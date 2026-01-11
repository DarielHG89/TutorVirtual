import React, { useReducer } from 'react';
import type { Screen, QuizConfig, CategoryId, StudentProfile, QuestionResult } from '../types';

// State shape
interface AppState {
    screen: Screen;
    quizConfig: QuizConfig | null;
    selectedCategory: CategoryId | null;
    finalResults: QuestionResult[] | null;
    allUsers: StudentProfile[];
    currentUser: StudentProfile | null;
    isFreeMode: boolean;
    lessonId: string | null;
    showPracticeSuggestion: { categoryId: CategoryId; categoryName: string } | null;
    openPeriods: Record<number, boolean>;
    isFeedbackModalOpen: boolean;
    isEditProfileModalOpen: boolean;
}

// Actions
type AppAction =
    | { type: 'SET_SCREEN'; payload: Screen }
    | { type: 'SET_ALL_USERS'; payload: StudentProfile[] }
    | { type: 'SET_CURRENT_USER'; payload: StudentProfile | null }
    | { type: 'START_QUIZ'; payload: QuizConfig }
    | { type: 'END_QUIZ'; payload: QuestionResult[] }
    | { type: 'SELECT_CATEGORY'; payload: { categoryId: CategoryId; isFreeMode: boolean } }
    | { type: 'SELECT_LESSON'; payload: string }
    | { type: 'GO_TO_MAIN_MENU' }
    | { type: 'GO_TO_LEVEL_SELECTION' }
    | { type: 'GO_TO_LESSON' }
    | { type: 'GO_TO_STUDY_AREA'; payload: Record<number, boolean> }
    | { type: 'SET_SHOW_PRACTICE_SUGGESTION'; payload: { categoryId: CategoryId; categoryName: string } | null }
    | { type: 'TOGGLE_PERIOD'; payload: number }
    | { type: 'OPEN_FEEDBACK_MODAL' }
    | { type: 'CLOSE_FEEDBACK_MODAL' }
    | { type: 'OPEN_EDIT_PROFILE_MODAL' }
    | { type: 'CLOSE_EDIT_PROFILE_MODAL' };

const initialState: AppState = {
    screen: 'name-entry',
    quizConfig: null,
    selectedCategory: null,
    finalResults: null,
    allUsers: [],
    currentUser: null,
    isFreeMode: false,
    lessonId: null,
    showPracticeSuggestion: null,
    openPeriods: {},
    isFeedbackModalOpen: false,
    isEditProfileModalOpen: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case 'SET_SCREEN':
            // Reset category/lesson context when going to certain screens
            if (['main-menu', 'user-selection', 'name-entry', 'study-area', 'free-practice-menu'].includes(action.payload)) {
                return { ...state, screen: action.payload, selectedCategory: null, lessonId: null };
            }
            return { ...state, screen: action.payload };
        case 'SET_ALL_USERS':
            return { ...state, allUsers: action.payload };
        case 'SET_CURRENT_USER':
            return { ...state, currentUser: action.payload };
        case 'START_QUIZ':
            return { ...state, quizConfig: action.payload, screen: 'quiz' };
        case 'END_QUIZ':
            return { ...state, finalResults: action.payload, screen: 'results' };
        case 'SELECT_CATEGORY':
            return { ...state, selectedCategory: action.payload.categoryId, isFreeMode: action.payload.isFreeMode, screen: 'level-selection' };
        case 'SELECT_LESSON':
            return { ...state, lessonId: action.payload, screen: 'lesson' };
        case 'GO_TO_MAIN_MENU':
            return { ...state, screen: 'main-menu', quizConfig: null, selectedCategory: null, finalResults: null, isFreeMode: false, lessonId: null, showPracticeSuggestion: null };
        case 'GO_TO_LEVEL_SELECTION':
             return { ...state, screen: 'level-selection', quizConfig: null, finalResults: null, showPracticeSuggestion: null };
        case 'GO_TO_LESSON':
             return { ...state, screen: 'lesson', quizConfig: null, finalResults: null, showPracticeSuggestion: null };
        case 'GO_TO_STUDY_AREA':
            return { ...state, screen: 'study-area', lessonId: null, quizConfig: null, finalResults: null, showPracticeSuggestion: null, openPeriods: action.payload };
        case 'SET_SHOW_PRACTICE_SUGGESTION':
            return { ...state, showPracticeSuggestion: action.payload };
        case 'TOGGLE_PERIOD':
            const currentPeriodState = state.openPeriods[action.payload] || false;
            return { ...state, openPeriods: { ...state.openPeriods, [action.payload]: !currentPeriodState } };
        case 'OPEN_FEEDBACK_MODAL':
            return { ...state, isFeedbackModalOpen: true };
        case 'CLOSE_FEEDBACK_MODAL':
            return { ...state, isFeedbackModalOpen: false };
        case 'OPEN_EDIT_PROFILE_MODAL':
            return { ...state, isEditProfileModalOpen: true };
        case 'CLOSE_EDIT_PROFILE_MODAL':
            return { ...state, isEditProfileModalOpen: false };
        default:
            return state;
    }
}

export const useAppReducer = () => {
    return useReducer(appReducer, initialState);
};