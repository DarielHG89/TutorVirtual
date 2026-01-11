import React, { useMemo } from 'react';
import type { GameState, CategoryId, ConnectionStatus, StudentProfile } from '../types';
import { questions } from '../data/questions';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { categoryNames } from '../utils/constants';
import { lessons } from '../data/lessons';
import { playClickSound } from '../utils/sounds';

interface MainMenuProps {
    studentProfile: StudentProfile | null;
    gameState: GameState;
    onSelectCategory: (categoryId: CategoryId) => void;
    onStartWeeklyExam: () => void;
    onStartRefreshExam: () => void;
    onStartQuickChallenge: () => void;
    onStartLiveConversation: () => void;
    onStartFreePractice: () => void;
    onStartStudyArea: () => void;
    onGoToParentDashboard: () => void;
    onViewHistory: (categoryId: CategoryId) => void;
    connectionStatus: ConnectionStatus;
    isAiEnabled: boolean;
    unlockedPracticeCategories: Set<CategoryId>;
    newContentNotifications: Partial<Record<CategoryId, boolean>>;
    areExamsEnabled: boolean;
    aiSuggestion: { text: string; isLoading: boolean; error: string | null };
    onGenerateSuggestion: () => void;
    onGoToDashboard: () => void;
}

const categoryIcons: Record<CategoryId, string> = {
    numeros: '🔢',
    suma_resta: '➕',
    multi_divi: '✖️',
    problemas: '🧠',
    geometria: '📐',
    medidas: '📏',
    reloj: '⏰'
};

