import type { GameState, CategoryId } from '../types';
import { questions } from '../data/questions';
import { lessons } from '../data/lessons';

export const initialGameState = (): GameState => {
    const state: GameState = {};
    const allKeys = new Set<string>();

    (Object.keys(questions) as CategoryId[]).forEach(key => allKeys.add(key));
    lessons.forEach(lesson => allKeys.add(lesson.id));
    allKeys.add('exam_weekly');
    allKeys.add('exam_refresh');
    allKeys.add('exam_quick');

    allKeys.forEach(key => {
        state[key] = { unlockedLevel: 1, highScores: {}, skillHistory: [], usedQuestions: {}, contentVersion: 1, interactiveExerciseState: {} };
    });
    
    return state;
};

export const loadGameStateForUser = (userId: string): GameState => {
    const freshInitialState = initialGameState();
    if (!userId) {
        return freshInitialState;
    }

    const GAME_STATE_KEY = `maestroDigitalProgress_${userId}`;
    try {
        const savedState = localStorage.getItem(GAME_STATE_KEY);
        if (savedState) {
            const parsedSavedState = JSON.parse(savedState);
            const mergedState: GameState = { ...freshInitialState };

            for (const key in parsedSavedState) {
                if (Object.prototype.hasOwnProperty.call(parsedSavedState, key)) {
                    if (mergedState[key]) {
                        mergedState[key] = {
                            ...freshInitialState[key],
                            ...parsedSavedState[key],
                            highScores: {
                                ...freshInitialState[key].highScores,
                                ...(parsedSavedState[key].highScores || {})
                            },
                            skillHistory: parsedSavedState[key].skillHistory || [],
                            usedQuestions: parsedSavedState[key].usedQuestions || {}
                        };
                    } else {
                         mergedState[key] = parsedSavedState[key];
                    }
                }
            }
            return mergedState;
        }
    } catch (error) {
        console.error(`Could not load/merge game state for user ${userId}`, error);
    }
    return freshInitialState;
};
