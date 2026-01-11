import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { LessonContent, GameState, StudentProfile } from '../types';
import { Card } from './common/Card';
import { useSpeech } from '../context/SpeechContext';
import { MatchPairsExercise } from './interactive/MatchPairsExercise';
import { FillInTheBlanksExercise } from './interactive/FillInTheBlanksExercise';
import { FillInTheTextExercise } from './interactive/FillInTheTextExercise';
import { playClickSound } from '../utils/sounds';
import { NumberLineExercise } from './interactive/NumberLineExercise';
import { ChooseTheOperationExercise } from './interactive/ChooseTheOperationExercise';

interface LessonScreenProps {
    lesson: LessonContent;
    onStartPractice: (lessonId: string, level: number) => void;
    gameState: GameState;
    isAiEnabled: boolean;
    studentProfile: StudentProfile;
    recordInteractiveExerciseState: (lessonId: string, exerciseIndex: number, state: any) => void;
    isDebugMode: boolean;
}

const practiceLevels = [
    { level: 1, name: 'Básico', color: 'text-teal-800', bg: 'bg-teal-100', border: 'border-teal-500', darkColor: 'dark:text-teal-200', darkBg: 'dark:bg-teal-900/50', darkBorder: 'dark:border-teal-600', criteria: 'Automático al iniciar' },
    { level: 2, name: 'Intermedio', color: 'text-orange-800', bg: 'bg-orange-100', border: 'border-orange-500', darkColor: 'dark:text-orange-200', darkBg: 'dark:bg-orange-900/50', darkBorder: 'dark:border-orange-600', criteria: '≥80% en Nivel 1' },
    { level: 3, name: 'Avanzado', color: 'text-red-800', bg: 'bg-red-100', border: 'border-red-500', darkColor: 'dark:text-red-200', darkBg: 'dark:bg-red-900/50', darkBorder: 'dark:border-red-600', criteria: '≥80% en Nivel 2' },
];


const QUIZ_LENGTH = 10;
const MIN_SCORE_TO_UNLOCK = 8;

