import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import type { ConnectionStatus, VoiceMode, StudentProfile } from '../../types';
import { useSpeech } from '../../context/SpeechContext';
import { playClickSound } from '../../utils/sounds';

interface GlobalHeaderProps {
    onBack?: () => void;
    title?: string;
    connectionStatus: ConnectionStatus;
    isAiEnabled: boolean;
    onToggleAi: () => void;
    voiceMode: VoiceMode;
    onVoiceModeChange: (mode: VoiceMode) => void;
    studentProfile?: StudentProfile | null;
    onSwitchUser?: () => void;
    onOpenEditProfile?: () => void;
    isDebugMode?: boolean;
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
}

const ConnectionIndicator: React.FC<{ status: ConnectionStatus }> = ({ status }) => {
    const statusInfo = {
        checking: { color: 'bg-yellow-400', text: 'IA...' },
        online: { color: 'bg-green-500', text: 'Online' },
        offline: { color: 'bg-red-500', text: 'Offline' },
    };
    const current = statusInfo[status];

    return (
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full" title={status === 'checking' ? 'Comprobando conexión con la IA...' : status === 'online' ? 'La IA está generando pistas y explicaciones' : 'Usando pistas y explicaciones predefinidas'}>
            <span className={`w-2.5 h-2.5 rounded-full ${current.color}`}></span>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{current.text}</span>
        </div>
    );
};

