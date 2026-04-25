import { lessons as defaultLessons } from '../data/lessons';
import { questions as defaultQuestions } from '../data/questions';
import type { LessonContent, CategoryId, Question, AppTaxonomy } from '../types';

const LESSONS_KEY = 'maestroDigitalContent_lessons';
const QUESTIONS_KEY = 'maestroDigitalContent_questions';
const TAXONOMY_KEY = 'maestroDigitalContent_taxonomy';

const defaultCategories = {
    numeros: 'Números',
    suma_resta: 'Suma y Resta',
    multi_divi: 'Multiplicación y División',
    problemas: 'Problemas',
    geometria: 'Geometría',
    medidas: 'Medidas',
    reloj: 'El Reloj'
};

const defaultTaxonomy: AppTaxonomy = {
    grades: [{ id: 'grado-3', name: 'Tercer Grado' }],
    subjects: [{ id: 'matematicas', name: 'Matemáticas', gradeId: 'grado-3' }],
    categories: Object.keys(defaultCategories).map(key => ({
        id: key,
        name: defaultCategories[key as keyof typeof defaultCategories],
        subjectId: 'matematicas'
    }))
};

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

    saveTaxonomy: (taxonomy: AppTaxonomy) => {
        localStorage.setItem(TAXONOMY_KEY, JSON.stringify(taxonomy));
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

    saveLessons: (lessons: LessonContent[]) => {
        localStorage.setItem(LESSONS_KEY, JSON.stringify(lessons));
    },

    saveQuestions: (questions: Record<CategoryId, Record<number, Question[]>>) => {
        localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
    },

    resetToDefault: () => {
        localStorage.removeItem(LESSONS_KEY);
        localStorage.removeItem(QUESTIONS_KEY);
        localStorage.removeItem(TAXONOMY_KEY);
    }
};
