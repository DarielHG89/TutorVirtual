
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { QuizConfig, StudentProfile, QuestionResult } from '../types';
import { generateHint, generateExplanation } from '../services/aiService';
import { Button } from './common/Button';
import { useSpeech } from '../context/SpeechContext';
import { Confetti } from './Results';
import { playCorrectSound, playIncorrectSound, playClickSound, playHintSound } from '../utils/sounds';
import { useMascot } from '../context/MascotContext';

interface QuizProps {
    quizConfig: QuizConfig;
    onQuizEnd: (results: QuestionResult[]) => void;
    onBack: () => void;
    isAiEnabled: boolean;
    studentProfile: StudentProfile;
    isDebugMode: boolean;
}

export const Quiz: React.FC<QuizProps> = ({ quizConfig, onQuizEnd, onBack, isAiEnabled, studentProfile, isDebugMode }) => {
    const [questionIndex, setQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [feedback, setFeedback] = useState<{ text: string; correct: boolean; explanation?: string } | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isLoadingAI, setIsLoadingAI] = useState(false);
    const [hintText, setHintText] = useState<string | null>(null);
    const [hintCycleIndex, setHintCycleIndex] = useState(0);
    const [aiHintAttempted, setAiHintAttempted] = useState(false);
    const [startTime, setStartTime] = useState(Date.now());
    const [quizResults, setQuizResults] = useState<QuestionResult[]>([]);
    const { speak } = useSpeech();
    const [isNextDisabled, setIsNextDisabled] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [hintsUsedCount, setHintsUsedCount] = useState(0);
    
    // Context for Mascot Interaction
    const { triggerReaction, setEmotion, emotion, handleCorrect, handleIncorrect } = useMascot();
    const inactivityTimerRef = useRef<number | null>(null);

    // Prevent crash if quiz starts with no questions
    useEffect(() => {
        if (!quizConfig.questions || quizConfig.questions.length === 0) {
            alert("No hay preguntas disponibles para esta lección o nivel. Volviendo...");
            setTimeout(onBack, 0);
        }
    }, [quizConfig.questions, onBack]);

    // Inactivity / Proactive Help Timer
    useEffect(() => {
        if (isAnswered || feedback) return;
        
        if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
        
        inactivityTimerRef.current = window.setTimeout(() => {
            if (!isAnswered && !hintText) {
                triggerReaction('hint_suggestion', 4000);
            }
        }, 12000); // 12 seconds without answer

        return () => {
            if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
        };
    }, [questionIndex, isAnswered, hintText, triggerReaction]);


    const currentQuestion = (quizConfig.questions && quizConfig.questions.length > 0) ? quizConfig.questions[questionIndex] : null;
    const inputRef = useRef<HTMLInputElement>(null);
    const nextButtonRef = useRef<HTMLButtonElement>(null);

    const handleDebugShortcut = useCallback(() => {
        if (isAnswered || !currentQuestion) return;

        const result: QuestionResult = {
            question: currentQuestion.question,
            userAnswer: currentQuestion.answer,
            correctAnswer: currentQuestion.answer,
            correct: true,
            time: 0.1,
            hintsUsed: 0,
        };
        const newResults = [...quizResults, result];
        setQuizResults(newResults);
        setScore(prev => prev + 1);
        handleCorrect();

        if (questionIndex < quizConfig.questions.length - 1) {
            setQuestionIndex(prevIndex => prevIndex + 1);
        } else {
            onQuizEnd(newResults);
        }
    }, [isAnswered, questionIndex, quizConfig.questions.length, onQuizEnd, quizResults, currentQuestion, handleCorrect]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (isDebugMode && event.ctrlKey && event.altKey && event.key === 's') {
                event.preventDefault();
                handleDebugShortcut();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleDebugShortcut, isDebugMode]);
    

    const checkAnswer = async (answer: string) => {
        if (isAnswered || !currentQuestion) return;
        if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
        
        setSelectedAnswer(answer);

        const timeTaken = (Date.now() - startTime) / 1000;
        setIsAnswered(true);
        
        const isCorrect = answer.trim().toLowerCase() === currentQuestion.answer.toString().toLowerCase();
        
        const result: QuestionResult = {
            question: currentQuestion.question,
            userAnswer: answer,
            correctAnswer: currentQuestion.answer,
            correct: isCorrect,
            time: timeTaken,
            hintsUsed: hintsUsedCount,
        };
        setQuizResults(prev => [...prev, result]);
        
        if (isCorrect) {
            playCorrectSound();
            setShowConfetti(true);
            handleCorrect(); // Updates streak and triggers happy reaction
            const feedbackText = "¡Excelente! ✨";
            setScore(prev => prev + 1);
            setFeedback({ text: feedbackText, correct: true });
            speak(feedbackText);
        } else {
            playIncorrectSound();
            handleIncorrect(); // Resets streak and triggers error reaction
            setIsNextDisabled(true);
            setTimeout(() => setIsNextDisabled(false), 3000);

            const feedbackText = "¡Casi! Sigue intentando 💪";
            let explanation: string;
            const fallbackExplanation = currentQuestion.explanation || `La respuesta correcta es "${currentQuestion.answer}". ¡Sigue practicando y lo conseguirás!`;

            if (isAiEnabled) {
                setIsLoadingAI(true);
                setEmotion('thinking'); 
                try {
                    explanation = await generateExplanation(currentQuestion, answer, studentProfile);
                } catch (error) {
                    console.error("AI explanation failed, using fallback", error);
                    explanation = fallbackExplanation;
                } finally {
                    setIsLoadingAI(false);
                    setEmotion('idle'); 
                }
            } else {
                explanation = fallbackExplanation;
            }
            setFeedback({ text: feedbackText, correct: false, explanation });
            speak(`${feedbackText}. La respuesta correcta es ${currentQuestion.answer}. ${explanation}`);
        }
    };


    // Reset state for new question
    useEffect(() => {
        setIsAnswered(false);
        setFeedback(null);
        setUserAnswer('');
        setSelectedAnswer('');
        setHintText(null);
        setHintCycleIndex(0);
        setAiHintAttempted(false);
        setStartTime(Date.now());
        setIsNextDisabled(false);
        setShowConfetti(false);
        setHintsUsedCount(0);
        inputRef.current?.focus();
        setEmotion('idle');
    }, [questionIndex, setEmotion]);
    
    // Speak question and options
    useEffect(() => {
        if (!currentQuestion) return;
        let textToSpeak = currentQuestion.question;
        if (currentQuestion.type === 'mcq' && currentQuestion.options) {
            const optionsText = currentQuestion.options.map(opt => typeof opt === 'string' ? opt : opt.text).join(', ');
            textToSpeak += `. ... Opciones son: ${optionsText}`;
        }
        speak(textToSpeak);
    }, [questionIndex, currentQuestion, speak]);

    useEffect(() => {
        if (isAnswered && !isNextDisabled) {
            const timer = setTimeout(() => {
                nextButtonRef.current?.focus();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isAnswered, isNextDisabled]);
    
    const handleConfettiComplete = useCallback(() => {
        setShowConfetti(false);
    }, []);

    const handleHint = async () => {
        if (!currentQuestion) return;
        playHintSound();
        setHintsUsedCount(prev => prev + 1);
        if (isAiEnabled && !aiHintAttempted) {
            setIsLoadingAI(true);
            setAiHintAttempted(true);
            setEmotion('thinking');
            try {
                const aiHint = await generateHint(currentQuestion, studentProfile);
                setHintText(aiHint);
                speak(`Pista: ${aiHint}`);
                triggerReaction('speaking', 3000);
            } catch (error) {
                console.error("AI hint failed, using first local hint", error);
                const localHints = currentQuestion.hints || ["Piensa con cuidado, ¡tú puedes!"];
                const firstHint = localHints[0];
                setHintText(firstHint);
                speak(`Pista: ${firstHint}`);
                setHintCycleIndex(1);
            } finally {
                setIsLoadingAI(false);
                if(emotion === 'thinking') setEmotion('idle');
            }
        } else {
            const localHints = currentQuestion.hints || ["Piensa con cuidado, ¡tú puedes!"];
            const hintToShow = localHints[hintCycleIndex % localHints.length];
            setHintText(hintToShow);
            speak(`Pista: ${hintToShow}`);
            setHintCycleIndex(prev => prev + 1);
            triggerReaction('speaking', 2000);
        }
    };

    const handleNextQuestion = () => {
        playClickSound();
        if (questionIndex < quizConfig.questions.length - 1) {
            setQuestionIndex(prev => prev + 1);
        } else {
            onQuizEnd(quizResults);
        }
    };

    if (!currentQuestion) {
        return <div className="text-center p-8">Cargando preguntas...</div>;
    }
    
    const progressPercent = ((questionIndex) / quizConfig.questions.length) * 100;

    return (
        <div className="animate-fade-in">
            {showConfetti && <Confetti onComplete={handleConfettiComplete} />}
            <header className="flex justify-between items-center mb-4">
                 <div className="w-1/3 text-left font-bold text-slate-500 dark:text-slate-400">
                    Pregunta {questionIndex + 1} de {quizConfig.questions.length}
                </div>
                <div className="w-1/3 text-lg font-bold bg-yellow-400 text-white px-4 py-2 rounded-full shadow-md text-center">
                    {score} / {quizConfig.questions.length}
                </div>
                <div className="w-1/3"></div>
            </header>
            
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 mb-4">
                <div className="bg-green-500 h-4 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-2xl min-h-[150px] flex flex-col justify-center items-center text-xl sm:text-2xl font-bold mb-6 shadow-inner text-center">
                {currentQuestion.imageUrl && <img src={currentQuestion.imageUrl} alt="Pregunta" className="max-h-40 mb-4" />}
                <p>{currentQuestion.question}</p>
            </div>
            
            <div className="space-y-4">
                {currentQuestion.type === 'mcq' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {currentQuestion.options?.map((opt, index) => {
                             const optionText = typeof opt === 'string' ? opt : opt.text;
                             const optionImageUrl = typeof opt === 'object' && opt.imageUrl ? opt.imageUrl : undefined;
                             const isThisTheCorrectAnswer = optionText.toString().toLowerCase() === currentQuestion.answer.toString().toLowerCase();
                             const isThisTheSelectedAnswer = optionText === selectedAnswer;

                             let highlightClass = '';
                             if (isAnswered) {
                                if (isThisTheSelectedAnswer) {
                                    highlightClass = isThisTheCorrectAnswer ? 'ring-4 ring-green-500 bg-green-100 dark:bg-green-900/50' : 'ring-4 ring-red-500 bg-red-100 dark:bg-red-900/50';
                                } else if (isThisTheCorrectAnswer) {
                                    highlightClass = 'ring-4 ring-green-500 animate-pulse';
                                }
                             }

                             return (
                                 <Button key={index} onClick={() => checkAnswer(optionText)} disabled={isAnswered} className={`w-full h-full flex flex-col items-center justify-center p-2 ${highlightClass}`}>
                                     {optionImageUrl && <img src={optionImageUrl} alt={optionText} className="h-20 w-20 object-contain mb-2" />}
                                     <span>{optionText}</span>
                                 </Button>
                             );
                        })}
                    </div>
                )}
                {currentQuestion.type === 'input' && (
                    <>
                        <form className="flex items-center justify-center gap-2" onSubmit={(e) => { e.preventDefault(); checkAnswer(userAnswer); }}>
                            <input
                                ref={inputRef}
                                type="text"
                                value={userAnswer}
                                onChange={e => {
                                    const val = e.target.value;
                                    if (/^[\d,.\s/]*$/.test(val)) {
                                        setUserAnswer(val);
                                    }
                                }}
                                disabled={isAnswered}
                                className={`flex-grow max-w-sm p-4 text-xl border-2 rounded-lg text-center text-black bg-white dark:bg-slate-600 dark:text-white dark:placeholder-slate-400 ${isAnswered ? (feedback?.correct ? 'border-green-500' : 'border-red-500') : 'border-slate-300 dark:border-slate-500'}`}
                                placeholder="Tu respuesta"
                            />
                            <Button type="submit" disabled={isAnswered} variant="special">OK</Button>
                        </form>
                    </>
                )}
            </div>
            
            {!isAnswered && (
                <div className="mt-4 text-center">
                    <Button 
                        onClick={handleHint} 
                        disabled={isLoadingAI} 
                        variant="warning" 
                        className={`text-sm px-4 py-2 ${emotion === 'hint_suggestion' ? 'animate-bounce ring-4 ring-yellow-400' : ''}`}
                    >
                        {isLoadingAI ? "Pensando..." : "💡 Pista"}
                    </Button>
                </div>
            )}
            
            {!isAnswered && hintText && (
                 <div className="mt-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 dark:bg-yellow-900/40 dark:border-yellow-500 dark:text-yellow-200 rounded-r-lg animate-fade-in text-left">
                    <p><strong className="font-bold">Pista:</strong> {hintText}</p>
                </div>
            )}

            {isAnswered && (
                <div className="mt-6 p-4 rounded-lg bg-slate-100 dark:bg-slate-700/50 animate-fade-in text-center">
                    {feedback && (
                        <>
                         <p className={`text-2xl font-bold ${feedback.correct ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {feedback.text}
                         </p>
                        {!feedback.correct && (
                            <p className="text-slate-600 dark:text-slate-300 mt-2">
                                La respuesta correcta es: 
                                <strong className="inline-block px-3 py-1 ml-2 text-green-800 bg-green-200 dark:bg-green-800 dark:text-green-200 rounded-lg animate-pulse border-2 border-green-400 dark:border-green-600">
                                    {currentQuestion.answer}
                                </strong>
                            </p>
                        )}
                        </>
                    )}
                    {isLoadingAI ? (
                         <p className="text-slate-600 dark:text-slate-400 mt-2 animate-pulse">Maestro Digital está pensando en una buena explicación...</p>
                    ) : (
                        feedback?.explanation && <p className="text-slate-600 dark:text-slate-300 mt-2">{feedback.explanation}</p>
                    )}
                    <Button ref={nextButtonRef} onClick={handleNextQuestion} className="mt-4" disabled={isNextDisabled}>Siguiente &rarr;</Button>
                </div>
            )}
        </div>
    );
};
