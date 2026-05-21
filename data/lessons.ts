import type { LessonContent } from '../types';

import { numerosLessons } from './grades/grado-3/matematicas/lessons/numeros';
import { sumaRestaLessons } from './grades/grado-3/matematicas/lessons/suma_resta';
import { multiDiviLessons } from './grades/grado-3/matematicas/lessons/multi_divi';
import { problemasLessons } from './grades/grado-3/matematicas/lessons/problemas';
import { geometriaLessons } from './grades/grado-3/matematicas/lessons/geometria';
import { medidasLessons } from './grades/grado-3/matematicas/lessons/medidas';
import { relojLessons } from './grades/grado-3/matematicas/lessons/reloj';
import { fraccionesLessons } from './grades/grado-3/matematicas/lessons/fracciones';

export const lessons: LessonContent[] = [
    ...numerosLessons,
    ...sumaRestaLessons,
    ...multiDiviLessons,
    ...problemasLessons,
    ...geometriaLessons,
    ...medidasLessons,
    ...relojLessons,
    ...fraccionesLessons,
];