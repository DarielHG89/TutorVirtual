import React, { useRef, useEffect } from 'react';
import type { LessonContent, GameState, StudentProfile } from '../types';
import { Card } from './common/Card';
import { useSpeech } from '../context/SpeechContext';
import { MatchPairsExercise } from './interactive/MatchPairsExercise';
import { FillInTheBlanksExercise } from './interactive/FillInTheBlanksExercise';
import { FillInTheTextExercise } from './interactive/FillInTheTextExercise';
import { playClickSound } from '../utils/sounds';
import { NumberLineExercise } from './interactive/NumberLineExercise';

interface LessonScreenProps {
    lesson: LessonContent;
    onStartPractice: (lessonId: string, level: number) => void;
    gameState: GameState;
    isAiEnabled: boolean;
    studentProfile: StudentProfile;
}

const practiceLevels = [
    { level: 1, name: 'Básico', color: 'text-teal-800', bg: 'bg-teal-100', border: 'border-teal-500', darkColor: 'dark:text-teal-200', darkBg: 'dark:bg-teal-900/50', darkBorder: 'dark:border-teal-600', criteria: 'Automático al iniciar' },
    { level: 2, name: 'Intermedio', color: 'text-orange-800', bg: 'bg-orange-100', border: 'border-orange-500', darkColor: 'dark:text-orange-200', darkBg: 'dark:bg-orange-900/50', darkBorder: 'dark:border-orange-600', criteria: '≥80% en Nivel 1' },
    { level: 3, name: 'Avanzado', color: 'text-red-800', bg: 'bg-red-100', border: 'border-red-500', darkColor: 'dark:text-red-200', darkBg: 'dark:bg-red-900/50', darkBorder: 'dark:border-red-600', criteria: '≥80% en Nivel 2' },
];


const QUIZ_LENGTH = 10;
const MIN_SCORE_TO_UNLOCK = 8;

export const LessonScreen: React.FC<LessonScreenProps> = ({ lesson, onStartPractice, gameState, isAiEnabled, studentProfile }) => {
    
    const { speak } = useSpeech();
    const theoryRef = useRef<HTMLDivElement>(null);

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
                    // Add a visual feedback class
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
                {/* Theory Section */}
                <div className="bg-white/80 dark:bg-slate-800/50 p-6 rounded-lg shadow-md border dark:border-slate-700">
                    <h2 className="text-3xl font-bold text-slate-700 dark:text-slate-200 mb-4 border-b-2 dark:border-slate-600 pb-2">🧠 ¡Aprende!</h2>
                    <div ref={theoryRef} className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: lesson.theory }} />
                </div>

                {/* Interactive Exercises Section */}
                {lesson.interactiveExercises && lesson.interactiveExercises.length > 0 && (
                     <div className="space-y-6">
                        {lesson.interactiveExercises.map((exercise, index) => (
                            <div key={`exercise-${index}`} className="bg-white/80 dark:bg-slate-800/50 p-6 rounded-lg shadow-md border dark:border-slate-700">
                                <h2 className="text-3xl font-bold text-slate-700 dark:text-slate-200 mb-4 border-b-2 dark:border-slate-600 pb-2 text-center">{exercise.title}</h2>
                                {exercise.type === 'match-pairs' && <MatchPairsExercise exercise={exercise} />}
                                {exercise.type === 'fill-in-the-blanks' && <FillInTheBlanksExercise exercise={exercise} />}
                                {exercise.type === 'fill-in-the-text' && <FillInTheTextExercise exercise={exercise} />}
                                {exercise.type === 'number-line' && <NumberLineExercise exercise={exercise} isAiEnabled={isAiEnabled} studentProfile={studentProfile} />}
                            </div>
                        ))}
                    </div>
                )}


                {/* Practice Section */}
                <div className="bg-white/80 dark:bg-slate-800/50 p-6 rounded-lg shadow-md border dark:border-slate-700 flex flex-col">
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