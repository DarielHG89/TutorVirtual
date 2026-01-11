import React, { useState, useRef, useEffect, useCallback } from 'react';
// FIX: Removed deprecated FunctionDeclarationTool from import.
import type { LiveServerMessage, FunctionDeclaration, FunctionCall } from '@google/genai';
import { Type } from '@google/genai';
import { connectToLive, generateImageFromText } from '../services/aiService';
import { createBlob, decode, decodeAudioData } from '../utils/audio';
import type { TranscriptEntry, ConnectionStatus, StudentProfile } from '../types';
import { Card } from './common/Card';
import { playClickSound } from '../utils/sounds';

type LiveSession = Awaited<ReturnType<typeof connectToLive>>;

interface LiveConversationProps {
    studentProfile: StudentProfile;
    onBack: () => void;
    isAiEnabled: boolean;
    connectionStatus: ConnectionStatus;
}

type ConversationStatus = 'idle' | 'listening' | 'processing';

const generateImageFunctionDeclaration: FunctionDeclaration = {
  name: 'generateImage',
  parameters: {
    type: Type.OBJECT,
    description: 'Generates an image based on a descriptive prompt. The prompt must be in English.',
    properties: {
      prompt: {
        type: Type.STRING,
        description: 'A creative and descriptive prompt in English for the image to be generated. For example: "a happy robot waving hello".',
      },
    },
    required: ['prompt'],
  },
};


const MicButton: React.FC<{ status: ConversationStatus, onClick: () => void }> = ({ status, onClick }) => {
    const statusConfig = {
        idle: { icon: '🎤', text: 'Toca para hablar', color: 'bg-blue-500 hover:bg-blue-600', pulse: false },
        listening: { icon: '🤖', text: 'Escuchando...', color: 'bg-red-500', pulse: true },
        processing: { icon: '🤔', text: 'Pensando...', color: 'bg-yellow-500', pulse: false },
    };
    const current = statusConfig[status];

    const handleClick = () => {
        playClickSound();
        onClick();
    };

    return (
        <button
            onClick={handleClick}
            className={`w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-lg transform active:scale-95 text-white hover:scale-105 ${current.color} ${current.pulse ? 'mic-pulse' : ''}`}
        >
            <span className="text-5xl">{current.icon}</span>
            <span className="mt-1 font-bold">{current.text}</span>
        </button>
    )
}

