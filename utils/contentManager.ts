import { lessons as defaultLessons } from '../data/lessons';
import { questions as defaultQuestions } from '../data/questions';
import { taxonomyData as defaultTaxonomy } from '../data/taxonomy';
import type { LessonContent, CategoryId, Question, AppTaxonomy } from '../types';

const LESSONS_KEY = 'maestroDigitalContent_lessons';
const QUESTIONS_KEY = 'maestroDigitalContent_questions';
const TAXONOMY_KEY = 'maestroDigitalContent_taxonomy';

export const contentManager = {
    getTaxonomy: (): AppTaxonomy => {
        try {
            const saved = localStorage.getItem(TAXONOMY_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Quick migration if it has Primer Grado but no Tercer Grado
                if (parsed.grades && parsed.grades.find((g: any) => g.id === 'grado-1') && !parsed.grades.find((g: any) => g.id === 'grado-3')) {
                    parsed.grades = parsed.grades.map((g: any) => g.id === 'grado-1' ? { id: 'grado-3', name: 'Tercer Grado' } : g);
                    parsed.subjects = parsed.subjects.map((s: any) => s.gradeId === 'grado-1' ? { ...s, gradeId: 'grado-3' } : s);
                    // Also update student profiles referencing grado-1 dynamically if needed elsewhere, 
                    // or just return the mutated taxonomy. (Profiles might still reference grado-1, they'll fall back to default).
                }
                return parsed;
            }
        } catch (e) {
            console.error("Failed to parse taxonomy from local storage", e);
        }
        return defaultTaxonomy;
    },

    saveTaxonomy: async (taxonomy: AppTaxonomy, destination: 'local' | 'server' = 'local') => {
        if (destination === 'local') {
            localStorage.setItem(TAXONOMY_KEY, JSON.stringify(taxonomy));
        } else {
            // Save to server
            try {
                const res = await fetch('/api/save-content', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: 'taxonomy', data: taxonomy })
                });
                if (!res.ok) throw new Error("Servidor respondió con error");
                // Clear local on successful server save
                localStorage.removeItem(TAXONOMY_KEY);
            } catch (e) {
                console.error("Failed to save taxonomy to source", e);
                throw e;
            }
        }
    },

    getCategoryNamesMap: (): Record<string, string> => {
        const taxonomy = contentManager.getTaxonomy();
        const map: Record<string, string> = {};
        taxonomy.categories.forEach(cat => { map[cat.id] = cat.name; });
        return map;
    },

    getLessons: (): LessonContent[] => {
        try {
            const saved = localStorage.getItem(LESSONS_KEY);
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error("Failed to parse lessons from local storage", e);
        }
        return defaultLessons;
    },
    
    getQuestions: (): Record<CategoryId, Record<number, Question[]>> => {
        try {
            const saved = localStorage.getItem(QUESTIONS_KEY);
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error("Failed to parse questions from local storage", e);
        }
        return defaultQuestions;
    },

    isCustomized: (type: 'lessons' | 'questions' | 'taxonomy'): boolean => {
        switch (type) {
            case 'lessons': return !!localStorage.getItem(LESSONS_KEY);
            case 'questions': return !!localStorage.getItem(QUESTIONS_KEY);
            case 'taxonomy': return !!localStorage.getItem(TAXONOMY_KEY);
            default: return false;
        }
    },

    saveLessons: async (lessons: LessonContent[], destination: 'local' | 'server' = 'local') => {
        if (destination === 'local') {
            localStorage.setItem(LESSONS_KEY, JSON.stringify(lessons));
        } else {
            // Save to server
            try {
                const res = await fetch('/api/save-content', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: 'lessons', data: lessons })
                });
                if (!res.ok) throw new Error("Servidor respondió con error");
                // Clear local if we successfully save to server to avoid confusion
                localStorage.removeItem(LESSONS_KEY);
            } catch (e) {
                console.error("Failed to save lessons to source", e);
                throw e;
            }
        }
    },

    saveQuestions: async (questions: Record<CategoryId, Record<number, Question[]>>, destination: 'local' | 'server' = 'local') => {
        if (destination === 'local') {
            localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
        } else {
            // Save to server
            try {
                const res = await fetch('/api/save-content', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: 'questions', data: questions })
                });
                if (!res.ok) throw new Error("Servidor respondió con error");
                // Clear local if we successfully save to server
                localStorage.removeItem(QUESTIONS_KEY);
                console.log("Questions saved to server and local cleared.");
            } catch (e) {
                console.error("Failed to save questions to source", e);
                throw e;
            }
        }
    },

    resetToDefault: () => {
        console.log("Resetting all content to defaults...");
        localStorage.removeItem(LESSONS_KEY);
        localStorage.removeItem(QUESTIONS_KEY);
        localStorage.removeItem(TAXONOMY_KEY);
        
        // Final sweep to catch any edge cases with key naming or leftovers
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('maestroDigitalContent_')) {
                localStorage.removeItem(key);
            }
        });
        console.log("All local overrides cleared.");
    },

    resetSection: (section: 'lessons' | 'questions' | 'taxonomy') => {
        console.log(`Resetting section: ${section}`);
        const key = section === 'lessons' ? LESSONS_KEY : 
                    section === 'questions' ? QUESTIONS_KEY : 
                    TAXONOMY_KEY;
        localStorage.removeItem(key);
        console.log(`Cleared key: ${key}`);
    },

    getOriginalDefaults: () => {
        // Return deep clones to ensure React detects changes correctly
        return {
            lessons: JSON.parse(JSON.stringify(defaultLessons)),
            questions: JSON.parse(JSON.stringify(defaultQuestions)),
            taxonomy: JSON.parse(JSON.stringify(defaultTaxonomy))
        };
    }
};
