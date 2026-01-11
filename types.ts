import type { LiveServerMessage } from '@google/genai';

export type Screen = 'main-menu' | 'level-selection' | 'quiz' | 'results' | 'live-conversation' | 'name-entry' | 'free-practice-menu' | 'study-area' | 'lesson' | 'parent-dashboard' | 'practice-history' | 'user-selection' | 'student-dashboard';

export type CategoryId = 'numeros' | 'suma_resta' | 'multi_divi' | 'problemas' | 'geometria' | 'medidas' | 'reloj';

export type ConnectionStatus = 'checking' | 'online' | 'offline';

export type VoiceMode = 'auto' | 'local' | 'online';

export interface Question {
    type: 'mcq' | 'input';
    question: string;
    options?: { text: string; imageUrl?: string }[] | string[];
    answer: string;
    explanation?: string;
    hints?: string[];
    imageUrl?: string;
    lessonId?: string;
}

export interface QuestionResult {
    question: string;
    userAnswer: string;
    correctAnswer: string;
    correct: boolean;
    time: number;
    hintsUsed?: number;
}

export type ExerciseType = 'match-pairs' | 'fill-in-the-blanks' | 'fill-in-the-text' | 'number-line' | 'choose-the-operation';

export interface MatchPairsExercise {
    type: 'match-pairs';
    title: string;
    pairs: {
        term: string;
        definition: string;
    }[];
}

export interface FillInTheBlanksExercise {
    type: 'fill-in-the-blanks';
    title: string;
    textWithBlanks: string; // e.g., "A square has __BLANK__ equal sides and __BLANK__ right angles."
    blanks: {
        correctAnswer: string;
        options: string[];
    }[];
}

export interface FillInTheTextExercise {
    type: 'fill-in-the-text';
    title: string;
    textWithInputs: string; // e.g., "María tiene __INPUT__ galletas. Si se come 3, le quedan __INPUT__."
    correctAnswers: string[];
}

export interface NumberLineExercise {
    type: 'number-line';
    title: string;
    min: number;
    max: number;
    items: {
        value: number;
        label: string;
    }[];
}

export interface ChooseTheOperationExercise {
    type: 'choose-the-operation';
    title: string;
    problems: {
        text: string;
        correctOperation: '+' | '-' | 'x' | '÷';
    }[];
}


export type InteractiveExercise = MatchPairsExercise | FillInTheBlanksExercise | FillInTheTextExercise | NumberLineExercise | ChooseTheOperationExercise;

export interface LessonContent {
    id: string;
    title: string;
    period: number;
    categoryId: CategoryId;
    theory: string;
    practice: Record<number, Question[]>; 
    interactiveExercises?: InteractiveExercise[];
}

export interface QuizConfig {
    type: 'practice' | 'exam' | 'lesson';
    categoryId?: CategoryId;
    level?: number;
    name: string;
    questions: Question[];
    origin?: 'level-selection' | 'main-menu' | 'lesson';
    lessonId?: string;
    questionIndices?: number[];
}

export interface CategoryGameState {
    unlockedLevel: number;
    highScores: { [level: number]: number };
    skillHistory: { 
        score: number; 
        timestamp: number; 
        level: number; 
        type: 'lesson' | 'practice' | 'exam';
        contentVersion?: number; 
        totalTime: number;
        results?: QuestionResult[]; // Detailed results
        lessonId?: string; // Reference to the lesson if the quiz came from one
    }[];
    usedQuestions: { [level: number]: number[] };
    contentVersion?: number;
    interactiveExerciseState?: Record<number, any>;
}

export interface GameState {
    [key:string]: CategoryGameState;
}

export interface TranscriptEntry {
    id: number;
    source: 'user' | 'model';
    text: string;
    isFinal: boolean;
    imageUrl?: string;
}

export interface StudentProfile {
    id: string;
    name: string;
    age: number;
    gender: 'boy' | 'girl';
    avatar?: string;
    hasCompletedOnboarding?: boolean;
}

// Types for Study Plan
export interface Submodule {
  id: string;
  title: string;
  isLocked?: boolean;
  isCompleted?: boolean;

  isMastered?: boolean;
  levelProgress?: boolean[];
}

export interface Module {
  id: string;
  title: string;
  icon: string;
  submodules: Submodule[];
}

export interface PeriodPlan {
  period: number;
  title: string;
  modules: Module[];
}