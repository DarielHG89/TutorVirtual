import React, { useMemo, useState, useEffect } from 'react';
import type { GameState, StudentProfile, CategoryId, QuestionResult } from '../types';
import { Card } from './common/Card';
import { contentManager } from '../utils/contentManager';
import { categoryNames } from '../utils/constants';
import { SkillChart } from './common/SkillChart';
import { playClickSound } from '../utils/sounds';

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
    subjectId?: string;
    onViewGlobalHistory: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ studentProfile, gameState, subjectId, onViewGlobalHistory }) => {

    const taxonomy = contentManager.getTaxonomy();

    const initialGrade = useMemo(() => {
        if (studentProfile?.gradeId) return studentProfile.gradeId;
        if (subjectId) {
            const subject = taxonomy.subjects.find(s => s.id === subjectId);
            if (subject) return subject.gradeId;
        }
        return taxonomy.grades[0]?.id || '';
    }, [subjectId, studentProfile?.gradeId, taxonomy.subjects, taxonomy.grades]);

    const [selectedGrade, setSelectedGrade] = useState<string>(initialGrade);
    const [selectedSubject, setSelectedSubject] = useState<string>(subjectId || '');

    useEffect(() => {
        if (taxonomy.grades.length > 0 && !taxonomy.grades.find(g => g.id === selectedGrade)) {
            setSelectedGrade(studentProfile?.gradeId || taxonomy.grades[0].id);
        }
    }, [taxonomy.grades, selectedGrade, studentProfile?.gradeId]);

    useEffect(() => {
        const subjectsForGrade = taxonomy.subjects.filter(s => s.gradeId === selectedGrade);
        if (subjectsForGrade.length > 0 && !subjectsForGrade.find(s => s.id === selectedSubject)) {
            setSelectedSubject(subjectsForGrade[0].id);
        }
    }, [selectedGrade, taxonomy.subjects, selectedSubject]);

    const { 
        overallProgress, 
        masteryLevels, 
        totalSessions, 
        totalTime, 
        totalQuestionsAnswered,
        recentActivity,
        mostPracticed,
        strengthsAndWeaknesses,
        subjectName,
        gradeName
    } = useMemo(() => {
        const activeSubject = selectedSubject;
        
        const subjectCategories = taxonomy.categories.filter(c => c.subjectId === activeSubject);
        const subjectCategoryIds = new Set(subjectCategories.map(c => c.id));
        
        const subjObj = taxonomy.subjects.find(s => s.id === activeSubject);
        const subjectNameStr = subjObj?.name || '';
        const gradeNameStr = taxonomy.grades.find(g => g.id === subjObj?.gradeId)?.name || '';

        const lessonsForSubject = contentManager.getLessons().filter(l => subjectCategoryIds.has(l.categoryId) || l.categoryId.startsWith(activeSubject || ''));
        const categoryIdsForSubject = subjectCategories.map(c => c.id as CategoryId);

        // Overall Progress (based on lessons for this subject)
        const totalLessons = lessonsForSubject.length;
        const completedLessons = lessonsForSubject.filter(lesson => (gameState[lesson.id]?.highScores?.[1] || 0) >= MIN_SCORE_TO_PASS).length;
        const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

        let allHistory: (GameState[string]['skillHistory'][0] & { categoryId: string })[] = [];
        let totalTime = 0;
        let totalQuestionsAnswered = 0;

        // Mastery & History calculation (filtered by categoryIdsForSubject)
        const relevantCategoryIds = categoryIdsForSubject.length > 0 ? categoryIdsForSubject : (Object.keys(contentManager.getQuestions()) as CategoryId[]);

        const levels = relevantCategoryIds.map(categoryId => {
            const categoryData = gameState[categoryId];
            const history = categoryData?.skillHistory || [];
            allHistory.push(...history.map(h => ({...h, categoryId})));
            totalTime += history.reduce((sum, s) => sum + s.totalTime, 0);
            
            const totalCorrectInCategory = history.reduce((sum, session) => sum + (session.results?.filter(r => r.correct).length || 0), 0);
            const totalAttemptedInCategory = history.reduce((sum, session) => sum + (session.results?.length || 0), 0);
            totalQuestionsAnswered += totalAttemptedInCategory;
            
            const accuracy = totalAttemptedInCategory > 0 ? Math.round((totalCorrectInCategory / totalAttemptedInCategory) * 100) : 0;
            const averageScore = history.length > 0 ? history.reduce((sum, s) => sum + s.score, 0) / history.length : 0;

            const questionsForCat = contentManager.getQuestions()[categoryId] || {};
            let totalAvailableLevels = Object.keys(questionsForCat).length;
            let completedLevelsCount = 0;
            
            // Practice levels mastery
            if (categoryData?.highScores) {
                 Object.values(categoryData.highScores).forEach((score: number) => {
                    if (score >= MIN_SCORE_TO_PASS) completedLevelsCount++;
                });
            }

            // Lesson levels mastery
            const lessonsInCat = contentManager.getLessons().filter(l => l.categoryId === categoryId);
            lessonsInCat.forEach(lesson => {
                const lessonData = gameState[lesson.id];
                totalAvailableLevels += Object.keys(lesson.practice).length;
                if (lessonData?.highScores) {
                    Object.values(lessonData.highScores).forEach((score: number) => {
                        if (score >= MIN_SCORE_TO_PASS) completedLevelsCount++;
                    });
                }
            });

            const mastery = totalAvailableLevels > 0 ? Math.round((completedLevelsCount / totalAvailableLevels) * 100) : 0;
            
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
            masteryLevels: levels.filter(l => l.practiceCount > 0 || categoryIdsForSubject.includes(l.id)),
            totalSessions: allHistory.length,
            totalTime,
            totalQuestionsAnswered,
            recentActivity,
            mostPracticed,
            strengthsAndWeaknesses,
            subjectName: subjectNameStr,
            gradeName: gradeNameStr
        };

    }, [gameState, selectedSubject, taxonomy]);

    return (
        <div className="animate-fade-in space-y-6">
            <Card className="flex flex-col sm:flex-row items-center gap-6 !p-6 bg-slate-50 dark:bg-slate-700/50">
                <AvatarDisplay profile={studentProfile} />
                <div className="text-center sm:text-left flex-grow">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">{studentProfile.name}</h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400">Progreso por Asignatura</p>
                </div>
                
                <div className="flex flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                    <div className="flex items-center justify-between sm:justify-end gap-2">
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Grado:</span>
                        <select
                            value={selectedGrade}
                            onChange={(e) => {
                                playClickSound();
                                setSelectedGrade(e.target.value);
                            }}
                            className="p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold"
                        >
                            {taxonomy.grades.map(g => (
                                <option key={g.id} value={g.id}>{g.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2">
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Asignatura:</span>
                        <select
                            value={selectedSubject}
                            onChange={(e) => {
                                playClickSound();
                                setSelectedSubject(e.target.value);
                            }}
                            className="p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold"
                        >
                            {taxonomy.subjects.filter(s => s.gradeId === selectedGrade).map(subject => (
                                <option key={subject.id} value={subject.id}>{subject.name}</option>
                            ))}
                            {taxonomy.subjects.filter(s => s.gradeId === selectedGrade).length === 0 && (
                                <option value="">Sin asignaturas</option>
                            )}
                        </select>
                    </div>
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
                    <div className="space-y-3 mb-4">
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
                    {totalSessions > 0 && (
                        <div className="flex justify-center border-t border-slate-200 dark:border-slate-700 pt-4">
                            <button onClick={() => { playClickSound(); onViewGlobalHistory(); }} className="text-blue-600 dark:text-blue-400 font-bold hover:underline transition-colors text-sm">
                                Ver Todo el Historial &rarr;
                            </button>
                        </div>
                    )}
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