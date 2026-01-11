
import React from 'react';
import type { MascotEmotion } from '../../../context/MascotContext';
import { MascotStyles } from './MascotStyles';
import { MascotEyes } from './MascotEyes';
import type { BackgroundTheme } from '../DynamicBackground';

interface MascotDisplayProps {
    emotion: MascotEmotion;
    streak: number;
    idleAction: 'none' | 'yoyo' | 'cleaning' | 'yawning' | 'reading' | 'music';
    isSpeaking: boolean;
    isDragging: boolean;
    isBouncing: boolean;
    isBlinking: boolean;
    isInterested: boolean;
    isDizzy: boolean;
    isHidden?: boolean;
    activeTheme?: BackgroundTheme;
}

const THEME_PARTICLES = {
    math: {
        success: ['+', '−'],
        happy: ['1', '2', '3']
    },
    geometry: {
        success: ['△', '□'],
        happy: ['◯', '◈']
    },
    measurements: {
        success: ['📏', '⚖️'],
        happy: ['💰', '⏰']
    },
    default: {
        success: ['✨', '🌟'],
        happy: ['❤️', '💖']
    }
};

export const MascotDisplay: React.FC<MascotDisplayProps> = ({
    emotion,
    streak,
    idleAction,
    isSpeaking,
    isDragging,
    isBouncing,
    isBlinking,
    isInterested,
    isDizzy,
    isHidden = false,
    activeTheme = 'default'
}) => {
    const BASE_GREEN = '#22c55e';
    const LIGHT_GREEN = '#86efac'; // Lighter shade for inner mouth
    const ERROR_RED = '#ef4444';
    const SUCCESS_BLUE = '#3b82f6';
    const THINKING_YELLOW = '#fbbf24';
    
    const HAS_GLASSES = streak >= 3;
    const HAS_CAPE = streak >= 5;
    const HAS_HAT = streak >= 10;
    const CHARGE_LEVEL = Math.min(streak * 10, 100);
    
    // Aura Logic
    const hasLevel1Aura = streak >= 5;
    const hasLevel2Aura = streak >= 10;

    const isError = emotion === 'error';
    const isSuccess = emotion === 'success';
    const isThinking = emotion === 'thinking' || emotion === 'hint_suggestion';
    const isHappy = emotion === 'happy';
    const isYawning = idleAction === 'yawning';
    const isReading = idleAction === 'reading';
    const isMusic = idleAction === 'music';
    const isCleaning = idleAction === 'cleaning';
    
    const eyeColor = isError ? ERROR_RED : BASE_GREEN;
    const coreColor = isError ? ERROR_RED : (isThinking ? THINKING_YELLOW : BASE_GREEN);
    const screenStrokeColor = isError ? ERROR_RED : (isSuccess ? SUCCESS_BLUE : '#1e293b');
    const screenStrokeWidth = isError || isSuccess ? '3' : '1';
    const screenFilter = isError || isSuccess || CHARGE_LEVEL > 50 ? 'url(#glow)' : 'none';

    // Squash and Stretch Animation for Blink
    const blinkTransform = isDragging 
        ? 'scale(1, 1)' 
        : (isBlinking ? 'scale(1.1, 0.1)' : 'scale(1, 1)');

    // Determine if fingers should be extended based on action
    // Extended when: Success, Error, Dragging, Bouncing, Surprised, Sleeping (requested), or doing an idle action (except music usually)
    const areFingersExtended = isSuccess || isError || isDragging || isBouncing || emotion === 'surprised' || emotion === 'sleeping' || (idleAction !== 'none' && idleAction !== 'music');

    // Helper to calculate finger position (retracted vs extended)
    const getFinger = (targetCx: number, targetCy: number, angle: number, handCx: number, handCy: number) => {
        // Calculate vector from hand center to finger target
        const dx = targetCx - handCx;
        const dy = targetCy - handCy;
        
        // Retraction factor: 1 = fully extended, 0.5 = retracted (mostly hidden behind palm radius 9)
        // Fingers are approx 9 units away from center. 9 * 0.5 = 4.5 distance. Palm radius is 9.
        // So they will be well inside the palm circle.
        const factor = areFingersExtended ? 1 : 0.5;
        
        const finalCx = handCx + dx * factor;
        const finalCy = handCy + dy * factor;

        return {
            cx: finalCx,
            cy: finalCy,
            r: "2.3",
            fill: "url(#whitePlastic)",
            stroke: "#94a3b8",
            strokeWidth: "1",
            transform: `rotate(${angle}, ${finalCx}, ${finalCy})`
        };
    };

    // Logic for Left Hand Class
    const leftHandClass = isSuccess ? 'hand-success-l' 
        : isError ? 'hand-error-l' 
        : idleAction === 'cleaning' ? 'cleaning-hand' 
        : emotion === 'sleeping' ? 'hand-sleep-l' 
        : isReading ? 'hand-reading-l' 
        : isHidden ? 'hand-hide-l' 
        : (!isDragging && !isBouncing && emotion !== 'dizzy') ? 'hand-idle-l' 
        : '';

    // Logic for Right Hand Class
    const rightHandClass = isSuccess ? 'hand-success-r' 
        : isError ? 'hand-error-r' 
        : idleAction === 'yoyo' ? 'hand-yoyo' 
        : isYawning ? 'hand-yawn' 
        : emotion === 'sleeping' ? 'hand-sleep-r' 
        : isReading ? 'hand-reading-r' 
        : isHidden ? 'hand-hide-r' 
        : (!isDragging && !isBouncing && emotion !== 'dizzy') ? 'hand-idle-r' 
        : '';

    // Get themed particles based on active theme
    const particles = THEME_PARTICLES[activeTheme as keyof typeof THEME_PARTICLES] || THEME_PARTICLES.default;

    return (
        <>
            <MascotStyles 
                isDragging={isDragging} 
                isBouncing={isBouncing} 
                isYawning={isYawning} 
                isMusic={isMusic}
                eyeColor={eyeColor}
                successBlue={SUCCESS_BLUE}
            />
            <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-2xl overflow-visible pointer-events-none">
                <defs>
                    <linearGradient id="whitePlastic" x1="30%" y1="0%" x2="70%" y2="100%"><stop offset="0%" stopColor="#f8fafc" /><stop offset="100%" stopColor="#cbd5e1" /></linearGradient>
                    <linearGradient id="darkScreen" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#334155" /><stop offset="100%" stopColor="#0f172a" /></linearGradient>
                    <radialGradient id="blueGradient" cx="50%" cy="50%" r="50%"><stop offset="50%" stopColor="#3b82f6" stopOpacity="0" /><stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" /></radialGradient>
                    <filter id="glow"><feGaussianBlur stdDeviation="2.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                    <clipPath id="screenClip"><rect x="27" y="27" width="66" height="40" rx="18" ry="18" /></clipPath>
                </defs>

                {/* EMOTION PARTICLES BACKGROUND - Shifted Up */}
                {isThinking && (
                    <g opacity="0.6" transform="translate(0, -12)">
                        <path d="M 30 20 L 34 20 L 34 24 L 30 24 Z" fill="none" stroke="#cbd5e1" strokeWidth="3" className="gear-spin" />
                        <path d="M 90 20 L 94 20 L 94 24 L 90 24 Z" fill="none" stroke="#94a3b8" strokeWidth="4" className="gear-spin-c" />
                        <circle cx="32" cy="22" r="8" stroke="#94a3b8" strokeWidth="2" fill="none" strokeDasharray="2,2" className="gear-spin" />
                        <circle cx="92" cy="22" r="6" stroke="#cbd5e1" strokeWidth="2" fill="none" strokeDasharray="2,2" className="gear-spin-c" />
                    </g>
                )}
                {isSuccess && (
                    <g transform="translate(0, -15)">
                        <path d="M 60 60 L 60 20" stroke={SUCCESS_BLUE} strokeWidth="2" opacity="0" className="star-particle" />
                        <path d="M 60 60 L 90 30" stroke="#fcd34d" strokeWidth="2" opacity="0" className="star-particle star-delay-1" />
                        <path d="M 60 60 L 30 30" stroke="#fcd34d" strokeWidth="2" opacity="0" className="star-particle star-delay-2" />
                        <text x="20" y="30" fontSize="24" fontWeight="bold" fill={SUCCESS_BLUE} className="star-particle" style={{fontFamily: 'Nunito, sans-serif'}}>{particles.success[0]}</text>
                        <text x="85" y="30" fontSize="24" fontWeight="bold" fill="#fcd34d" className="star-particle star-delay-1" style={{fontFamily: 'Nunito, sans-serif'}}>{particles.success[1]}</text>
                    </g>
                )}
                {isHappy && !isSuccess && !isDragging && (
                    <g transform="translate(0, -30)">
                        <text x="25" y="60" fontSize="20" fontWeight="bold" fill="#f472b6" className="heart-particle" style={{fontFamily: 'Nunito, sans-serif'}}>{particles.happy[0]}</text>
                        <text x="85" y="50" fontSize="16" fontWeight="bold" fill="#f472b6" className="heart-particle heart-delay-1" style={{fontFamily: 'Nunito, sans-serif'}}>{particles.happy[1] || particles.happy[0]}</text>
                        {particles.happy[2] && <text x="55" y="20" fontSize="14" fontWeight="bold" fill="#f472b6" className="heart-particle heart-delay-2" style={{fontFamily: 'Nunito, sans-serif'}}>{particles.happy[2]}</text>}
                    </g>
                )}

                {/* SUPERHERO AURA LAYERS - Rendered behind mascot */}
                {hasLevel1Aura && (
                    <g className="aura-base">
                        {/* Level 1: Blue Energy Ring */}
                        <circle cx="60" cy="65" r="55" fill="url(#blueGradient)" opacity="0.3" />
                        <circle cx="60" cy="65" r="50" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="10 5" className="aura-ring-slow" opacity="0.6" />
                    </g>
                )}
                
                {hasLevel2Aura && (
                    <g transform="translate(0, 0)">
                        {/* Level 2: Golden Burst Energy */}
                        <g className="aura-ring-rev" opacity="0.7">
                            <rect x="25" y="30" width="70" height="70" fill="none" stroke="#eab308" strokeWidth="2" />
                        </g>
                        <g className="aura-ring-fast" opacity="0.8">
                            <rect x="25" y="30" width="70" height="70" fill="none" stroke="#fbbf24" strokeWidth="2" transform="rotate(45 60 65)" />
                        </g>
                        <circle cx="60" cy="65" r="58" fill="none" stroke="#fcd34d" strokeWidth="3" strokeDasharray="2 6" className="aura-ring-rev" />
                    </g>
                )}

                <ellipse cx="60" cy="115" rx="25" ry="4" fill="#000" opacity={isDragging ? "0.1" : "0.3"} />

                {HAS_CAPE && (
                    <path d="M 40 40 Q 20 80 10 110 L 110 110 Q 100 80 80 40 Z" fill="#ef4444" className="robot-container" style={{transformOrigin: '60px 40px'}} />
                )}

                <g className="robot-container">
                    {/* Body */}
                    <path d="M 42 85 Q 60 100 78 85 L 75 72 Q 60 76 45 72 Z" fill="url(#whitePlastic)" stroke="#94a3b8" strokeWidth="1"/>
                    {/* CORE */}
                    <g filter={CHARGE_LEVEL > 50 || isError ? "url(#glow)" : ""}>
                        <circle cx="60" cy="82" r="4" fill={coreColor} className="transition-colors duration-300" />
                        {CHARGE_LEVEL >= 80 && <circle cx="60" cy="82" r="6" fill="none" stroke={THINKING_YELLOW} strokeWidth="1" strokeDasharray="2,2" className="animate-spin" />}
                    </g>

                    {/* Head Group */}
                    <g transform="translate(0, -5)" className={`head-group ${isSuccess ? 'head-happy' : (isError ? 'head-error' : '')}`} >
                        
                        <rect x="22" y="12" width="76" height="60" rx="28" ry="28" fill="url(#whitePlastic)" stroke="#94a3b8" strokeWidth="1" />
                        <path d="M 18 42 L 22 42 L 22 52 L 18 52 Q 15 47 18 42 Z" fill="#64748b" />
                        <path d="M 102 42 L 98 42 L 98 52 L 102 52 Q 105 47 102 42 Z" fill="#64748b" />
                        
                        {/* Headphones */}
                        {isMusic && (
                            <g>
                                <path d="M 15 35 Q 15 0 60 0 Q 105 0 105 35" fill="none" stroke="#334155" strokeWidth="6" />
                                <rect x="10" y="30" width="12" height="24" rx="4" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1" />
                                <rect x="98" y="30" width="12" height="24" rx="4" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1" />
                            </g>
                        )}

                        {/* Screen */}
                        <rect x="27" y="27" width="66" height="40" rx="18" ry="18" fill="url(#darkScreen)" stroke={screenStrokeColor} strokeWidth={screenStrokeWidth} filter={screenFilter} className="transition-all duration-300" />
                        <path d="M 37 32 Q 60 32 83 32 Q 75 42 37 37 Z" fill="white" opacity="0.08" />
                        
                        {/* Sparkles for Cleaning Mode */}
                        {isCleaning && (
                            <g clipPath="url(#screenClip)">
                                <g transform="translate(40, 35)">
                                    <path d="M 0 -4 L 1 -1 L 4 0 L 1 1 L 0 4 L -1 1 L -4 0 L -1 1 L -4 0 L -1 -1 Z" fill="white" className="sparkle-1" />
                                </g>
                                <g transform="translate(85, 30)">
                                    <path d="M 0 -4 L 1 -1 L 4 0 L 1 1 L 0 4 L -1 1 L -4 0 L -1 -1 Z" fill="white" className="sparkle-2" />
                                </g>
                                <g transform="translate(65, 55)">
                                    <path d="M 0 -4 L 1 -1 L 4 0 L 1 1 L 0 4 L -1 1 L -4 0 L -1 -1 Z" fill="white" className="sparkle-3" />
                                </g>
                            </g>
                        )}

                        <g clipPath="url(#screenClip)">
                            <g style={{ transformOrigin: '60px 41px', transform: blinkTransform, transition: 'transform 0.1s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                                <MascotEyes 
                                    emotion={emotion} 
                                    isDragging={isDragging} 
                                    isBlinking={isBlinking} 
                                    isInterested={isInterested} 
                                    idleAction={idleAction} 
                                    eyeColor={eyeColor} 
                                />
                            </g>
                            {/* MOUTH */}
                            {(isSpeaking || emotion === 'speaking') && (
                                <g transform="translate(60, 64)">
                                    <rect x="-12" y="-2" height="4" className="mouth-bar" style={{animation: 'voiceBar 0.4s ease-in-out infinite'}} />
                                    <rect x="-4" y="-2" height="4" className="mouth-bar" style={{animation: 'voiceBar 0.5s ease-in-out infinite 0.1s'}} />
                                    <rect x="4" y="-2" height="4" className="mouth-bar" style={{animation: 'voiceBar 0.3s ease-in-out infinite 0.2s'}} />
                                    <rect x="12" y="-2" height="4" className="mouth-bar" style={{animation: 'voiceBar 0.6s ease-in-out infinite 0.3s'}} />
                                </g>
                            )}
                            {!isSpeaking && emotion !== 'speaking' && !isDizzy && !isYawning && !isReading && (
                                emotion === 'sleeping' || idleAction === 'cleaning' ? (
                                    <line x1="54" y1="65" x2="66" y2="65" stroke={eyeColor} strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
                                ) : (
                                    isMusic ? (
                                        <circle cx="60" cy="64" r="3" stroke={eyeColor} strokeWidth="2" fill="none" opacity="0.8" />
                                    ) : (
                                        <path d="M 52 63 Q 60 67 68 63" stroke={eyeColor} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8"/>
                                    )
                                )
                            )}
                            {isYawning && (
                                <g className="mouth-yawn">
                                    <g transform="translate(60, 60)">
                                        <ellipse cx="0" cy="0" rx="6" ry="8" fill={BASE_GREEN} />
                                        <ellipse cx="0" cy="0" rx="2.5" ry="5" fill={LIGHT_GREEN} />
                                    </g>
                                </g>
                            )}
                        </g>

                        {/* Zs */}
                        {emotion === 'sleeping' && (
                            <g>
                                <text x="85" y="15" fontSize="42" fill="#1e293b" stroke="white" strokeWidth="1.5" className="animate-pulse" style={{fontFamily: 'Nunito, sans-serif', fontWeight: '900', filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.3))'}}>Z</text>
                                <text x="110" y="0" fontSize="28" fill="#334155" stroke="white" strokeWidth="1" className="animate-pulse" style={{fontFamily: 'Nunito, sans-serif', fontWeight: '800', animationDelay: '0.7s', filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.3))'}}>z</text>
                            </g>
                        )}
                        {isYawning && (
                            <g>
                                <text x="85" y="25" fontSize="24" fill="#475569" style={{fontFamily: 'Nunito, sans-serif', fontWeight: '900'}} className="yawn-z-1">z</text>
                                <text x="100" y="15" fontSize="18" fill="#94a3b8" style={{fontFamily: 'Nunito, sans-serif', fontWeight: '800'}} className="yawn-z-2">z</text>
                            </g>
                        )}

                        {/* Notes */}
                        {isMusic && (
                            <g>
                                <text x="90" y="20" className="music-note-1">♫</text>
                                <text x="105" y="35" className="music-note-2">♪</text>
                            </g>
                        )}

                        {/* Accessories */}
                        {HAS_GLASSES && (
                            <g transform="translate(0, -3)">
                                <rect x="32" y="40" width="25" height="15" rx="3" fill="#000" opacity="0.8" />
                                <rect x="63" y="40" width="25" height="15" rx="3" fill="#000" opacity="0.8" />
                                <line x1="57" y1="47" x2="63" y2="47" stroke="#000" strokeWidth="2" />
                                <line x1="22" y1="45" x2="32" y2="47" stroke="#000" strokeWidth="2" />
                                <line x1="88" y1="47" x2="98" y2="45" stroke="#000" strokeWidth="2" />
                            </g>
                        )}
                        {HAS_HAT && !isMusic && (
                            <g transform="translate(35, -5) rotate(-5)">
                                <path d="M 0 10 L 25 0 L 50 10 L 25 20 Z" fill="#1e1b4b" stroke="#000" strokeWidth="1"/>
                                <rect x="15" y="18" width="20" height="10" fill="#1e1b4b" />
                                <line x1="50" y1="10" x2="50" y2="25" stroke="#fbbf24" strokeWidth="2" />
                                <circle cx="50" cy="25" r="2" fill="#fbbf24" />
                            </g>
                        )}
                    </g>

                    {/* Reading Book */}
                    {isReading && (
                        <g transform="translate(40, 45)">
                            <path d="M 0 10 Q 20 20 40 10 L 40 30 Q 20 40 0 30 Z" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1" />
                            {/* Book Spine */}
                            <path d="M 20 15 L 20 35" stroke="#1e3a8a" strokeWidth="4" strokeLinecap="round" />
                            <path d="M 2 10 Q 20 18 38 10" fill="none" stroke="white" strokeWidth="3" />
                        </g>
                    )}

                    {/* LEFT HAND (Center 15, 75) */}
                    <g className={`robot-hand-l ${leftHandClass}`}>
                        {/* Cloth */}
                        {idleAction === 'cleaning' && <rect x="0" y="60" width="30" height="30" fill="#fca5a5" rx="5" transform="rotate(-15 15 75)" />}

                        {/* Thumb (Inner) - Hidden when reading */}
                        {!isReading && <circle {...getFinger(25.5, 78, 55, 15, 75)} />}
                        {/* Index */}
                        <circle {...getFinger(19.5, 83, 15, 15, 75)} />
                        {/* Middle */}
                        <circle {...getFinger(13.5, 84, -5, 15, 75)} />
                        {/* Pinky/Ring */}
                        <circle {...getFinger(7.5, 82, -25, 15, 75)} />

                        {/* Palm */}
                        <circle cx="15" cy="75" r="9" fill="url(#whitePlastic)" stroke="#94a3b8" strokeWidth="1" />
                    </g>
                    
                    {/* RIGHT HAND (Center 105, 75) */}
                    <g className={`robot-hand-r ${rightHandClass}`}>
                        
                        {idleAction === 'yoyo' && (
                            <g transform="translate(105, 75)">
                                <line x1="0" y1="0" x2="0" y2="40" className="yoyo-string" />
                                <circle cx="0" cy="0" r="6" className="yoyo-body" />
                            </g>
                        )}

                        {/* Thumb (Inner) - Hidden when reading */}
                        {!isReading && <circle {...getFinger(94.5, 78, -55, 105, 75)} />}
                        {/* Index */}
                        <circle {...getFinger(100.5, 83, -15, 105, 75)} />
                        {/* Middle */}
                        <circle {...getFinger(106.5, 84, 5, 105, 75)} />
                        {/* Pinky/Ring */}
                        <circle {...getFinger(112.5, 82, 25, 105, 75)} />

                        {/* Palm */}
                        <circle cx="105" cy="75" r="9" fill="url(#whitePlastic)" stroke="#94a3b8" strokeWidth="1" />
                    </g>
                </g>
                
                {/* Dizzy Stars */}
                {isDizzy && (
                    <g className="animate-pulse">
                        <text x="30" y="20" fontSize="20">💫</text>
                        <text x="90" y="25" fontSize="20">💫</text>
                    </g>
                )}
            </svg>
            
            {/* Thinking Bubble */}
            {isThinking && !isDragging && (
                <div className="absolute -top-6 -left-4 bg-white dark:bg-slate-800 px-3 py-1 rounded-2xl rounded-br-none text-xs font-bold shadow-lg animate-bounce border-2 border-yellow-400 text-slate-700 dark:text-slate-200 z-10 whitespace-nowrap pointer-events-none">
                    {emotion === 'hint_suggestion' ? '¿Una pista? 💡' : 'Mmm... 💭'}
                </div>
            )}
        </>
    );
};
