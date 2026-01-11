import type { LessonContent } from '../types';

import { numerosLessons } from './lessons/numeros';
import { sumaRestaLessons } from './lessons/suma_resta';
import { multiDiviLessons } from './lessons/multi_divi';
import { problemasLessons } from './lessons/problemas';
import { geometriaLessons } from './lessons/geometria';
import { medidasLessons } from './lessons/medidas';
import { relojLessons } from './lessons/reloj';
import { fraccionesLessons } from './lessons/fracciones';

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