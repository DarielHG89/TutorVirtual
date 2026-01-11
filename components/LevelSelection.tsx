

import React from 'react';
import type { GameState, CategoryId } from '../types';
import { questions } from '../data/questions';
import { Card } from './common/Card';
import { categoryNames } from '../utils/constants';

interface LevelSelectionProps {
    categoryId: CategoryId;
    gameState: GameState;
    onStartPractice: (categoryId: CategoryId, level: number) => void;
    isFreeMode?: boolean;
}

// Nueva paleta de colores para diferenciar dificultad de estado.
const levelDetails: Record<number, { name: string; color: string; bg: string; border: string; darkColor: string; darkBg: string; darkBorder: string; }> = {
    1: { name: 'Fácil', color: 'text-teal-800', bg: 'bg-teal-100', border: 'border-teal-500', darkColor: 'dark:text-teal-200', darkBg: 'dark:bg-teal-900/50', darkBorder: 'dark:border-teal-600' },
    2: { name: 'Medio', color: 'text-orange-800', bg: 'bg-orange-100', border: 'border-orange-500', darkColor: 'dark:text-orange-200', darkBg: 'dark:bg-orange-900/50', darkBorder: 'dark:border-orange-600' },
    3: { name: 'Difícil', color: 'text-red-800', bg: 'bg-red-100', border: 'border-red-500', darkColor: 'dark:text-red-200', darkBg: 'dark:bg-red-900/50', darkBorder: 'dark:border-red-600' }
};

export const LevelSelection: React.FC<LevelSelectionProps> = ({ categoryId, gameState, onStartPractice, isFreeMode = false }) => {
    const categoryData = gameState[categoryId];
    const levels = Object.keys(questions[categoryId]);
    const QUIZ_LENGTH = 10;
    const MIN_SCORE_TO_PASS = 8;

    return (
        <div className="animate-fade-in text-center">
            <p className="text-slate-600 dark:text-slate-300 mb-6">
                {isFreeMode
                    ? 'Elige cualquier nivel para practicar libremente.'
                    : 'Selecciona una dificultad. ¡Debes sacar un buen resultado para desbloquear la siguiente!'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {levels.map((levelStr, index) => {
                    const level = parseInt(levelStr);
                    const isLocked = !isFreeMode && level > categoryData.unlockedLevel;
                    const highScore = categoryData.highScores[level] || 0;
                    
                    let stars = 0;
                    if (highScore === QUIZ_LENGTH) {
                        stars = 3;
                    } else if (highScore >= 9) {
                        stars = 2;
                    } else if (highScore >= MIN_SCORE_TO_PASS) {
                        stars = 1;
                    }

                    const details = levelDetails[level] || { name: 'Extra', color: 'text-gray-800', bg: 'bg-gray-100', border: 'border-gray-500', darkColor: 'dark:text-gray-200', darkBg: 'dark:bg-gray-900/50', darkBorder: 'dark:border-gray-600' };

                    const isMastered = highScore === QUIZ_LENGTH;
                    const isCompleted = highScore >= MIN_SCORE_TO_PASS;
                    const isCurrent = !isFreeMode && level === categoryData.unlockedLevel && !isCompleted;

                    const statusClass = isMastered
                        ? 'bg-yellow-100 dark:bg-yellow-900/40 border-t-2 border-yellow-300 dark:border-yellow-600'
                        : isCompleted
                        ? 'bg-green-100 dark:bg-green-900/40 border-t-2 border-green-300 dark:border-green-600'
                        : isCurrent
                        ? 'bg-blue-100 dark:bg-blue-900/40 border-t-2 border-blue-300 dark:border-blue-600'
                        : 'bg-white dark:bg-slate-700/60';

                    return (
                        <div key={level} className="relative animate-staggered-fade-in" style={{ animationDelay: `${index * 75}ms` }}>
                            <Card 
                                onClick={!isLocked ? () => onStartPractice(categoryId, level) : undefined}
                                className={`flex flex-col items-center justify-between min-h-[180px] !p-0 overflow-hidden ${isLocked ? 'filter grayscale' : ''}`}
                            >
                                <div className={`w-full p-2 text-center ${details.bg} ${details.border} ${details.darkBg} ${details.darkBorder} border-b-2`}>
                                    <h4 className={`text-xl font-bold ${details.color} ${details.darkColor}`}>{`Nivel ${level}`}</h4>
                                    <p className={`font-semibold ${details.color} ${details.darkColor} opacity-90`}>{details.name}</p>
                                </div>

                                <div className={`flex flex-col items-center justify-center flex-grow p-3 w-full transition-colors ${statusClass}`}>
                                    <div className={`text-3xl mt-2`}>
                                        <span className="text-yellow-400 won-reward">{'★'.repeat(stars)}</span>
                                        <span className="text-slate-400 dark:text-slate-500">{'☆'.repeat(3 - stars)}</span>
                                    </div>
                                    
                                    <p className="mt-2 font-semibold text-slate-500 dark:text-slate-400">
                                        Mejor: {highScore}/{QUIZ_LENGTH}
                                    </p>
                                </div>
                            </Card>
                            {isLocked && (
                                <div className="absolute inset-0 bg-slate-800/60 rounded-xl flex flex-col items-center justify-center text-white cursor-not-allowed">
                                    <span className="text-6xl" role="img" aria-label="Bloqueado">🔒</span>
                                    <span className="font-bold mt-2 text-lg">Bloqueado</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};