import React, { useMemo, useState } from 'react';
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

// Configuration of thematic worlds based on standard classroom periods (Unidades 1, 2, 3)
const WORLD_THEMES: Record<number, {
    name: string;
    levelRange: string;
    sub: string;
    icon: string;
    bgColor: string;
    borderColor: string;
    headerBg: string;
    pathLine: string;
    cardActiveBg: string;
    cardCompletedBg: string;
    bossName: string;
    classAccent: string;
}> = {
    1: {
        name: "Reino del Descubrimiento",
        levelRange: "Fácil • Iniciación 🧭",
        sub: "Domina los fundamentos de la matemática y suma tus primeras estrellas.",
        icon: "🌳💚",
        bgColor: "bg-emerald-50/40 dark:bg-emerald-950/10",
        borderColor: "border-emerald-300 dark:border-emerald-800/60 shadow-[0_12px_40px_rgba(16,185,129,0.08)]",
        headerBg: "bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500",
        pathLine: "bg-gradient-to-b from-emerald-400 to-teal-500",
        cardActiveBg: "bg-emerald-50/90 border-emerald-400 dark:bg-emerald-950/50 dark:border-emerald-700 ring-4 ring-emerald-300 dark:ring-emerald-800/80 shadow-[0_8px_30px_rgba(16,185,129,0.2)]",
        cardCompletedBg: "bg-green-50/40 border-green-300 dark:bg-green-950/25 dark:border-green-800/60",
        bossName: "Duende de las Cifras 👺",
        classAccent: "text-emerald-600 dark:text-emerald-400"
    },
    2: {
        name: "Valle de las Operaciones",
        levelRange: "Intermedio • Desafío ⚡",
        sub: "Corta las distancias con cálculo mental veloz, multiplicaciones y lógica dinámica.",
        icon: "🏔️💙",
        bgColor: "bg-blue-50/40 dark:bg-indigo-950/10",
        borderColor: "border-blue-300 dark:border-indigo-800/60 shadow-[0_12px_40px_rgba(59,130,246,0.08)]",
        headerBg: "bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500",
        pathLine: "bg-gradient-to-b from-blue-400 to-indigo-500",
        cardActiveBg: "bg-blue-50/90 border-blue-400 dark:bg-indigo-950/50 dark:border-indigo-700 ring-4 ring-blue-300 dark:ring-indigo-800/80 shadow-[0_8px_30px_rgba(59,130,246,0.2)]",
        cardCompletedBg: "bg-blue-50/40 border-blue-300 dark:bg-indigo-950/25 dark:border-indigo-800/60",
        bossName: "Troll del Multiplicador 👹",
        classAccent: "text-blue-600 dark:text-blue-400"
    },
    3: {
        name: "Cumbre de la Sabiduría",
        levelRange: "Avanzado • Maestría 👑",
        sub: "Desbloquea el nivel definitivo y conviértete en un legendario maestro de tercer grado.",
        icon: "🌌💛",
        bgColor: "bg-amber-50/40 dark:bg-amber-950/10",
        borderColor: "border-amber-300 dark:border-amber-700/60 shadow-[0_12px_40px_rgba(245,158,11,0.08)]",
        headerBg: "bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500",
        pathLine: "bg-gradient-to-b from-amber-400 to-orange-500",
        cardActiveBg: "bg-amber-50/90 border-amber-400 dark:bg-amber-950/50 dark:border-amber-700 ring-4 ring-amber-300 dark:ring-amber-800/80 shadow-[0_8px_30px_rgba(245,158,11,0.2)]",
        cardCompletedBg: "bg-amber-50/40 border-amber-300 dark:bg-amber-950/25 dark:border-amber-800/60",
        bossName: "Sabio Dragón Escolar 🐲✨",
        classAccent: "text-amber-600 dark:text-amber-400"
    }
};

const getMundoTheme = (pNum: number) => {
    return WORLD_THEMES[pNum] || {
        name: `Mundo ${pNum}: Área de Práctica`,
        levelRange: "Especial • Extra ⭐",
        sub: "Sigue entrenando y expandiendo tus horizontes lógicos.",
        icon: "🚀💜",
        bgColor: "bg-purple-50/40 dark:bg-purple-950/10",
        borderColor: "border-purple-300 dark:border-purple-800/60 shadow-[0_12px_40px_rgba(147,51,234,0.08)]",
        headerBg: "bg-gradient-to-r from-purple-500 to-pink-500",
        pathLine: "bg-gradient-to-b from-purple-400 to-pink-500",
        cardActiveBg: "bg-purple-50/90 border-purple-400 dark:bg-purple-950/50 dark:border-purple-700 ring-4 ring-purple-300 dark:ring-purple-800/80 shadow-[0_8px_30px_rgba(147,51,234,0.2)]",
        cardCompletedBg: "bg-purple-50/40 border-purple-300 dark:bg-purple-950/25 dark:border-purple-800/60",
        bossName: "Guardián de la Galaxia 👾",
        classAccent: "text-purple-600 dark:text-purple-400"
    };
};

