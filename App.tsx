
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MainMenu } from './components/MainMenu';
import { LevelSelection } from './components/LevelSelection';
import { Quiz } from './components/Quiz';
import { Results } from './components/Results';
import { LiveConversation } from './components/LiveConversation';
import { NameEntry } from './components/NameEntry';
import { FreePracticeMenu } from './components/FreePracticeMenu';
import { StudyAreaMenu } from './components/StudyAreaMenu';
import { LessonScreen } from './components/LessonScreen';
import { ParentDashboard } from './components/ParentDashboard';
import { PracticeHistory } from './components/PracticeHistory';
import { UserSelection, EditProfileModal } from './components/UserSelection';
import { GlobalHeader } from './components/common/GlobalHeader';
import { Modal } from './components/common/Modal';
import { DashboardModal } from './components/DashboardModal';
import { AvatarSelectorModal, type AvatarSelectorModalProps } from './components/AvatarSelectorModal';
import { FeedbackModal } from './components/FeedbackModal';
import { Onboarding } from './components/Onboarding';
import { DynamicBackground, type BackgroundTheme } from './components/common/DynamicBackground';
import { InteractiveMascot } from './components/common/InteractiveMascot'; // Import Mascot
import { useGameState } from './hooks/useGameState';
import { useAppReducer } from './hooks/useAppReducer';
import { useTheme } from './hooks/useTheme';
import type { Screen, QuizConfig, CategoryId, ConnectionStatus, StudentProfile, VoiceMode, Question, QuestionResult } from './types';
import { questions } from './data/questions';
import { lessons } from './data/lessons';
import { checkGeminiConnection, generatePersonalizedSuggestion } from './services/aiService';
import { SpeechProvider } from './context/SpeechContext';
import { MascotProvider } from './context/MascotContext'; // Import Provider
import { categoryNames } from './utils/constants';
import { shuffleArray } from './utils/array';
import { StudentDashboard } from './components/StudentDashboard';

const USER_LIST_KEY = 'maestroDigitalUserList';
const LAST_SCREEN_KEY_PREFIX = 'maestroDigitalLastScreen_';
const DEBUG_MODE_KEY = 'maestroDigitalDebugMode';
const MIN_SCORE_TO_UNLOCK = 8;

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}


