import React, { useState } from 'react';
import type { GameState, CategoryId } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { categoryNames } from '../utils/constants';
import { playClickSound } from '../utils/sounds';

interface GlobalHistoryScreenProps {
    gameState: GameState;
    onBack: () => void;
    lessonIdToNameMap: Map<string, string>;
}

const formatTime = (seconds: number | undefined): string => {
    if (seconds === undefined || isNaN(seconds) || seconds < 0) return '';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
};

const SessionDetail: React.FC<{
    session: GameState[string]['skillHistory'][0] & { categoryId: string };
    onBack: () => void;
}> = ({ session, onBack }) => {
    
    return (
        <div className="animate-fade-in text-left">
            <button onClick={() => { playClickSound(); onBack(); }} className="text-slate-500 dark:text-slate-400 font-bold hover:text-slate-800 dark:hover:text-slate-200 transition-colors mb-4">
                &larr; Volver al Historial
            </button>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2 text-center">Detalles del Intento</h3>
            <p className="text-center text-slate-500 dark:text-slate-400 mb-4">{new Date(session.timestamp).toLocaleString('es-ES')}</p>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                {session.results?.map((result, index) => (
                    <div key={index} className="bg-slate-100 dark:bg-slate-700/60 p-3 rounded-lg text-sm">
                        <div className="flex justify-between items-start">
                            <p className="font-semibold text-slate-800 dark:text-slate-200 flex-grow pr-4">
                                {index + 1}. {result.question}
                            </p>
                            <div className={`font-bold text-base text-right flex-shrink-0 w-24 ${result.correct ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {result.correct ? '✓ Correcto' : '✗ Incorrecto'}
                                <span className="block text-xs font-normal text-slate-500 dark:text-slate-400">{result.time.toFixed(1)}s</span>
                                {result.hintsUsed && result.hintsUsed > 0 && (
                                    <span className="block text-xs font-normal text-yellow-600 dark:text-yellow-400" title={`${result.hintsUsed} pista(s) usada(s)`}>💡 {result.hintsUsed}</span>
                                )}
                            </div>
                        </div>
                         {!result.correct && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 border-t border-slate-200 dark:border-slate-600 pt-1">
                                Tu respuesta: <span className="font-bold">{result.userAnswer || '""'}</span>
                                {` (Correcta: "${result.correctAnswer}")`}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export const GlobalHistoryScreen: React.FC<GlobalHistoryScreenProps> = ({ gameState, onBack, lessonIdToNameMap }) => {
    let allHistory: (GameState[string]['skillHistory'][0] & { categoryId: string })[] = [];
    Object.keys(gameState).forEach(key => {
        const history = gameState[key]?.skillHistory || [];
        allHistory.push(...history.map(h => ({ ...h, categoryId: key })));
    });
    
    // Sort logic (newest first)
    allHistory.sort((a, b) => b.timestamp - a.timestamp);

    const [selectedSession, setSelectedSession] = useState<GameState[string]['skillHistory'][0] & { categoryId: string } | null>(null);

    const practiceTypeNames: Record<'lesson' | 'practice' | 'exam', string> = {
        practice: 'Práctica Libre',
        lesson: 'Práctica de Lección',
        exam: 'Examen'
    };

    if (selectedSession) {
        return <SessionDetail session={selectedSession} onBack={() => setSelectedSession(null)} />;
    }

    return (
        <div className="animate-fade-in text-center flex flex-col h-full max-h-full">
            <h2 className="text-3xl font-black text-slate-800 dark:text-slate-200 mb-2">Historial Completo</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">Aquí puedes ver todos los ejercicios realizados.</p>
            
            <div className="flex-grow overflow-y-auto pr-2 space-y-3">
                {allHistory.length > 0 ? (
                    allHistory.map((entry, index) => {
                        const correctAnswers = entry.results?.filter(r => r.correct).length || 0;
                        const totalQuestions = entry.results?.length || 0;
                        const lessonName = entry.lessonId ? lessonIdToNameMap.get(entry.lessonId) : null;
                        
                        return (
                            <Card 
                                key={`${entry.timestamp}-${index}`} 
                                className="!p-3 text-left animate-staggered-fade-in"
                            >
                                <div className="flex justify-between items-center flex-wrap gap-2">
                                    <div className="min-w-0 flex-1">
                                        <p className="font-bold text-slate-800 dark:text-slate-200 text-lg flex items-center gap-2">
                                            {categoryNames[entry.categoryId as CategoryId] || entry.categoryId}
                                        </p>
                                        <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                            <p className="mb-1">
                                                <span className="font-semibold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full text-xs mr-2">
                                                    {practiceTypeNames[entry.type] || 'Práctica'}
                                                </span>
                                                <span className="mr-2">Nivel {entry.level}</span>
                                                {entry.totalTime !== undefined && <span>⏱️ <span className="font-medium">{formatTime(entry.totalTime)}</span></span>}
                                            </p>
                                            <p className="font-medium">
                                                Puntuación: <span className="text-blue-600 dark:text-blue-400">{Math.round(entry.score)}</span> | 
                                                Aciertos: <span className="text-green-600 dark:text-green-400 ml-1">{correctAnswers}/{totalQuestions}</span>
                                            </p>
                                            {lessonName && <p className="font-semibold text-purple-700 dark:text-purple-400 mt-1">📘 {lessonName}</p>}
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-2">
                                         <div className="text-xs text-slate-500 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                            {new Date(entry.timestamp).toLocaleDateString('es-ES')} <br className="hidden sm:block" /> {new Date(entry.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        {entry.results && (
                                            <Button onClick={() => { playClickSound(); setSelectedSession(entry); }} variant="secondary" className="!py-1 !text-xs">
                                                Ver Detalles
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        );
                    })
                ) : (
                    <p className="text-slate-500 dark:text-slate-400 py-8 text-center h-full flex items-center justify-center">Aún no hay intentos registrados.</p>
                )}
            </div>
            
            <div className="mt-4 flex-shrink-0">
                <Button onClick={onBack} variant="primary" className="w-full sm:w-auto">Volver</Button>
            </div>
        </div>
    );
};
