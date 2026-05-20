import { Achievement, QuestionResult, GameState, StudentProfile } from '../types';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
    { id: 'first_lesson', title: '¡Primeros Pasos!', description: 'Completa tu primera lección.', icon: '🌟' },
    { id: 'streak_3', title: 'Racha de 3 Días', description: 'Estudia 3 días seguidos.', icon: '🔥', maxProgress: 3 },
    { id: 'perfect_10', title: '¡Perfecto!', description: 'Responde 10 preguntas seguidas correctamente.', icon: '🎯', maxProgress: 10 },
    { id: 'master_math', title: 'Mente Brillante', description: 'Completa todos los niveles de un tema de matemáticas.', icon: '🧠' },
    { id: 'explorer', title: 'Explorador', description: 'Prueba la Conversación con IA o la Ayuda de Mascota.', icon: '🧭' },
    { id: 'speed_demon', title: 'Rayo Veloz', description: 'Responde 5 preguntas en menos de 10 segundos cada una.', icon: '⚡', maxProgress: 5 },
    { id: 'weekend_warrior', title: 'Guerrero del Fin de Semana', description: 'Completa una lección en sábado o domingo.', icon: '🛡️' }
];

export const checkAchievements = (
    currentProfile: StudentProfile,
    gameState: GameState,
    recentResults?: QuestionResult[],
    action?: string
): Achievement[] => {
    let newAchievements: Achievement[] = [];
    let updatedAchievements = currentProfile.achievements ? [...currentProfile.achievements] : [...INITIAL_ACHIEVEMENTS];

    const unlock = (id: string) => {
        const index = updatedAchievements.findIndex(a => a.id === id);
        if (index !== -1 && !updatedAchievements[index].unlockedAt) {
            updatedAchievements[index] = { ...updatedAchievements[index], unlockedAt: Date.now() };
            newAchievements.push(updatedAchievements[index]);
        }
    };

    const updateProgress = (id: string, progress: number) => {
        const index = updatedAchievements.findIndex(a => a.id === id);
        if (index !== -1 && !updatedAchievements[index].unlockedAt && updatedAchievements[index].maxProgress) {
             const max = updatedAchievements[index].maxProgress!;
             const newProgress = Math.min(progress, max);
             updatedAchievements[index] = { ...updatedAchievements[index], progress: newProgress };
             if (newProgress >= max) {
                 unlock(id);
             }
        }
    };

    // Check first lesson
    if (action === 'lesson_complete') {
        unlock('first_lesson');
        
        // Weekend warrior
        const day = new Date().getDay();
        if (day === 0 || day === 6) {
            unlock('weekend_warrior');
        }
    }

    // Check perfect 10 & speed demon
    if (recentResults && recentResults.length > 0) {
        let perfectStreak = 0;
         let speedStreak = 0;
        // In reality we'd need history across quizzes, for now let's just check the current quiz
        for (const res of recentResults) {
            if (res.correct) perfectStreak++;
            else perfectStreak = 0;

            if (res.correct && res.time < 10) speedStreak++;
            else speedStreak = 0;
        }
        
        if (perfectStreak >= 10) unlock('perfect_10');
        else updateProgress('perfect_10', perfectStreak);
        
        if (speedStreak >= 5) unlock('speed_demon');
        else updateProgress('speed_demon', speedStreak);
    }
    
    if (action === 'ai_chat') {
        unlock('explorer');
    }

    return newAchievements.length > 0 ? updatedAchievements : currentProfile.achievements || INITIAL_ACHIEVEMENTS;
};
