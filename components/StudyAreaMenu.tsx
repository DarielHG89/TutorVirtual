import React, { useMemo } from 'react';
import { Card } from './common/Card';
import type { PeriodPlan, GameState, Submodule, StudentProfile } from '../types';
import { playClickSound } from '../utils/sounds';
import { contentManager } from '../utils/contentManager';
import { categoryNames } from '../utils/constants';

interface StudyAreaMenuProps {
    onSelectSubmodule: (submoduleId: string) => void;
    gameState: GameState;
    openPeriods: Record<number, boolean>;
    onTogglePeriod: (periodNumber: number) => void;
    subjectId?: string;
    studentProfile?: StudentProfile | null;
}

const MIN_SCORE_TO_UNLOCK = 8;
const PERFECT_SCORE = 10;

export const StudyAreaMenu: React.FC<StudyAreaMenuProps> = ({ onSelectSubmodule, gameState, openPeriods, onTogglePeriod, subjectId, studentProfile }) => {
    
    const [viewMode, setViewMode] = React.useState<'map' | 'list'>('map');

    const { processedStudyPlan, currentSubmoduleId, subjectName, gradeName } = useMemo(() => {
        const taxonomy = contentManager.getTaxonomy();
        
        let activeSubject = subjectId;
        if (!activeSubject) {
            const userGrade = studentProfile?.gradeId || taxonomy.grades[0]?.id;
            activeSubject = taxonomy.subjects.find(s => s.gradeId === userGrade)?.id || taxonomy.subjects[0]?.id;
        }

        const subjectCategories = taxonomy.categories.filter(c => c.subjectId === activeSubject);
        const subjectCategoryIds = new Set(subjectCategories.map(c => c.id));
        
        const subjObj = taxonomy.subjects.find(s => s.id === activeSubject);
        const subjectNameStr = subjObj?.name || 'Asignatura';
        const gradeNameStr = taxonomy.grades.find(g => g.id === subjObj?.gradeId)?.name || 'Grado';

        const allLessons = contentManager.getLessons().filter(l => subjectCategoryIds.has(l.categoryId) || l.categoryId.startsWith(activeSubject || ''));
        
        const periodsMap = new Map<number, { period: number; title: string; modules: Map<string, any> }>();
        
        allLessons.forEach(lesson => {
            const p = lesson.period || 1;
            if (!periodsMap.has(p)) {
                periodsMap.set(p, { period: p, title: `Unidad ${p}`, modules: new Map() });
            }
            const periodData = periodsMap.get(p)!;
            
            if (!periodData.modules.has(lesson.categoryId)) {
                periodData.modules.set(lesson.categoryId, {
                    id: lesson.categoryId,
                    title: categoryNames[lesson.categoryId] || lesson.categoryId,
                    icon: '📚', // Default icon, could use categoryIcons if we exported them
                    submodules: []
                });
            }
            periodData.modules.get(lesson.categoryId)!.submodules.push(lesson);
        });

        const studyPlan: PeriodPlan[] = Array.from(periodsMap.values()).sort((a,b) => a.period - b.period).map(p => ({
            period: p.period,
            title: p.title,
            modules: Array.from(p.modules.values())
        }));

        const allSubmodulesFlat: Submodule[] = studyPlan.flatMap(p => p.modules.flatMap(m => m.submodules));
        let previousSubmoduleId: string | null = null;
        const processedSubmodules = new Map<string, Submodule>();
        let currentSubmoduleId: string | null = null;

        for (const submodule of allSubmodulesFlat) {
            const progress = gameState[submodule.id];
            const highScores = progress?.highScores || {};
            
            const levelProgress = [
                (highScores[1] || 0) >= MIN_SCORE_TO_UNLOCK,
                (highScores[2] || 0) >= MIN_SCORE_TO_UNLOCK,
                (highScores[3] || 0) >= MIN_SCORE_TO_UNLOCK,
            ];

            const isMastered = (highScores[1] || 0) === PERFECT_SCORE && 
                             (highScores[2] || 0) === PERFECT_SCORE && 
                             (highScores[3] || 0) === PERFECT_SCORE;

            const isCompleted = levelProgress[0]; // Completed if level 1 is passed

            let isLocked = true;
            if (!previousSubmoduleId) {
                isLocked = false; // First lesson is always available.
            } else {
                const prevSubmoduleProgress = gameState[previousSubmoduleId];
                const prevSubmoduleHighScore = prevSubmoduleProgress?.highScores?.[1] || 0;
                
                // Parental override check
                const isManuallyUnlocked = progress && progress.unlockedLevel > 1;

                if (prevSubmoduleHighScore >= MIN_SCORE_TO_UNLOCK || isManuallyUnlocked) {
                    isLocked = false;
                }
            }
            
            if (!isLocked && !isCompleted && !currentSubmoduleId) {
                currentSubmoduleId = submodule.id;
            }
            
            processedSubmodules.set(submodule.id, { ...submodule, isLocked, isCompleted, isMastered, levelProgress });
            previousSubmoduleId = submodule.id;
        }

        const finalPlan = studyPlan.map(period => {
            const allSubmodulesInPeriod = period.modules.flatMap(m => m.submodules);
            const isPeriodCompleted = allSubmodulesInPeriod.length > 0 && allSubmodulesInPeriod.every(sm => processedSubmodules.get(sm.id)?.isCompleted);
            const isPeriodMastered = allSubmodulesInPeriod.length > 0 && allSubmodulesInPeriod.every(sm => processedSubmodules.get(sm.id)?.isMastered);

            return {
                ...period,
                isCompleted: isPeriodCompleted,
                isMastered: isPeriodMastered,
                modules: period.modules.map(module => ({
                    ...module,
                    submodules: module.submodules.map(submodule => processedSubmodules.get(submodule.id)!)
                }))
            };
        });

        return { processedStudyPlan: finalPlan, currentSubmoduleId, subjectName: subjectNameStr, gradeName: gradeNameStr };
    }, [gameState, subjectId]);

    const currentPeriodNumber = useMemo(() => {
        const firstUncompleted = processedStudyPlan.find(p => !p.isCompleted);
        return firstUncompleted ? firstUncompleted.period : -1;
    }, [processedStudyPlan]);

    return (
        <div className="animate-fade-in max-w-4xl mx-auto px-4 pb-16">
            <h1 className="text-4xl font-black text-slate-800 dark:text-slate-200 text-center mb-2">Área de Estudio: {subjectName} ({gradeName})</h1>
            <p className="text-slate-600 dark:text-slate-300 mb-6 text-center">Sigue el programa oficial. ¡Supera cada lección para desbloquear la siguiente!</p>
            
            <div className="flex justify-center mb-8">
                <div className="bg-slate-200 dark:bg-slate-700 p-1 rounded-full flex gap-1 shadow-inner">
                    <button onClick={() => setViewMode('map')} className={`px-6 py-2 rounded-full font-bold text-sm transition-colors flex items-center gap-2 ${viewMode === 'map' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}><span>🗺️</span> Mapa</button>
                    <button onClick={() => setViewMode('list')} className={`px-6 py-2 rounded-full font-bold text-sm transition-colors flex items-center gap-2 ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}><span>📋</span> Lista</button>
                </div>
            </div>

            {processedStudyPlan.length === 0 && (
                 <p className="text-slate-500 dark:text-slate-400 mb-8 border-2 border-dashed border-slate-300 dark:border-slate-700 p-8 rounded-xl font-bold text-center">No hay lecciones configuradas para esta asignatura todavía.</p>
            )}

            {viewMode === 'map' ? (
                <div className="relative py-8 px-4 sm:px-0">
                    <div className="absolute left-1/2 top-4 bottom-4 w-3 bg-gradient-to-b from-blue-200 via-purple-200 to-indigo-200 dark:from-blue-900/50 dark:via-purple-900/50 dark:to-indigo-900/50 transform -translate-x-1/2 rounded-full z-0 pointer-events-none hidden sm:block"></div>
                    
                    {processedStudyPlan.flatMap(p => p.modules.flatMap(m => m.submodules)).map((submodule, index) => {
                        const isLeftSide = index % 2 === 0;
                        const isCurrent = submodule.id === currentSubmoduleId;
                        
                        const cardStyles = submodule.isLocked
                            ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-400 grayscale opacity-80 cursor-not-allowed border-slate-200 dark:border-slate-700'
                            : submodule.isMastered
                            ? 'bg-yellow-50 border-yellow-400 dark:bg-yellow-900/40 shadow-lg scale-105'
                            : submodule.isCompleted
                            ? 'bg-green-50 border-green-400 dark:bg-green-900/40 shadow-md transform hover:scale-105'
                            : isCurrent
                            ? 'bg-blue-50 border-blue-400 dark:bg-blue-900/50 shadow-xl transform scale-110 ring-4 ring-blue-300 dark:ring-blue-600'
                            : 'bg-white dark:bg-slate-700 hover:bg-slate-50 shadow-md border-slate-200 dark:border-slate-600 transform hover:scale-105';

                        const pinColor = isCurrent ? 'bg-blue-500 border-white' : submodule.isCompleted ? 'bg-green-500 border-white' : submodule.isLocked ? 'bg-slate-300 border-slate-100 dark:bg-slate-700 dark:border-slate-600' : 'bg-slate-100 border-slate-400';

                        return (
                            <div key={submodule.id} className={`relative z-10 flex flex-col sm:flex-row items-center justify-center mb-10 w-full`}>
                                <div className={`w-full sm:w-1/2 flex ${isLeftSide ? 'sm:justify-end sm:pr-12' : 'sm:justify-start sm:pl-12 sm:order-2'} justify-center relative`}>
                                    <button
                                        onClick={() => { if (!submodule.isLocked) { playClickSound(); onSelectSubmodule(submodule.id); } }}
                                        disabled={submodule.isLocked}
                                        className={`p-5 rounded-2xl border-2 transition-all duration-300 w-full max-w-sm ${cardStyles}`}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="font-bold text-lg text-left text-slate-800 dark:text-slate-100 leading-tight pr-4">{submodule.title}</span>
                                            {submodule.isLocked && <span className="text-2xl mt-1">🔒</span>}
                                        </div>
                                        <div className="flex justify-between items-end mt-4">
                                            <div className="text-xl">
                                                {submodule.levelProgress?.map((completed: boolean, i: number) => (
                                                    <span key={i} className={completed ? 'text-yellow-400 won-reward' : 'text-slate-300 dark:text-slate-600'}>
                                                        {completed ? '★' : '☆'}
                                                    </span>
                                                ))}
                                            </div>
                                            {submodule.isMastered ? <span className="text-4xl won-reward drop-shadow-sm">🏆</span> : <span className="text-3xl opacity-40 grayscale">🏆</span>}
                                        </div>
                                    </button>
                                </div>
                                <div className={`hidden sm:flex absolute left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-full border-4 items-center justify-center shadow-md z-20 ${pinColor} transition-colors duration-500`}>
                                    <span className={`text-xl font-bold ${submodule.isLocked ? 'text-slate-400 dark:text-slate-500' : 'text-white'}`}>{index + 1}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                processedStudyPlan.map((period: any) => {
                const isCurrent = period.period === currentPeriodNumber;
                
                let periodColorClass = 'bg-white/60 border-slate-200/80 dark:bg-slate-700/30 dark:border-slate-600/50';
                let headerBorderColorClass = 'border-blue-300 dark:border-blue-500';

                if (period.isMastered) {
                    periodColorClass = 'bg-yellow-100 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700'; // Dorado
                    headerBorderColorClass = 'border-yellow-400 dark:border-yellow-600';
                } else if (period.isCompleted) {
                    periodColorClass = 'bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700'; // Verde claro
                    headerBorderColorClass = 'border-green-400 dark:border-green-600';
                } else if (isCurrent) {
                    periodColorClass = 'bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700'; // Azul claro
                    headerBorderColorClass = 'border-blue-400 dark:border-blue-600';
                }

                return (
                    <div key={period.period} className={`mb-4 p-4 sm:p-6 rounded-2xl shadow-md border transition-colors duration-300 ${periodColorClass}`}>
                        <h2 className={`text-2xl font-bold text-slate-700 dark:text-slate-200 ${openPeriods[period.period] ? `border-b-2 ${headerBorderColorClass} pb-2 mb-4` : ''}`}>
                            <button onClick={() => { playClickSound(); onTogglePeriod(period.period); }} className="w-full flex justify-between items-center text-left hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                                <div className="flex items-center gap-4">
                                    <span className={`text-4xl ${period.isCompleted ? 'text-yellow-400 won-reward' : 'unwon-reward'}`} title={period.isCompleted ? "¡Todas las lecciones de este período han sido superadas!" : "Completa todas las lecciones para ganar la estrella"}>★</span>
                                    {period.isMastered ? (
                                        <span className="text-4xl won-reward" role="img" aria-label="Período masterizado">🏆</span>
                                    ) : (
                                        <span className="text-4xl unwon-reward" role="img" aria-label="Trofeo por conseguir" title="Consigue la puntuación perfecta en todos los niveles para ganar el trofeo">🏆</span>
                                    )}
                                    <span>{period.title}</span>
                                </div>
                                <span className={`transform transition-transform duration-300 text-blue-500 ${openPeriods[period.period] ? 'rotate-180' : ''}`}>
                                    ▾
                                </span>
                            </button>
                        </h2>
                        <div className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${openPeriods[period.period] ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                            <div className={`overflow-hidden transition-opacity duration-300 ${openPeriods[period.period] ? 'opacity-100 delay-150' : 'opacity-0'}`}>
                                <div className="space-y-4 pt-4">
                                    {period.modules.map((module: any) => (
                                        <div key={module.id} className="bg-white/60 dark:bg-slate-800/40 p-4 rounded-lg shadow-md border dark:border-slate-700">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="text-3xl">{module.icon}</span>
                                                <h3 className={`font-black text-lg text-slate-800 dark:text-slate-200`}>{module.title}</h3>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                {module.submodules.map((submodule: any) => {
                                                    const isCurrentSubmodule = submodule.id === currentSubmoduleId;
                                                    
                                                    const cardStyles = submodule.isLocked
                                                        ? 'backdrop-blur-sm bg-slate-200/60 text-slate-400 dark:bg-slate-800/50 dark:text-slate-500 cursor-not-allowed filter grayscale'
                                                        : submodule.isMastered
                                                        ? 'backdrop-blur-sm bg-yellow-100/70 border-yellow-400 dark:bg-yellow-900/50 dark:border-yellow-600 border hover:!bg-yellow-200/80 dark:hover:!bg-yellow-800/60 hover:shadow-lg'
                                                        : submodule.isCompleted
                                                        ? 'backdrop-blur-sm bg-green-100/70 border-green-400 dark:bg-green-900/50 dark:border-green-600 border hover:!bg-green-200/80 dark:hover:!bg-green-800/60 hover:shadow-lg'
                                                        : isCurrentSubmodule
                                                        ? 'backdrop-blur-sm bg-blue-100/70 border-blue-400 dark:bg-blue-900/50 dark:border-blue-600 border hover:!bg-blue-200/80 dark:hover:!bg-blue-800/60 hover:shadow-lg'
                                                        : 'backdrop-blur-sm bg-white/60 dark:bg-slate-700/50 hover:bg-blue-50/70 dark:hover:bg-slate-600/60 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-500 border dark:border-slate-600 shadow-sm';
                                                    
                                                    return (
                                                    <button
                                                        key={submodule.id}
                                                        onClick={() => { if (!submodule.isLocked) { playClickSound(); onSelectSubmodule(submodule.id); } }}
                                                        disabled={submodule.isLocked}
                                                        className={`p-3 rounded-lg text-left transition-all duration-200 flex flex-col justify-between h-28 ${cardStyles}`}
                                                    >
                                                        <div className="flex justify-between items-start w-full">
                                                            <span className="font-semibold pr-2">{submodule.title}</span>
                                                            {submodule.isLocked && (
                                                                <span className="text-xl" role="img" aria-label="Bloqueado">🔒</span>
                                                            )}
                                                            {submodule.isCompleted && !submodule.isLocked && (
                                                                <span className="text-xs font-bold bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-full whitespace-nowrap hidden sm:inline-block">
                                                                    🔄 Repasar
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex justify-between items-end w-full mt-auto">
                                                            <div className="text-lg">
                                                                {submodule.levelProgress?.map((completed: boolean, i: number) => (
                                                                    <span key={i} className={completed ? 'text-yellow-400 won-reward' : 'text-slate-400 dark:text-slate-500'}>
                                                                        {completed ? '★' : '☆'}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                            {submodule.isMastered ? (
                                                                <span className="text-4xl text-yellow-500 won-reward" role="img" aria-label="Masterizado">🏆</span>
                                                            ) : (
                                                                <span className="text-4xl unwon-reward" role="img" aria-label="Trofeo por conseguir" title="¡Consigue la puntuación perfecta en todos los niveles para ganar el trofeo!">🏆</span>
                                                            )}
                                                        </div>
                                                    </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })
            )}
        </div>
    );
};