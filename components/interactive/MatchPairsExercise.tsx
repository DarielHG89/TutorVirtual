import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import type { MatchPairsExercise as MatchPairsExerciseType } from '../../types';
import { shuffleArray } from '../../utils/array';
import { playCorrectSound, playIncorrectSound, playClickSound } from '../../utils/sounds';
import { Confetti } from '../Results';
import { Button } from '../common/Button';

interface MatchPairsExerciseProps {
    exercise: MatchPairsExerciseType;
    onComplete: (state: any) => void;
    savedState?: any;
    themeColor?: string;
}

type FeedbackStatus = 'idle' | 'correct' | 'incorrect';

interface TermItem {
    term: string;
    originalIndex: number;
}

interface DefinitionItem {
    definition: string;
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


export const MatchPairsExercise: React.FC<MatchPairsExerciseProps> = ({ exercise, onComplete, savedState, themeColor = 'slate' }) => {
    const selectedTheme = themePalettes[themeColor] || themePalettes.slate;
    
    const [shuffledTerms, shuffledDefinitions] = useMemo(() => {
        const items = exercise.pairs.map((p, i) => ({ term: p.term, definition: p.definition, originalIndex: i }));
        const terms: TermItem[] = shuffleArray(items.map(({ term, originalIndex }) => ({ term, originalIndex })));
        const definitions: DefinitionItem[] = shuffleArray(items.map(({ definition, originalIndex }) => ({ definition, originalIndex })));
        return [terms, definitions];
    }, [exercise.pairs]);

    const [droppedTerms, setDroppedTerms] = useState<Record<number, TermItem | null>>(savedState?.dropped || {});
    const [feedback, setFeedback] = useState<Record<number, FeedbackStatus>>({});
    const [isDraggingOver, setIsDraggingOver] = useState<number | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const onCompleteCalled = useRef(!!savedState);

    const correctlyPlacedOriginalIndexes = useMemo(() => 
        new Set(Object.values(droppedTerms).filter((t): t is TermItem => t !== null).map(t => t.originalIndex))
    , [droppedTerms]);

    const allCorrect = useMemo(() => {
        if (savedState) return true;
        return Object.keys(droppedTerms).length === exercise.pairs.length && Object.values(droppedTerms).every(t => t !== null)
    }, [droppedTerms, exercise.pairs.length, savedState]);

    useEffect(() => {
        if (allCorrect && !onCompleteCalled.current) {
            onCompleteCalled.current = true;
            setShowConfetti(true);
            setTimeout(() => {
                onComplete({ dropped: droppedTerms });
            }, 2000);
        }
    }, [allCorrect, onComplete, droppedTerms]);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, termData: TermItem) => {
        e.dataTransfer.setData('termData', JSON.stringify(termData));
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, defItem: DefinitionItem, defShuffledIndex: number) => {
        e.preventDefault();
        setIsDraggingOver(null);
        if (droppedTerms[defShuffledIndex]) return;

        try {
            const termData = JSON.parse(e.dataTransfer.getData('termData')) as TermItem;
            
            const sourceDefinitionText = exercise.pairs[termData.originalIndex].definition;
            const targetDefinitionText = defItem.definition;

            if (sourceDefinitionText === targetDefinitionText) {
                // Correct match
                playCorrectSound();
                setDroppedTerms(prev => ({...prev, [defShuffledIndex]: termData }));
                setFeedback(prev => ({...prev, [defShuffledIndex]: 'correct' }));
            } else {
                // Incorrect match
                playIncorrectSound();
                setFeedback(prev => ({...prev, [defShuffledIndex]: 'incorrect' }));
                setTimeout(() => setFeedback(prev => ({...prev, [defShuffledIndex]: 'idle' })), 500);
            }
        } catch (err) {
            console.error("Error parsing dropped data:", err);
        }
    };
    
    const feedbackClasses: Record<FeedbackStatus, string> = {
        idle: 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600',
        correct: 'correct !text-slate-800 dark:!text-slate-100',
        incorrect: 'incorrect'
    };

    const handleReset = () => {
        playClickSound();
        setDroppedTerms({});
        setFeedback({});
        setShowConfetti(false);
        onCompleteCalled.current = false;
        // This won't reset the parent's saved state, allowing for a temporary replay.
        // The saved state will reappear if the lesson is reloaded.
    };

    return (
        <div className="relative">
            {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Terms Column */}
                <div className="space-y-3">
                    {!allCorrect && <h3 className="font-bold text-center text-slate-600 dark:text-slate-300">Arrastra un Término...</h3>}
                    {shuffledTerms.map((termItem) => {
                        const isPlaced = correctlyPlacedOriginalIndexes.has(termItem.originalIndex);
                        return (
                             <div
                                key={termItem.originalIndex}
                                draggable={!isPlaced && !allCorrect}
                                onDragStart={(e) => handleDragStart(e, termItem)}
                                className={`term-drag-item min-h-[5rem] p-4 rounded-lg flex items-center justify-center text-center font-bold text-lg shadow-md transition-opacity ${selectedTheme.itemBg} ${isPlaced ? 'placed' : ''} ${allCorrect ? 'cursor-default' : ''}`}
                            >
                                {termItem.term}
                            </div>
                        );
                    })}
                </div>

                {/* Definitions Column */}
                <div className="space-y-3">
                     {!allCorrect && <h3 className="font-bold text-center text-slate-600 dark:text-slate-300">...a su Definición Correcta</h3>}
                    {shuffledDefinitions.map((defItem, defShuffledIndex) => {
                        const droppedTerm = droppedTerms[defShuffledIndex];
                        const currentFeedback = feedback[defShuffledIndex] || (droppedTerm ? 'correct' : 'idle');
                        
                        return (
                            <div
                                key={defItem.originalIndex}
                                onDragOver={(e) => { if (!allCorrect) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; } }}
                                onDragEnter={() => !droppedTerm && !allCorrect && setIsDraggingOver(defShuffledIndex)}
                                onDragLeave={() => setIsDraggingOver(null)}
                                onDrop={(e) => !allCorrect && handleDrop(e, defItem, defShuffledIndex)}
                                className={`drop-zone min-h-[5rem] p-4 rounded-lg border-2 border-dashed flex items-center justify-center transition-all duration-300 ${feedbackClasses[currentFeedback]} ${isDraggingOver === defShuffledIndex && !allCorrect ? 'drag-over' : ''} ${allCorrect ? 'cursor-default' : ''}`}
                            >
                                {droppedTerm ? (
                                    <span className="font-bold text-lg">
                                        {droppedTerm.term.includes('__?__')
                                            ? droppedTerm.term.replace('__?__', defItem.definition)
                                            : defItem.definition}
                                    </span>
                                ) : (
                                    <span className="text-slate-600 dark:text-slate-300">{defItem.definition}</span>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {allCorrect && (
                <div className="animate-fade-in text-center mt-6">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">¡Excelente! ¡Todo correcto! 🎉</p>
                    <Button onClick={handleReset} variant="secondary" className="mt-4">Jugar de nuevo</Button>
                </div>
            )}
        </div>
    );
};