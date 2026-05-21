import type { Question, CategoryId } from '../types';

import { numerosQuestions } from './grades/grado-3/matematicas/categories/numeros';
import { sumaRestaQuestions } from './grades/grado-3/matematicas/categories/suma_resta';
import { multiDiviQuestions } from './grades/grado-3/matematicas/categories/multi_divi';
import { problemasQuestions } from './grades/grado-3/matematicas/categories/problemas';
import { geometriaQuestions } from './grades/grado-3/matematicas/categories/geometria';
import { medidasQuestions } from './grades/grado-3/matematicas/categories/medidas';
import { relojQuestions } from './grades/grado-3/matematicas/categories/reloj';
import { fraccionesQuestions } from './grades/grado-3/matematicas/categories/fracciones';

export const questions: Record<CategoryId, Record<number, Question[]>> = {
    numeros: numerosQuestions,
    suma_resta: sumaRestaQuestions,
    multi_divi: multiDiviQuestions,
    problemas: problemasQuestions,
    geometria: geometriaQuestions,
    medidas: medidasQuestions,
    reloj: relojQuestions,
    fracciones: fraccionesQuestions
};