export const StudyAreaMenu: React.FC<StudyAreaMenuProps> = ({ onSelectSubmodule, gameState, openPeriods, onTogglePeriod, subjectId, studentProfile }) => {
    
    const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

    // Build standard educational taxonomy hierarchy mapping
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
                    icon: '📚',
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

            const isCompleted = levelProgress[0];

            let isLocked = true;
            if (!previousSubmoduleId) {
                isLocked = false;
            } else {
                const prevSubmoduleProgress = gameState[previousSubmoduleId];
                const prevSubmoduleHighScore = prevSubmoduleProgress?.highScores?.[1] || 0;
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
    }, [gameState, subjectId, studentProfile]);

    const currentPeriodNumber = useMemo(() => {
        const firstUncompleted = processedStudyPlan.find(p => !p.isCompleted);
        return firstUncompleted ? firstUncompleted.period : -1;
    }, [processedStudyPlan]);

    const [localOpenPeriods, setLocalOpenPeriods] = useState<Record<number, boolean>>(() => {
        const initial: Record<number, boolean> = {};
        processedStudyPlan.forEach(p => {
            if (openPeriods && openPeriods[p.period] !== undefined) {
                initial[p.period] = openPeriods[p.period];
            } else {
                initial[p.period] = p.period === currentPeriodNumber;
            }
        });
        
        const hasOpen = Object.values(initial).some(v => v);
        if (!hasOpen && processedStudyPlan.length > 0) {
            const firstUncompleted = processedStudyPlan.find(p => !p.isCompleted);
            if (firstUncompleted) {
                initial[firstUncompleted.period] = true;
            } else {
                initial[processedStudyPlan[0].period] = true;
            }
        }
        return initial;
    });

    const handleLocalTogglePeriod = (periodNumber: number) => {
        setLocalOpenPeriods(prev => ({
            ...prev,
            [periodNumber]: !prev[periodNumber]
        }));
        if (onTogglePeriod) {
            onTogglePeriod(periodNumber);
        }
    };

    React.useEffect(() => {
        if (openPeriods) {
            setLocalOpenPeriods(prev => {
                const updated = { ...prev };
                Object.keys(openPeriods).forEach(k => {
                    const numKey = Number(k);
                    updated[numKey] = openPeriods[numKey];
                });
                return updated;
            });
        }
    }, [openPeriods]);

    // Gather global indices and progress tracking for the gamer HUD widget onMap
    const allSubmodules = useMemo(() => {
        return processedStudyPlan.flatMap(p => p.modules.flatMap(m => m.submodules));
    }, [processedStudyPlan]);

    const { totalStars, maxStars, totalCoins, completedLessonsCount } = useMemo(() => {
        let stars = 0;
        let max = 0;
        let coins = 0;
        let completed = 0;

        allSubmodules.forEach(sm => {
            max += 3;
            const progress = gameState[sm.id];
            if (progress) {
                const highScores = progress.highScores || {};
                const sc1 = highScores[1] || 0;
                const sc2 = highScores[2] || 0;
                const sc3 = highScores[3] || 0;
                
                stars += (sc1 >= MIN_SCORE_TO_UNLOCK ? 1 : 0);
                stars += (sc2 >= MIN_SCORE_TO_UNLOCK ? 1 : 0);
                stars += (sc3 >= MIN_SCORE_TO_UNLOCK ? 1 : 0);
                
                coins += (sc1 + sc2 + sc3) * 15;
                
                if (sc1 >= MIN_SCORE_TO_UNLOCK) {
                    completed += 1;
                }
            }
        });

        return { totalStars: stars, maxStars: max, totalCoins: coins, completedLessonsCount: completed };
    }, [allSubmodules, gameState]);

    const overallPercent = useMemo(() => {
        if (allSubmodules.length === 0) return 0;
        return Math.round((completedLessonsCount / allSubmodules.length) * 100);
    }, [completedLessonsCount, allSubmodules]);

    const activeCurrentSubmoduleId = useMemo(() => {
        if (currentSubmoduleId) return currentSubmoduleId;
        if (allSubmodules.length > 0) {
            return allSubmodules[allSubmodules.length - 1].id;
        }
        return null;
    }, [currentSubmoduleId, allSubmodules]);

    const submoduleGlobalIndices = useMemo(() => {
        const map: Record<string, number> = {};
        let count = 0;
        processedStudyPlan.forEach(p => {
            p.modules.forEach(m => {
                m.submodules.forEach(sm => {
                    map[sm.id] = ++count;
                });
            });
        });
        return map;
    }, [processedStudyPlan]);

    const getPeriodStars = (period: any) => {
        let stars = 0;
        period.modules.forEach((m: any) => {
            m.submodules.forEach((sm: any) => {
                const progress = gameState[sm.id];
                if (progress) {
                    const highScores = progress.highScores || {};
                    if ((highScores[1] || 0) >= MIN_SCORE_TO_UNLOCK) stars++;
                    if ((highScores[2] || 0) >= MIN_SCORE_TO_UNLOCK) stars++;
                    if ((highScores[3] || 0) >= MIN_SCORE_TO_UNLOCK) stars++;
                }
            });
        });
        return stars;
    };

    const getPeriodCoins = (period: any) => {
        let coins = 0;
        period.modules.forEach((m: any) => {
            m.submodules.forEach((sm: any) => {
                const progress = gameState[sm.id];
                if (progress) {
                    const highScores = progress.highScores || {};
                    coins += ((highScores[1] || 0) + (highScores[2] || 0) + (highScores[3] || 0)) * 15;
                }
            });
        });
        return coins;
    };

    // Sub-renders for modularity
    const renderHUDAvatar = () => {
        const avatarContent = studentProfile?.avatar || (studentProfile?.gender === 'boy' ? '👦' : '👧') || '👤';
        if (avatarContent.startsWith('data:image')) {
            return <img src={avatarContent} alt="Avatar" className="w-14 h-14 rounded-xl object-cover border border-amber-400" referrerPolicy="no-referrer" />;
        }
        return <span className="text-4xl">{avatarContent}</span>;
    };

    const renderMapPin = (submodule: Submodule, isCurrent: boolean, globalIndex: number, isLast: boolean) => {
        let pinInner = <span className="text-xl font-bold text-slate-500 dark:text-slate-400 font-mono">{globalIndex}</span>;
        let pinStyles = "bg-white border-slate-300 dark:bg-slate-800 dark:border-slate-700 w-14 h-14";
        let ringPing = null;

        if (submodule.isLocked) {
            pinInner = <span className="text-lg">🔒</span>;
            pinStyles = "bg-slate-100 border-slate-250 dark:bg-slate-800/40 dark:border-slate-700 w-14 h-14 opacity-75 grayscale";
        } else if (isCurrent) {
            const avatarContent = studentProfile?.avatar || (studentProfile?.gender === 'boy' ? '👦' : '👧') || '👤';
            if (avatarContent.startsWith('data:image')) {
                pinInner = <img src={avatarContent} alt="Tú" className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 scale-110" referrerPolicy="no-referrer" />;
            } else {
                pinInner = <span className="text-2xl">{avatarContent}</span>;
            }
            pinStyles = "bg-amber-400 border-white dark:border-slate-800 w-16 h-16 scale-110 shadow-[0_0_20px_rgba(245,158,11,0.55)] z-30 ring-4 ring-amber-300 dark:ring-amber-500/50";
            ringPing = <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 animate-ping z-0"></span>;
        } else if (submodule.isMastered) {
            pinInner = <span className="text-2xl font-black drop-shadow-sm leading-none text-yellow-500 won-reward">🏆</span>;
            pinStyles = "bg-yellow-50 border-yellow-400 dark:bg-yellow-950/65 dark:border-yellow-600 w-14 h-14 shadow-lg";
        } else if (submodule.isCompleted) {
            pinInner = <span className="text-lg font-black leading-none text-emerald-500">⭐</span>;
            pinStyles = "bg-emerald-50 border-emerald-400 dark:bg-emerald-900/40 dark:border-emerald-700 w-14 h-14 shadow-md";
        }

        return (
            <div className="hidden sm:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center z-20">
                <div className="relative flex items-center justify-center">
                    {ringPing}
                    <div className={`rounded-full border-4 flex items-center justify-center shadow-md transition-all duration-300 relative z-10 ${pinStyles}`}>
                        {pinInner}
                    </div>
                </div>
            </div>
        );
    };

    const renderLevelCard = (submodule: Submodule, isCurrent: boolean, globalIndex: number, isLast: boolean, theme: any) => {
        let bgStyle = "";
        if (submodule.isLocked) {
            bgStyle = "bg-slate-100/50 dark:bg-slate-800/15 text-slate-400/80 dark:text-slate-600 grayscale opacity-75 cursor-not-allowed border-slate-200/60 dark:border-slate-800";
        } else if (submodule.isMastered) {
            bgStyle = "bg-gradient-to-br from-yellow-50/95 to-amber-50/95 border-yellow-400 dark:from-yellow-950/40 dark:to-amber-950/20 dark:border-yellow-600 shadow-xl hover:scale-[1.03]";
        } else if (submodule.isCompleted) {
            bgStyle = "bg-gradient-to-br from-green-50/95 to-emerald-50/95 border-green-400 dark:from-green-950/40 dark:to-emerald-950/20 dark:border-green-600 shadow-lg hover:scale-[1.025]";
        } else if (isCurrent) {
            bgStyle = theme.cardActiveBg + " shadow-2xl scale-[1.04] hover:scale-[1.06]";
        } else {
            bgStyle = "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 shadow-md hover:scale-[1.02]";
        }

        return (
            <button
                onClick={() => { if (!submodule.isLocked) { playClickSound(); onSelectSubmodule(submodule.id); } }}
                disabled={submodule.isLocked}
                className={`pl-5 pr-5 pb-5 ${isCurrent || isLast ? 'pt-8' : 'pt-5'} rounded-2xl border-2 transition-all duration-300 w-full text-left relative overflow-hidden group select-none ${bgStyle}`}
            >
                {/* Visual gloss effect for active / conquered slots */}
                {!submodule.isLocked && (
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
                )}

                {/* Status Ribbons */}
                {isCurrent && (
                    <div className="absolute top-0 right-0 bg-amber-400 text-slate-900 text-[9px] font-black uppercase px-3 py-1 rounded-bl-xl shadow-sm tracking-wider animate-pulse font-mono">
                        🎯 EN CURSO
                    </div>
                )}
                
                {isLast && (
                    <div className={`absolute top-0 left-0 ${submodule.isLocked ? 'bg-slate-400 text-slate-200' : 'bg-rose-500 text-white animate-pulse'} text-[9px] font-black uppercase px-3 py-1 rounded-br-xl shadow-sm tracking-wider flex items-center gap-1 font-mono`}>
                        💀 DESAFÍO BOSS
                    </div>
                )}

                <div className="flex flex-col gap-1 relative z-10">
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-mono">
                        {isLast ? "🚨 Guardián de Unidad" : `📍 Nivel ${globalIndex}`}
                        {submodule.isCompleted && <span className="text-emerald-500 font-extrabold font-sans">✓ Conquistado</span>}
                    </span>

                    <div className="flex justify-between items-start gap-3 mt-1">
                        <span className={`font-black text-lg leading-snug pr-4 tracking-tight transition-all duration-200 ${isCurrent ? 'text-amber-600 dark:text-amber-400' : 'text-slate-800 dark:text-slate-100'}`}>
                            {submodule.title}
                        </span>
                        {submodule.isLocked ? (
                            <span className="text-2xl text-slate-400 dark:text-slate-600 flex-shrink-0">🔒</span>
                        ) : isLast ? (
                            <span className="text-3xl flex-shrink-0 filter drop-shadow hover:scale-110 transition-transform">🏰</span>
                        ) : (
                            <span className="text-2xl flex-shrink-0 filter opacity-75 group-hover:scale-110 transition-transform">📘</span>
                        )}
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed font-semibold">
                        {submodule.isLocked 
                            ? "Completa las lecciones del camino escolar anterior para romper el sello." 
                            : isCurrent
                            ? "¡Aventúrate hoy! Conquista los tres niveles y amplía tu colección de trofeos."
                            : submodule.isMastered
                            ? "¡Fabuloso! Lograste la maestría perfecta con 3 estrellas de oro."
                            : submodule.isCompleted
                            ? "Nivel básico superado. ¡Repasa el tema para perfeccionar tu puntuación estrella!"
                            : "Explora la teoría creativa y supera la práctica interactiva."
                        }
                    </p>

                    {/* Progress stars block */}
                    <div className="flex justify-between items-center mt-5 pt-3 border-t border-slate-200/50 dark:border-slate-800">
                        <div className="flex items-center gap-1">
                            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500 font-mono">Dificultades:</span>
                            <div className="flex gap-1 ml-1.5">
                                {submodule.levelProgress?.map((completed, i) => {
                                    const starsType = ["Básico 🌱", "Medio 🧠", "Máximo ⚡"];
                                    return (
                                        <span 
                                            key={i} 
                                            title={starsType[i] + ": " + (completed ? 'Superada' : 'No jugada')}
                                            className={`text-lg transition-transform hover:scale-125 duration-150 ${completed ? 'text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]' : 'text-slate-200 dark:text-slate-700'}`}
                                        >
                                            {completed ? '★' : '☆'}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>

                        {submodule.isMastered ? (
                            <div className="flex items-center gap-1 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-xl shadow-inner">
                                <span className="text-lg won-reward animate-bounce">🏆</span>
                                <span className="text-[10px] font-black font-mono text-amber-500 uppercase tracking-wider">Maestría</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 opacity-25">
                                <span className="text-lg grayscale">🏆</span>
                                <span className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-wider">Maestría</span>
                            </div>
                        )}
                    </div>
                </div>
            </button>
        );
    };

    return (
        <div className="animate-fade-in max-w-4xl mx-auto px-4 pb-20 select-none">
            
            {/* GAME HEADLINE HERO BANNER */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-black text-slate-800 dark:text-slate-200 tracking-tight font-title">
                     Modo Historia 🗺️⚔️
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-bold mt-1 text-sm uppercase tracking-wider">
                     Aventura Curricular de {gradeName}
                </p>
            </div>

            {/* GAMER HIGH-FIFI STATS HUD */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-4 border-indigo-500/80 rounded-3xl p-6 mb-8 text-white relative overflow-hidden shadow-2xl">
                {/* Scanning sci-fi overlay network grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1b4b_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b_1px,transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Retro gaming profile card link */}
                    <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20 rounded-2xl bg-indigo-500/20 border-4 border-amber-400 p-1 flex items-center justify-center shadow-lg shadow-indigo-500/40">
                            {renderHUDAvatar()}
                            <span className="absolute -bottom-2 -right-2 bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase border-2 border-slate-900 animate-bounce">
                                HERO
                            </span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-wide text-amber-300 uppercase flex items-center gap-2">
                                {studentProfile?.name || 'Aventurero'}
                                <span className="text-xs bg-indigo-500/30 text-indigo-300 font-extrabold px-3 py-1 rounded-full border border-indigo-400/30 font-mono">
                                    Nivel {studentProfile?.age || 8}
                                </span>
                            </h2>
                            <p className="text-xs text-indigo-200 mt-1 uppercase font-black tracking-wider flex items-center gap-1 duration-150">
                                 Senda Matemática: <span className="text-sky-400 font-black">{subjectName}</span>
                            </p>
                        </div>
                    </div>

                    {/* Gameplay stats HUD grid */}
                    <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
                        <div className="bg-slate-950/60 border border-rose-500/30 rounded-2xl py-3 px-4 flex flex-col items-center justify-center min-w-[100px] shadow-inner">
                            <span className="text-2xl animate-pulse">❤️</span>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400 mt-1 font-mono">Energía</span>
                            <span className="text-xs font-black font-mono text-white mt-0.5">AL MÁXIMO</span>
                        </div>

                        <div className="bg-slate-950/60 border border-amber-500/30 rounded-2xl py-3 px-4 flex flex-col items-center justify-center min-w-[100px] shadow-inner">
                            <span className="text-2xl hover:scale-125 transition-transform duration-150 cursor-default">💰</span>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 mt-1 font-mono">Monedas</span>
                            <span className="text-lg font-black font-mono text-amber-400 mt-0.5">{totalCoins}</span>
                        </div>

                        <div className="bg-slate-950/60 border border-yellow-500/30 rounded-2xl py-3 px-4 flex flex-col items-center justify-center min-w-[100px] shadow-inner">
                            <span className="text-2xl won-reward">⭐</span>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-yellow-400 mt-1 font-mono">Estrellas</span>
                            <span className="text-lg font-black font-mono text-yellow-300 mt-0.5">{totalStars} / {maxStars}</span>
                        </div>
                    </div>
                </div>

                {/* Level up XP progress bars */}
                <div className="mt-6 pt-4 border-t border-indigo-500/25">
                    <div className="flex justify-between items-center text-xs uppercase font-black text-indigo-300 mb-2 font-mono">
                        <span>Puntuación e Historia Completada</span>
                        <span className="text-amber-300 font-black text-sm">{overallPercent}% XP</span>
                    </div>
                    <div className="w-full bg-slate-950/80 rounded-full h-4 p-1 border border-indigo-500/30 overflow-hidden shadow-inner flex items-center">
                        <div 
                            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 h-2 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                            style={{ width: `${overallPercent}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* TOGGLE NAVIGATION MAP / LIST */}
            <div className="flex justify-center mb-10">
                <div className="bg-slate-200 dark:bg-slate-700/80 p-1 rounded-full flex gap-1 shadow-inner border border-slate-300/40 dark:border-slate-600">
                    <button 
                        onClick={() => setViewMode('map')} 
                        className={`px-6 py-2 rounded-full font-black text-sm transition-colors flex items-center gap-2 ${viewMode === 'map' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-md' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        <span>🗺️</span> Mapa RPG
                    </button>
                    <button 
                        onClick={() => setViewMode('list')} 
                        className={`px-6 py-2 rounded-full font-black text-sm transition-colors flex items-center gap-2 ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-md' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        <span>📋</span> Lista Unidades
                    </button>
                </div>
            </div>

            {processedStudyPlan.length === 0 && (
                 <p className="text-slate-500 dark:text-slate-400 mb-8 border-2 border-dashed border-slate-300 dark:border-slate-700 p-8 rounded-xl font-bold text-center">No hay lecciones configuradas para esta asignatura todavía.</p>
            )}

            {/* VIDEO GAME ADVENTURE MAP */}
            {viewMode === 'map' ? (
                <div className="space-y-6">
                    {processedStudyPlan.map((period, periodIndex) => {
                        const submodulesInPeriod = period.modules.flatMap(m => m.submodules);
                        if (submodulesInPeriod.length === 0) return null;

                        const theme = getMundoTheme(period.period);
                        const nextPeriodSubmodules = processedStudyPlan[periodIndex + 1]?.modules.flatMap(m => m.submodules) || [];
                        const nextPeriodFirstSubposition = nextPeriodSubmodules[0];
                        const isNextWorldUnlocked = nextPeriodFirstSubposition ? !nextPeriodFirstSubposition.isLocked : false;

                        return (
                            <div key={period.period} className="relative">
                                
                                {/* 🪐 INDIVIDUAL FLOATING WORLD ISLAND */}
                                <div className={`relative rounded-3xl p-6 sm:p-10 border-4 overflow-hidden ${theme.bgColor} ${theme.borderColor} transition-colors duration-300`}>
                                    
                                    {/* Retro game scanlines overlay inside unit card */}
                                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none"></div>

                                    {/* World Title Banner Header */}
                                    <div className={`-mx-6 -mt-6 sm:-mx-10 sm:-mt-10 mb-10 p-6 text-white ${theme.headerBg} rounded-t-2xl shadow-md border-b-2 border-white/20 relative overflow-hidden`}>
                                        <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 text-9xl opacity-10 font-black font-mono select-none">
                                            {period.period}
                                        </div>
                                        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div>
                                                <div className="inline-block bg-white/20 text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full border border-white/25 backdrop-blur-sm mb-2 font-mono">
                                                    {theme.levelRange}
                                                </div>
                                                <h2 className="text-3xl font-black tracking-wide uppercase flex items-center gap-2 drop-shadow-sm font-title">
                                                     {theme.icon} {period.title}: {theme.name}
                                                </h2>
                                                <p className="text-xs text-white/90 font-bold mt-1.5 max-w-xl leading-relaxed">
                                                    {theme.sub}
                                                </p>
                                            </div>

                                            {/* Sub score stars tracker badge */}
                                            <div className="flex items-center gap-3 bg-slate-900/35 p-3 rounded-2xl border border-white/15 backdrop-blur-sm self-stretch sm:self-auto justify-center font-mono">
                                                <div className="text-center">
                                                    <span className="block text-[8px] uppercase tracking-wider text-white/60 font-black">Ganancias</span>
                                                    <span className="font-mono text-sm font-black text-amber-300">💰 {getPeriodCoins(period)}</span>
                                                </div>
                                                <div className="w-px h-6 bg-white/20"></div>
                                                <div className="text-center">
                                                    <span className="block text-[8px] uppercase tracking-wider text-white/60 font-black">Trofeos</span>
                                                    <span className="font-mono text-sm font-black text-yellow-300">⭐ {getPeriodStars(period)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Paths Grid Stages */}
                                    <div className="relative py-8 px-4 sm:px-0 mt-2">
                                        {/* Dynamic central path line connector */}
                                        <div className={`absolute left-1/2 top-4 bottom-4 w-3 ${theme.pathLine} transform -translate-x-1/2 rounded-full z-0 pointer-events-none hidden sm:block opacity-65 shadow-inner`}></div>

                                        {submodulesInPeriod.map((submodule, index) => {
                                            const globalIndex = submoduleGlobalIndices[submodule.id] || index + 1;
                                            const isLeftSide = index % 2 === 0;
                                            const isCurrent = submodule.id === activeCurrentSubmoduleId;
                                            const isLast = index === submodulesInPeriod.length - 1;

                                            // Submodule Card Column on its designated side
                                            const cardCol = (
                                                <div className={`w-full sm:w-1/2 flex ${isLeftSide ? 'sm:justify-end sm:pr-14' : 'sm:justify-start sm:pl-14'} justify-center relative z-10`}>
                                                    <div className="w-full max-w-sm relative">
                                                        {isCurrent && (
                                                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 z-40 animate-float-badge pointer-events-none">
                                                                <div className="bg-amber-400 text-slate-900 border-2 border-slate-900 dark:border-slate-950 text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl shadow-lg whitespace-nowrap flex items-center gap-1.5 font-mono">
                                                                    <span>🚩</span> ¡ESTÁS AQUÍ!
                                                                </div>
                                                                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-900 dark:border-t-slate-950 mx-auto mt-[-1px]"></div>
                                                            </div>
                                                        )}
                                                        {renderLevelCard(submodule, isCurrent, globalIndex, isLast, theme)}
                                                    </div>
                                                </div>
                                            );

                                            // Spacer Column to balance the grid and keep cards off the central map path
                                            const spacerCol = <div className="hidden sm:block sm:w-1/2" />;

                                            return (
                                                <div key={submodule.id} className="relative z-10 flex flex-col sm:flex-row items-center justify-center mb-12 last:mb-2 w-full">
                                                    
                                                    {/* We render card & spacer side-by-side on desktop so they split the row width, preventing the central pin from overlapping text */}
                                                    {isLeftSide ? cardCol : spacerCol}
                                                    {isLeftSide ? spacerCol : cardCol}

                                                    {/* Central responsive Pin milestone */}
                                                    {renderMapPin(submodule, isCurrent, globalIndex, isLast)}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* 🌌 COSMIC INTER-WORLD REGIONAL CONNECTOR / ENERGY PORTAL */}
                                {periodIndex < processedStudyPlan.length - 1 && (
                                    <div className="flex flex-col items-center justify-center my-14 relative select-none">
                                        <div className="w-1.5 h-24 bg-gradient-to-b from-slate-350 to-slate-450 dark:from-slate-800 dark:to-slate-900 pointer-events-none"></div>
                                        
                                        {/* Dynamic locked/unlocked portal trigger banner */}
                                        {isNextWorldUnlocked ? (
                                            <div className="absolute top-1/2 transform -translate-y-1/2 z-30 bg-white dark:bg-slate-800 px-5 py-3 border-4 border-emerald-400 rounded-2xl flex flex-col items-center shadow-[0_4px_25px_rgba(16,185,129,0.3)] animate-pulse hover:scale-105 transition-transform">
                                                <span className="text-3xl animate-spin" style={{ animationDuration: '8s' }}>🌀</span>
                                                <span className="text-xs font-black text-emerald-500 tracking-widest mt-1.5 uppercase font-mono">
                                                     Portal Unlocked ✓
                                                </span>
                                                <span className="text-[9px] text-slate-400 font-bold uppercase mt-0.5 font-mono">
                                                     Cruce permitido al Mundo {period.period + 1}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="absolute top-1/2 transform -translate-y-1/2 z-30 bg-slate-150 dark:bg-slate-900 px-5 py-3 border-4 border-slate-400 rounded-2xl flex flex-col items-center shadow-lg hover:scale-105 transition-transform opacity-90">
                                                <span className="text-3xl">🔒</span>
                                                <span className="text-xs font-black text-slate-500 dark:text-slate-400 tracking-widest mt-1.5 uppercase font-mono">
                                                     Portal Guardado ⛓️
                                                </span>
                                                <span className="text-[9px] text-slate-400 font-bold uppercase mt-0.5 text-center px-1 font-mono">
                                                     Conquista el Boss de Unidad {period.period} para abrir
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                
                /* CLASSIC UNIT LIST PREVIEW */
                <div className="space-y-6">
                    {processedStudyPlan.map((period: any) => {
                        const isCurrent = period.period === currentPeriodNumber;
                        const theme = getMundoTheme(period.period);
                        
                        let periodColorClass = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700';
                        if (period.isMastered) {
                            periodColorClass = 'bg-yellow-50/50 border-yellow-300 dark:bg-yellow-950/20 dark:border-yellow-900';
                        } else if (period.isCompleted) {
                            periodColorClass = 'bg-green-50/50 border-green-300 dark:bg-green-950/20 dark:border-green-900';
                        } else if (isCurrent) {
                            periodColorClass = 'bg-blue-50/50 border-blue-300 dark:bg-indigo-950/20 dark:border-indigo-900';
                        }

                        return (
                            <div key={period.period} className={`p-6 rounded-3xl shadow-lg border transition-all duration-300 ${periodColorClass}`}>
                                <h2 className="text-2xl font-black text-slate-700 dark:text-slate-200">
                                    <button 
                                        onClick={() => { playClickSound(); handleLocalTogglePeriod(period.period); }} 
                                        className="w-full flex justify-between items-center text-left hover:text-blue-600 dark:hover:text-sky-400 transition-colors py-1"
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className={`text-3xl ${period.isCompleted ? 'text-yellow-400 won-reward' : 'unwon-reward'}`}>★</span>
                                            {period.isMastered ? (
                                                <span className="text-3xl won-reward">🏆</span>
                                            ) : (
                                                <span className="text-3xl opacity-35">🏆</span>
                                            )}
                                            <span className="font-title">{period.title}: {theme.name}</span>
                                        </div>
                                        <span className={`transform transition-transform duration-300 text-blue-500 font-bold ${localOpenPeriods[period.period] ? 'rotate-180' : ''}`}>
                                            ▾
                                        </span>
                                    </button>
                                </h2>
                                
                                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${localOpenPeriods[period.period] ? 'max-h-[5000px] opacity-100 visible pt-6' : 'max-h-0 opacity-0 invisible h-0 overflow-hidden'}`}>
                                    <div className="space-y-4">
                                            {period.modules.map((module: any) => (
                                                <div key={module.id} className="bg-slate-50/80 dark:bg-slate-900/45 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <span className="text-3xl">{module.icon}</span>
                                                        <h3 className="font-black text-lg text-slate-800 dark:text-slate-200">{module.title}</h3>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {module.submodules.map((submodule: any) => {
                                                            const isCurrentSubmodule = submodule.id === activeCurrentSubmoduleId;
                                                            let buttonStyle = "bg-white/90 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:shadow-md";
                                                            
                                                            if (submodule.isLocked) {
                                                                buttonStyle = "bg-slate-100 dark:bg-slate-900/30 text-slate-400 cursor-not-allowed opacity-60";
                                                            } else if (submodule.isMastered) {
                                                                buttonStyle = "bg-yellow-50/80 dark:bg-yellow-950/20 border-yellow-400 hover:bg-yellow-100/50 hover:shadow-md";
                                                            } else if (submodule.isCompleted) {
                                                                buttonStyle = "bg-green-50/80 dark:bg-green-950/20 border-green-400 hover:bg-green-100/50 hover:shadow-md";
                                                            } else if (isCurrentSubmodule) {
                                                                buttonStyle = "bg-blue-50/80 dark:bg-indigo-950/20 border-blue-400 ring-2 ring-blue-300 dark:ring-indigo-800/60";
                                                            }

                                                            return (
                                                                <button
                                                                    key={submodule.id}
                                                                    onClick={() => { if (!submodule.isLocked) { playClickSound(); onSelectSubmodule(submodule.id); } }}
                                                                    disabled={submodule.isLocked}
                                                                    className={`p-4 rounded-xl text-left transition-all duration-250 flex flex-col justify-between h-28 border ${buttonStyle}`}
                                                                >
                                                                    <div className="flex justify-between items-start w-full">
                                                                        <span className="font-bold text-sm text-slate-800 dark:text-slate-200 pr-2 line-clamp-2 leading-snug">{submodule.title}</span>
                                                                        {submodule.isLocked && <span className="text-lg">🔒</span>}
                                                                        {submodule.isCompleted && !submodule.isLocked && (
                                                                            <span className="text-[10px] font-black bg-emerald-150 text-emerald-800 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                                                                                Repasar
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex justify-between items-end w-full mt-auto">
                                                                        <div className="text-base flex gap-0.5">
                                                                            {submodule.levelProgress?.map((completed: boolean, i: number) => (
                                                                                <span key={i} className={completed ? 'text-yellow-400 drop-shadow' : 'text-slate-300 dark:text-slate-700'}>
                                                                                    ★
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                        {submodule.isMastered ? (
                                                                            <span className="text-2xl won-reward">🏆</span>
                                                                        ) : (
                                                                            <span className="text-2xl opacity-20">🏆</span>
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
                        );
                    })}
                </div>
            )}
        </div>
    );
};