export const LessonScreen: React.FC<LessonScreenProps> = ({ lesson, onStartPractice, gameState, isAiEnabled, studentProfile, recordInteractiveExerciseState, isDebugMode }) => {
    
    const { speak } = useSpeech();
    const theoryRef = useRef<HTMLDivElement>(null);
    const [openExerciseIndex, setOpenExerciseIndex] = useState<number | null>(null);
    const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());
    
    const numInteractiveExercises = lesson.interactiveExercises?.length || 0;
    const allInteractiveComplete = numInteractiveExercises === 0 || completedExercises.size === numInteractiveExercises;

    useEffect(() => {
        const savedState = gameState[lesson.id]?.interactiveExerciseState || {};
        const savedCompletedIndices = Object.keys(savedState).map(Number);
        const initialCompleted = new Set(savedCompletedIndices);
        setCompletedExercises(initialCompleted);
        
        // Find the first uncompleted exercise to open by default
        let firstUncompletedIndex: number | null = null;
        if (numInteractiveExercises > 0) {
            for (let i = 0; i < numInteractiveExercises; i++) {
                if (!initialCompleted.has(i)) {
                    firstUncompletedIndex = i;
                    break;
                }
            }
        }
        setOpenExerciseIndex(firstUncompletedIndex);
    }, [lesson.id, gameState, numInteractiveExercises]);


    const handleExerciseComplete = useCallback((index: number, state: any) => {
        // Only proceed if it's a new completion
        if (completedExercises.has(index)) return;

        // 1. Record state and update completed set
        recordInteractiveExerciseState(lesson.id, index, state);
        const newCompleted = new Set(completedExercises).add(index);
        setCompletedExercises(newCompleted);

        // Use a timeout to let the UI update (e.g., accordion closes) before scrolling
        setTimeout(() => {
            // 2. Find the index of the first uncompleted exercise
            let nextUncompletedIndex: number | null = null;
            if (lesson.interactiveExercises) {
                for (let i = 0; i < lesson.interactiveExercises.length; i++) {
                    if (!newCompleted.has(i)) {
                        nextUncompletedIndex = i;
                        break;
                    }
                }
            }
            
            // Open the next accordion, or close all if done
            setOpenExerciseIndex(nextUncompletedIndex);

            if (nextUncompletedIndex !== null) {
                // 3. Scroll to the THEORY section of the next exercise
                const nextTheoryElement = document.getElementById(`theory-section-${nextUncompletedIndex}`);
                if (nextTheoryElement) {
                    // Using 'start' is better so the user sees the title of the section
                    nextTheoryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } else {
                // 4. If all are complete, scroll to the practice section
                const practiceSection = document.getElementById('practice-section');
                if (practiceSection) {
                    practiceSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }, 500); // A 500ms delay for UI animations

    }, [completedExercises, lesson.id, lesson.interactiveExercises, recordInteractiveExerciseState]);

    useEffect(() => {
        const handleDebugShortcut = (event: KeyboardEvent) => {
            if (isDebugMode && event.ctrlKey && event.altKey && event.key.toLowerCase() === 's') {
                event.preventDefault();
                // Find the currently open (or first uncompleted) exercise and complete it
                if (openExerciseIndex !== null && !completedExercises.has(openExerciseIndex)) {
                     console.log(`[Maestro Digital Debug] Completando ejercicio interactivo #${openExerciseIndex + 1}...`);
                    handleExerciseComplete(openExerciseIndex, { completedByDebug: true });
                }
            }
        };

        window.addEventListener('keydown', handleDebugShortcut);
        return () => {
            window.removeEventListener('keydown', handleDebugShortcut);
        };
    }, [isDebugMode, openExerciseIndex, completedExercises, handleExerciseComplete]);

    useEffect(() => {
        const theoryEl = theoryRef.current;
        if (!theoryEl) return;

        const handleClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (target.tagName === 'SPAN' && target.classList.contains('pronounceable')) {
                playClickSound();
                const textToSpeak = target.textContent;
                if (textToSpeak) {
                    speak(textToSpeak.trim());
                    target.classList.add('speaking');
                    setTimeout(() => target.classList.remove('speaking'), 500);
                }
            }
        };

        theoryEl.addEventListener('click', handleClick);

        return () => {
            theoryEl.removeEventListener('click', handleClick);
        };
    }, [lesson.theory, speak]);

    const renderTheoryWithExercises = () => {
        if (!lesson.theory) return null;

        const placeholderRegex = /<div data-exercise-index="(\d+)"><\/div>/g;
        const parts = lesson.theory.split(placeholderRegex);
        
        const renderedElements: React.JSX.Element[] = [];
        const savedExerciseState = gameState[lesson.id]?.interactiveExerciseState || {};

        const themeRegex = /bg-([a-z]+)-50/;
        let currentThemeColor = 'slate';

        for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 0) { // Text part
                const part = parts[i];
                
                const match = part.match(themeRegex);
                if (match) {
                    currentThemeColor = match[1];
                }

                // Find the index of the exercise that follows this theory block
                const nextPartIndex = i + 1;
                let theoryForExerciseIndex: number | null = null;
                if (nextPartIndex < parts.length) {
                    const indexStr = parts[nextPartIndex];
                    const parsedIndex = parseInt(indexStr, 10);
                    if (!isNaN(parsedIndex)) {
                        theoryForExerciseIndex = parsedIndex;
                    }
                }

                if (part.trim()) {
                     renderedElements.push(
                        <div 
                            id={theoryForExerciseIndex !== null ? `theory-section-${theoryForExerciseIndex}` : undefined}
                            key={`text-wrapper-${i}`}
                            className="scroll-mt-20" // Margin for sticky header
                        >
                            <div dangerouslySetInnerHTML={{ __html: part }} />
                        </div>
                    );
                }
            } else { // Exercise index part
                const exerciseIndex = parseInt(parts[i], 10);
                const exercise = lesson.interactiveExercises?.[exerciseIndex];
                
                if (exercise) {
                    const isOpen = openExerciseIndex === exerciseIndex;
                    const isCompleted = completedExercises.has(exerciseIndex);
                    const savedState = savedExerciseState[exerciseIndex];
                    
                    const themeClasses: Record<string, Record<string, string>> = {
                        slate: { bg: 'bg-slate-50 dark:bg-slate-700/50', border: 'border-slate-200 dark:border-slate-600', hover: 'hover:bg-slate-100 dark:hover:bg-slate-700', headerBg: 'bg-slate-100/50 dark:bg-slate-800/20', buttonText: 'text-slate-800 dark:text-slate-200', buttonIcon: 'text-blue-500' },
                        blue: { bg: 'bg-blue-50 dark:bg-blue-900/30', border: 'border-blue-200 dark:border-blue-800', hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/40', headerBg: 'bg-blue-100/50 dark:bg-blue-900/20', buttonText: 'text-blue-800 dark:text-blue-200', buttonIcon: 'text-blue-500' },
                        green: { bg: 'bg-green-50 dark:bg-green-900/30', border: 'border-green-200 dark:border-green-800', hover: 'hover:bg-green-100 dark:hover:bg-green-900/40', headerBg: 'bg-green-100/50 dark:bg-green-900/20', buttonText: 'text-green-800 dark:text-green-200', buttonIcon: 'text-green-500' },
                        yellow: { bg: 'bg-yellow-50 dark:bg-yellow-900/30', border: 'border-yellow-200 dark:border-yellow-800', hover: 'hover:bg-yellow-100 dark:hover:bg-yellow-900/40', headerBg: 'bg-yellow-100/50 dark:bg-yellow-900/20', buttonText: 'text-yellow-800 dark:text-yellow-200', buttonIcon: 'text-yellow-500' },
                        orange: { bg: 'bg-orange-50 dark:bg-orange-900/30', border: 'border-orange-200 dark:border-orange-800', hover: 'hover:bg-orange-100 dark:hover:bg-orange-900/40', headerBg: 'bg-orange-100/50 dark:bg-orange-900/20', buttonText: 'text-orange-800 dark:text-orange-200', buttonIcon: 'text-orange-500' },
                        red: { bg: 'bg-red-50 dark:bg-red-900/30', border: 'border-red-200 dark:border-red-800', hover: 'hover:bg-red-100 dark:hover:bg-red-900/40', headerBg: 'bg-red-100/50 dark:bg-red-900/20', buttonText: 'text-red-800 dark:text-red-200', buttonIcon: 'text-red-500' },
                        pink: { bg: 'bg-pink-50 dark:bg-pink-900/30', border: 'border-pink-200 dark:border-pink-800', hover: 'hover:bg-pink-100 dark:hover:bg-pink-900/40', headerBg: 'bg-pink-100/50 dark:bg-pink-900/20', buttonText: 'text-pink-800 dark:text-pink-200', buttonIcon: 'text-pink-500' },
                        purple: { bg: 'bg-purple-50 dark:bg-purple-900/30', border: 'border-purple-200 dark:border-purple-800', hover: 'hover:bg-purple-100 dark:hover:bg-purple-900/40', headerBg: 'bg-purple-100/50 dark:bg-purple-900/20', buttonText: 'text-purple-800 dark:text-purple-200', buttonIcon: 'text-purple-500' },
                        cyan: { bg: 'bg-cyan-50 dark:bg-cyan-900/30', border: 'border-cyan-200 dark:border-cyan-800', hover: 'hover:bg-cyan-100 dark:hover:bg-cyan-900/40', headerBg: 'bg-cyan-100/50 dark:bg-cyan-900/20', buttonText: 'text-cyan-800 dark:text-cyan-200', buttonIcon: 'text-cyan-500' },
                        indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/30', border: 'border-indigo-200 dark:border-indigo-800', hover: 'hover:bg-indigo-100 dark:hover:bg-indigo-900/40', headerBg: 'bg-indigo-100/50 dark:bg-indigo-900/20', buttonText: 'text-indigo-800 dark:text-indigo-200', buttonIcon: 'text-indigo-500' },
                        teal: { bg: 'bg-teal-50 dark:bg-teal-900/30', border: 'border-teal-200 dark:border-teal-800', hover: 'hover:bg-teal-100 dark:hover:bg-teal-900/40', headerBg: 'bg-teal-100/50 dark:bg-teal-900/20', buttonText: 'text-teal-800 dark:text-teal-200', buttonIcon: 'text-teal-500' },
                        emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/30', border: 'border-emerald-200 dark:border-emerald-800', hover: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/40', headerBg: 'bg-emerald-100/50 dark:bg-emerald-900/20', buttonText: 'text-emerald-800 dark:text-emerald-200', buttonIcon: 'text-emerald-500' },
                        rose: { bg: 'bg-rose-50 dark:bg-rose-900/30', border: 'border-rose-200 dark:border-rose-800', hover: 'hover:bg-rose-100 dark:hover:bg-rose-900/40', headerBg: 'bg-rose-100/50 dark:bg-rose-900/20', buttonText: 'text-rose-800 dark:text-rose-200', buttonIcon: 'text-rose-500' },
                        amber: { bg: 'bg-amber-50 dark:bg-amber-900/30', border: 'border-amber-200 dark:border-amber-800', hover: 'hover:bg-amber-100 dark:hover:bg-amber-900/40', headerBg: 'bg-amber-100/50 dark:bg-amber-900/20', buttonText: 'text-amber-800 dark:text-amber-200', buttonIcon: 'text-amber-500' },
                        lime: { bg: 'bg-lime-50 dark:bg-lime-900/30', border: 'border-lime-200 dark:border-lime-800', hover: 'hover:bg-lime-100 dark:hover:bg-lime-900/40', headerBg: 'bg-lime-100/50 dark:bg-lime-900/20', buttonText: 'text-lime-800 dark:text-lime-200', buttonIcon: 'text-lime-500' },
                    };
                    
                    const selectedTheme = themeClasses[currentThemeColor] || themeClasses.slate;
                    
                    renderedElements.push(
                        <div key={`exercise-wrapper-${exerciseIndex}`} className="my-4 not-prose">
                            <div className={`${selectedTheme.bg} rounded-lg border ${selectedTheme.border} overflow-hidden transition-shadow hover:shadow-md`}>
                                <button
                                    onClick={() => {
                                        playClickSound();
                                        setOpenExerciseIndex(isOpen ? null : exerciseIndex);
                                    }}
                                    className={`w-full text-left p-4 flex justify-between items-center ${selectedTheme.headerBg} ${selectedTheme.hover}`}
                                    aria-expanded={isOpen}
                                >
                                    <h4 className={`text-xl font-bold ${selectedTheme.buttonText} flex items-center gap-3`}>
                                        {isCompleted && <span className="text-green-500 text-2xl" role="img" aria-label="Completado">✅</span>}
                                        <span className="text-lg">🎯 {exercise.title}</span>
                                    </h4>
                                    <span className={`transform transition-transform duration-300 text-2xl ${selectedTheme.buttonIcon} ${isOpen ? 'rotate-180' : ''}`}>▾</span>
                                </button>
                                <div className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                                    <div className="overflow-hidden">
                                        <div className={`p-4 border-t ${selectedTheme.border}`}>
                                            {exercise.type === 'match-pairs' && <MatchPairsExercise exercise={exercise} onComplete={(state) => handleExerciseComplete(exerciseIndex, state)} savedState={savedState} themeColor={currentThemeColor} />}
                                            {exercise.type === 'fill-in-the-blanks' && <FillInTheBlanksExercise exercise={exercise} onComplete={(state) => handleExerciseComplete(exerciseIndex, state)} savedState={savedState} themeColor={currentThemeColor} />}
                                            {exercise.type === 'fill-in-the-text' && <FillInTheTextExercise exercise={exercise} onComplete={(state) => handleExerciseComplete(exerciseIndex, state)} savedState={savedState} themeColor={currentThemeColor} />}
                                            {exercise.type === 'number-line' && <NumberLineExercise exercise={exercise} isAiEnabled={isAiEnabled} studentProfile={studentProfile} onComplete={(state) => handleExerciseComplete(exerciseIndex, state)} savedState={savedState} themeColor={currentThemeColor} />}
                                            {exercise.type === 'choose-the-operation' && <ChooseTheOperationExercise exercise={exercise} onComplete={(state) => handleExerciseComplete(exerciseIndex, state)} savedState={savedState} themeColor={currentThemeColor} />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }
            }
        }
        return renderedElements;
    };

    const lessonProgress = gameState[lesson.id];
    const highScores = lessonProgress?.highScores || {};
    const unlockedLevel = lessonProgress?.unlockedLevel || 1;

    const getLevelStatus = (level: number) => {
        const highScore = highScores[level] || 0;
        
        let stars = 0;
        if (highScore === QUIZ_LENGTH) {
            stars = 3;
        } else if (highScore >= 9) {
            stars = 2;
        } else if (highScore >= MIN_SCORE_TO_UNLOCK) {
            stars = 1;
        }

        const isLocked = level > unlockedLevel;
        
        return { highScore, stars, isLocked };
    };

    return (
        <div className="animate-fade-in">
            <h1 className="text-4xl font-black text-slate-800 dark:text-slate-200 text-center mb-6">{lesson.title}</h1>
            
            <div className="space-y-8">
                {/* Theory Section with Integrated Exercises */}
                <div className="bg-white/80 dark:bg-slate-800/50 p-6 rounded-lg shadow-md border dark:border-slate-700">
                    <h2 className="text-3xl font-bold text-slate-700 dark:text-slate-200 mb-4 border-b-2 dark:border-slate-600 pb-2">🧠 ¡Aprende!</h2>
                    <div ref={theoryRef} className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                        {renderTheoryWithExercises()}
                    </div>
                </div>

                {/* Practice Section */}
                <div id="practice-section" className="bg-white/80 dark:bg-slate-800/50 p-6 rounded-lg shadow-md border dark:border-slate-700 flex flex-col relative scroll-mt-20">
                    {!allInteractiveComplete && (
                        <div className="absolute inset-0 bg-slate-700/60 dark:bg-slate-800/80 rounded-lg flex flex-col items-center justify-center text-white z-10 p-4 text-center backdrop-blur-sm">
                            <span className="text-6xl" role="img" aria-label="Bloqueado">🔒</span>
                            <span className="font-bold mt-4 text-lg">Completa los ejercicios interactivos de arriba para desbloquear la práctica.</span>
                        </div>
                    )}
                    <h2 className="text-3xl font-bold text-slate-700 dark:text-slate-200 mb-4 border-b-2 dark:border-slate-600 pb-2">🤸 ¡Practica!</h2>
                    <p className="text-slate-600 dark:text-slate-300 mb-6">Demuestra lo que has aprendido. ¡Desbloquea todos los niveles!</p>
                    <div className="space-y-4">
                       {practiceLevels.map(levelInfo => {
                           if (!lesson.practice[levelInfo.level]) return null;

                           const { highScore, stars, isLocked } = getLevelStatus(levelInfo.level);

                           const isMastered = highScore === QUIZ_LENGTH;
                           const isCompleted = highScore >= MIN_SCORE_TO_UNLOCK;
                           const isCurrent = levelInfo.level === unlockedLevel && !isCompleted;

                            const statusClass = isMastered
                                ? 'bg-yellow-100 dark:bg-yellow-900/40 border-t-2 border-yellow-300 dark:border-yellow-600'
                                : isCompleted
                                ? 'bg-green-100 dark:bg-green-900/40 border-t-2 border-green-300 dark:border-green-600'
                                : isCurrent
                                ? 'bg-blue-100 dark:bg-blue-900/40 border-t-2 border-blue-300 dark:border-blue-600'
                                : 'bg-white dark:bg-slate-700/60';

                           return (
                                <div key={levelInfo.level} className="relative">
                                    <Card
                                        onClick={!isLocked ? () => onStartPractice(lesson.id, levelInfo.level) : undefined}
                                        className={`!p-0 overflow-hidden ${isLocked ? 'filter grayscale' : ''}`}
                                    >
                                        <div className={`w-full p-2 text-center ${levelInfo.bg} ${levelInfo.border} ${levelInfo.darkBg} ${levelInfo.darkBorder} border-b-2`}>
                                            <h4 className={`text-lg font-bold ${levelInfo.color} ${levelInfo.darkColor}`}>Nivel {levelInfo.level}: {levelInfo.name}</h4>
                                            <p className={`text-xs font-semibold ${levelInfo.color} ${levelInfo.darkColor} opacity-80`}>Criterio: {levelInfo.criteria}</p>
                                        </div>
                                        <div className={`p-3 flex items-center justify-between transition-colors ${statusClass}`}>
                                            <div className="text-2xl">
                                                <span className="text-yellow-400 won-reward">{'★'.repeat(stars)}</span>
                                                <span className="text-slate-400 dark:text-slate-500">{'☆'.repeat(3 - stars)}</span>
                                            </div>
                                            <div className="font-semibold text-slate-500 dark:text-slate-400 text-sm">
                                                Mejor: {highScore}/{QUIZ_LENGTH}
                                            </div>
                                        </div>
                                    </Card>
                                    {isLocked && (
                                        <div className="absolute inset-0 bg-slate-800/60 rounded-xl flex items-center justify-center text-white cursor-not-allowed">
                                            <span className="text-4xl" role="img" aria-label="Bloqueado">🔒</span>
                                        </div>
                                    )}
                                </div>
                           );
                       })}
                    </div>
                </div>
            </div>
        </div>
    );
};