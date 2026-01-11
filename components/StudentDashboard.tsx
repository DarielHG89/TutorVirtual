import React, { useMemo } from 'react';
import type { GameState, StudentProfile, CategoryId, QuestionResult } from '../types';
import { Card } from './common/Card';
import { questions } from '../data/questions';
import { lessons } from '../data/lessons';
import { categoryNames } from '../utils/constants';
import { SkillChart } from './common/SkillChart';

const categoryIcons: Record<CategoryId, string> = {
    numeros: '🔢',
    suma_resta: '➕',
    multi_divi: '✖️',
    problemas: '🧠',
    geometria: '📐',
    medidas: '📏',
    reloj: '⏰'
};

const MIN_SCORE_TO_PASS = 8;

const AvatarDisplay: React.FC<{ profile: StudentProfile }> = ({ profile }) => {
    const avatarContent = profile.avatar || (profile.gender === 'boy' ? '👦' : '👧');

    if (avatarContent.startsWith('data:image')) {
        return <img src={avatarContent} alt={profile.name} className="w-24 h-24 rounded-full object-cover" />;
    }

    return <span className="text-7xl">{avatarContent}</span>;
};

const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    let result = '';
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m`;
    if (hours === 0 && minutes === 0) return '< 1m';
    return result.trim();
};

interface StudentDashboardProps {
    studentProfile: StudentProfile;
    gameState: GameState;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ studentProfile, gameState }) => {

    const { 
        overallProgress, 
        masteryLevels, 
        totalSessions, 
        totalTime, 
        totalQuestionsAnswered,
        recentActivity,
        mostPracticed,
        strengthsAndWeaknesses
    } = useMemo(() => {
        // Overall Progress (based on lessons)
        const totalLessons = lessons.length;
        const completedLessons = lessons.filter(lesson => (gameState[lesson.id]?.highScores?.[1] || 0) >= MIN_SCORE_TO_PASS).length;
        const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

        let allHistory: (GameState[string]['skillHistory'][0] & { categoryId: string })[] = [];
        let totalTime = 0;
        let totalQuestionsAnswered = 0;

        // Mastery & History calculation
        const levels = (Object.keys(questions) as CategoryId[]).map(categoryId => {
            const categoryData = gameState[categoryId];
            const history = categoryData?.skillHistory || [];
            allHistory.push(...history.map(h => ({...h, categoryId})));
            totalTime += history.reduce((sum, s) => sum + s.totalTime, 0);
            
            const totalCorrectInCategory = history.reduce((sum, session) => sum + (session.results?.filter(r => r.correct).length || 0), 0);
            const totalAttemptedInCategory = history.reduce((sum, session) => sum + (session.results?.length || 0), 0);
            totalQuestionsAnswered += totalAttemptedInCategory;
            
            const accuracy = totalAttemptedInCategory > 0 ? Math.round((totalCorrectInCategory / totalAttemptedInCategory) * 100) : 0;
            const averageScore = history.length > 0 ? history.reduce((sum, s) => sum + s.score, 0) / history.length : 0;

            const totalLevels = Object.keys(questions[categoryId]).length;
            let completedLevelsCount = 0;
            if (categoryData?.highScores) {
                 Object.values(categoryData.highScores).forEach((score: number) => {
                    if (score >= MIN_SCORE_TO_PASS) completedLevelsCount++;
                });
            }
            const mastery = totalLevels > 0 ? Math.round((completedLevelsCount / totalLevels) * 100) : 0;
            
            return { 
                id: categoryId, 
                mastery, 
                practiceCount: history.length, 
                totalCorrect: totalCorrectInCategory, 
                totalAttempted: totalAttemptedInCategory, 
                accuracy,
                averageScore
            };
        });

        const recentActivity = allHistory.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);

        const mostPracticed = [...levels].sort((a,b) => b.practiceCount - a.practiceCount).slice(0, 3);
        
        const practicedCategories = levels.filter(l => l.practiceCount > 0);
        practicedCategories.sort((a, b) => b.averageScore - a.averageScore);

        const strengthsAndWeaknesses = {
            strength: practicedCategories[0] || null,
            weakness: practicedCategories.length > 1 ? practicedCategories[practicedCategories.length - 1] : null
        };

        return { 
            overallProgress: { percent: progressPercent, completed: completedLessons, total: totalLessons },
            masteryLevels: levels,
            totalSessions: allHistory.length,
            totalTime,
            totalQuestionsAnswered,
            recentActivity,
            mostPracticed,
            strengthsAndWeaknesses
        };

    }, [gameState]);

    return (
        <div className="animate-fade-in space-y-6">
            <Card className="flex flex-col sm:flex-row items-center gap-6 !p-6 bg-slate-50 dark:bg-slate-700/50">
                <AvatarDisplay profile={studentProfile} />
                <div className="text-center sm:text-left">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">{studentProfile.name}</h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400">Resumen de tu aventura de aprendizaje</p>
                </div>
            </Card>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
                <Card>
                    <h3 className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-300">Progreso Total</h3>
                    <p className="text-4xl sm:text-5xl font-black text-blue-500 my-2">{overallProgress.percent}%</p>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{overallProgress.completed} de {overallProgress.total} lecciones</p>
                </Card>
                 <Card>
                    <h3 className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-300">Sesiones</h3>
                    <p className="text-4xl sm:text-5xl font-black text-purple-500 my-2">{totalSessions}</p>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Prácticas realizadas</p>
                </Card>
                 <Card>
                    <h3 className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-300">Tiempo Total</h3>
                    <p className="text-4xl sm:text-5xl font-black text-green-500 my-2">{formatTime(totalTime)}</p>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Dedicado a aprender</p>
                </Card>
                 <Card>
                    <h3 className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-300">Preguntas</h3>
                    <p className="text-4xl sm:text-5xl font-black text-orange-500 my-2">{totalQuestionsAnswered}</p>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Respondidas en total</p>
                </Card>
            </div>

            <Card>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 text-center">Dominio por Categoría</h2>
                <div className="space-y-4">
                    {masteryLevels.map(({ id, mastery, totalCorrect, totalAttempted, accuracy }) => (
                        <div key={id}>
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-slate-700 dark:text-slate-300">{categoryNames[id]} {categoryIcons[id]}</span>
                                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{mastery}% Dominio</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 mb-1">
                                <div className="bg-blue-500 h-4 rounded-full transition-all duration-500" style={{ width: `${mastery}%` }}></div>
                            </div>
                            {totalAttempted > 0 && (
                                 <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
                                    <span>{totalCorrect} / {totalAttempted} Preguntas Correctas</span>
                                    <span className="font-semibold">Precisión Promedio: {accuracy}%</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </Card>

            {strengthsAndWeaknesses.strength && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-green-50 dark:bg-green-900/30">
                        <h2 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-3 text-center">Tu Fortaleza 💪</h2>
                        <div className="text-center">
                            <p className="text-6xl">{categoryIcons[strengthsAndWeaknesses.strength.id]}</p>
                            <p className="text-xl font-bold mt-2">{categoryNames[strengthsAndWeaknesses.strength.id]}</p>
                            <p className="text-lg font-semibold text-green-600 dark:text-green-400">Precisión: {strengthsAndWeaknesses.strength.accuracy}%</p>
                        </div>
                    </Card>
                    {strengthsAndWeaknesses.weakness ? (
                        <Card className="bg-yellow-50 dark:bg-yellow-900/30">
                            <h2 className="text-2xl font-bold text-yellow-800 dark:text-yellow-400 mb-3 text-center">Área de Enfoque 🤔</h2>
                             <div className="text-center">
                                <p className="text-6xl">{categoryIcons[strengthsAndWeaknesses.weakness.id]}</p>
                                <p className="text-xl font-bold mt-2">{categoryNames[strengthsAndWeaknesses.weakness.id]}</p>
                                <p className="text-lg font-semibold text-yellow-600 dark:text-yellow-500">Precisión: {strengthsAndWeaknesses.weakness.accuracy}%</p>
                            </div>
                        </Card>
                    ) : (
                         <Card className="bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">¡Sigue así! 🚀</p>
                                <p className="text-slate-600 dark:text-slate-400 mt-2">Practica otra categoría para encontrar tu próxima área de enfoque.</p>
                            </div>
                        </Card>
                    )}
                </div>
            )}


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 text-center">Actividad Reciente</h2>
                    <div className="space-y-3">
                        {recentActivity.length > 0 ? recentActivity.map((entry) => {
                             const correctAnswers = entry.results?.filter(r => r.correct).length || 0;
                             const totalQuestions = entry.results?.length || 0;
                             return(
                                <div key={entry.timestamp} className="bg-slate-100 dark:bg-slate-700/60 p-2 rounded-lg text-sm flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-slate-700 dark:text-slate-300">{categoryNames[entry.categoryId as CategoryId]}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Nivel {entry.level} - <span className="font-semibold">{correctAnswers}/{totalQuestions} correctas</span></p>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{new Date(entry.timestamp).toLocaleDateString('es-ES')}</p>
                                </div>
                             )
                        }) : <p className="text-slate-500 dark:text-slate-400 text-center py-4">¡Empieza a practicar para ver tu actividad!</p>}
                    </div>
                </Card>
                <Card>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 text-center">Evolución de Habilidad</h2>
                    {mostPracticed.length > 0 && gameState[mostPracticed[0].id]?.skillHistory.length > 1 ? (
                        <>
                           <p className="text-center text-sm text-slate-500 dark:text-slate-400 -mt-3 mb-3">Tu categoría más practicada: <strong className="text-slate-600 dark:text-slate-300">{categoryNames[mostPracticed[0].id as CategoryId]}</strong></p>
                           <SkillChart data={gameState[mostPracticed[0].id].skillHistory} />
                        </>
                    ) : <p className="text-slate-500 dark:text-slate-400 text-center py-4">Practica más para ver tu evolución.</p>}
                </Card>
            </div>
        </div>
    );
};