export const LiveConversation: React.FC<LiveConversationProps> = ({ studentProfile, onBack, isAiEnabled, connectionStatus }) => {
    const [statusState, setStatusState] = useState<ConversationStatus>('idle');
    const statusRef = useRef<ConversationStatus>('idle');
    const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [pastTranscripts, setPastTranscripts] = useState<{timestamp: number, transcript: TranscriptEntry[]}[]>([]);
    const [viewingPast, setViewingPast] = useState(false);
    const [selectedTranscript, setSelectedTranscript] = useState<TranscriptEntry[] | null>(null);

    const sessionRef = useRef<LiveSession | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const nextStartTimeRef = useRef<number>(0);
    const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const transcriptEndRef = useRef<HTMLDivElement>(null);
    const turnCompleteReceivedRef = useRef<boolean>(false);
    const isStoppingRef = useRef<boolean>(false);
    
    const transcriptRef = useRef<TranscriptEntry[]>([]);
    const processMessageRef = useRef<((message: LiveServerMessage) => void) | undefined>(undefined);
    const lastTranscriptLengthRef = useRef<number>(0);
    
    useEffect(() => {
        transcriptRef.current = transcript;
    }, [transcript]);

     useEffect(() => {
        try {
            const TRANSCRIPTS_KEY = 'maestroDigitalTranscripts';
            const saved = localStorage.getItem(TRANSCRIPTS_KEY);
            if (saved) {
                setPastTranscripts(JSON.parse(saved));
            }
        } catch (e) {
            console.error("Could not load past transcripts", e);
        }
    }, []);

    const setStatus = (newStatus: ConversationStatus) => {
        statusRef.current = newStatus;
        setStatusState(newStatus);
    };

    const handleGenerateImageFromFunction = useCallback(async (fc: FunctionCall) => {
        const prompt = fc.args.prompt as string;
        if (!prompt) return;

        const thinkingEntry: TranscriptEntry = {
            id: Date.now(),
            source: 'model',
            text: `¡Claro! Dibujando "${prompt}" para ti... 🎨`,
            isFinal: true,
        };
        setTranscript(prev => [...prev, thinkingEntry]);
        
        let toolResponseResult = "ok, image generated";
        try {
            const imageUrl = await generateImageFromText(prompt);
            const imageEntry: TranscriptEntry = {
                id: Date.now() + 1,
                source: 'model',
                text: ``, // No text needed if there is an image
                isFinal: true,
                imageUrl: imageUrl,
            };
            setTranscript(prev => [...prev, imageEntry]);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'No se pudo generar la imagen.';
            setError(message);
             const errorEntry: TranscriptEntry = {
                id: Date.now() + 1,
                source: 'model',
                text: `😥 ¡Oh no! ${message}`,
                isFinal: true,
            };
            setTranscript(prev => [...prev, errorEntry]);
            toolResponseResult = `Error generating image: ${message}`;
        } finally {
            sessionRef.current?.sendToolResponse({
                functionResponses: [{
                    id: fc.id,
                    name: fc.name,
                    response: { result: toolResponseResult },
                }]
            });
        }
    }, []);

    const stopConversation = useCallback((force = false) => {
        if ((!force && statusRef.current === 'idle') || isStoppingRef.current) return;

        isStoppingRef.current = true;
        
        const currentTranscript = transcriptRef.current;
        const newEntries = currentTranscript.slice(lastTranscriptLengthRef.current);

        if (newEntries.length > 0) {
            try {
                const TRANSCRIPTS_KEY = 'maestroDigitalTranscripts';
                const MAX_TRANSCRIPTS = 10;
                const savedTranscriptsRaw = localStorage.getItem(TRANSCRIPTS_KEY);
                const savedTranscripts = savedTranscriptsRaw ? JSON.parse(savedTranscriptsRaw) : [];
                
                const newTranscriptRecord = {
                    timestamp: Date.now(),
                    transcript: newEntries.filter(entry => entry.text.trim() !== '' || entry.imageUrl)
                };

                if (newTranscriptRecord.transcript.length > 0) {
                    const updatedTranscripts = [newTranscriptRecord, ...savedTranscripts].slice(0, MAX_TRANSCRIPTS);
                    localStorage.setItem(TRANSCRIPTS_KEY, JSON.stringify(updatedTranscripts));
                    setPastTranscripts(updatedTranscripts); // Update state after saving
                    console.log('Conversation transcript saved.');
                }
            } catch (err) {
                console.error("Failed to save transcript:", err);
            }
        }
        
        setStatus('idle');
        
        sessionRef.current?.close();
        sessionRef.current = null;

        mediaStreamRef.current?.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
        
        scriptProcessorRef.current?.disconnect();
        scriptProcessorRef.current = null;
        
        if (inputAudioContextRef.current?.state !== 'closed') {
          inputAudioContextRef.current?.close().catch(console.error);
        }
        inputAudioContextRef.current = null;
        
        if (outputAudioContextRef.current?.state !== 'closed') {
          outputAudioContextRef.current?.close().catch(console.error);
        }
        outputAudioContextRef.current = null;
        
        audioSourcesRef.current.forEach(source => source.stop(0));
        audioSourcesRef.current.clear();
        nextStartTimeRef.current = 0;
    }, []);


    useEffect(() => {
        processMessageRef.current = async (message: LiveServerMessage) => {
            if (isStoppingRef.current) return;

            if (message.toolCall) {
                for (const fc of message.toolCall.functionCalls) {
                    if (fc.name === 'generateImage') {
                        handleGenerateImageFromFunction(fc);
                    }
                }
            }

             if (message.serverContent) {
                if (message.serverContent.inputTranscription) {
                    const text = message.serverContent.inputTranscription.text;
                    setTranscript(prev => {
                        const last = prev[prev.length - 1];
                        if (last?.source === 'user' && !last.isFinal) {
                            return [...prev.slice(0, -1), { ...last, text, isFinal: false }];
                        }
                        return [...prev, { id: Date.now(), source: 'user', text, isFinal: false }];
                    });
                }
                if (message.serverContent.outputTranscription) {
                    if (statusRef.current === 'listening') {
                        setStatus('processing');
                    }
                    const text = message.serverContent.outputTranscription.text;
                    setTranscript(prev => {
                        const last = prev[prev.length - 1];
                        if (last?.source === 'model' && !last.isFinal) {
                            return [...prev.slice(0, -1), { ...last, text: last.text + text, isFinal: false }];
                        }
                        return [...prev, { id: Date.now(), source: 'model', text, isFinal: false }];
                    });
                }
                const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                if (audioData) {
                    const ctx = outputAudioContextRef.current;
                    if (ctx) {
                        const nextStartTime = Math.max(nextStartTimeRef.current, ctx.currentTime);
                        const audioBuffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
        
                        const source = ctx.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(ctx.destination);
                        source.addEventListener('ended', () => {
                            if (isStoppingRef.current) return;
                            audioSourcesRef.current.delete(source);
                            if (audioSourcesRef.current.size === 0 && turnCompleteReceivedRef.current) {
                                setStatus('listening');
                                turnCompleteReceivedRef.current = false;
                            }
                        });
                        source.start(nextStartTime);
                        nextStartTimeRef.current = nextStartTime + audioBuffer.duration;
                        audioSourcesRef.current.add(source);
                    }
                }
    
                if (message.serverContent?.interrupted) {
                    audioSourcesRef.current.forEach(source => source.stop(0));
                    audioSourcesRef.current.clear();
                    nextStartTimeRef.current = 0;
                    turnCompleteReceivedRef.current = false;
                    setTranscript(prev => {
                        const last = prev[prev.length - 1];
                        if (last?.source === 'model' && !last.isFinal) {
                            return [...prev.slice(0, -1), { ...last, isFinal: true }];
                        }
                        return prev;
                    });
                    setStatus('listening');
                }

                if(message.serverContent.turnComplete) {
                    turnCompleteReceivedRef.current = true;
                    setTranscript(prev => prev.map(entry => entry.isFinal ? entry : { ...entry, isFinal: true }));
                    if (audioSourcesRef.current.size === 0) {
                        setStatus('listening');
                        turnCompleteReceivedRef.current = false;
                    }
                }
            }
        };
    }, [handleGenerateImageFromFunction]);

    const startConversation = useCallback(async () => {
        isStoppingRef.current = false;
        setError(null);
        lastTranscriptLengthRef.current = transcriptRef.current.length;
        setStatus('listening');
        try {
            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            
            await outputAudioContextRef.current.resume();
            await inputAudioContextRef.current.resume();

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            const source = inputAudioContextRef.current.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
            
            // FIX: Removed deprecated FunctionDeclarationTool type annotation.
            const tools = [{ functionDeclarations: [generateImageFunctionDeclaration] }];
            
            const sessionPromise = connectToLive(
                studentProfile,
                (message) => processMessageRef.current?.(message),
                (e) => { 
                    console.error('Live connection error:', e); 
                    setError('Hubo un error en la conexión.'); 
                    stopConversation(true); 
                },
                () => {
                    console.log('Live connection closed.');
                    if (!isStoppingRef.current) {
                        stopConversation(true);
                    }
                },
                tools
            );

            sessionPromise.then(session => {
                sessionRef.current = session;
            }).catch(e => {
                console.error(e);
                setError('No se pudo conectar con la IA. ¿Estás online?');
                stopConversation(true);
            });

            scriptProcessor.onaudioprocess = (event) => {
                const inputData = event.inputBuffer.getChannelData(0);
                const pcmBlob = createBlob(inputData);
                sessionPromise.then(session => {
                    if (session) session.sendRealtimeInput({ media: pcmBlob });
                });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current.destination);
            scriptProcessorRef.current = scriptProcessor;

        } catch (err) {
            console.error('Error starting conversation:', err);
            setError('Necesitas dar permiso para usar el micrófono.');
            stopConversation(true);
        }
    }, [stopConversation, studentProfile]);

    const handleMicClick = () => {
        if (statusState === 'idle') {
            startConversation();
        } else {
            stopConversation();
        }
    };

    useEffect(() => {
        return () => {
            stopConversation(true);
        };
    }, [stopConversation]);

    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcript, selectedTranscript]);


    if (viewingPast) {
        return (
            <div className="animate-fade-in relative flex flex-col h-full">
                {selectedTranscript ? (
                    // Viewing a single past transcript
                    <>
                        <header className="flex-shrink-0 relative">
                             <button onClick={() => { playClickSound(); setSelectedTranscript(null); }} className="absolute -top-4 -left-4 text-slate-500 dark:text-slate-400 font-bold hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                                &larr; Volver al Historial
                            </button>
                            <h2 className="text-3xl font-black text-slate-800 dark:text-slate-200 text-center mb-4">Transcripción</h2>
                        </header>
                         <div className="flex-grow bg-slate-100 dark:bg-slate-700/50 rounded-lg p-4 overflow-y-auto shadow-inner">
                            {selectedTranscript.map((entry, index) => (
                                <div key={`${entry.id}-${index}`} className={`animate-bubble-in flex ${entry.source === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
                                    <div className={`max-w-[80%] p-3 rounded-lg ${entry.source === 'user' ? 'bg-blue-500 text-white' : 'bg-white dark:bg-slate-600 text-slate-700 dark:text-slate-200 shadow'}`}>
                                        {entry.text && <p>{entry.text}</p>}
                                        {entry.imageUrl && <img src={entry.imageUrl} alt={entry.text} className="rounded-lg max-w-full sm:max-w-xs mx-auto mt-2"/>}
                                    </div>
                                </div>
                            ))}
                            <div ref={transcriptEndRef} />
                        </div>
                    </>
                ) : (
                    // Viewing the list of past transcripts
                    <>
                        <header className="flex-shrink-0 relative">
                            <button onClick={() => { playClickSound(); setViewingPast(false); }} className="absolute -top-4 -left-4 text-slate-500 dark:text-slate-400 font-bold hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                                &larr; Volver a la Charla
                            </button>
                            <h2 className="text-4xl font-black text-slate-800 dark:text-slate-200 mb-2">Conversaciones Pasadas</h2>
                             <p className="text-slate-500 dark:text-slate-400 mb-4">Revisa tus charlas anteriores con el Maestro.</p>
                        </header>
                         <div className="flex-grow overflow-y-auto space-y-3 p-1">
                            {pastTranscripts.length === 0 ? (
                                <p className="text-slate-500 dark:text-slate-400 text-center mt-8">No hay conversaciones guardadas todavía.</p>
                            ) : (
                                pastTranscripts.map((record) => (
                                    <Card key={record.timestamp} onClick={() => setSelectedTranscript(record.transcript)}>
                                        <h3 className="font-bold text-slate-700 dark:text-slate-200">Conversación de:</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(record.timestamp).toLocaleString('es-ES')}</p>
                                    </Card>
                                ))
                            )}
                        </div>
                    </>
                )}
            </div>
        );
    }


    return (
        <div className="animate-fade-in relative flex flex-col h-full">
            <header className="flex-shrink-0 flex justify-between items-start">
                 <div>
                    <p className="text-slate-500 dark:text-slate-400 mb-4 text-left">¡Habla con el Maestro! También puedes pedirle que dibuje algo para ti.</p>
                 </div>
                 {pastTranscripts.length > 0 && (
                     <button 
                        onClick={() => { playClickSound(); setViewingPast(true); }}
                        className="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 font-bold py-2 px-3 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900 transition-colors text-sm whitespace-nowrap"
                    >
                        Ver Historial 📜
                    </button>
                 )}
            </header>

            <div className="flex-grow bg-slate-100 dark:bg-slate-700/50 rounded-lg p-4 overflow-y-auto mb-4 shadow-inner">
                {transcript.length === 0 && statusState !== 'idle' && (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-slate-400 dark:text-slate-500 font-semibold">Esperando para escuchar...</p>
                    </div>
                )}
                {transcript.map((entry) => (
                    <div key={`${entry.id}-${entry.text.length}`} className={`animate-bubble-in flex ${entry.source === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
                        <div className={`max-w-[80%] p-3 rounded-lg ${entry.source === 'user' ? 'bg-blue-500 text-white' : 'bg-white dark:bg-slate-600 text-slate-700 dark:text-slate-200 shadow'}`}>
                           {entry.text && <p>{entry.text}</p>}
                           {entry.imageUrl && <img src={entry.imageUrl} alt={entry.text} className="rounded-lg max-w-full sm:max-w-xs mx-auto mt-2"/>}
                        </div>
                    </div>
                ))}
                 <div ref={transcriptEndRef} />
            </div>

            <div className="flex-shrink-0 flex flex-col items-center justify-center">
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <MicButton status={statusState} onClick={handleMicClick} />
            </div>
        </div>
    );
};
