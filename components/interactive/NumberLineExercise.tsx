import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import type { NumberLineExercise as NumberLineExerciseType, StudentProfile } from '../../types';
import { shuffleArray } from '../../utils/array';
import { playCorrectSound, playIncorrectSound, playClickSound } from '../../utils/sounds';
import { Confetti } from '../Results';
import { Button } from '../common/Button';
import { generateNumberLineExercise } from '../../services/aiService';

interface NumberLineExerciseProps {
    exercise: NumberLineExerciseType;
    isAiEnabled: boolean;
    studentProfile: StudentProfile;
    onComplete: (state: any) => void;
    savedState?: any;
    themeColor?: string;
}

type FeedbackStatus = 'idle' | 'correct' | 'incorrect';

interface DraggableItem {
    value: number;
    label: string;
    originalIndex: number;
}

const themePalettes: Record<string, { itemBg: string }> = {
    slate: { itemBg: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200' },
    blue: { itemBg: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200' },
    green: { itemBg: 'bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-200' },
    yellow: { itemBg: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-200' },
    orange: { itemBg: 'bg-orange-100 text-orange-800 dark:bg-orange-900/60 dark:text-orange-200' },
    red: { itemBg: 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-200' },
    pink: { itemBg: 'bg-pink-100 text-pink-800 dark:bg-pink-900/60 dark:text-pink-200' },
    purple: { itemBg: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200' },
    cyan: { itemBg: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-200' },
    indigo: { itemBg: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200' },
    teal: { itemBg: 'bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200' },
    emerald: { itemBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200' },
    rose: { itemBg: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200' },
    amber: { itemBg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200' },
    lime: { itemBg: 'bg-lime-100 text-lime-800 dark:bg-lime-900/60 dark:text-lime-200' },
};

export const NumberLineExercise: React.FC<NumberLineExerciseProps> = ({ exercise, isAiEnabled, studentProfile, onComplete, savedState, themeColor = 'slate' }) => {
    const selectedTheme = themePalettes[themeColor] || themePalettes.slate;
    
    const [currentItems, setCurrentItems] = useState(exercise.items);
    
    const draggableItems = useMemo(() => {
        return shuffleArray(currentItems.map((item, index) => ({ ...item, originalIndex: index })));
    }, [currentItems]);

    const [placedItems, setPlacedItems] = useState<Record<number, DraggableItem | null>>(() => {
        if (savedState?.placed) {
            const initialPlaced: Record<number, DraggableItem | null> = {};
            currentItems.forEach((item, index) => {
                const savedItem = savedState.placed.find((p: any) => p.originalIndex === index);
                if (savedItem) {
                    initialPlaced[index] = savedItem;
                }
            });
            return initialPlaced;
        }
        return {};
    });
    
    const [feedback, setFeedback] = useState<Record<number, FeedbackStatus>>({});
    const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [aiState, setAiState] = useState<{ isLoading: boolean; error: string | null }>({ isLoading: false, error: null });
    const onCompleteCalled = useRef(!!savedState);

    const numberLineRef = useRef<HTMLDivElement>(null);

    const correctlyPlacedOriginalIndexes = useMemo(() => 
        new Set(Object.values(placedItems).filter((item): item is DraggableItem => item !== null).map(item => item.originalIndex))
    , [placedItems]);

    const allCorrect = useMemo(() => {
        if (savedState) return true;
        return correctlyPlacedOriginalIndexes.size === currentItems.length
    }, [correctlyPlacedOriginalIndexes, currentItems, savedState]);

    useEffect(() => {
        if (allCorrect && !onCompleteCalled.current) {
            onCompleteCalled.current = true;
            setShowConfetti(true);
            setTimeout(() => {
                 const finalState = { placed: Object.values(placedItems).filter(Boolean) };
                 onComplete(finalState);
            }, 2000);
        }
    }, [allCorrect, onComplete, placedItems]);

    const handleReset = useCallback((newItems?: NumberLineExerciseType['items']) => {
        playClickSound();
        if (newItems) {
            setCurrentItems(newItems);
        }
        setPlacedItems({});
        setFeedback({});
        setShowConfetti(false);
        setAiState({ isLoading: false, error: null });
        onCompleteCalled.current = false;
    }, []);

    const handleGenerateAI = async () => {
        setAiState({ isLoading: true, error: null });
        try {
            const newItems = await generateNumberLineExercise(exercise.min, exercise.max, 5, 'fácil', studentProfile);
            handleReset(newItems);
        } catch (err) {
            const message = err instanceof Error ? err.message : "No se pudo generar el ejercicio.";
            setAiState({ isLoading: false, error: `Error de la IA: ${message}` });
        }
    };


    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, itemData: DraggableItem) => {
        e.dataTransfer.setData('itemData', JSON.stringify(itemData));
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingOver(false);
        const lineEl = numberLineRef.current;
        if (!lineEl) return;

        try {
            const itemData = JSON.parse(e.dataTransfer.getData('itemData')) as DraggableItem;
            if (correctlyPlacedOriginalIndexes.has(itemData.originalIndex)) return;

            const rect = lineEl.getBoundingClientRect();
            const dropX = e.clientX - rect.left;
            const dropPercentage = dropX / rect.width;
            
            const itemPercentage = (itemData.value - exercise.min) / (exercise.max - exercise.min);
            
            const tolerance = 0.05; // 5% tolerance on either side
            if (Math.abs(dropPercentage - itemPercentage) <= tolerance) {
                // Correct
                playCorrectSound();
                setPlacedItems(prev => ({ ...prev, [itemData.originalIndex]: itemData }));
                setFeedback(prev => ({...prev, [itemData.originalIndex]: 'correct' }));
            } else {
                // Incorrect
                playIncorrectSound();
                setFeedback(prev => ({...prev, [itemData.originalIndex]: 'incorrect' }));
                setTimeout(() => {
                    setFeedback(prev => {
                        const newFeedback = {...prev};
                        delete newFeedback[itemData.originalIndex];
                        return newFeedback;
                    });
                }, 500);
            }
        } catch (err) {
            console.error("Error parsing dropped data:", err);
        }
    };
    
    return (
        <div className="relative text-center">
            {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}
            
            {/* Draggable Items */}
            <div className="flex flex-wrap justify-center gap-3 mb-8 min-h-[6rem]">
                {draggableItems.map((item) => {
                    const isPlaced = correctlyPlacedOriginalIndexes.has(item.originalIndex);
                    const currentFeedback = feedback[item.originalIndex] || 'idle';
                    
                    let feedbackClass = '';
                    if (currentFeedback === 'incorrect') feedbackClass = 'animate-shake !bg-red-200 dark:!bg-red-800';
                    if (isPlaced) feedbackClass = 'opacity-30 cursor-not-allowed';

                    return (
                         <div
                            key={item.originalIndex}
                            draggable={!isPlaced && !allCorrect}
                            onDragStart={(e) => handleDragStart(e, item)}
                            className={`number-line-item p-3 rounded-lg text-center font-bold text-lg shadow-md transition-all cursor-grab active:cursor-grabbing ${selectedTheme.itemBg} ${feedbackClass}`}
                        >
                            {item.label}
                        </div>
                    );
                })}
            </div>

            {/* Number Line */}
            <div className="relative w-full h-16 flex items-center">
                <div 
                    ref={numberLineRef}
                    onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setIsDraggingOver(true); }}
                    onDragLeave={() => setIsDraggingOver(false)}
                    onDrop={handleDrop}
                    className={`number-line w-full h-2 bg-slate-300 dark:bg-slate-600 rounded-full transition-all ${isDraggingOver ? 'number-line-over' : ''}`}
                >
                     {/* Ticks */}
                    <div className="number-line-tick" style={{ left: '0%' }}>
                        <span className="number-line-tick-label">{exercise.min}</span>
                    </div>
                     <div className="number-line-tick" style={{ left: '50%' }}>
                        <span className="number-line-tick-label">{(exercise.min + exercise.max) / 2}</span>
                    </div>
                     <div className="number-line-tick" style={{ left: '100%' }}>
                        <span className="number-line-tick-label">{exercise.max}</span>
                    </div>

                    {/* Placed Items */}
                    {Object.values(placedItems)
                        .filter((item): item is DraggableItem => Boolean(item))
                        .map(item => (
                        <div 
                            key={item.originalIndex}
                            className="number-line-placed-item animate-fade-in"
                            style={{ left: `calc(${((item.value - exercise.min) / (exercise.max - exercise.min)) * 100}% - 24px)`}}
                        >
                            {item.label}
                        </div>
                    ))}

                </div>
            </div>

             <div className="mt-8">
                 {allCorrect ? (
                    <div className="animate-fade-in">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">¡Felicidades! ¡Todo correcto! 🥳</p>
                        <Button onClick={() => handleReset()} variant="secondary" className="mt-4">
                            Jugar de nuevo
                        </Button>
                    </div>
                ) : (
                    <p className="text-slate-500 dark:text-slate-400">Arrastra cada número a su lugar correcto en la línea.</p>
                )}
                 {isAiEnabled && !allCorrect && (
                     <Button 
                        onClick={handleGenerateAI} 
                        variant="special" 
                        className="mt-4"
                        disabled={aiState.isLoading}
                    >
                         {aiState.isLoading ? 'Generando...' : 'Generar con IA 🤖'}
                    </Button>
                 )}
                 {aiState.error && <p className="text-red-500 mt-2">{aiState.error}</p>}
            </div>
        </div>
    );
};