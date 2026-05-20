import React from 'react';
import { StudentProfile } from '../types';
import { INITIAL_ACHIEVEMENTS } from '../utils/achievements';
import { motion } from 'framer-motion';

interface AchievementsScreenProps {
    studentProfile: StudentProfile;
}

export const AchievementsScreen: React.FC<AchievementsScreenProps> = ({ studentProfile }) => {
    const userAchievements = studentProfile.achievements || INITIAL_ACHIEVEMENTS;

    return (
        <div className="w-full max-w-4xl mx-auto py-8 px-4">
            <h2 className="text-3xl font-bold mb-8 text-center text-slate-800 dark:text-slate-100">
                Mis Logros y Medallas 🏆
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {userAchievements.map((achievement, index) => {
                    const isUnlocked = !!achievement.unlockedAt;
                    return (
                        <motion.div
                            key={achievement.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-4 rounded-xl shadow-md border-2 text-center transition-all ${
                                isUnlocked 
                                ? 'bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/40 dark:to-orange-800/40 border-amber-300 dark:border-amber-600 scale-105' 
                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-70 grayscale'
                            }`}
                        >
                            <div className="text-5xl mb-3 drop-shadow-md">{achievement.icon}</div>
                            <h3 className={`font-bold text-lg mb-1 leading-tight ${isUnlocked ? 'text-amber-800 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}`}>
                                {achievement.title}
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                                {achievement.description}
                            </p>
                            
                            {!isUnlocked && achievement.maxProgress && (
                                <div className="mt-2">
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                                      <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${((achievement.progress || 0) / achievement.maxProgress) * 100}%` }}></div>
                                    </div>
                                    <p className="text-[10px] mt-1 text-slate-500">{achievement.progress || 0} / {achievement.maxProgress}</p>
                                </div>
                            )}

                            {isUnlocked && (
                                <div className="mt-2 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                                    ¡Desbloqueado!
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};
