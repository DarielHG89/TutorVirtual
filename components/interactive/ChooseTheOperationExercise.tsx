import React, { useState, useEffect, useRef } from 'react';
import type { ChooseTheOperationExercise as ChooseTheOperationExerciseType } from '../../types';
import { Button } from '../common/Button';
import { playCorrectSound, playIncorrectSound, playClickSound } from '../../utils/sounds';
import { Confetti } from '../Results';

interface ChooseTheOperationExerciseProps {
    exercise: ChooseTheOperationExerciseType;
    onComplete: (state: any) => void;
    savedState?: any;
    themeColor?: string;
}

const operationIcons = {
    '+': '➕',
    '-': '➖',
    'x': '✖️',
    '÷': '➗',
};

const themePalettes: Record<string, { bg: string }> = {
    slate: { bg: 'bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600' },
    blue: { bg: 'bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-600' },
    green: { bg: 'bg-green-100 dark:bg-green-900/40 border-green-300 dark:border-green-600' },
    yellow: { bg: 'bg-yellow-100 dark:bg-yellow-900/40 border-yellow-300 dark:border-yellow-600' },
    orange: { bg: 'bg-orange-100 dark:bg-orange-900/40 border-orange-300 dark:border-orange-600' },
    red: { bg: 'bg-red-100 dark:bg-red-900/40 border-red-300 dark:border-red-600' },
    pink: { bg: 'bg-pink-100 dark:bg-pink-900/40 border-pink-300 dark:border-pink-600' },
    purple: { bg: 'bg-purple-100 dark:bg-purple-900/40 border-purple-300 dark:border-purple-600' },
    cyan: { bg: 'bg-cyan-100 dark:bg-cyan-900/40 border-cyan-300 dark:border-cyan-600' },
    indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/40 border-indigo-300 dark:border-indigo-600' },
    teal: { bg: 'bg-teal-100 dark:bg-teal-900/40 border-teal-300 dark:border-teal-600' },
    emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-600' },
    rose: { bg: 'bg-rose-100 dark:bg-rose-900/40 border-rose-300 dark:border-rose-600' },
    amber: { bg: 'bg-amber-100 dark:bg-amber-900/40 border-amber-300 dark:border-amber-600' },
    lime: { bg: 'bg-lime-100 dark:bg-lime-900/40 border-lime-300 dark:border-lime-600' },
};


export const ChooseTheOperationExercise: React.FC<ChooseTheOperationExerciseProps> = ({ exercise, onComplete, savedState, themeColor = 'slate' }) => {
    const selectedTheme = themePalettes[themeColor] || themePalettes.slate;
    
    const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isFinished, setIsFinished] = useState(!!savedState?.completed);

    const currentProblem = exercise.problems[currentProblemIndex];
    const onCompleteCalled = useRef(!!savedState);

    useEffect(() => {
        if(savedState?.completed) {
            setCurrentProblemIndex(exercise.problems.length - 1);
        }
    }, [savedState, exercise.problems.length]);

    const handleOperationSelect = (operation: '+' | '-' | 'x' | '÷') => {
        if (feedback === 'correct' || isFinished) return;
        playClickSound();

        if (operation === currentProblem.correctOperation) {
            playCorrectSound();
            setFeedback('correct');

            if (currentProblemIndex === exercise.problems.length - 1) {
                setShowConfetti(true);
                setIsFinished(true);
                if (!onCompleteCalled.current) {
                    onCompleteCalled.current = true;
                    setTimeout(() => {
                        onComplete({ completed: true });
                    }, 2000);
                }
            } else {
                setTimeout(() => {
                    setFeedback(null);
                    setCurrentProblemIndex(prev => prev + 1);
                }, 1500);
            }
        } else {
            playIncorrectSound();
            setFeedback('incorrect');
            setTimeout(() => {
                setFeedback(null);
            }, 1000);
        }
    };
    
    const handleReset = () => {
        playClickSound();
        setCurrentProblemIndex(0);
        setFeedback(null);
        setShowConfetti(false);
        setIsFinished(false);
        onCompleteCalled.current = false;
    }
    
    let feedbackClass = '';
    if (feedback === 'correct') {
        feedbackClass = 'bg-green-100 dark:bg-green-900/50 border-green-400';
    } else if (feedback === 'incorrect') {
        feedbackClass = 'bg-red-100 dark:bg-red-900/50 border-red-400 animate-shake';
    } else {
        feedbackClass = selectedTheme.bg;
    }

    return (
        <div className="relative text-center">
             {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}
            
            <div className={`p-6 rounded-lg border-2 min-h-[10rem] flex items-center justify-center transition-colors ${feedbackClass}`}>
                <p className="text-xl font-semibold text-slate-700 dark:text-slate-200">{currentProblem?.text}</p>
            </div>
            
            {!isFinished && <p className="my-4 font-bold text-slate-600 dark:text-slate-300">¿Qué operación usarías para resolverlo?</p>}
            
            <div className="flex justify-center gap-4 flex-wrap mt-4">
                {(['+', '-', 'x', '÷'] as const).map(op => {
                    const isCorrect = op === currentProblem.correctOperation;
                    let buttonClass = '';
                    if ((feedback === 'correct' && isCorrect) || (isFinished && isCorrect)) {
                        buttonClass = 'ring-4 ring-green-500';
                    }

                    return (
                        <Button
                            key={op}
                            onClick={() => handleOperationSelect(op)}
                            className={`!text-4xl !w-20 !h-20 ${buttonClass}`}
                            disabled={feedback === 'correct' || isFinished}
                            aria-label={`Operación ${op}`}
                        >
                            {operationIcons[op]}
                        </Button>
                    );
                })}
            </div>

            {isFinished && (
                <div className="animate-fade-in mt-4">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">¡Felicidades! ¡Ejercicio completado! 🥳</p>
                    <Button onClick={handleReset} variant="secondary" className="mt-4">
                        Jugar de nuevo
                    </Button>
                </div>
            )}
        </div>
    );
};