
import React from 'react';

interface MascotStylesProps {
    isDragging: boolean;
    isBouncing: boolean;
    isYawning: boolean;
    isMusic: boolean;
    eyeColor: string;
    successBlue: string;
}

export const MascotStyles: React.FC<MascotStylesProps> = ({ 
    isDragging, 
    isBouncing, 
    isYawning, 
    isMusic, 
    eyeColor,
    successBlue
}) => {
    return (
        <style>
            {`
                @keyframes robotFloat { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
                @keyframes bounceRelease { 0% { transform: scale(1.1, 0.9); } 50% { transform: scale(0.9, 1.1) translateY(-10px); } 100% { transform: scale(1, 1) translateY(0); } }
                
                /* Transitions for smoother animations */
                .robot-container, .head-group, .robot-hand-l, .robot-hand-r {
                    transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                
                /* Smooth finger retraction */
                .robot-hand-l circle:not(:last-child), .robot-hand-r circle:not(:last-child) {
                    transition: cx 0.3s ease-out, cy 0.3s ease-out, transform 0.3s ease-out;
                }

                /* Aura Animations (Superhero Mode) */
                @keyframes auraSpin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes auraPulse {
                    0%, 100% { transform: scale(0.95); opacity: 0.5; }
                    50% { transform: scale(1.05); opacity: 0.8; }
                }
                
                .aura-base { transform-origin: 60px 60px; animation: auraPulse 3s ease-in-out infinite; }
                .aura-ring-slow { transform-origin: 60px 60px; animation: auraSpin 10s linear infinite; }
                .aura-ring-fast { transform-origin: 60px 60px; animation: auraSpin 3s linear infinite; }
                .aura-ring-rev { transform-origin: 60px 60px; animation: auraSpin 5s linear infinite reverse; }

                /* Reading Animations */
                @keyframes readingScanVertical {
                    0%, 45% { transform: translateY(6px); }
                    50%, 95% { transform: translateY(10px); }
                    100% { transform: translateY(6px); }
                }

                @keyframes readingScanHorizontal {
                    0% { transform: translate(-5px, 3.5px); }
                    45% { transform: translate(5px, 3.5px); }
                    50% { transform: translate(-5px, 3.5px); }
                    95% { transform: translate(5px, 3.5px); }
                    100% { transform: translate(-5px, 3.5px); }
                }
                
                /* Music Animations */
                @keyframes headBob {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(3px) rotate(1deg); }
                }
                @keyframes noteFloat {
                    0% { opacity: 0; transform: translate(0, 0) scale(0.8); }
                    30% { opacity: 1; transform: translate(5px, -15px) scale(1); }
                    100% { opacity: 0; transform: translate(15px, -30px) scale(0.8); }
                }
                .music-note-1 { animation: noteFloat 2s ease-out infinite; fill: ${eyeColor}; font-size: 24px; font-weight: bold; }
                .music-note-2 { animation: noteFloat 2.5s ease-out infinite; animation-delay: 1s; fill: ${successBlue}; font-size: 20px; font-weight: bold; }

                /* Yoyo Animations */
                @keyframes yoyoHand { 
                    0%, 100% { transform: translateY(0px); } 
                    50% { transform: translateY(-3px); } 
                }
                @keyframes yoyoSpin {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(45px) rotate(180deg); }
                    100% { transform: translateY(0px) rotate(360deg); }
                }
                @keyframes yoyoStringScale {
                    0%, 100% { transform: scaleY(0); }
                    50% { transform: scaleY(1); }
                }

                /* Yawn Animation - Double Yawn Cycle (6s) */
                @keyframes yawnCycle {
                    0% { transform: scale(1); }
                    /* First Yawn (Big) */
                    10% { transform: scale(1.05, 1.15) translateY(-2px); }
                    40% { transform: scale(1.05, 1.15) translateY(-2px); }
                    50% { transform: scale(1); }
                    /* Second Yawn (Small) */
                    60% { transform: scale(1.02, 1.08) translateY(-1px); }
                    85% { transform: scale(1.02, 1.08) translateY(-1px); }
                    95%, 100% { transform: scale(1); }
                }
                
                @keyframes yawnMouthAnim {
                    0% { transform: scale(0); opacity: 0; } 
                    /* First Yawn - Bigger mouth opening */
                    10% { transform: scale(1.3); opacity: 1; } 
                    40% { transform: scale(1.3); opacity: 1; } 
                    50% { transform: scale(0); opacity: 0; }
                    /* Second Yawn - Smaller & Faster */
                    60% { transform: scale(0.6); opacity: 1; }
                    75% { transform: scale(0.6); opacity: 1; }
                    85%, 100% { transform: scale(0); opacity: 0; }
                }

                @keyframes yawnHand {
                    0% { transform: translate(0,0) rotate(0deg); }
                    /* First Yawn - Hand goes to mouth. Rotate CLOCKWISE so fingers point left/up towards nose. Lowered Y to cover mouth. */
                    /* Raised hand slightly (from -8px to -14px) to better align with mouth height */
                    10% { transform: translate(-45px, -14px) rotate(110deg); }
                    40% { transform: translate(-45px, -14px) rotate(110deg); }
                    50% { transform: translate(0,0) rotate(0deg); }
                    /* Second Yawn - Hand stays down */
                    60% { transform: translate(0, 0) rotate(0deg); }
                    85% { transform: translate(0, 0) rotate(0deg); }
                    95%, 100% { transform: translate(0,0) rotate(0deg); }
                }
                
                /* Zs animation for Yawning */
                @keyframes yawnZFloat {
                    0% { opacity: 0; transform: translate(0, 0) scale(0.8); }
                    20% { opacity: 1; }
                    100% { opacity: 0; transform: translate(10px, -20px) scale(1.2); }
                }
                .yawn-z-1 { animation: yawnZFloat 2s ease-out infinite; animation-delay: 0.5s; }
                .yawn-z-2 { animation: yawnZFloat 2s ease-out infinite; animation-delay: 1.5s; }

                /* Circular Cleaning Motion with Wrist Rotation */
                @keyframes cleanWipe { 
                    0% { transform: translate(45px, -28px) rotate(-100deg); } /* Center */
                    20% { transform: translate(12px, -48px) rotate(-115deg); } /* Top Left */
                    40% { transform: translate(78px, -48px) rotate(-85deg); } /* Top Right */
                    60% { transform: translate(78px, -8px) rotate(-85deg); } /* Bottom Right */
                    80% { transform: translate(12px, -8px) rotate(-115deg); } /* Bottom Left */
                    100% { transform: translate(45px, -28px) rotate(-100deg); } /* Center */
                }
                
                /* Sparkles for cleaning - fixed scale animation */
                @keyframes sparklePop {
                    0%, 100% { transform: scale(0); opacity: 0; }
                    50% { transform: scale(1); opacity: 1; }
                }
                /* Using transform-box: fill-box ensures scaling happens from the center of the star itself */
                .sparkle-1 { 
                    animation: sparklePop 2.1s ease-in-out infinite; 
                    transform-origin: center; 
                    transform-box: fill-box; 
                }
                .sparkle-2 { 
                    animation: sparklePop 1.7s ease-in-out infinite 0.4s; 
                    transform-origin: center; 
                    transform-box: fill-box; 
                }
                .sparkle-3 { 
                    animation: sparklePop 2.5s ease-in-out infinite 0.9s; 
                    transform-origin: center; 
                    transform-box: fill-box; 
                }

                @keyframes voiceBar { 0%, 100% { height: 4px; } 50% { height: 15px; } }
                @keyframes dizzySpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                
                /* Pupil Jitter Animation */
                @keyframes pupilJitter {
                    0%, 90% { transform: translate(0, 0); }
                    92% { transform: translate(0.5px, 0.5px); }
                    94% { transform: translate(-0.5px, 0.5px); }
                    96% { transform: translate(-0.5px, -0.5px); }
                    98% { transform: translate(0.5px, -0.5px); }
                    100% { transform: translate(0, 0); }
                }
                .pupil-jitter {
                    animation: pupilJitter 5s infinite;
                    transform-box: fill-box;
                    transform-origin: center;
                }

                /* Error Hands - Adjusted to sit on top/sides of head */
                @keyframes handErrorL { 
                    0% { transform: translate(0,0) rotate(0deg); } 
                    100% { transform: translate(22px, -60px) rotate(140deg); } 
                }
                @keyframes handErrorR { 
                    0% { transform: translate(0,0) rotate(0deg); } 
                    100% { transform: translate(-22px, -60px) rotate(-140deg); } 
                }

                /* Victory Hands - Waving Up/Down */
                @keyframes victoryWaveL { 
                    0%, 100% { transform: translateY(0); } 
                    50% { transform: translateY(-15px); } 
                }
                @keyframes victoryWaveR { 
                    0%, 100% { transform: translateY(-10px); } 
                    50% { transform: translateY(-25px); } 
                }

                /* Idle Breathing Hands */
                @keyframes idleHandBreathL {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    50% { transform: translate(6px, -2px) rotate(-8deg); }
                }
                @keyframes idleHandBreathR {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    50% { transform: translate(-6px, -2px) rotate(8deg); }
                }

                /* New Emotion Particles */
                @keyframes gearSpin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes gearSpinCounter {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                }
                .gear-spin { transform-origin: center; transform-box: fill-box; animation: gearSpin 4s linear infinite; }
                .gear-spin-c { transform-origin: center; transform-box: fill-box; animation: gearSpinCounter 4s linear infinite; }

                @keyframes heartFloat {
                    0% { transform: translateY(0) scale(0.8); opacity: 0; }
                    20% { opacity: 1; transform: translateY(-10px) scale(1); }
                    100% { transform: translateY(-40px) scale(0.5); opacity: 0; }
                }
                .heart-particle { animation: heartFloat 3s ease-out infinite; }
                .heart-delay-1 { animation-delay: 0.5s; }
                .heart-delay-2 { animation-delay: 1.5s; }

                @keyframes starBurst {
                    0% { transform: scale(0) rotate(0deg); opacity: 0; }
                    50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
                    100% { transform: scale(0) rotate(360deg); opacity: 0; }
                }
                .star-particle { transform-origin: center; transform-box: fill-box; animation: starBurst 2s ease-in-out infinite; }
                .star-delay-1 { animation-delay: 0.2s; }
                .star-delay-2 { animation-delay: 0.7s; }

                .robot-container { animation: ${isDragging ? 'none' : (isBouncing ? 'bounceRelease 0.6s ease-out' : 'robotFloat 4s ease-in-out infinite')}; }
                
                /* Yoyo Classes */
                .yoyo-string { 
                    stroke: white; 
                    stroke-width: 1.5; 
                    transform-origin: top;
                    animation: yoyoStringScale 1s ease-in-out infinite; 
                }
                .yoyo-body { 
                    fill: #ef4444; 
                    animation: yoyoSpin 1s ease-in-out infinite; 
                }
                .hand-yoyo { 
                    animation: yoyoHand 1s ease-in-out infinite; 
                }
                
                /* Special Hand Positions */
                .hand-sleep-l { transform: translate(25px, -28px) rotate(-95deg); }
                .hand-sleep-r { transform: translate(-25px, -28px) rotate(95deg); }
                
                /* Reading Hands: Positioned on the sides of the book with updated rotation */
                .hand-reading-l { transform: translate(22px, -12px) rotate(-70deg); }
                .hand-reading-r { transform: translate(-22px, -12px) rotate(70deg); }

                /* Hiding Hands: Covering eyes with strong rotation so fingers point up/inwards */
                .hand-hide-l { transform: translate(28px, -38px) rotate(150deg); }
                .hand-hide-r { transform: translate(-28px, -38px) rotate(-150deg); }

                .cleaning-hand { animation: cleanWipe 2.5s linear infinite; }
                
                /* Yawn Hand uses keyframes now for timing */
                .hand-yawn { animation: yawnHand 6s ease-in-out infinite; }
                
                .mouth-yawn { transform-origin: 60px 58px; animation: yawnMouthAnim 6s ease-in-out infinite; }
                .mouth-bar { fill: ${eyeColor}; width: 4px; rx: 2px; transform-origin: center; transform-box: fill-box; }
                
                .hand-success-l { animation: victoryWaveL 1s ease-in-out infinite; }
                .hand-success-r { animation: victoryWaveR 1s ease-in-out infinite; }
                .hand-error-l { animation: handErrorL 0.5s forwards; transform-origin: 15px 75px; }
                .hand-error-r { animation: handErrorR 0.5s forwards; transform-origin: 105px 75px; }
                
                .hand-idle-l { animation: idleHandBreathL 4s ease-in-out infinite; }
                .hand-idle-r { animation: idleHandBreathR 4s ease-in-out infinite; }

                /* Default hand origins for smoother transitions */
                .robot-hand-l { transform-origin: 15px 75px; }
                .robot-hand-r { transform-origin: 105px 75px; }

                .head-group {
                    transform-origin: 60px 50px;
                    animation: ${isYawning ? 'yawnCycle 6s ease-in-out infinite' : (isMusic ? 'headBob 0.6s ease-in-out infinite' : 'none')};
                }
            `}
        </style>
    );
};