const AiToggleSwitch: React.FC<{ isEnabled: boolean, onToggle: () => void, isOnline: boolean }> = ({ isEnabled, onToggle, isOnline }) => {
    return (
        <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">IA</span>
            <button
                onClick={() => { playClickSound(); onToggle(); }}
                className={`relative inline-flex items-center h-5 rounded-full w-9 transition-colors duration-300 focus:outline-none ${isEnabled ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                title={isOnline 
                    ? (isEnabled ? 'Desactivar IA' : 'Activar IA') 
                    : (isEnabled ? 'Desactivar IA (sin conexión)' : 'Activar IA (sin conexión)')
                }
            >
                <span
                    className={`inline-block w-3.5 h-3.5 transform bg-white rounded-full transition-transform duration-300 ${isEnabled ? 'translate-x-5' : 'translate-x-1'}`}
                />
            </button>
        </div>
    );
}

const LocalVoiceSelector: React.FC<{
    voices: SpeechSynthesisVoice[];
    selectedURI: string | null;
    onSelect: (uri: string) => void;
    disabled: boolean;
}> = ({ voices, selectedURI, onSelect, disabled }) => {
    if (voices.length === 0) return null;

    return (
        <select
            value={selectedURI || ''}
            onChange={(e) => { playClickSound(); onSelect(e.target.value); }}
            disabled={disabled}
            className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold py-1 px-2 rounded-md text-xs max-w-[120px] truncate"
            title="Seleccionar voz local"
        >
            <option value="" disabled>Elige una voz</option>
            {voices.map(voice => (
                <option key={voice.voiceURI} value={voice.voiceURI}>
                    {voice.name}
                </option>
            ))}
        </select>
    );
};


const VoiceControl: React.FC<{ voiceMode: VoiceMode, onVoiceModeChange: (mode: VoiceMode) => void, isOnline: boolean }> = ({ voiceMode, onVoiceModeChange, isOnline }) => {
    const { isMuted, toggleMute, isSupported, isSpeaking, availableLocalVoices, selectedVoiceURI, selectVoice } = useSpeech();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!isSupported) return null;

    const modes: { key: VoiceMode, label: string }[] = [
        { key: 'auto', label: 'Auto' },
        { key: 'local', label: 'Local' },
        { key: 'online', label: 'Online (IA)' }
    ];

    const currentModeLabel = modes.find(m => m.key === voiceMode)?.label || 'Voz';

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => { playClickSound(); toggleMute(); }}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-md transition-colors ${isMuted ? 'bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-400' : 'bg-yellow-400 text-white'}`}
                title={isMuted ? 'Activar voz' : 'Silenciar voz'}
            >
                {isSpeaking ? '💬' : (isMuted ? '🔇' : '🔊')}
            </button>
            <div className="relative" ref={menuRef}>
                 <button 
                    onClick={() => { playClickSound(); setIsMenuOpen(prev => !prev); }} 
                    className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold py-1 px-2 rounded-md text-xs flex items-center gap-1"
                    title="Seleccionar modo de voz"
                 >
                    {currentModeLabel} <span className={`transition-transform transform ${isMenuOpen ? 'rotate-180' : ''}`}>▾</span>
                </button>
                {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-700 rounded-md shadow-lg z-10 border border-slate-200 dark:border-slate-600">
                        {modes.map(mode => (
                             <button
                                key={mode.key}
                                onClick={() => {
                                    playClickSound();
                                    onVoiceModeChange(mode.key);
                                    setIsMenuOpen(false);
                                }}
                                className="block w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 disabled:opacity-50 disabled:bg-transparent disabled:cursor-not-allowed"
                                disabled={!isOnline && mode.key === 'online'}
                            >
                                {mode.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
             <LocalVoiceSelector 
                voices={availableLocalVoices}
                selectedURI={selectedVoiceURI}
                onSelect={selectVoice}
                disabled={voiceMode !== 'local'}
            />
        </div>
    );
};

const AvatarDisplay: React.FC<{ profile: StudentProfile | null | undefined }> = ({ profile }) => {
    const avatarContent = profile?.avatar || (profile?.gender === 'boy' ? '👦' : '👧') || '👤';

    if (avatarContent.startsWith('data:image')) {
        return <img src={avatarContent} alt={profile?.name} className="w-10 h-10 rounded-full object-cover" />;
    }

    return <span className="text-3xl">{avatarContent}</span>;
};


export const GlobalHeader: React.FC<GlobalHeaderProps> = ({ onBack, title, connectionStatus, isAiEnabled, onToggleAi, voiceMode, onVoiceModeChange, studentProfile, onSwitchUser, onOpenEditProfile, isDebugMode, theme, onToggleTheme }) => {
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);
    const settingsRef = useRef<HTMLDivElement>(null);
    const hideTimeoutRef = useRef<number | null>(null);

    const titleContainerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const [isTitleOverflowing, setIsTitleOverflowing] = useState(false);

    useLayoutEffect(() => {
        const checkOverflow = () => {
            const container = titleContainerRef.current;
            const text = titleRef.current;
            if (text && container) {
                const isNowOverflowing = text.scrollWidth > container.clientWidth;
                setIsTitleOverflowing(isNowOverflowing);
                if (isNowOverflowing) {
                    text.style.setProperty('--scroll-width', `${text.scrollWidth}px`);
                    text.style.setProperty('--container-width', `${container.clientWidth}px`);
                }
            }
        };
        const timeoutId = setTimeout(checkOverflow, 50);
        window.addEventListener('resize', checkOverflow);
        return () => { clearTimeout(timeoutId); window.removeEventListener('resize', checkOverflow); };
    }, [title]);

    const toggleSettings = () => {
        playClickSound();
        setIsSettingsVisible(prev => !prev);
    }

    useEffect(() => {
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        if (isSettingsVisible) hideTimeoutRef.current = window.setTimeout(() => setIsSettingsVisible(false), 4000);
        return () => { if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current); };
    }, [isSettingsVisible]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) setIsSettingsVisible(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMouseEnterPanel = () => { if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current); };
    const handleMouseLeavePanel = () => { hideTimeoutRef.current = window.setTimeout(() => setIsSettingsVisible(false), 4000); };
    
    const studentFirstName = studentProfile?.name.split(' ')[0] || '';
    
    return (
        <header className="w-full p-3 grid grid-cols-[auto_1fr_auto] items-center border-b-2 border-slate-200 dark:border-slate-700 flex-shrink-0 gap-4">
            <div className="flex items-center gap-3 min-w-0">
                {onBack && (
                    <button onClick={() => { playClickSound(); onBack(); }} className="text-slate-500 dark:text-slate-400 font-bold hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-200 transform hover:scale-110 hover:-translate-x-1 active:scale-95 text-2xl flex-shrink-0">
                        &larr;
                    </button>
                )}
                 {isDebugMode && <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-md select-none">DEBUG</span>}
                {studentProfile && (
                     <button 
                        onClick={() => { onOpenEditProfile && playClickSound(); onOpenEditProfile?.(); }} 
                        className="flex items-center gap-2 min-w-0 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title="Editar Perfil"
                     >
                        <div className="flex-shrink-0" aria-hidden="true"><AvatarDisplay profile={studentProfile} /></div>
                        <div className="flex flex-col min-w-0 text-left">
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">Estudiante:</span>
                            <p className="text-base font-bold text-slate-800 dark:text-slate-200 leading-tight truncate" title={studentProfile.name}>{studentFirstName}</p>
                        </div>
                    </button>
                )}
            </div>
            
            <div ref={titleContainerRef} className="text-center min-w-0 px-2 overflow-hidden marquee-container">
                {title && (
                    <h2 ref={titleRef} className={`text-xl font-black text-slate-700 dark:text-slate-300 inline-block whitespace-nowrap ${isTitleOverflowing ? 'animate-marquee-scroll' : 'truncate'}`} title={title}>
                        {title}
                    </h2>
                )}
            </div>

            <div className="flex items-center justify-end gap-2">
                <button onClick={() => { playClickSound(); onToggleTheme(); }} title="Cambiar tema" className="p-1 w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    <span className="text-xl" role="img" aria-label="Cambiar Tema">{theme === 'light' ? '🌙' : '☀️'}</span>
                </button>

                {onSwitchUser && (
                    <button onClick={() => { playClickSound(); onSwitchUser(); }} title="Cambiar de Usuario" className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <span className="text-2xl" role="img" aria-label="Cambiar Usuario">👥</span>
                    </button>
                )}
                
                <div className="relative" ref={settingsRef}>
                    <button onClick={toggleSettings} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Configuración">
                        <span className="text-2xl" role="img" aria-label="Configuración">⚙️</span>
                    </button>
                    
                    <div
                        onMouseEnter={handleMouseEnterPanel}
                        onMouseLeave={handleMouseLeavePanel}
                        className={`absolute z-20 flex items-center gap-2 p-2 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg border border-slate-200/50 dark:border-slate-700 transition-all duration-300 top-full right-0 mt-2 origin-top-right md:top-1/2 md:-translate-y-1/2 md:right-full md:mr-2 md:mt-0 md:origin-right ${isSettingsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                    >
                        <AiToggleSwitch isEnabled={isAiEnabled} onToggle={onToggleAi} isOnline={connectionStatus === 'online'} />
                        <ConnectionIndicator status={connectionStatus} />
                        <VoiceControl voiceMode={voiceMode} onVoiceModeChange={onVoiceModeChange} isOnline={connectionStatus === 'online'} />
                    </div>
                </div>
            </div>
        </header>
    );
};