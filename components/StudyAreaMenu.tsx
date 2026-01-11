import React, { useMemo } from 'react';
import { Card } from './common/Card';
import type { PeriodPlan, GameState, Submodule } from '../types';
import { playClickSound } from '../utils/sounds';

interface StudyAreaMenuProps {
    onSelectSubmodule: (submoduleId: string) => void;
    gameState: GameState;
    openPeriods: Record<number, boolean>;
    onTogglePeriod: (periodNumber: number) => void;
}

const studyPlan: PeriodPlan[] = [
    {
        period: 1,
        title: 'Periodo 1 (60 horas-clase)',
        modules: [
            { 
                id: 'numeros_1', title: 'Números hasta 10 000', icon: '🔢', 
                submodules: [
                    { id: 'numeros_1_1', title: 'Consolidación hasta 100' },
                    { id: 'numeros_1_2', title: 'Números hasta 10 000' },
                    { id: 'numeros_1_3', title: 'Orden y comparación' }
                ] 
            },
            { 
                id: 'adicion_1', title: 'Adición y Sustracción', icon: '➕', 
                submodules: [
                    { id: 'adicion_2_2', title: 'Procedimiento escrito de la adición' }
                ] 
            },
            { 
                id: 'geometria_1', title: 'Geometría', icon: '📐', 
                submodules: [
                    { id: 'geometria_p1', title: 'Rectas paralelas y perpendiculares' }
                ] 
            },
        ]
    },
    {
        period: 2,
        title: 'Periodo 2 (50 horas-clase)',
        modules: [
             { 
                id: 'sustraccion_2', title: 'Adición y Sustracción', icon: '➖', 
                submodules: [
                    { id: 'sustraccion_2_3', title: 'Procedimiento escrito de la sustracción' }
                ] 
            },
            { 
                id: 'multiplicacion_2', title: 'Multiplicación y División', icon: '✖️', 
                submodules: [
                    { id: 'multiplicacion_3_2', title: 'Procedimiento escrito de la multiplicación' }
                ] 
            },
            { 
                id: 'geometria_2', title: 'Geometría', icon: '🧊', 
                submodules: [
                    { id: 'geometria_p2_1', title: 'Rectángulo y cuadrado' },
                    { id: 'geometria_p2_2', title: 'Prisma (ortoedro y cubo)' }
                ] 
            },
        ]
    },
    {
        period: 3,
        title: 'Periodo 3 (55 horas-clase)',
        modules: [
            { 
                id: 'division_3', title: 'Multiplicación y División', icon: '➗', 
                submodules: [
                    { id: 'division_3_3', title: 'Procedimiento escrito de la división' },
                    { id: 'division_3_4', title: 'Ejercitación y problemas' },
                    { id: 'operaciones_combinadas', title: 'Operaciones Combinadas' }
                ] 
            },
            {
                id: 'fracciones_3', title: 'Fracciones', icon: '🍕',
                submodules: [
                    { id: 'fracciones_intro', title: 'Introducción a las fracciones'}
                ]
            },
            { 
                id: 'geometria_3', title: 'Geometría', icon: '🔵', 
                submodules: [
                    { id: 'geometria_p3', title: 'Circunferencia, círculo y cilindro' }
                ] 
            },
            {
                id: 'medidas_3', title: 'Medidas', icon: '📏',
                submodules: [
                    { id: 'medidas_longitud_1', title: 'Midiendo el Mundo: Longitud' },
                    { id: 'medidas_masa_1', title: '¿Cuánto Pesa?: Masa' },
                    { id: 'medidas_capacidad_1', title: '¿Cuánto Cabe?: Capacidad' },
                    { id: 'medidas_moneda_1', title: 'Nuestro Dinero: Peso Cubano' }
                ]
            },
            {
                id: 'reloj_3', title: 'El Reloj', icon: '⏰',
                submodules: [
                    { id: 'reloj_horas_1', title: 'El Reloj: Horas y Fracciones' },
                    { id: 'reloj_minutos_1', title: 'El Reloj: Contando Minutos' },
                    { id: 'reloj_problemas_1', title: 'El Reloj: Problemas de Tiempo' }
                ]
            }
        ]
    }
];

const MIN_SCORE_TO_UNLOCK = 8;
const PERFECT_SCORE = 10;

export const StudyAreaMenu: React.FC<StudyAreaMenuProps> = ({ onSelectSubmodule, gameState, openPeriods, onTogglePeriod }) => {

    const { processedStudyPlan, currentSubmoduleId } = useMemo(() => {
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
            const isPeriodCompleted = allSubmodulesInPeriod.every(sm => processedSubmodules.get(sm.id)?.isCompleted);
            const isPeriodMastered = allSubmodulesInPeriod.every(sm => processedSubmodules.get(sm.id)?.isMastered);

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

        return { processedStudyPlan: finalPlan, currentSubmoduleId };
    }, [gameState]);

    const currentPeriodNumber = useMemo(() => {
        const firstUncompleted = processedStudyPlan.find(p => !p.isCompleted);
        return firstUncompleted ? firstUncompleted.period : -1;
    }, [processedStudyPlan]);

    return (
        <div className="animate-fade-in">
            <h1 className="text-4xl font-black text-slate-800 dark:text-slate-200 text-center mb-2">Área de Estudio: Matemática 3er Grado</h1>
            <p className="text-slate-600 dark:text-slate-300 mb-8 text-center">Sigue el programa oficial cubano. ¡Supera cada lección para desbloquear la siguiente!</p>

            {processedStudyPlan.map((period: any) => {
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
            })}
        </div>
    );
};