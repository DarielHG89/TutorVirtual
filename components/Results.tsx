

import React, { useEffect, useRef, useMemo } from 'react';
import { Button } from './common/Button';
import { useSpeech } from '../context/SpeechContext';
import type { QuestionResult, CategoryId, QuizConfig } from '../types';
import { questions } from '../data/questions';
import { lessons } from '../data/lessons';

interface ResultsProps {
    results: QuestionResult[];
    onBack: () => void;
    practiceSuggestion?: { categoryId: CategoryId, categoryName: string } | null;
    onGoToPractice?: (categoryId: CategoryId) => void;
    onGoToMainMenu?: () => void;
    onGoToStudyArea?: () => void;
    quizConfig: QuizConfig | null;
    onStartNextLevel: () => void;
}

const MIN_SCORE_TO_PASS = 0.8;

interface ConfettiProps {
    onComplete?: () => void;
}

const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return '0s';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
};

export const Confetti: React.FC<ConfettiProps> = ({ onComplete }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let W = window.innerWidth;
        let H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;
        
        let animationFrameId: number;
        let p: any[] = [];
        const count = 200;
        const colors = ['#f1c40f','#e67e22','#e74c3c','#9b59b6','#3498db','#1abc9c','#2ecc71'];
        
        for (let i=0; i<count; i++) {
            p.push({ x:Math.random()*W, y:Math.random()*H-H, s:Math.random()*5+3, d:Math.random()*5+2, a:Math.random()*360, c:colors[Math.floor(Math.random()*colors.length)], t:Math.random()*10-5 });
        }
        
        const draw = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            p.forEach((c, i) => {
                c.y += c.d; c.x += Math.sin(c.a*Math.PI/180); c.a += c.t;
                ctx.fillStyle=c.c; ctx.fillRect(c.x, c.y, c.s, c.s*2);
                if (c.y > canvas.height) p.splice(i,1);
            });
            if (p.length > 0) {
                animationFrameId = requestAnimationFrame(draw);
            } else {
                onComplete?.();
            }
        };

        draw();

        const handleResize = () => {
            W = window.innerWidth;
            H = window.innerHeight;
            if(canvas) {
              canvas.width = W;
              canvas.height = H;
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [onComplete]);

    return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 100 }} />;
};


export const Results: React.FC<ResultsProps> = ({ results, onBack, practiceSuggestion, onGoToPractice, onGoToMainMenu, onGoToStudyArea, quizConfig, onStartNextLevel }) => {
    const score = results.filter(r => r.correct).length;
    const total = results.length;
    const totalTime = results.reduce((sum, r) => sum + r.time, 0);
    const isPerfectScore = score === total && total > 0;
    const passed = total > 0 && score / total >= MIN_SCORE_TO_PASS;
    const { speak } = useSpeech();

    const title = isPerfectScore ? "¡Puntuación Perfecta!" : "¡Aventura Completada!";

    useEffect(() => {
        let resultText = `${title}. Tu resultado final es ${score} de ${total}.`;
        if (practiceSuggestion) {
            resultText += ` ¡Felicidades, has completado todos los niveles de esta lección!`;
        }
        speak(resultText);
    }, [score, total, title, speak, practiceSuggestion]);

    const showNextLevelButton = useMemo(() => {
        if (!passed || !quizConfig || practiceSuggestion) {
            return false;
        }

        const currentLevel = quizConfig.level;
        if (currentLevel === undefined || currentLevel >= 3) {
            return false;
        }

        const nextLevel = currentLevel + 1;
        if (quizConfig.type === 'practice' && quizConfig.categoryId) {
            return !!questions[quizConfig.categoryId]?.[nextLevel];
        }

        if (quizConfig.type === 'lesson' && quizConfig.lessonId) {
            const lesson = lessons.find(l => l.id === quizConfig.lessonId);
            return !!lesson?.practice?.[nextLevel];
        }

        return false;
    }, [passed, quizConfig, practiceSuggestion]);

    const backButtonText = useMemo(() => {
        if (!quizConfig) return 'Volver';
        if (quizConfig.origin === 'lesson') return 'Volver a la Lección';
        if (quizConfig.origin === 'level-selection') return 'Volver a Niveles';
        return 'Volver al Menú';
    }, [quizConfig]);
    
    return (
        <div className="animate-fade-in text-center flex flex-col h-full">
            {isPerfectScore && <Confetti />}
            <div className="flex-shrink-0">
                <h2 className="text-5xl font-black text-slate-800 dark:text-slate-200 mb-4">{title}</h2>
                <p className="text-xl mb-2 text-slate-600 dark:text-slate-300">Tu resultado final es:</p>
                <div className={`text-7xl font-black my-4 ${passed ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                    {score} / {total}
                </div>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">
                    Tiempo Total: <span className="font-bold">{formatTime(totalTime)}</span>
                </p>
            </div>
            
            <div className="mt-4 flex-grow overflow-y-auto pr-2 border-t-2 border-slate-200 dark:border-slate-700 pt-4 min-h-0">
                {practiceSuggestion && onGoToPractice && onGoToMainMenu && onGoToStudyArea && (
                    <div className="mb-6 p-4 rounded-lg bg-blue-100 dark:bg-blue-900/40 border-2 border-blue-300 dark:border-blue-600 animate-fade-in text-center">
                        <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200">¡Lección Dominada! 🥳</h3>
                        <p className="text-slate-700 dark:text-slate-300 mt-2">¡Felicidades! Has completado esta lección. ¿Qué quieres hacer ahora?</p>
                        <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
                            <Button onClick={() => onGoToPractice(practiceSuggestion.categoryId)} variant="special" className="w-full sm:w-auto">
                                Practicar '{practiceSuggestion.categoryName}'
                            </Button>
                            <Button onClick={onGoToStudyArea} variant="primary" className="w-full sm:w-auto">
                                Otras Lecciones
                            </Button>
                            <Button onClick={onGoToMainMenu} variant="secondary" className="w-full sm:w-auto">
                                Menú Principal
                            </Button>
                        </div>
                    </div>
                )}

                <div className="text-left">
                    <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-4 text-center">Resumen Detallado</h3>
                    {results.map((result, index) => (
                        <div key={index} className="bg-slate-100 dark:bg-slate-700/60 p-3 rounded-lg mb-2 flex justify-between items-center text-sm">
                            <div className="flex-grow pr-4">
                                <p className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-sm" title={result.question}>
                                {index + 1}. {result.question}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Tu respuesta: <span className="font-bold">{result.userAnswer || '""'}</span>
                                    {!result.correct && ` (Correcta: "${result.correctAnswer}")`}
                                </p>
                            </div>
                            <div className={`font-bold text-base text-right flex-shrink-0 w-24 ${result.correct ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {result.correct ? '✓ Correcto' : '✗ Incorrecto'}
                                <span className="block text-xs font-normal text-slate-500 dark:text-slate-400">{result.time.toFixed(1)}s</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="mt-6 flex-shrink-0">
                { !practiceSuggestion ? (
                    <div className="flex justify-center gap-4">
                        <Button onClick={onBack} variant="secondary">
                            {backButtonText}
                        </Button>
                        {showNextLevelButton && (
                            <Button onClick={onStartNextLevel} variant="primary">
                                Siguiente Nivel &rarr;
                            </Button>
                        )}
                    </div>
                ) : null }
            </div>
        </div>
    );
};