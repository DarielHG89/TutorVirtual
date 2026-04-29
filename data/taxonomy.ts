import type { AppTaxonomy } from '../types';

const defaultCategories = {
    numeros: 'Números',
    suma_resta: 'Suma y Resta',
    multi_divi: 'Multiplicación y División',
    problemas: 'Problemas',
    geometria: 'Geometría',
    medidas: 'Medidas',
    reloj: 'El Reloj'
};

export const taxonomyData: AppTaxonomy = {
    grades: [{ id: 'grado-3', name: 'Tercer Grado' }],
    subjects: [{ id: 'matematicas', name: 'Matemáticas', gradeId: 'grado-3' }],
    categories: Object.keys(defaultCategories).map(key => ({
        id: key,
        name: defaultCategories[key as keyof typeof defaultCategories],
        subjectId: 'matematicas'
    }))
};
