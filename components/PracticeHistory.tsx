import React, { useState } from 'react';
import type { GameState, CategoryId, QuestionResult } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { SkillChart } from './common/SkillChart';
import { categoryNames } from '../utils/constants';
import { playClickSound } from '../utils/sounds';

interface PracticeHistoryProps {
    categoryId: CategoryId;
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
    session: GameState[string]['skillHistory'][0];
    onBack: () => void;
}> = ({ session, onBack }) => {
    
    return (
        <div className="animate-fade-in text-left">
            <button onClick={() => { playClickSound(); onBack(); }} className="text-slate-500 dark:text-slate-400 font-bold hover:text-slate-800 dark:hover:text-slate-200 transition-colors mb-4">
                &larr; Volver al Historial
            </button>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2 text-center">Detalles del Intento</h3>
            <p className="text-center text-slate-500 dark:text-slate-400 mb-4">{new Date(session.timestamp).toLocaleString('es-ES')}</p>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
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


export const PracticeHistory: React.FC<PracticeHistoryProps> = ({ categoryId, gameState, onBack, lessonIdToNameMap }) => {
    const categoryData = gameState[categoryId];
    const history = categoryData?.skillHistory || [];
    const reversedHistory = [...history].reverse();
    const [selectedSession, setSelectedSession] = useState<GameState[string]['skillHistory'][0] | null>(null);

    const practiceTypeNames: Record<'lesson' | 'practice' | 'exam', string> = {
        practice: 'Práctica General',
        lesson: 'Práctica de Lección',
        exam: 'Examen'
    };

    if (selectedSession) {
        return <SessionDetail session={selectedSession} onBack={() => setSelectedSession(null)} />;
    }

    return (
        <div className="animate-fade-in text-center">
            <p className="text-slate-600 dark:text-slate-300 mb-6">Aquí puedes ver tu progreso en <strong className="font-bold text-slate-700 dark:text-slate-200">{categoryNames[categoryId]}</strong> a lo largo del tiempo.</p>
            
            <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Gráfico de Habilidad</h3>
                <Card>
                    <SkillChart data={history} />
                </Card>
            </div>

            <div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Intentos de Práctica</h3>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                    {reversedHistory.length > 0 ? (
                        reversedHistory.map((entry, index) => {
                            const hasAdditionalContent = entry.contentVersion && entry.contentVersion > 1;
                            const correctAnswers = entry.results?.filter(r => r.correct).length || 0;
                            const totalQuestions = entry.results?.length || 0;
                            const lessonName = entry.lessonId ? lessonIdToNameMap.get(entry.lessonId) : null;
                            
                            return (
                                <Card 
                                    key={`${entry.timestamp}-${index}`} 
                                    className="!p-3 text-left animate-staggered-fade-in"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-slate-200">Puntuación: <span className="text-blue-600 dark:text-blue-400">{Math.round(entry.score)}</span> | Correctas: <span className="text-green-600 dark:text-green-400">{correctAnswers}/{totalQuestions}</span></p>
                                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                                <p>
                                                    {practiceTypeNames[entry.type] || 'Práctica'} - Nivel: {entry.level}
                                                    {entry.totalTime && <span> - Tiempo: <span className="font-bold">{formatTime(entry.totalTime)}</span></span>}
                                                    {hasAdditionalContent && <span className="text-blue-500 font-bold" title="Este intento incluye contenido adicional desbloqueado."> ✨</span>}
                                                </p>
                                                {lessonName && <p className="font-semibold text-purple-700 dark:text-purple-400">Lección: {lessonName}</p>}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                             <div className="text-sm text-slate-500 dark:text-slate-400">
                                                {new Date(entry.timestamp).toLocaleDateString('es-ES')}
                                                <br/>
                                                {new Date(entry.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            {entry.results && (
                                                <button onClick={() => { playClickSound(); setSelectedSession(entry); }} className="text-xs bg-slate-200 text-slate-600 dark:bg-slate-600 dark:text-slate-200 font-bold py-1 px-2 rounded-md mt-1 hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">
                                                    Ver Detalles
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            );
                        })
                    ) : (
                        <p className="text-slate-500 dark:text-slate-400 py-8">Aún no hay intentos registrados para esta categoría.</p>
                    )}
                </div>
            </div>
            
            <Button onClick={onBack} className="mt-8">Volver al Menú</Button>
        </div>
    );
};