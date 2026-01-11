
import React from 'react';
import type { MascotEmotion } from '../../../context/MascotContext';

interface MascotEyesProps {
    emotion: MascotEmotion;
    isDragging: boolean;
    isBlinking: boolean;
    isInterested: boolean;
    idleAction: string;
    eyeColor: string;
}

export const MascotEyes: React.FC<MascotEyesProps> = ({
    emotion,
    isDragging,
    isBlinking,
    isInterested,
    idleAction,
    eyeColor
}) => {
    const isDizzy = emotion === 'dizzy';
    const isSuccess = emotion === 'success';
    const isError = emotion === 'error';
    const isThinking = emotion === 'thinking' || emotion === 'hint_suggestion';
    const isMusic = idleAction === 'music';
    const isYawning = idleAction === 'yawning';
    const isReading = idleAction === 'reading';
    const isCleaning = idleAction === 'cleaning';

    // Base eye Y position
    const EYE_BASE_Y = 41;

    if (isDizzy) {
        return (
            <g transform="translate(0, 5)">
                <path d="M 35 44 Q 45 34 55 44 Q 45 54 35 44 M 40 44 Q 45 39 50 44" stroke={eyeColor} strokeWidth="3" fill="none" className="animate-spin origin-[45px_44px]" />
                <path d="M 65 44 Q 75 34 85 44 Q 75 54 65 44 M 70 44 Q 75 39 80 44" stroke={eyeColor} strokeWidth="3" fill="none" className="animate-spin origin-[75px_44px]" />
            </g>
        );
    }
    
    // PRIORITY: Dragging overrides happy/music/sleeping
    if (isDragging || emotion === 'surprised') {
        return (
            <g>
                <circle cx="45" cy={EYE_BASE_Y} r="12" fill="none" stroke={eyeColor} strokeWidth="3" filter="url(#glow)" />
                <circle cx="75" cy={EYE_BASE_Y} r="12" fill="none" stroke={eyeColor} strokeWidth="3" filter="url(#glow)" />
                <circle cx="45" cy={EYE_BASE_Y} r="4" fill={eyeColor} />
                <circle cx="75" cy={EYE_BASE_Y} r="4" fill={eyeColor} />
            </g>
        );
    }

    if (isMusic) {
            // Happy closed eyes for music
            return (
            <g transform="translate(0, -3)">
                <path d="M 38 46 L 45 38 L 52 46" stroke={eyeColor} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 68 46 L 75 38 L 82 46" stroke={eyeColor} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
        );
    }
    
    if (isSuccess || emotion === 'happy') {
        return (
            <g transform="translate(0, 2)">
                <path d="M 35 51 Q 45 36 55 51" stroke={eyeColor} strokeWidth="5" fill="none" strokeLinecap="round" filter="url(#glow)" />
                <path d="M 65 51 Q 75 36 85 51" stroke={eyeColor} strokeWidth="5" fill="none" strokeLinecap="round" filter="url(#glow)" />
            </g>
        );
    }
    // Yawning: Closed eyes go UP slightly to make room for big mouth
    if (isYawning) {
            return (
            <g transform="translate(0, -7)">
                <path d="M 35 46 L 55 46" stroke={eyeColor} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />
                <path d="M 65 46 L 85 46" stroke={eyeColor} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />
            </g>
        );
    }
    // Sleeping & Cleaning: Closed eyes go DOWN slightly
    if (emotion === 'sleeping' || isCleaning) {
        return (
            <g transform="translate(0, 5)">
                <path d="M 35 46 L 55 46" stroke={eyeColor} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.6" />
                <path d="M 65 46 L 85 46" stroke={eyeColor} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.6" />
            </g>
        );
    }
    if (isError) {
        return (
            <g transform="translate(0, -3)">
                <path d="M 38 38 L 52 52 M 52 38 L 38 52" stroke={eyeColor} strokeWidth="4" strokeLinecap="round" filter="url(#glow)"/>
                <path d="M 68 38 L 82 52 M 82 38 L 68 52" stroke={eyeColor} strokeWidth="4" strokeLinecap="round" filter="url(#glow)"/>
            </g>
        );
    }
    if (isThinking) {
            return (
            <g>
                <circle cx="45" cy={EYE_BASE_Y - 3} r="10" fill="none" stroke={eyeColor} strokeWidth="3" />
                <circle cx="75" cy={EYE_BASE_Y - 3} r="4" fill={eyeColor} />
                <circle cx="45" cy={EYE_BASE_Y - 3} r="3" fill={eyeColor} />
            </g>
        );
    }
    
    // Default Eyes (Standard or Reading) - Base Y is 41
    const pupilSize = isInterested ? 6 : 3.5;
    const eyeHeight = isInterested ? 14 : 12;
    
    // Update animations: Vertical for eyes group, Horizontal for pupils
    const eyeGroupAnimation = isReading ? 'readingScanVertical 3s ease-in-out infinite' : 'none';
    const pupilAnimation = isReading ? 'readingScanHorizontal 3s ease-in-out infinite' : 'none';
    const pupilOffsetY = isReading ? 2 : 0;
    
    // Force pupil position to look down (translate Y) when reading to align with book
    // Also ignore CSS variables when reading to prevent "stuck" eyes if mouse moves
    // When reading, the animation takes control of the transform.
    const pupilTransform = isReading 
        ? undefined 
        : 'translate(var(--pupil-x, 0px), var(--pupil-y, 0px))';

    return (
        <g className="transition-transform duration-75 ease-out" style={{ transform: 'translate(var(--eye-group-x, 0), var(--eye-group-y, 0))', animation: eyeGroupAnimation }}>
            <ellipse cx="45" cy={EYE_BASE_Y} rx="9" ry={eyeHeight} fill={eyeColor} filter="url(#glow)" className="transition-all duration-300" />
            
            {/* Left Pupil Group for Tracking */}
            <g className="transition-transform duration-75" style={{ transform: pupilTransform, animation: pupilAnimation }}>
                {/* Inner Circle for Jitter */}
                <circle cx="45" cy={EYE_BASE_Y + pupilOffsetY} r={pupilSize} fill="#0f172a" className="pupil-jitter" />
            </g>
            
            <circle cx="49" cy={EYE_BASE_Y - 6} r="2.5" fill="white" opacity="0.9" /> 

            <ellipse cx="75" cy={EYE_BASE_Y} rx="9" ry={eyeHeight} fill={eyeColor} filter="url(#glow)" className="transition-all duration-300" />
            
            {/* Right Pupil Group for Tracking */}
            <g className="transition-transform duration-75" style={{ transform: pupilTransform, animation: pupilAnimation }}>
                 <circle cx="75" cy={EYE_BASE_Y + pupilOffsetY} r={pupilSize} fill="#0f172a" className="pupil-jitter" />
            </g>

            <circle cx="79" cy={EYE_BASE_Y - 6} r="2.5" fill="white" opacity="0.9" /> 
        </g>
    );
};
