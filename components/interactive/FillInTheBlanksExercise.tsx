import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import type { FillInTheBlanksExercise as FillInTheBlanksExerciseType } from '../../types';
import { shuffleArray } from '../../utils/array';
import { playCorrectSound, playIncorrectSound, playClickSound } from '../../utils/sounds';
import { Confetti } from '../Results';
import { Button } from '../common/Button';

interface FillInTheBlanksExerciseProps {
    exercise: FillInTheBlanksExerciseType;
    onComplete: (state: any) => void;
    savedState?: any;
    themeColor?: string;
}

type FeedbackStatus = 'idle' | 'correct' | 'incorrect';

const themePalettes: Record<string, { bg: string }> = {
    slate: { bg: 'bg-slate-100 dark:bg-slate-700/50' },
    blue: { bg: 'bg-blue-100 dark:bg-blue-900/40' },
    green: { bg: 'bg-green-100 dark:bg-green-900/40' },
    yellow: { bg: 'bg-yellow-100 dark:bg-yellow-900/40' },
    orange: { bg: 'bg-orange-100 dark:bg-orange-900/40' },
    red: { bg: 'bg-red-100 dark:bg-red-900/40' },
    pink: { bg: 'bg-pink-100 dark:bg-pink-900/40' },
    purple: { bg: 'bg-purple-100 dark:bg-purple-900/40' },
    cyan: { bg: 'bg-cyan-100 dark:bg-cyan-900/40' },
    indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/40' },
    teal: { bg: 'bg-teal-100 dark:bg-teal-900/40' },
    emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/40' },
    rose: { bg: 'bg-rose-100 dark:bg-rose-900/40' },
    amber: { bg: 'bg-amber-100 dark:bg-amber-900/40' },
    lime: { bg: 'bg-lime-100 dark:bg-lime-900/40' },
};

export const FillInTheBlanksExercise: React.FC<FillInTheBlanksExerciseProps> = ({ exercise, onComplete, savedState, themeColor = 'slate' }) => {
    const selectedTheme = themePalettes[themeColor] || themePalettes.slate;
    
    const [userAnswers, setUserAnswers] = useState<Record<number, string>>(savedState?.answers || {});
    const [feedback, setFeedback] = useState<Record<number, FeedbackStatus>>({});
    const [isSubmitted, setIsSubmitted] = useState(!!savedState);
    const [allCorrect, setAllCorrect] = useState(!!savedState);
    const [showConfetti, setShowConfetti] = useState(false);
    const onCompleteCalled = useRef(!!savedState);

    const exerciseParts = useMemo(() => {
        const parts = exercise.textWithBlanks.split('__BLANK__');
        const shuffledBlanks = exercise.blanks.map(blank => ({
            ...blank,
            options: shuffleArray([blank.correctAnswer, ...blank.options.filter(o => o !== blank.correctAnswer)])
        }));
        return { parts, shuffledBlanks };
    }, [exercise]);

    useEffect(() => {
        if (savedState) {
            const initialFeedback: Record<number, FeedbackStatus> = {};
            exercise.blanks.forEach((_, index) => {
                initialFeedback[index] = 'correct';
            });
            setFeedback(initialFeedback);
        }
    }, [savedState, exercise.blanks]);

    const handleAnswerChange = (blankIndex: number, value: string) => {
        playClickSound();
        setUserAnswers(prev => ({ ...prev, [blankIndex]: value }));
        if (isSubmitted) {
            setIsSubmitted(false);
            setFeedback({});
            setAllCorrect(false);
        }
    };
    
    const checkAnswers = () => {
        playClickSound();
        setIsSubmitted(true);
        let allAreCorrect = true;
        const newFeedback: Record<number, FeedbackStatus> = {};
        
        exercise.blanks.forEach((blank, index) => {
            if (userAnswers[index] === blank.correctAnswer) {
                newFeedback[index] = 'correct';
            } else {
                newFeedback[index] = 'incorrect';
                allAreCorrect = false;
            }
        });
        
        setFeedback(newFeedback);

        if (allAreCorrect) {
            playCorrectSound();
            setShowConfetti(true);
            setAllCorrect(true);
            if (!onCompleteCalled.current) {
                onCompleteCalled.current = true;
                setTimeout(() => {
                    onComplete({ answers: userAnswers });
                }, 2000);
            }
        } else {
            playIncorrectSound();
        }
    };

    const handleReset = () => {
        playClickSound();
        setUserAnswers({});
        setFeedback({});
        setIsSubmitted(false);
        setAllCorrect(false);
        setShowConfetti(false);
        onCompleteCalled.current = false;
    };

    const isCheckDisabled = Object.keys(userAnswers).length !== exercise.blanks.length;

    return (
        <div className="relative text-lg">
            {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}
            
            <div className={`${selectedTheme.bg} p-4 rounded-lg leading-loose`}>
                {exerciseParts.parts.map((part, index) => (
                    <React.Fragment key={index}>
                        {part}
                        {index < exerciseParts.shuffledBlanks.length && (
                            <select
                                value={userAnswers[index] || ""}
                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                                disabled={allCorrect}
                                className={`blank-select mx-1 ${isSubmitted ? feedback[index] : ''}`}
                            >
                                <option value="" disabled>Elige...</option>
                                {exerciseParts.shuffledBlanks[index].options.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        )}
                    </React.Fragment>
                ))}
            </div>
            
            <div className="text-center mt-6">
                {allCorrect ? (
                     <div className="animate-fade-in">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">¡Felicidades! ¡Todo correcto! 🥳</p>
                        <Button onClick={handleReset} variant="secondary" className="mt-4">
                            Jugar de nuevo
                        </Button>
                    </div>
                ) : (
                    <Button onClick={checkAnswers} disabled={isCheckDisabled}>
                        Comprobar Respuestas
                    </Button>
                )}
            </div>
        </div>
    );
};