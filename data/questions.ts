import type { Question, CategoryId } from '../types';

import { numerosQuestions } from './categories/numeros';
import { sumaRestaQuestions } from './categories/suma_resta';
import { multiDiviQuestions } from './categories/multi_divi';
import { problemasQuestions } from './categories/problemas';
import { geometriaQuestions } from './categories/geometria';
import { medidasQuestions } from './categories/medidas';
import { relojQuestions } from './categories/reloj';
import { fraccionesQuestions } from './categories/fracciones';

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
