
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useMascot, MascotEmotion } from '../../context/MascotContext';
import { useSpeech } from '../../context/SpeechContext';
import { BackgroundTheme } from './DynamicBackground';
import { playClickSound, playCorrectSound, playMascotSound } from '../../utils/sounds';
import { MascotDisplay } from './mascot/MascotDisplay';

interface InteractiveMascotProps {
    activeTheme?: BackgroundTheme;
}

// Possible idle actions
type IdleActionType = 'none' | 'yoyo' | 'cleaning' | 'yawning' | 'reading' | 'music';
const PLAYFUL_ACTIONS: IdleActionType[] = ['yoyo', 'cleaning', 'reading', 'music'];

const DEBUG_EMOTIONS: MascotEmotion[] = ['idle', 'happy', 'thinking', 'sleeping', 'surprised', 'speaking', 'success', 'error', 'dizzy', 'hint_suggestion'];
const DEBUG_ACTIONS: IdleActionType[] = ['none', 'yoyo', 'cleaning', 'yawning', 'reading', 'music'];

export const InteractiveMascot: React.FC<InteractiveMascotProps> = ({ activeTheme = 'default' }) => {
    const { emotion, setEmotion, triggerReaction, streak } = useMascot();
    const { isSpeaking } = useSpeech();
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Timers
    const actionTimerRef = useRef<number | null>(null);
    const yawnTimerRef = useRef<number | null>(null);
    const sleepTimerRef = useRef<number | null>(null);
    const blinkTimerRef = useRef<number | null>(null);
    const saccadeTimerRef = useRef<number | null>(null);

    // Visual State
    const [isBlinking, setIsBlinking] = useState(false);
    const [isInterested, setIsInterested] = useState(false);
    const [scrollOffset, setScrollOffset] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    
    // Interaction State
    const [position, setPosition] = useState<{x: number, y: number} | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isBouncing, setIsBouncing] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
    const [idleAction, setIdleAction] = useState<IdleActionType>('none');

    // Debug State
    const [showDebug, setShowDebug] = useState(false);

    // Action Bag for Shuffle Logic
    const availableActionsRef = useRef<IdleActionType[]>([...PLAYFUL_ACTIONS]);

    // Physics & Input Logic
    const dragOffset = useRef<{x: number, y: number}>({ x: 0, y: 0 });
    const startPos = useRef<{x: number, y: number}>({ x: 0, y: 0 });
    const longPressTimer = useRef<number | null>(null);
    const tapCount = useRef(0);
    const lastTapTime = useRef(0);
    const isPointerDown = useRef(false);
    const lastMouseRef = useRef({ x: 0, y: 0 });
    
    // Eye Movement Logic Refs
    const isSaccadingRef = useRef(false); 
    const isTrackingInputRef = useRef(false);
    
    // State for restoring eye position after animations
    const targetEyeStateRef = useRef({ 
        eyeGroupX: 0, eyeGroupY: 0, 
        headX: 0, headY: 0, 
        pupilX: 0, pupilY: 0 
    });
    
    // Shake Detection
    const velocityHistory = useRef<{x: number, time: number}[]>([]);
    const lastDragPos = useRef<{x: number, y: number} | null>(null);

    // Track emotion in a ref to avoid dependency loops
    const emotionRef = useRef(emotion);
    useEffect(() => {
        emotionRef.current = emotion;
    }, [emotion]);

    // Force reset geometry when entering specific idle states
    useEffect(() => {
        if (idleAction !== 'none') {
            if (containerRef.current) {
                const vars = ['--eye-group-x', '--eye-group-y', '--pupil-x', '--pupil-y', '--head-x', '--head-y'];
                vars.forEach(v => containerRef.current?.style.setProperty(v, '0px'));
            }
            // IMPORTANT: Reset target state ref so restoration logic doesn't snap back to old mouse position
            targetEyeStateRef.current = { 
                eyeGroupX: 0, eyeGroupY: 0, 
                headX: 0, headY: 0, 
                pupilX: 0, pupilY: 0 
            };
        }
    }, [idleAction]);

    const updateEyePosition = useCallback((deltaX: number, deltaY: number) => {
        if (!containerRef.current) return;
        
        // 1. Calculate Target Positions based on input delta
        
        // Reduced horizontal range to prevent eyes clipping into rounded screen corners (was 9)
        const maxEyeGroupMoveX = 7; 
        
        // Reduced Up range significantly to prevent clipping into top bezel (was 5)
        // Eye center is roughly at Y=41. Screen top is Y=27. Eye radius is ~12-14.
        // 41 - 14 = 27. So at rest (interested), it touches the top.
        // We limit upward movement to almost zero to keep it inside.
        const maxEyeGroupMoveYUp = 1.5; 
        
        // Relaxed Down restriction slightly as requested (was 3, now 6)
        const maxEyeGroupMoveYDown = 6; 

        const eyeGroupX = Math.max(-maxEyeGroupMoveX, Math.min(maxEyeGroupMoveX, deltaX / 35));
        const eyeGroupY = Math.max(-maxEyeGroupMoveYUp, Math.min(maxEyeGroupMoveYDown, deltaY / 35));
        
        // Slightly reduced head movement to keep face composition tighter (was 7)
        const maxHeadMove = 5;
        const headX = Math.max(-maxHeadMove, Math.min(maxHeadMove, deltaX / 55));
        const headY = Math.max(-maxHeadMove, Math.min(maxHeadMove, deltaY / 55));

        // Reduced pupil range to keep them inside sclera at edges (was 6.5)
        const maxPupilMove = 5;
        const pupilX = Math.max(-maxPupilMove, Math.min(maxPupilMove, deltaX / 45));
        const pupilY = Math.max(-maxPupilMove, Math.min(maxPupilMove, deltaY / 45));

        // 2. Store calculated state for later restoration
        targetEyeStateRef.current = { eyeGroupX, eyeGroupY, headX, headY, pupilX, pupilY };

        // 3. Apply only if NOT currently running a controlled animation (Saccade/LookAtUser)
        if (isSaccadingRef.current) return;

        // Special case: Hint suggestion forces a specific look
        if (emotion === 'hint_suggestion') {
             containerRef.current.style.setProperty('--eye-group-x', `3px`);
             containerRef.current.style.setProperty('--eye-group-y', `3px`);
             containerRef.current.style.setProperty('--pupil-x', `2px`);
             containerRef.current.style.setProperty('--pupil-y', `3px`);
             containerRef.current.style.setProperty('--head-x', `2px`);
             containerRef.current.style.setProperty('--head-y', `4px`);
             return;
        }

        containerRef.current.style.setProperty('--eye-group-x', `${eyeGroupX}px`);
        containerRef.current.style.setProperty('--eye-group-y', `${eyeGroupY}px`);
        containerRef.current.style.setProperty('--head-x', `${headX}px`);
        containerRef.current.style.setProperty('--head-y', `${headY}px`);
        containerRef.current.style.setProperty('--pupil-x', `${pupilX}px`);
        containerRef.current.style.setProperty('--pupil-y', `${pupilY}px`);
    }, [emotion]);

    // Load saved position
    useEffect(() => {
        const savedPos = localStorage.getItem('mascotPosition');
        if (savedPos) {
            try {
                setPosition(JSON.parse(savedPos));
            } catch (e) {}
        }
    }, []);

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                const target = event.target as HTMLElement;
                if (!target.closest('.mascot-menu')) {
                    setShowMenu(false);
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, []);

    // Global pointer up
    useEffect(() => {
        const handleGlobalPointerUp = () => {
            if (isDragging || isPointerDown.current) {
                isPointerDown.current = false;
                setIsDragging(false);
                lastDragPos.current = null;
                velocityHistory.current = [];
            }
        };
        window.addEventListener('pointerup', handleGlobalPointerUp);
        window.addEventListener('pointercancel', handleGlobalPointerUp);
        window.addEventListener('mouseup', handleGlobalPointerUp);
        return () => {
            window.removeEventListener('pointerup', handleGlobalPointerUp);
            window.removeEventListener('pointercancel', handleGlobalPointerUp);
            window.removeEventListener('mouseup', handleGlobalPointerUp);
        };
    }, [isDragging]);

    // Blink Logic
    useEffect(() => {
        if (blinkTimerRef.current) clearTimeout(blinkTimerRef.current);
        if (emotion === 'sleeping' || emotion === 'dizzy' || idleAction === 'yawning' || idleAction === 'music') {
            setIsBlinking(false);
            return; 
        }
        const scheduleBlink = () => {
            const nextBlinkTime = 2500 + Math.random() * 4500;
            blinkTimerRef.current = window.setTimeout(() => {
                const isDoubleBlink = Math.random() < 0.3;
                const blinkDuration = 150;
                const performBlink = (onComplete?: () => void) => {
                    setIsBlinking(true);
                    setTimeout(() => {
                        setIsBlinking(false);
                        if (onComplete) onComplete();
                    }, blinkDuration);
                };
                performBlink(() => {
                    if (isDoubleBlink) {
                        setTimeout(() => {
                            performBlink(scheduleBlink);
                        }, 100);
                    } else {
                        scheduleBlink();
                    }
                });
            }, nextBlinkTime);
        };
        scheduleBlink();
        return () => { if (blinkTimerRef.current) clearTimeout(blinkTimerRef.current); };
    }, [emotion, idleAction]);

    // --- EYE MOVEMENT LOGIC (SACCADES VS TRACKING) ---
    
    const restoreEyeState = useCallback(() => {
        if (containerRef.current) {
            const { eyeGroupX, eyeGroupY, headX, headY, pupilX, pupilY } = targetEyeStateRef.current;
            containerRef.current.style.setProperty('--eye-group-x', `${eyeGroupX}px`);
            containerRef.current.style.setProperty('--eye-group-y', `${eyeGroupY}px`);
            containerRef.current.style.setProperty('--head-x', `${headX}px`);
            containerRef.current.style.setProperty('--head-y', `${headY}px`);
            containerRef.current.style.setProperty('--pupil-x', `${pupilX}px`);
            containerRef.current.style.setProperty('--pupil-y', `${pupilY}px`);
        }
        isSaccadingRef.current = false;
    }, []);

    const performNaturalAnimation = useCallback(() => {
        if (!containerRef.current) return;
        
        // Mark as animating to block mouse tracking override
        isSaccadingRef.current = true;

        if (isTrackingInputRef.current) {
            // --- TRACKING INPUT MODE ---
            // Behavior: "Look at User" (Center Pupils Only)
            // The mascot keeps head and eyes oriented towards work, but glances at user with pupils.
            containerRef.current.style.setProperty('--pupil-x', '0px');
            containerRef.current.style.setProperty('--pupil-y', '0px');
            
            setTimeout(restoreEyeState, 1500);
        } else {
            // --- IDLE/MOUSE TRACKING MODE ---
            // Behavior: "Natural Saccades" (Glancing around)
            // Look in a random direction (Up, Down, Left, Right, Diagonals)
            
            // Decreased movement range for subtlety (was ~8px)
            const range = 4.5; 
            // Random point within the range
            const x = (Math.random() * range * 2) - range;
            const y = (Math.random() * range * 2) - range;

            containerRef.current.style.setProperty('--pupil-x', `${x}px`);
            containerRef.current.style.setProperty('--pupil-y', `${y}px`);

            setTimeout(() => {
                // Return to tracking after a short glance
                restoreEyeState();
            }, 300);
        }
    }, [restoreEyeState]);

    // Scheduler for Animations
    useEffect(() => {
        if (saccadeTimerRef.current) clearTimeout(saccadeTimerRef.current);
        
        // Do not perform extra eye animations if sleeping, dizzy, or doing full-body actions
        // Exception: Yoyo is allowed to have saccades
        if (emotion !== 'idle' || (idleAction !== 'none' && idleAction !== 'yoyo')) {
            isSaccadingRef.current = false; 
            return;
        }

        const scheduleAnimation = () => {
            // Random interval between 3 and 7 seconds
            const nextTime = Math.random() * 4000 + 3000; 
            
            saccadeTimerRef.current = window.setTimeout(() => {
                if (isDragging) {
                    scheduleAnimation();
                    return;
                }
                performNaturalAnimation();
                scheduleAnimation(); 
            }, nextTime);
        };

        scheduleAnimation();
        return () => { if (saccadeTimerRef.current) clearTimeout(saccadeTimerRef.current); };
    }, [emotion, idleAction, performNaturalAnimation, isDragging]);


    // --- IDLE STATE MANAGEMENT ---
    const handleUserActivity = useCallback(() => {
        // If debug menu forced an action, don't clear it automatically on activity
        // unless we want user activity to interrupt debug actions. 
        // For now, we will let user activity interrupt normal idle flow but maybe respect debug?
        // The original logic clears it. We'll keep it consistent: user activity wakes up the robot.
        setIdleAction(prev => {
            if (prev !== 'none') return 'none';
            return prev;
        });
        
        if (emotionRef.current === 'sleeping') {
            setEmotion('idle');
        }

        if (actionTimerRef.current) clearTimeout(actionTimerRef.current);
        if (yawnTimerRef.current) clearTimeout(yawnTimerRef.current);
        if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);

        actionTimerRef.current = window.setTimeout(() => {
            if (containerRef.current) {
                const vars = ['--eye-group-x', '--eye-group-y', '--pupil-x', '--pupil-y', '--head-x', '--head-y'];
                vars.forEach(v => containerRef.current?.style.setProperty(v, '0px'));
            }
            if (availableActionsRef.current.length === 0) {
                availableActionsRef.current = [...PLAYFUL_ACTIONS];
            }
            const randomIndex = Math.floor(Math.random() * availableActionsRef.current.length);
            const nextAction = availableActionsRef.current[randomIndex];
            availableActionsRef.current.splice(randomIndex, 1);
            setIdleAction(nextAction);
        }, 10000);

        yawnTimerRef.current = window.setTimeout(() => {
            setIdleAction('yawning'); 
        }, 20000);

        sleepTimerRef.current = window.setTimeout(() => {
            setIdleAction('none');
            setEmotion('sleeping');
        }, 25000);

    }, [setEmotion]); 

    useEffect(() => {
        handleUserActivity();
        return () => {
            if (actionTimerRef.current) clearTimeout(actionTimerRef.current);
            if (yawnTimerRef.current) clearTimeout(yawnTimerRef.current);
            if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
        };
    }, [handleUserActivity]);

    const trackTarget = useCallback((targetX: number, targetY: number) => {
        if (containerRef.current) {
            const rectMascot = containerRef.current.getBoundingClientRect();
            const centerX = rectMascot.left + rectMascot.width / 2;
            const centerY = rectMascot.top + rectMascot.height / 2;
            
            handleUserActivity(); // Wake up if idle
            updateEyePosition(targetX - centerX, targetY - centerY);
        }
    }, [handleUserActivity, updateEyePosition]);

    // Input Tracking Listeners
    useEffect(() => {
        const handleFocusIn = (e: FocusEvent) => {
            const target = e.target as HTMLElement;
            if (target.matches('input, textarea, select, [contenteditable]')) {
                isTrackingInputRef.current = true;
                const rect = target.getBoundingClientRect();
                trackTarget(rect.left + rect.width / 2, rect.top + rect.height / 2);
            }
        };

        const handleFocusOut = () => {
            isTrackingInputRef.current = false;
        };

        const handleInput = (e: Event) => {
            const target = e.target as HTMLElement;
            if (target.matches('input, textarea, select, [contenteditable]')) {
                isTrackingInputRef.current = true;
                const rect = target.getBoundingClientRect();
                trackTarget(rect.left + rect.width / 2, rect.top + rect.height / 2);
            }
        };

        window.addEventListener('focusin', handleFocusIn);
        window.addEventListener('focusout', handleFocusOut);
        window.addEventListener('input', handleInput);
        return () => {
            window.removeEventListener('focusin', handleFocusIn);
            window.removeEventListener('focusout', handleFocusOut);
            window.removeEventListener('input', handleInput);
        };
    }, [trackTarget]);

    // Mouse Tracking
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const dx = Math.abs(e.clientX - lastMouseRef.current.x);
            const dy = Math.abs(e.clientY - lastMouseRef.current.y);
            if (dx < 2 && dy < 2) return; 
            
            lastMouseRef.current = { x: e.clientX, y: e.clientY };

            if (isDragging || !containerRef.current || emotion === 'dizzy' || idleAction !== 'none') return;
            if (isTrackingInputRef.current) return;

            handleUserActivity();

            const rect = containerRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            updateEyePosition(e.clientX - centerX, e.clientY - centerY);
        };
        
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [handleUserActivity, isDragging, emotion, idleAction, updateEyePosition]);

    const calculateMenuPosition = () => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const menuWidth = 160; const menuHeight = 60; 
        let top = rect.top - menuHeight - 12; 
        if (top < 10) top = rect.bottom + 12;
        let left = rect.left + rect.width / 2 - menuWidth / 2;
        if (left < 10) left = 10;
        if (left + menuWidth > window.innerWidth - 10) left = window.innerWidth - menuWidth - 10;
        setMenuStyle({ top: `${top}px`, left: `${left}px`, position: 'fixed', zIndex: 9999 });
    };

    // Pointer/Touch Logic
    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        isPointerDown.current = true;
        startPos.current = { x: e.clientX, y: e.clientY };
        setIsBouncing(false); 
        setIdleAction('none'); 
        if (emotion === 'sleeping') {
            setEmotion('idle'); 
            playMascotSound('snore');
        } else {
            playMascotSound('chirp');
        }
        handleUserActivity();

        const now = Date.now();
        if (now - lastTapTime.current < 500) tapCount.current++;
        else tapCount.current = 1;
        lastTapTime.current = now;

        if (tapCount.current >= 3) {
            triggerReaction('happy');
            playCorrectSound();
            tapCount.current = 0;
            containerRef.current?.animate([
                { transform: 'translate(1px, 1px) rotate(0deg)' },
                { transform: 'translate(-1px, -2px) rotate(-1deg)' },
                { transform: 'translate(-3px, 0px) rotate(1deg)' },
                { transform: 'translate(3px, 2px) rotate(0deg)' },
                { transform: 'translate(1px, -1px) rotate(1deg)' }
            ], { duration: 500, iterations: 1 });
        }

        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
            try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {}
        }

        if (longPressTimer.current) clearTimeout(longPressTimer.current);
        longPressTimer.current = window.setTimeout(() => {
            if (isPointerDown.current && !isDragging) {
                calculateMenuPosition();
                setShowMenu(true);
                playClickSound();
            }
        }, 600);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isPointerDown.current) return;
        
        const currentTime = Date.now();
        if (lastDragPos.current) {
            const dx = e.clientX - lastDragPos.current.x;
            velocityHistory.current.push({ x: dx, time: currentTime });
            if (velocityHistory.current.length > 10) velocityHistory.current.shift();
            
            let directionChanges = 0;
            for(let i=1; i<velocityHistory.current.length; i++) {
                if (Math.sign(velocityHistory.current[i].x) !== Math.sign(velocityHistory.current[i-1].x) && Math.abs(velocityHistory.current[i].x) > 15) {
                    directionChanges++;
                }
            }
            if (directionChanges > 3) {
                triggerReaction('dizzy', 4000);
                velocityHistory.current = [];
            }
        }
        lastDragPos.current = { x: e.clientX, y: e.clientY };

        const deltaX = Math.abs(e.clientX - startPos.current.x);
        const deltaY = Math.abs(e.clientY - startPos.current.y);
        
        if (!isDragging && Math.sqrt(deltaX*deltaX + deltaY*deltaY) > 5) {
            if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; }
            if (showMenu) setShowMenu(false);
            setIsDragging(true);
            playMascotSound('surprised');
            if (emotion !== 'dizzy') setEmotion('surprised');
        }

        if (isDragging) {
            let newX = e.clientX - dragOffset.current.x;
            let newY = e.clientY - dragOffset.current.y;
            const w = window.innerWidth; const h = window.innerHeight;
            newX = Math.max(-50, Math.min(w - 50, newX));
            newY = Math.max(-50, Math.min(h - 50, newY));
            setPosition({ x: newX, y: newY });
        }
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isPointerDown.current) return;
        isPointerDown.current = false;
        lastDragPos.current = null;
        velocityHistory.current = [];
        
        if (longPressTimer.current) clearTimeout(longPressTimer.current);
        try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (err) {}

        if (isDragging) {
            setIsDragging(false);
            setIsBouncing(true);
            setTimeout(() => setIsBouncing(false), 1000);
            if (emotion !== 'dizzy') triggerReaction('happy');
            if (position) localStorage.setItem('mascotPosition', JSON.stringify(position));
        }
    };

    const positionStyle: React.CSSProperties = position 
        ? { left: `${position.x}px`, top: `${position.y}px`, transform: `translateY(${scrollOffset}px) scale(${isDragging ? 1.1 : 1})` }
        : { bottom: '1rem', right: '1rem', transform: `translateY(${scrollOffset}px)` };

    return (
        <>
            {showDebug && (
                <div className="fixed bottom-2 left-2 bg-slate-900/90 text-white p-3 rounded-lg shadow-xl z-[100] text-xs max-w-xs border border-slate-700 font-mono">
                    <div className="flex justify-between items-center mb-2 border-b border-slate-700 pb-1">
                        <span className="font-bold text-green-400">Mascot Debugger</span>
                        <button onClick={() => setShowDebug(false)} className="text-slate-400 hover:text-white">✕</button>
                    </div>
                    
                    <div className="mb-3">
                        <div className="text-slate-400 mb-1 font-semibold">Set Emotion</div>
                        <div className="flex flex-wrap gap-1">
                            {DEBUG_EMOTIONS.map((e) => (
                                <button 
                                    key={e} 
                                    onClick={() => {
                                        setEmotion(e);
                                        if(e === 'sleeping') setIdleAction('none');
                                    }} 
                                    className={`px-2 py-1 rounded transition-colors ${emotion === e ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
                                >
                                    {e}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="text-slate-400 mb-1 font-semibold">Set Action</div>
                        <div className="flex flex-wrap gap-1">
                            {DEBUG_ACTIONS.map((a) => (
                                <button 
                                    key={a} 
                                    onClick={() => {
                                        setIdleAction(a);
                                        if(a !== 'none') setEmotion('idle');
                                    }} 
                                    className={`px-2 py-1 rounded transition-colors ${idleAction === a ? 'bg-purple-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
                                >
                                    {a}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            
            {!showDebug && (
                <button 
                    onClick={() => setShowDebug(true)}
                    className="fixed bottom-2 left-2 z-[100] bg-slate-900/50 p-2 rounded-full text-white hover:bg-slate-900 transition-colors"
                    title="Open Debug Menu"
                >
                    🐞
                </button>
            )}

            {showMenu && (
                <div className="mascot-menu fixed bg-white dark:bg-slate-800 rounded-xl shadow-xl border-2 border-blue-300 p-2 flex gap-2 animate-modal-scale-in" style={menuStyle} onPointerDown={(e) => e.stopPropagation()}>
                    <button onClick={() => { playClickSound(); setShowMenu(false); triggerReaction('speaking', 3000); }} className="p-2 hover:bg-blue-100 rounded-full text-xl" title="Hablar">🗣️</button>
                    <button onClick={() => { playClickSound(); setShowMenu(false); setIsVisible(false); setTimeout(() => setIsVisible(true), 5000); }} className="p-2 hover:bg-blue-100 rounded-full text-xl" title="Esconder">👻</button>
                    <button onClick={() => { playClickSound(); setShowMenu(false); setEmotion('thinking'); }} className="p-2 hover:bg-blue-100 rounded-full text-xl" title="Pensar">🤔</button>
                </div>
            )}

            <div 
                ref={containerRef}
                className={`fixed z-50 w-36 h-36 sm:w-48 sm:h-48 transition-all duration-100 ease-out select-none`}
                style={{ 
                    ...positionStyle, 
                    opacity: isVisible ? 1 : 0.3, 
                    pointerEvents: isVisible ? 'auto' : 'none', 
                    cursor: isDragging ? 'grabbing' : 'grab', 
                    touchAction: 'none' 
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
            >
                <MascotDisplay
                    emotion={emotion}
                    streak={streak}
                    idleAction={idleAction}
                    isSpeaking={isSpeaking}
                    isDragging={isDragging}
                    isBouncing={isBouncing}
                    isBlinking={isBlinking}
                    isInterested={isInterested}
                    isDizzy={emotion === 'dizzy'}
                    isHidden={!isVisible}
                    activeTheme={activeTheme}
                />
            </div>
        </>
    );
};
