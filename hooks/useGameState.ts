import { useState, useEffect, useCallback } from 'react';
import type { GameState, CategoryId, QuestionResult } from '../types';
import { questions } from '../data/questions';
import { lessons } from '../data/lessons';
import { initialGameState, loadGameStateForUser } from '../utils/gameState';

const MIN_SCORE_to_UNLOCK_PERCENT = 0.8;

const getMaxLevelForKey = (key: string): number => {
    if (key.startsWith('exam')) {
        return 1;
    }
    if (questions[key as CategoryId]) {
        return Object.keys(questions[key as CategoryId]).length;
    }
    const lesson = lessons.find(l => l.id === key);
    if (lesson && lesson.practice) {
        return Object.keys(lesson.practice).length;
    }
    return 0;
};

export const useGameState = (userId: string | null) => {
    const [gameState, setGameState] = useState<GameState>(initialGameState());

    useEffect(() => {
        if (!userId) {
            setGameState(initialGameState());
            return;
        }
        setGameState(loadGameStateForUser(userId));
    }, [userId]);

    useEffect(() => {
        if (!userId) return;
        const GAME_STATE_KEY = `maestroDigitalProgress_${userId}`;
        try {
            localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
            console.log(`[Maestro Digital] Progreso guardado para el usuario ${userId}.`);
        } catch (error) {
            console.error("Could not save game state", error);
        }
    }, [gameState, userId]);

    const recordPracticeResult = useCallback((key: string, level: number, score: number, total: number) => {
        setGameState(prev => {
            const newState: GameState = JSON.parse(JSON.stringify(prev));
            const stateForKey = newState[key] || { unlockedLevel: 1, highScores: {}, skillHistory: [], usedQuestions: {}, contentVersion: 1 };
            
            const currentHighScore = stateForKey.highScores?.[level] || 0;
            if (score > currentHighScore) {
                if(!stateForKey.highScores) stateForKey.highScores = {};
                stateForKey.highScores[level] = score;
            }
            
            const isCategory = !!questions[key as CategoryId];
            let maxLevel = 3;
            if (isCategory) {
                maxLevel = Object.keys(questions[key as CategoryId] || {}).length;
            } else {
                const lesson = lessons.find(l => l.id === key);
                if (lesson) {
                    maxLevel = Object.keys(lesson.practice).length;
                }
            }

            if (score / total >= MIN_SCORE_to_UNLOCK_PERCENT && level < maxLevel && level === stateForKey.unlockedLevel) {
                stateForKey.unlockedLevel += 1;
            }

            newState[key] = stateForKey;
            return newState;
        });
    }, []);
    
    const recordInteractiveExerciseState = useCallback((lessonId: string, exerciseIndex: number, state: any) => {
        setGameState(prev => {
            const newState: GameState = JSON.parse(JSON.stringify(prev));
            const stateForKey = newState[lessonId];
            if (!stateForKey) return prev;

            if (!stateForKey.interactiveExerciseState) {
                stateForKey.interactiveExerciseState = {};
            }
            stateForKey.interactiveExerciseState[exerciseIndex] = state;
            
            return newState;
        });
    }, []);

    const addSkillRecord = useCallback((key: string, skillScore: number, level: number, type: 'lesson' | 'practice' | 'exam', totalTime: number, results: QuestionResult[], lessonId?: string) => {
        setGameState(prev => {
            const newState: GameState = JSON.parse(JSON.stringify(prev));
            const stateForKey = newState[key] || { unlockedLevel: 1, highScores: {}, skillHistory: [], usedQuestions: {}, contentVersion: 1 };
            const history = stateForKey.skillHistory || [];
            const currentVersion = stateForKey.contentVersion || 1;
            const newRecord = { 
                score: Math.round(skillScore), 
                timestamp: Date.now(), 
                level, 
                type, 
                contentVersion: currentVersion, 
                totalTime,
                results,
                lessonId,
            };
            
            stateForKey.skillHistory = [...history, newRecord];
            newState[key] = stateForKey;
            
            return newState;
        });
    }, []);

    const recordUsedQuestions = useCallback((key: string, level: number, questionIndices: number[]) => {
        setGameState(prev => {
            const newState: GameState = JSON.parse(JSON.stringify(prev));
            const stateForKey = newState[key];
            if (!stateForKey) return prev;

            const usedForLevel = stateForKey.usedQuestions?.[level] || [];
            const newUsedSet = new Set([...usedForLevel, ...questionIndices]);

            if (!stateForKey.usedQuestions) {
                stateForKey.usedQuestions = {};
            }
            stateForKey.usedQuestions[level] = Array.from(newUsedSet);

            return newState;
        });
    }, []);

    const clearUsedQuestions = useCallback((key: string, level: number) => {
        setGameState(prev => {
            const newState: GameState = JSON.parse(JSON.stringify(prev));
            const stateForKey = newState[key];
            if (!stateForKey) return prev;
            
            if (!stateForKey.usedQuestions) {
                stateForKey.usedQuestions = {};
            }
            stateForKey.usedQuestions[level] = [];

            return newState;
        });
    }, []);
    
    const unlockNextLevel = useCallback((key: string) => {
        setGameState(prev => {
            const newState: GameState = JSON.parse(JSON.stringify(prev));
            const stateForKey = newState[key];
            if (!stateForKey) return prev;

            const maxLevel = getMaxLevelForKey(key);
            if (stateForKey.unlockedLevel < maxLevel) {
                stateForKey.unlockedLevel += 1;
            }
            
            return newState;
        });
    }, []);

    const resetProgressForKey = useCallback((key: string) => {
        setGameState(prev => {
            if (!prev[key]) return prev;

            const newState: GameState = JSON.parse(JSON.stringify(prev));
            newState[key] = {
                unlockedLevel: 1,
                highScores: {},
                skillHistory: [],
                usedQuestions: {},
                contentVersion: 1,
                interactiveExerciseState: {},
            };
            return newState;
        });
    }, []);

    const resetPracticeCategoryProgress = useCallback((key: CategoryId) => {
        setGameState(prev => {
            if (!prev[key]) return prev;

            const newState: GameState = JSON.parse(JSON.stringify(prev));
            const stateForKey = newState[key];

            // Reset high scores, used questions, and unlocked level to 1, but keep skill history
            stateForKey.highScores = {};
            stateForKey.usedQuestions = {};
            stateForKey.unlockedLevel = 1;
            stateForKey.contentVersion = (stateForKey.contentVersion || 1) + 1; // Increment content version

            newState[key] = stateForKey;
            return newState;
        });
    }, []);

    const unlockAllLevels = useCallback(() => {
        setGameState(prev => {
            const newState: GameState = JSON.parse(JSON.stringify(prev));
            Object.keys(newState).forEach(key => {
                const maxLevel = getMaxLevelForKey(key);
                if (maxLevel > 0) {
                    newState[key].unlockedLevel = maxLevel;
                }
            });
            return newState;
        });
    }, []);

    const resetAllProgress = useCallback(() => {
        setGameState(initialGameState());
    }, []);
    
    return { gameState, recordPracticeResult, addSkillRecord, unlockNextLevel, resetProgressForKey, recordUsedQuestions, clearUsedQuestions, unlockAllLevels, resetAllProgress, resetPracticeCategoryProgress, recordInteractiveExerciseState };
};