export const MainMenu: React.FC<MainMenuProps> = ({ studentProfile, gameState, onSelectCategory, onStartWeeklyExam, onStartRefreshExam, onStartQuickChallenge, onStartLiveConversation, onStartFreePractice, onStartStudyArea, onGoToParentDashboard, onViewHistory, connectionStatus, isAiEnabled, unlockedPracticeCategories, newContentNotifications, areExamsEnabled, aiSuggestion, onGenerateSuggestion, onGoToDashboard }) => {
    
    const studentName = studentProfile?.name || 'Estudiante';

    const { masteryLevels, recommendation, overallProgress } = useMemo(() => {
        const MIN_SCORE_TO_PASS = 8;
        
        // Practice Categories Mastery
        const levels = (Object.keys(questions) as CategoryId[]).map(categoryId => {
            const categoryData = gameState[categoryId];
            const totalLevels = Object.keys(questions[categoryId]).length;
            
            let completedLevelsCount = 0;
            const highScores = categoryData?.highScores || {};
            if (categoryData?.highScores) {
                 Object.values(categoryData.highScores).forEach((score: number) => {
                    if (score >= MIN_SCORE_TO_PASS) {
                        completedLevelsCount++;
                    }
                });
            }
            
            const isMastered = totalLevels > 0 && Object.keys(questions[categoryId]).every(levelStr => {
                const level = parseInt(levelStr);
                return (highScores[level] || 0) === 10;
            });

            const mastery = totalLevels > 0 ? Math.round((completedLevelsCount / totalLevels) * 100) : 0;
            return { id: categoryId, mastery, stars: completedLevelsCount, isMastered };
        });

        // Overall Progress (based on lessons)
        const totalLessons = lessons.length;
        const completedLessons = lessons.filter(lesson => {
            const progress = gameState[lesson.id];
            return (progress?.highScores?.[1] || 0) >= MIN_SCORE_TO_PASS;
        }).length;
        const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

        // Recommendation Logic
        const sortedLevels = [...levels].sort((a, b) => a.mastery - b.mastery);
        const nextChallenge = sortedLevels.find(cat => unlockedPracticeCategories.has(cat.id) && !cat.isMastered);
        
        const rec = nextChallenge
            ? `¡Hola, ${studentName}! Tu próximo desafío podría ser el área de ${categoryNames[nextChallenge.id]}.`
            : `¡Hola, ${studentName}! Parece que tu siguiente paso es el Área de Estudio para desbloquear más prácticas.`;

        return { masteryLevels: levels, recommendation: rec, overallProgress: progressPercent };
    }, [gameState, studentName, unlockedPracticeCategories]);

    const recommendationContent = useMemo(() => {
        if (aiSuggestion.isLoading) {
            return "El Maestro está pensando en un consejo para ti... 🤔";
        }
        if (aiSuggestion.error) {
            return `¡Oh, no! ${aiSuggestion.error} Intenta de nuevo.`;
        }
        if (aiSuggestion.text) {
            return aiSuggestion.text;
        }
        return recommendation;
    }, [aiSuggestion, recommendation]);

    return (
        <div className="animate-fade-in text-center">
            <h1 className="font-title text-5xl sm:text-7xl text-slate-800 text-gradient">Maestro Digital</h1>
            <p className="text-lg mb-4 mt-4 text-slate-600 dark:text-slate-300">Este es tu panel de progreso, {studentName}. ¡Elige un modo para empezar!</p>
            
             <div className="my-4">
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">Progreso General del Área de Estudio</h3>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 mt-1">
                    {overallProgress > 0 && (
                        <div 
                            className="bg-green-500 h-4 rounded-full text-right text-white text-xs font-black pr-2 flex items-center justify-end animate-progress-bar" 
                            style={{ width: `${overallProgress}%` }}
                            title={`${overallProgress}% de las lecciones completadas`}
                        >
                           {overallProgress > 10 && `${overallProgress}%`}
                        </div>
                    )}
                </div>
            </div>

            <div className={`bg-blue-100 dark:bg-blue-900/40 border-2 ${aiSuggestion.error ? 'border-red-400 dark:border-red-500' : 'border-blue-400 dark:border-blue-500'} text-blue-700 dark:text-blue-300 font-bold px-4 py-3 rounded-lg relative mb-6 transition-colors`}>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="flex-grow">{recommendationContent}</span>
                    <Button 
                        onClick={onGenerateSuggestion} 
                        variant="special" 
                        className="!py-1.5 !px-3 text-sm flex-shrink-0"
                        disabled={connectionStatus !== 'online' || !isAiEnabled || aiSuggestion.isLoading}
                        title={(!isAiEnabled || connectionStatus !== 'online') ? 'Activa la IA para usar esta función' : 'Pide un consejo personalizado'}
                    >
                        {aiSuggestion.isLoading ? "Pensando..." : "Pedir Consejo al Maestro 🤖"}
                    </Button>
                </div>
            </div>

            <div className="my-6">
                 <Button variant="warning" onClick={onStartStudyArea} className="w-full sm:w-auto text-2xl py-4 px-8 transform hover:scale-105">
                    📘 Área de Estudio (3er Grado)
                </Button>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
                    Sigue el plan de estudio oficial para aprender y desbloquear nuevo contenido paso a paso.
                </p>
            </div>
            
            <div className="my-6">
                 <Button variant="special" onClick={onStartLiveConversation} className="w-full sm:w-auto text-2xl py-4 px-8 transform hover:scale-105" disabled={connectionStatus !== 'online' || !isAiEnabled}>
                   Charla con el Maestro 🤖
                </Button>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
                    Conversa con el tutor de IA, practica tu pronunciación y pídele que dibuje para ti.
                    {(connectionStatus !== 'online' || !isAiEnabled) && <span className="block font-semibold mt-1">La charla en vivo requiere que la IA esté conectada y activada.</span>}
                </p>
            </div>

            <h2 className="text-3xl font-black text-slate-800 dark:text-slate-200 mb-4">Modos de Práctica</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {masteryLevels.map(({ id, mastery, stars, isMastered }, index) => {
                    const isPracticeUnlocked = unlockedPracticeCategories.has(id);
                    const hasNewContent = newContentNotifications[id];
                    return (
                        <Card 
                            key={id} 
                            onClick={isPracticeUnlocked ? () => onSelectCategory(id) : undefined} 
                            className={`relative flex flex-col justify-between h-full animate-staggered-fade-in ${!isPracticeUnlocked ? 'opacity-60' : ''} ${isMastered ? 'bg-yellow-100/80 dark:bg-yellow-900/40 !border-yellow-400 hover:!bg-yellow-200/90 dark:hover:!bg-yellow-800/50' : ''}`}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {hasNewContent && (
                                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full animate-pulse shadow-lg z-10" title="¡Nuevas preguntas desbloqueadas!">
                                    ¡Nuevo!
                                </div>
                            )}
                            <div>
                                <h3 className="font-black text-slate-800 dark:text-slate-200 text-lg capitalize flex items-center justify-center gap-2">
                                    <span className="text-2xl">{categoryIcons[id]}</span>
                                    <span>{categoryNames[id]}</span>
                                </h3>
                                <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">{mastery}%</div>
                                <div className="flex justify-between items-end mt-2">
                                    <p className="text-2xl">
                                        <span className="text-yellow-400 won-reward">{'★'.repeat(stars)}</span>
                                        <span className="text-slate-400 dark:text-slate-500">{'☆'.repeat(Math.max(0, 3 - stars))}</span>
                                    </p>
                                    {isMastered ? (
                                        <span className="text-4xl text-yellow-500 won-reward" role="img" aria-label="Trofeo de maestría" title="¡Dominado! Puntuación perfecta en todos los niveles.">🏆</span>
                                    ) : mastery > 0 ? (
                                        <span className="text-4xl" role="img" aria-label="En progreso" title="¡Sigue así para conseguir el trofeo!">🎯</span>
                                    ) : (
                                        <span className="text-4xl unwon-reward" role="img" aria-label="Completado" title="¡Completa un nivel para empezar!">✅</span>
                                    )}
                                </div>
                            </div>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    playClickSound();
                                    onViewHistory(id);
                                }}
                                disabled={!gameState[id].skillHistory || gameState[id].skillHistory.length === 0 || !isPracticeUnlocked}
                                className="text-xs bg-slate-200 text-slate-600 dark:bg-slate-600 dark:text-slate-200 font-bold py-1 px-2 rounded-md mt-2 hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Ver Progreso 📈
                            </button>
                            {!isPracticeUnlocked && (
                                <div className="absolute inset-0 bg-slate-700/50 dark:bg-slate-800/70 rounded-xl flex flex-col items-center justify-center text-white cursor-not-allowed p-2 text-center">
                                    <span className="text-4xl" role="img" aria-label="Bloqueado">🔒</span>
                                    <span className="font-bold mt-2 text-sm">Completa una lección de "{categoryNames[id]}" para desbloquear</span>
                                </div>
                            )}
                        </Card>
                    );
                })}
            </div>
            
            <hr className="my-6 border-slate-300 dark:border-slate-600" />

            <h2 className="text-3xl font-black text-slate-800 dark:text-slate-200 mb-4">Otros Modos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-center items-start gap-6">
                <div style={{ animationDelay: '0ms' }} className="animate-staggered-fade-in flex flex-col h-full">
                    <Button className="w-full" variant="secondary" onClick={onStartWeeklyExam} disabled={!areExamsEnabled}>🏆 Examen Semanal</Button>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 flex-grow">Un examen completo de 10 preguntas sobre todo lo que has aprendido.</p>
                </div>
                <div style={{ animationDelay: '50ms' }} className="animate-staggered-fade-in flex flex-col h-full">
                    <Button className="w-full" variant="primary" onClick={onStartRefreshExam} disabled={!areExamsEnabled}>💡 Refrescar Memoria</Button>
                     <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 flex-grow">Un test corto de 5 preguntas para repasar conceptos clave.</p>
                </div>
                <div style={{ animationDelay: '100ms' }} className="animate-staggered-fade-in flex flex-col h-full">
                    <Button className="w-full" variant="primary" onClick={onStartFreePractice}>🤸 Práctica Libre</Button>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 flex-grow">Elige cualquier tema y nivel para practicar sin presión y a tu ritmo.</p>
                </div>
                 <div style={{ animationDelay: '150ms' }} className="animate-staggered-fade-in flex flex-col h-full">
                    <Button className="w-full" variant="primary" onClick={onGoToDashboard}>📊 Mi Panel de Progreso</Button>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 flex-grow">Ve tus estadísticas, progreso y actividades recientes.</p>
                </div>
            </div>
            {!areExamsEnabled && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Los modos de examen se activarán cuando hayas practicado más contenido.</p>
            )}

            <div className="mt-8 border-t border-slate-300 dark:border-slate-600 pt-4 text-center">
                <button onClick={() => { playClickSound(); onGoToParentDashboard(); }} className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors">
                    🔑 Modo Padre / Tutor
                </button>
            </div>
        </div>
    );
};