export default function App() {
    const mainContentRef = useRef<HTMLElement>(null);
    const scrollPositionsRef = useRef<Record<string, number>>({});
    
    const [state, dispatch] = useAppReducer();
    const { screen, quizConfig, selectedCategory, finalResults, allUsers, currentUser, isFreeMode, lessonId, showPracticeSuggestion, openPeriods, isFeedbackModalOpen, isEditProfileModalOpen } = state;
    
    const [theme, toggleTheme] = useTheme();

    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('checking');
    const [isDebugMode, setIsDebugMode] = useState<boolean>(false);
    const [dashboardUser, setDashboardUser] = useState<StudentProfile | null>(null);
    const [avatarSelectorProps, setAvatarSelectorProps] = useState<Omit<AvatarSelectorModalProps, 'isOpen'> | null>(null);
    const [isOnboardingVisible, setIsOnboardingVisible] = useState(false);
    
    const [aiSuggestion, setAiSuggestion] = useState<{ text: string; isLoading: boolean; error: string | null }>({ text: '', isLoading: false, error: null });

    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm?: () => void;
        confirmVariant?: 'primary' | 'secondary' | 'special' | 'warning';
    }>({ isOpen: false, title: '', message: '' });

    const [isAiEnabled, setIsAiEnabled] = useState<boolean>(false);
    const [voiceMode, setVoiceMode] = useState<VoiceMode>('local');
    const [newContentNotifications, setNewContentNotifications] = useState<Partial<Record<CategoryId, boolean>>>({});

    const lessonIdToNameMap = useMemo(() => new Map(lessons.map(l => [l.id, l.title])), []);

    const { gameState, recordPracticeResult, addSkillRecord, unlockNextLevel, resetProgressForKey, recordUsedQuestions, clearUsedQuestions, unlockAllLevels, resetAllProgress, resetPracticeCategoryProgress, recordInteractiveExerciseState } = useGameState(currentUser?.id || null);
    const prevGameState = usePrevious(gameState);

    // --- Dynamic Theme Logic ---
    const activeTheme: BackgroundTheme = useMemo(() => {
        let category: string | undefined = undefined;

        // 1. Check if a category is directly selected
        if (selectedCategory) {
            category = selectedCategory;
        } 
        // 2. If in a lesson, find the lesson's category
        else if (lessonId) {
            const lesson = lessons.find(l => l.id === lessonId);
            if (lesson) category = lesson.categoryId;
        }
        // 3. If in a quiz (e.g. exam), try to infer or default
        else if (quizConfig) {
             if (quizConfig.categoryId) category = quizConfig.categoryId;
             else if (quizConfig.lessonId) {
                 const lesson = lessons.find(l => l.id === quizConfig.lessonId);
                 if (lesson) category = lesson.categoryId;
             }
        }

        if (!category) return 'default';

        if (['numeros', 'suma_resta', 'multi_divi', 'problemas'].includes(category)) {
            return 'math';
        } else if (['geometria'].includes(category)) {
            return 'geometry';
        } else if (['medidas', 'reloj'].includes(category)) {
            return 'measurements';
        }
        
        return 'default';
    }, [selectedCategory, lessonId, quizConfig]);


    const navigateTo = useCallback((newScreen: Screen) => {
        if (mainContentRef.current) {
            const key = screen === 'lesson' && lessonId 
                ? `lesson-${lessonId}` 
                : screen === 'level-selection' && selectedCategory
                ? `level-selection-${selectedCategory}`
                : screen;
            scrollPositionsRef.current[key] = mainContentRef.current.scrollTop;
        }
        dispatch({ type: 'SET_SCREEN', payload: newScreen });
    }, [screen, dispatch, lessonId, selectedCategory]);

    const showModal = useCallback((title: string, message: string, onConfirm?: () => void, confirmVariant: 'primary' | 'warning' = 'primary') => {
        setModalState({ isOpen: true, title, message, onConfirm, confirmVariant });
    }, []);

    const closeModal = useCallback(() => {
        setModalState({ isOpen: false, title: '', message: '' });
    }, []);

    useEffect(() => {
        const savedUsersRaw = localStorage.getItem(USER_LIST_KEY);
        if (savedUsersRaw) {
            const users = JSON.parse(savedUsersRaw);
            if (users && users.length > 0) {
                dispatch({ type: 'SET_ALL_USERS', payload: users });
                dispatch({ type: 'SET_SCREEN', payload: 'user-selection' });
            } else {
                dispatch({ type: 'SET_SCREEN', payload: 'name-entry' });
            }
        } else {
            dispatch({ type: 'SET_SCREEN', payload: 'name-entry' });
        }

        checkGeminiConnection().then(isOnline => {
            setConnectionStatus(isOnline ? 'online' : 'offline');
        });
        
        try {
            const savedDebug = localStorage.getItem(DEBUG_MODE_KEY);
            setIsDebugMode(savedDebug ? JSON.parse(savedDebug) : false);
        } catch {
            setIsDebugMode(false);
        }

    }, [dispatch]);
    
    useEffect(() => {
        localStorage.setItem(DEBUG_MODE_KEY, JSON.stringify(isDebugMode));
    }, [isDebugMode]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'd') {
                event.preventDefault();
                setIsDebugMode(prev => {
                    const newState = !prev;
                    console.log(`%c[Maestro Digital Debug] Modo de depuración ${newState ? 'ACTIVADO' : 'DESACTIVADO'}.`, `color: ${newState ? 'green' : 'red'}; font-weight: bold;`);
                    return newState;
                });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        if (currentUser) {
            const aiEnabledKey = `maestroDigitalAiEnabled_${currentUser.id}`;
            const voiceModeKey = `maestroDigitalVoiceMode_${currentUser.id}`;
            const newContentKey = `maestroDigitalNewContent_${currentUser.id}`;

            const savedAi = localStorage.getItem(aiEnabledKey);
            setIsAiEnabled(savedAi ? JSON.parse(savedAi) : false);

            const savedVoice = localStorage.getItem(voiceModeKey);
            setVoiceMode((savedVoice as VoiceMode) || 'local');

            const savedContent = localStorage.getItem(newContentKey);
            setNewContentNotifications(savedContent ? JSON.parse(savedContent) : {});
        } else {
            setIsAiEnabled(false);
            setVoiceMode('local');
            setNewContentNotifications({});
        }
    }, [currentUser]);
    
    useEffect(() => {
        if (currentUser && screen !== 'user-selection' && screen !== 'name-entry') {
            const lastScreenState = {
                screen,
                selectedCategory,
                lessonId,
                isFreeMode,
            };
            localStorage.setItem(`${LAST_SCREEN_KEY_PREFIX}${currentUser.id}`, JSON.stringify(lastScreenState));
        }
    }, [screen, selectedCategory, lessonId, isFreeMode, currentUser]);

    useEffect(() => {
        const mainEl = mainContentRef.current;
        if (mainEl) {
            const key = screen === 'lesson' && lessonId 
                ? `lesson-${lessonId}` 
                : screen === 'level-selection' && selectedCategory
                ? `level-selection-${selectedCategory}`
                : screen;
            const savedPosition = scrollPositionsRef.current[key];
            if (typeof savedPosition === 'number') {
                mainEl.scrollTop = savedPosition;
            } else {
                mainEl.scrollTop = 0;
            }
        }
    }, [screen, lessonId, selectedCategory]);

    useEffect(() => {
        if (!prevGameState || !currentUser) return;

        const allPeriods = [...new Set(lessons.map(l => l.period))].sort((a, b) => a - b);

        for (const periodNumber of allPeriods) {
            const lessonsInPeriod = lessons.filter(l => l.period === periodNumber);
            if (lessonsInPeriod.length === 0) continue;

            const wasPeriodComplete = lessonsInPeriod.every(pLesson => {
                const progress = prevGameState[pLesson.id];
                return (progress?.highScores?.[1] || 0) >= MIN_SCORE_TO_UNLOCK;
            });

            const isPeriodNowComplete = lessonsInPeriod.every(pLesson => {
                const progress = gameState[pLesson.id];
                return (progress?.highScores?.[1] || 0) >= MIN_SCORE_TO_UNLOCK;
            });

            if (!wasPeriodComplete && isPeriodNowComplete) {
                const nextPeriodNumber = periodNumber + 1;
                const hasNextPeriod = lessons.some(l => l.period === nextPeriodNumber);

                dispatch({ type: 'TOGGLE_PERIOD', payload: periodNumber });
                if (hasNextPeriod) {
                    dispatch({ type: 'TOGGLE_PERIOD', payload: nextPeriodNumber });
                }
            }
        }
    }, [gameState, prevGameState, currentUser, dispatch]);


    const unlockedPracticeCategories = useMemo(() => {
        const unlocked = new Set<CategoryId>();
    
        lessons.forEach(lesson => {
            const lessonProgress = gameState[lesson.id];
            if (lessonProgress) {
                const level1HighScore = lessonProgress.highScores?.[1] || 0;
                if (level1HighScore >= MIN_SCORE_TO_UNLOCK || lessonProgress.unlockedLevel > 1) {
                    unlocked.add(lesson.categoryId);
                }
            }
        });
    
        const allCategoryIds = Object.keys(questions) as CategoryId[];
        allCategoryIds.forEach(catId => {
            const practiceProgress = gameState[catId];
            if (practiceProgress && practiceProgress.unlockedLevel > 1) {
                unlocked.add(catId);
            }
        });
    
        return unlocked;
    }, [gameState]);

    const learnedQuestionsPool = useMemo(() => {
        const completedLessonIds = new Set<string>();
        lessons.forEach(lesson => {
            if ((gameState[lesson.id]?.highScores?.[1] || 0) >= MIN_SCORE_TO_UNLOCK) {
                completedLessonIds.add(lesson.id);
            }
        });

        let pool: Question[] = [];
        (Object.keys(questions) as CategoryId[]).forEach(catId => {
            Object.values(questions[catId]).forEach(levelQuestions => {
                levelQuestions.forEach(question => {
                    if (question.lessonId && completedLessonIds.has(question.lessonId)) {
                        pool.push(question);
                    }
                });
            });
        });
        
        return pool;
    }, [gameState]);

    const areExamsEnabled = useMemo(() => {
        return learnedQuestionsPool.length >= 5;
    }, [learnedQuestionsPool]);


    const handleToggleAi = () => {
        if (!currentUser) return;
        setIsAiEnabled(prev => {
            const newState = !prev;
            localStorage.setItem(`maestroDigitalAiEnabled_${currentUser.id}`, JSON.stringify(newState));
            return newState;
        });
    };

    const handleVoiceModeChange = (mode: VoiceMode) => {
        if (!currentUser) return;
        setVoiceMode(mode);
        localStorage.setItem(`maestroDigitalVoiceMode_${currentUser.id}`, mode);
    };

    const handleCreateProfile = (profileData: Omit<StudentProfile, 'id'>) => {
        const newUser: StudentProfile = { ...profileData, id: Date.now().toString(), hasCompletedOnboarding: false };
        const updatedUsers = [...allUsers, newUser];
        dispatch({ type: 'SET_ALL_USERS', payload: updatedUsers });
        localStorage.setItem(USER_LIST_KEY, JSON.stringify(updatedUsers));
        dispatch({ type: 'SET_CURRENT_USER', payload: newUser });
        navigateTo('main-menu');
        setIsOnboardingVisible(true);
    };

    const handleUpdateProfile = (updatedData: Partial<Omit<StudentProfile, 'id'>>) => {
        if (!currentUser) return;
        const updatedUser = { ...currentUser, ...updatedData };
        
        const updatedUsers = allUsers.map(u => u.id === currentUser.id ? updatedUser : u);
        
        dispatch({ type: 'SET_ALL_USERS', payload: updatedUsers });
        localStorage.setItem(USER_LIST_KEY, JSON.stringify(updatedUsers));
        dispatch({ type: 'SET_CURRENT_USER', payload: updatedUser });
        
        dispatch({ type: 'CLOSE_EDIT_PROFILE_MODAL' });
    };

    const handleSelectUser = (userId: string) => {
        const user = allUsers.find(u => u.id === userId);
        if (user) {
            dispatch({ type: 'SET_CURRENT_USER', payload: user });

            if (!user.hasCompletedOnboarding) {
                navigateTo('main-menu');
                setIsOnboardingVisible(true);
                return;
            }

            const lastScreenKey = `${LAST_SCREEN_KEY_PREFIX}${user.id}`;
            const savedStateRaw = localStorage.getItem(lastScreenKey);
            const nonRestorableScreens: Screen[] = ['quiz', 'results', 'name-entry', 'user-selection'];

            if (savedStateRaw) {
                try {
                    const savedState = JSON.parse(savedStateRaw);
                    if (savedState && savedState.screen && !nonRestorableScreens.includes(savedState.screen)) {
                         dispatch({ type: 'SELECT_CATEGORY', payload: { categoryId: savedState.selectedCategory, isFreeMode: savedState.isFreeMode || false } });
                         if(savedState.lessonId) dispatch({ type: 'SELECT_LESSON', payload: savedState.lessonId });
                         navigateTo(savedState.screen);
                        return; 
                    }
                } catch (e) {
                    console.error("Error parsing saved screen state:", e);
                }
            }
            // Fallback to main menu if no restorable state is found
            navigateTo('main-menu');
        }
    };
    
    const handleAddNewUser = () => {
        navigateTo('name-entry');
    };

    const handleSwitchUser = () => {
        dispatch({ type: 'SET_CURRENT_USER', payload: null });
        navigateTo('user-selection');
    };

    const handleFinishOnboarding = useCallback(() => {
        setIsOnboardingVisible(false);
        if (currentUser) {
            const updatedUser = { ...currentUser, hasCompletedOnboarding: true };
            const updatedUsers = allUsers.map(u => u.id === currentUser.id ? updatedUser : u);
            
            dispatch({ type: 'SET_ALL_USERS', payload: updatedUsers });
            localStorage.setItem(USER_LIST_KEY, JSON.stringify(updatedUsers));
            dispatch({ type: 'SET_CURRENT_USER', payload: updatedUser });
        }
    }, [currentUser, allUsers, dispatch]);

    const handleSelectCategory = useCallback((categoryId: CategoryId) => {
        if (!currentUser) return;
        dispatch({ type: 'SELECT_CATEGORY', payload: { categoryId, isFreeMode: false } });

        if (newContentNotifications[categoryId]) {
            setNewContentNotifications(prev => {
                const newNotifs = { ...prev };
                delete newNotifs[categoryId];
                localStorage.setItem(`maestroDigitalNewContent_${currentUser.id}`, JSON.stringify(newNotifs));
                return newNotifs;
            });
        }
        navigateTo('level-selection');
    }, [newContentNotifications, currentUser, dispatch, navigateTo]);

    const handleSelectCategoryForFreePractice = useCallback((categoryId: CategoryId) => {
        dispatch({ type: 'SELECT_CATEGORY', payload: { categoryId, isFreeMode: true } });
        navigateTo('level-selection');
    }, [dispatch, navigateTo]);
    
    const handleStartPractice = useCallback((categoryId: CategoryId, level: number) => {
        if (mainContentRef.current && selectedCategory) {
            const key = `level-selection-${selectedCategory}`;
            scrollPositionsRef.current[key] = mainContentRef.current.scrollTop;
        }

        const fullQuestionPool = (questions[categoryId][level] || []).map((q, index) => ({ question: q, originalIndex: index }));

        const completedLessonIds = lessons
            .filter(l => l.categoryId === categoryId && (gameState[l.id]?.highScores?.[1] || 0) >= MIN_SCORE_TO_UNLOCK)
            .map(l => l.id);
        
        const parentUnlockedLevel = gameState[categoryId]?.unlockedLevel || 1;

        const unlockedPool = fullQuestionPool.filter(item => {
            if (!item.question.lessonId) return true;
            if (completedLessonIds.includes(item.question.lessonId)) return true;
            if (parentUnlockedLevel >= level) return true;
            return false;
        });

        if (unlockedPool.length === 0) {
            alert("¡Aún no has desbloqueado suficientes lecciones en el Área de Estudio para practicar este nivel!");
            return;
        }

        let usedIndices = gameState[categoryId]?.usedQuestions?.[level] || [];
        let availablePool = unlockedPool.filter(item => !usedIndices.includes(item.originalIndex));
        
        if (availablePool.length === 0) {
            clearUsedQuestions(categoryId, level);
            availablePool = unlockedPool;
        }
        
        const quizItems = shuffleArray(availablePool).slice(0, 10);
        const practiceQuestions = quizItems.map(item => item.question);
        const questionIndices = quizItems.map(item => item.originalIndex);

        dispatch({
            type: 'START_QUIZ',
            payload: {
                type: 'practice',
                categoryId,
                level,
                name: `${categoryNames[categoryId]} - Nivel ${level}`,
                questions: practiceQuestions,
                origin: 'level-selection',
                questionIndices: questionIndices
            }
        });
        navigateTo('quiz');
    }, [gameState, clearUsedQuestions, dispatch, navigateTo, selectedCategory]);

    const handleStartLessonPractice = useCallback((lessonId: string, level: number) => {
        if (mainContentRef.current && lessonId) {
            const key = `lesson-${lessonId}`;
            scrollPositionsRef.current[key] = mainContentRef.current.scrollTop;
        }
        const lesson = lessons.find(l => l.id === lessonId);
        if (!lesson || !lesson.practice[level]) return;
    
        const fullQuestionPool = (lesson.practice[level] || []).map((q, index) => ({ question: q, originalIndex: index }));
    
        let usedIndices = gameState[lessonId]?.usedQuestions?.[level] || [];
        let availablePool = fullQuestionPool.filter(item => !usedIndices.includes(item.originalIndex));
    
        if (availablePool.length === 0 && fullQuestionPool.length > 0) {
            clearUsedQuestions(lessonId, level);
            availablePool = fullQuestionPool;
        }
    
        const quizItems = shuffleArray(availablePool).slice(0, 10);
        const practiceQuestions = quizItems.map(item => item.question);
        const questionIndices = quizItems.map(item => item.originalIndex);
    
        dispatch({
            type: 'START_QUIZ',
            payload: {
                type: 'lesson',
                level,
                name: `${lesson.title} - Nivel ${level}`,
                questions: practiceQuestions,
                origin: 'lesson',
                lessonId: lesson.id,
                questionIndices: questionIndices,
            }
        });
        navigateTo('quiz');
    }, [gameState, clearUsedQuestions, dispatch, navigateTo]);

    const handleStartWeeklyExam = useCallback(() => {
        if (!areExamsEnabled) {
            alert("¡Aún no has aprendido suficiente contenido para un examen!");
            return;
        }
        const examQuestions = shuffleArray(learnedQuestionsPool).slice(0, 10);
        dispatch({
            type: 'START_QUIZ',
            payload: {
                type: 'exam',
                name: 'Examen Semanal',
                questions: examQuestions,
                origin: 'main-menu',
            }
        });
        navigateTo('quiz');
    }, [areExamsEnabled, learnedQuestionsPool, dispatch, navigateTo]);

    const handleStartRefreshExam = useCallback(() => {
        if (!areExamsEnabled) {
            alert("¡Completa al menos una lección para poder refrescar la memoria!");
            return;
        }
        const examQuestions = shuffleArray(learnedQuestionsPool).slice(0, 5);
        dispatch({
            type: 'START_QUIZ',
            payload: {
                type: 'exam',
                name: 'Refrescar Memoria',
                questions: examQuestions,
                origin: 'main-menu'
            }
        });
        navigateTo('quiz');
    }, [areExamsEnabled, learnedQuestionsPool, dispatch, navigateTo]);

    const handleStartQuickChallenge = useCallback(() => {
        if (!areExamsEnabled) {
             alert("¡Completa al menos una lección para poder jugar al Desafío Rápido!");
            return;
        }
        const challengeQuestions = shuffleArray(learnedQuestionsPool).slice(0, 5);
        dispatch({
            type: 'START_QUIZ',
            payload: {
                type: 'exam',
                name: 'Desafío Rápido',
                questions: challengeQuestions,
                origin: 'main-menu'
            }
        });
        navigateTo('quiz');
    }, [areExamsEnabled, learnedQuestionsPool, dispatch, navigateTo]);


    const handleQuizEnd = useCallback((results: QuestionResult[]) => {
        if (!currentUser || !quizConfig) return;

        const score = results.filter(r => r.correct).length;
        const total = results.length;
        const totalTime = results.reduce((sum, r) => sum + r.time, 0);

        let key: string | undefined;
        let level: number | undefined;
        let skillKey: string | undefined;
        let lessonIdForRecord: string | undefined;

        if (quizConfig.type === 'practice' && quizConfig.categoryId && quizConfig.level) {
            key = quizConfig.categoryId;
            level = quizConfig.level;
            skillKey = quizConfig.categoryId;
            if (quizConfig.questionIndices) recordUsedQuestions(key, level, quizConfig.questionIndices);
        } else if (quizConfig.type === 'lesson' && quizConfig.lessonId && quizConfig.level) {
            key = quizConfig.lessonId;
            level = quizConfig.level;
            const lesson = lessons.find(l => l.id === quizConfig.lessonId);
            skillKey = lesson?.categoryId;
            lessonIdForRecord = key;
            if (quizConfig.questionIndices) recordUsedQuestions(key, level, quizConfig.questionIndices);
        } else if (quizConfig.type === 'exam' && quizConfig.name) {
             const examKeyMap: Record<string, string> = { 'Examen Semanal': 'exam_weekly', 'Refrescar Memoria': 'exam_refresh', 'Desafío Rápido': 'exam_quick' };
            key = examKeyMap[quizConfig.name] || 'exam_other';
            level = 1;
            skillKey = key;
        }

        if (key && level && skillKey) {
            const accuracy = total > 0 ? score / total : 0;
            const timePerQuestion = total > 0 ? totalTime / total : 0;
            let skillScore = accuracy * 1000 + ((15 - timePerQuestion) * 10);
            
            if (quizConfig.type === 'practice' || quizConfig.type === 'lesson') {
                skillScore *= (1 + (level - 1) * 0.25);
                const categoryState = gameState[skillKey as CategoryId];
                skillScore *= (1 + ((categoryState?.contentVersion || 1) - 1) * 0.2);
            }
            
            skillScore = Math.max(0, skillScore);
            addSkillRecord(skillKey, skillScore, level, quizConfig.type, totalTime, results, lessonIdForRecord);

            if ((quizConfig.type === 'practice' && !isFreeMode) || quizConfig.type === 'lesson' || quizConfig.type === 'exam') {
                recordPracticeResult(key, level, score, total);
            }
            
            if (quizConfig.type === 'lesson' && quizConfig.lessonId) {
                const lesson = lessons.find(l => l.id === quizConfig.lessonId);
                const previousHighScore = gameState[quizConfig.lessonId]?.highScores?.[1] || 0;

                if (lesson) {
                     if (quizConfig.level === 1 && previousHighScore < MIN_SCORE_TO_UNLOCK && score >= MIN_SCORE_TO_UNLOCK) {
                        setNewContentNotifications(prev => {
                            const newNotifs = { ...prev, [lesson.categoryId]: true };
                            localStorage.setItem(`maestroDigitalNewContent_${currentUser.id}`, JSON.stringify(newNotifs));
                            return newNotifs;
                        });
                        resetPracticeCategoryProgress(lesson.categoryId);
                    }

                    const allPracticeLevels = Object.keys(lesson.practice).map(Number);
                    const lessonProgress = gameState[lesson.id];
                    const areAllLevelsCompleted = allPracticeLevels.every(lvl => {
                        const currentHighScore = lessonProgress?.highScores?.[lvl] || 0;
                        return (lvl === level) ? Math.max(currentHighScore, score) >= MIN_SCORE_TO_UNLOCK : currentHighScore >= MIN_SCORE_TO_UNLOCK;
                    });
                     if (areAllLevelsCompleted) {
                        dispatch({ type: 'SET_SHOW_PRACTICE_SUGGESTION', payload: { categoryId: lesson.categoryId, categoryName: categoryNames[lesson.categoryId] } });
                    }
                }
            }
        }

        dispatch({ type: 'END_QUIZ', payload: results });
        navigateTo('results');
    }, [currentUser, quizConfig, recordPracticeResult, addSkillRecord, recordUsedQuestions, gameState, isFreeMode, resetPracticeCategoryProgress, dispatch, navigateTo]);

    const handleGenerateSuggestion = useCallback(async () => {
        if (!currentUser) return;
        setAiSuggestion({ text: '', isLoading: true, error: null });
        try {
            const suggestion = await generatePersonalizedSuggestion(gameState, currentUser);
            setAiSuggestion({ text: suggestion, isLoading: false, error: null });
        } catch (error) {
            const message = error instanceof Error ? error.message : "No se pudo generar el consejo.";
            setAiSuggestion({ text: '', isLoading: false, error: `Error: ${message}` });
        }
    }, [currentUser, gameState]);


    const handleBackToMenu = useCallback(() => dispatch({ type: 'GO_TO_MAIN_MENU' }), [dispatch]);
    const handleBackToStudyArea = useCallback(() => navigateTo('study-area'), [navigateTo]);
    const handleBackToLesson = useCallback(() => dispatch({ type: 'GO_TO_LESSON' }), [dispatch]);
    const handleBackToLevelSelection = useCallback(() => dispatch({ type: 'GO_TO_LEVEL_SELECTION' }), [dispatch]);
    const handleStartLiveConversation = useCallback(() => navigateTo('live-conversation'), [navigateTo]);
    const handleStartFreePractice = useCallback(() => navigateTo('free-practice-menu'), [navigateTo]);
    const handleBackToFreePracticeMenu = useCallback(() => navigateTo('free-practice-menu'), [navigateTo]);
    const handleGoToDashboard = useCallback(() => navigateTo('student-dashboard'), [navigateTo]);

    const handleStartStudyArea = useCallback(() => {
        const allSubmodulesFlat = lessons.filter(l => l.period);
        const processedSubmodules = new Map<string, {isCompleted: boolean}>();

        for (const submodule of allSubmodulesFlat) {
            const progress = gameState[submodule.id];
            const isCompleted = (progress?.highScores?.[1] || 0) >= MIN_SCORE_TO_UNLOCK;
            processedSubmodules.set(submodule.id, { isCompleted });
        }
        
        const processedStudyPlan = [...new Set(lessons.map(l => l.period))].sort((a,b) => a-b).map(pNum => {
            const allSubmodulesInPeriod = lessons.filter(l => l.period === pNum);
            const isPeriodCompleted = allSubmodulesInPeriod.every(sm => processedSubmodules.get(sm.id)?.isCompleted);
            return { period: pNum, isCompleted: isPeriodCompleted };
        });

        const firstUncompletedPeriod = processedStudyPlan.find(p => !p.isCompleted);
        const initialOpenState: Record<number, boolean> = {};
        processedStudyPlan.forEach(p => initialOpenState[p.period] = false);
        
        if (firstUncompletedPeriod) initialOpenState[firstUncompletedPeriod.period] = true;
        else if (processedStudyPlan.length > 0) initialOpenState[processedStudyPlan[processedStudyPlan.length - 1].period] = true;
        
        dispatch({ type: 'GO_TO_STUDY_AREA', payload: initialOpenState });
    }, [gameState, dispatch]);

    const handleTogglePeriod = useCallback((periodNumber: number) => dispatch({ type: 'TOGGLE_PERIOD', payload: periodNumber }), [dispatch]);
    const handleSelectSubmodule = useCallback((submoduleId: string) => {
        dispatch({ type: 'SELECT_LESSON', payload: submoduleId });
        navigateTo('lesson');
    }, [dispatch, navigateTo]);
    const handleGoToParentDashboard = useCallback(() => navigateTo('parent-dashboard'), [navigateTo]);
    const handleViewPracticeHistory = useCallback((categoryId: CategoryId) => {
        dispatch({ type: 'SELECT_CATEGORY', payload: { categoryId, isFreeMode: true } }); // isFreeMode doesn't matter here
        navigateTo('practice-history');
    }, [dispatch, navigateTo]);
    const handleOpenDashboard = useCallback((user: StudentProfile) => {
        setDashboardUser(user);
    }, []);
    const handleGoToPracticeFromSuggestion = useCallback((categoryId: CategoryId) => {
        handleSelectCategory(categoryId);
    }, [handleSelectCategory]);

    const handleStartNextLevel = useCallback(() => {
        if (!quizConfig || quizConfig.level === undefined) return;
        const nextLevel = quizConfig.level + 1;
        if (quizConfig.type === 'practice' && quizConfig.categoryId && questions[quizConfig.categoryId]?.[nextLevel]) {
            handleStartPractice(quizConfig.categoryId, nextLevel);
        } else if (quizConfig.type === 'lesson' && quizConfig.lessonId) {
            const lesson = lessons.find(l => l.id === quizConfig.lessonId);
            if (lesson?.practice?.[nextLevel]) handleStartLessonPractice(quizConfig.lessonId, nextLevel);
        }
    }, [quizConfig, handleStartPractice, handleStartLessonPractice]);
    
    const currentLesson = useMemo(() => lessonId ? lessons.find(l => l.id === lessonId) || null : null, [lessonId]);

    const screenConfig = useMemo(() => {
        const backFromResults = () => {
            if (quizConfig?.origin === 'lesson') return handleBackToLesson();
            if (quizConfig?.origin === 'level-selection') return handleBackToLevelSelection();
            return handleBackToMenu();
        };
        const backFromQuiz = backFromResults;

        switch (screen) {
            case 'user-selection':
                return { component: <UserSelection users={allUsers} onSelectUser={handleSelectUser} onAddNewUser={handleAddNewUser} theme={theme} onToggleTheme={toggleTheme} onOpenDashboard={handleOpenDashboard} />, showHeader: false, allowScroll: true };
            case 'name-entry':
                return { component: <NameEntry onProfileSubmit={handleCreateProfile} onBack={handleSwitchUser} showBackButton={allUsers.length > 0} theme={theme} onToggleTheme={toggleTheme} setAvatarSelectorProps={setAvatarSelectorProps} />, showHeader: false, allowScroll: true };
            case 'main-menu':
                 return { component: <MainMenu studentProfile={currentUser} gameState={gameState} onSelectCategory={handleSelectCategory} onStartWeeklyExam={handleStartWeeklyExam} onStartRefreshExam={handleStartRefreshExam} onStartQuickChallenge={handleStartQuickChallenge} onStartLiveConversation={handleStartLiveConversation} onStartFreePractice={handleStartFreePractice} onStartStudyArea={handleStartStudyArea} onGoToParentDashboard={handleGoToParentDashboard} onViewHistory={handleViewPracticeHistory} connectionStatus={connectionStatus} isAiEnabled={isAiEnabled} unlockedPracticeCategories={unlockedPracticeCategories} newContentNotifications={newContentNotifications} areExamsEnabled={areExamsEnabled} aiSuggestion={aiSuggestion} onGenerateSuggestion={handleGenerateSuggestion} onGoToDashboard={handleGoToDashboard} />, showHeader: true };
            case 'free-practice-menu':
                return { component: <FreePracticeMenu onSelectCategory={handleSelectCategoryForFreePractice} />, title: 'Práctica Libre', onBack: handleBackToMenu, showHeader: true };
            case 'study-area':
                return { component: <StudyAreaMenu onSelectSubmodule={handleSelectSubmodule} gameState={gameState} openPeriods={openPeriods} onTogglePeriod={handleTogglePeriod} />, title: 'Área de Estudio', onBack: handleBackToMenu, showHeader: true };
            case 'lesson':
                if (!currentLesson || !currentUser) return { component: null, showHeader: false };
                return { component: <LessonScreen lesson={currentLesson} onStartPractice={handleStartLessonPractice} gameState={gameState} isAiEnabled={isAiEnabled} studentProfile={currentUser} recordInteractiveExerciseState={recordInteractiveExerciseState} isDebugMode={isDebugMode} />, title: currentLesson.title, onBack: handleBackToStudyArea, showHeader: true };
            case 'level-selection':
                if (!selectedCategory) return { component: null, showHeader: false };
                return { component: <LevelSelection categoryId={selectedCategory} gameState={gameState} onStartPractice={handleStartPractice} isFreeMode={isFreeMode} />, title: categoryNames[selectedCategory], onBack: isFreeMode ? handleBackToFreePracticeMenu : handleBackToMenu, showHeader: true };
            case 'quiz':
                if (!quizConfig || !currentUser) return { component: null, showHeader: false };
                return { component: <Quiz quizConfig={quizConfig} onQuizEnd={handleQuizEnd} onBack={backFromQuiz} isAiEnabled={isAiEnabled} studentProfile={currentUser} isDebugMode={isDebugMode} />, title: quizConfig.name, onBack: backFromQuiz, showHeader: true };
            case 'results':
                if (!finalResults) return { component: null, showHeader: false };
                return { component: <Results results={finalResults} onBack={backFromResults} practiceSuggestion={showPracticeSuggestion} onGoToPractice={handleGoToPracticeFromSuggestion} onGoToMainMenu={handleBackToMenu} onGoToStudyArea={handleBackToStudyArea} quizConfig={quizConfig} onStartNextLevel={handleStartNextLevel} />, title: 'Resultados', onBack: backFromResults, showHeader: true };
            case 'live-conversation':
                 if (!currentUser) return { component: null, showHeader: false };
                 return { component: <LiveConversation studentProfile={currentUser} onBack={handleBackToMenu} isAiEnabled={isAiEnabled} connectionStatus={connectionStatus} />, title: 'Charla con el Maestro', onBack: handleBackToMenu, showHeader: true };
            case 'parent-dashboard':
                if (!currentUser) return { component: null, showHeader: false };
                return { component: <ParentDashboard studentProfile={currentUser} gameState={gameState} onUnlockNextLevel={unlockNextLevel} onResetProgress={resetProgressForKey} onUnlockAll={unlockAllLevels} onResetAll={resetAllProgress} showModal={showModal} onOpenFeedbackModal={() => dispatch({ type: 'OPEN_FEEDBACK_MODAL' })} />, title: 'Panel de Padres', onBack: handleBackToMenu, showHeader: true };
            case 'practice-history':
                if (!selectedCategory) return { component: null, showHeader: false };
                return { component: <PracticeHistory categoryId={selectedCategory} gameState={gameState} onBack={handleBackToMenu} lessonIdToNameMap={lessonIdToNameMap} />, title: `Historial: ${categoryNames[selectedCategory]}`, onBack: handleBackToMenu, showHeader: true };
            case 'student-dashboard':
                if (!currentUser) return { component: null, showHeader: false };
                return { component: <StudentDashboard studentProfile={currentUser} gameState={gameState} />, title: 'Panel de Progreso', onBack: handleBackToMenu, showHeader: true };
            default:
                 return { component: null, showHeader: false };
        }
    }, [screen, allUsers, currentUser, gameState, unlockedPracticeCategories, newContentNotifications, areExamsEnabled, openPeriods, handleSelectCategory, handleStartWeeklyExam, handleStartRefreshExam, handleStartQuickChallenge, handleStartLiveConversation, handleStartFreePractice, handleStartStudyArea, connectionStatus, isAiEnabled, handleCreateProfile, handleSelectCategoryForFreePractice, handleBackToMenu, selectedCategory, handleStartPractice, isFreeMode, quizConfig, handleQuizEnd, finalResults, currentLesson, handleSelectSubmodule, handleStartLessonPractice, handleBackToStudyArea, handleBackToLesson, handleGoToParentDashboard, unlockNextLevel, resetProgressForKey, unlockAllLevels, resetAllProgress, handleViewPracticeHistory, handleTogglePeriod, isDebugMode, showPracticeSuggestion, handleGoToPracticeFromSuggestion, lessonIdToNameMap, navigateTo, handleBackToFreePracticeMenu, handleSwitchUser, handleAddNewUser, handleSelectUser, showModal, handleStartNextLevel, handleBackToLevelSelection, aiSuggestion, handleGenerateSuggestion, dispatch, theme, toggleTheme, recordInteractiveExerciseState, handleGoToDashboard, handleOpenDashboard, setAvatarSelectorProps]);
    
    return (
        <SpeechProvider voiceMode={voiceMode}>
        <MascotProvider>
            <DynamicBackground theme={activeTheme} />
            <div className="flex justify-center items-center min-h-screen p-4">
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-4xl text-slate-700 dark:text-slate-300 border border-white/20 dark:border-slate-700/50 flex flex-col h-[95vh] max-h-[95vh] overflow-hidden relative z-10">
                    {screenConfig.showHeader && (
                        <GlobalHeader
                            onBack={screenConfig.onBack}
                            title={screenConfig.title}
                            connectionStatus={connectionStatus}
                            isAiEnabled={isAiEnabled}
                            onToggleAi={handleToggleAi}
                            voiceMode={voiceMode}
                            onVoiceModeChange={handleVoiceModeChange}
                            studentProfile={currentUser}
                            onSwitchUser={handleSwitchUser}
                            onOpenEditProfile={() => dispatch({ type: 'OPEN_EDIT_PROFILE_MODAL' })}
                            isDebugMode={isDebugMode}
                            theme={theme}
                            onToggleTheme={toggleTheme}
                        />
                    )}
                    <main 
                        ref={mainContentRef} 
                        className="flex-grow overflow-y-auto"
                    >
                        <div className="min-h-full flex flex-col">
                            <div className="flex-grow flex flex-col p-4 sm:p-6 sm:pb-4">
                                {screenConfig.component && (
                                    <div key={`${screen}-${selectedCategory}-${lessonId}`} className="w-full">
                                        {screenConfig.component}
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            {/* Interactive Mascot sits outside the main container but inside the provider */}
            <InteractiveMascot activeTheme={activeTheme} />

            <Modal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                title={modalState.title}
                onConfirm={modalState.onConfirm}
                confirmVariant={modalState.confirmVariant}
            >
                <p>{modalState.message}</p>
            </Modal>
            {isFeedbackModalOpen && <FeedbackModal onClose={() => dispatch({ type: 'CLOSE_FEEDBACK_MODAL' })} />}
            {isEditProfileModalOpen && currentUser && (
                <EditProfileModal
                    isOpen={isEditProfileModalOpen}
                    onClose={() => dispatch({ type: 'CLOSE_EDIT_PROFILE_MODAL' })}
                    currentUser={currentUser}
                    onSave={handleUpdateProfile}
                />
            )}
            {dashboardUser && <DashboardModal user={dashboardUser} onClose={() => setDashboardUser(null)} />}
            {avatarSelectorProps && <AvatarSelectorModal isOpen={true} {...avatarSelectorProps} />}
            {isOnboardingVisible && currentUser && (
                <Onboarding user={currentUser} onFinish={handleFinishOnboarding} />
            )}
        </MascotProvider>
        </SpeechProvider>
    );
}
