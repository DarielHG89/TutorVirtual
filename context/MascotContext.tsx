
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

export type MascotEmotion = 'idle' | 'happy' | 'thinking' | 'sleeping' | 'surprised' | 'speaking' | 'success' | 'error' | 'dizzy' | 'hint_suggestion';

interface MascotContextType {
    emotion: MascotEmotion;
    setEmotion: (emotion: MascotEmotion) => void;
    triggerReaction: (emotion: MascotEmotion, duration?: number) => void;
    streak: number;
    handleCorrect: () => void;
    handleIncorrect: () => void;
}

const MascotContext = createContext<MascotContextType | undefined>(undefined);

export const MascotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [emotion, setEmotionState] = useState<MascotEmotion>('idle');
    const [streak, setStreak] = useState(0);
    const timeoutRef = useRef<number | null>(null);

    const setEmotion = useCallback((newEmotion: MascotEmotion) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setEmotionState(newEmotion);
    }, []);

    const triggerReaction = useCallback((reaction: MascotEmotion, duration = 2000) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        
        setEmotionState(reaction);
        
        // Volver a idle después del tiempo, a menos que sea un estado persistente
        if (reaction !== 'sleeping' && reaction !== 'thinking') {
            timeoutRef.current = window.setTimeout(() => {
                setEmotionState('idle');
            }, duration);
        }
    }, []);

    const handleCorrect = useCallback(() => {
        setStreak(prev => prev + 1);
        triggerReaction('success', 3000);
    }, [triggerReaction]);

    const handleIncorrect = useCallback(() => {
        setStreak(0); // Reiniciar racha en error
        triggerReaction('error', 2500);
    }, [triggerReaction]);

    return (
        <MascotContext.Provider value={{ emotion, setEmotion, triggerReaction, streak, handleCorrect, handleIncorrect }}>
            {children}
        </MascotContext.Provider>
    );
};

export const useMascot = () => {
    const context = useContext(MascotContext);
    if (!context) {
        throw new Error('useMascot must be used within a MascotProvider');
    }
    return context;
};
