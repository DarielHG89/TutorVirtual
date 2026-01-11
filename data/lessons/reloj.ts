import type { LessonContent } from '../../types';
import { relojQuestions } from '../categories/reloj';

const getQuestionsForLesson = (lessonId: string) => {
    const lessonQuestions: Record<number, any[]> = { 1: [], 2: [], 3: [] };
    for (const level in relojQuestions) {
        relojQuestions[level as unknown as keyof typeof relojQuestions].forEach(q => {
            if (q.lessonId === lessonId) {
                lessonQuestions[level as unknown as keyof typeof lessonQuestions].push(q);
            }
        });
    }
    return lessonQuestions;
};

export const relojLessons: LessonContent[] = [
    {
        id: 'reloj_horas_1',
        title: 'El Reloj: Horas y Fracciones',
        period: 3,
        categoryId: 'reloj',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-purple-600 dark:text-purple-400">¡El Secreto del Reloj! 🕰️</h3>
            <p class="mb-4">El reloj nos ayuda a saber en qué momento del día estamos. ¡Tiene dos agujas muy importantes que siempre se están persiguiendo!</p>
            <div class="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-purple-800 dark:text-purple-300">Las Agujas Mágicas ✨</h4>
                <ul class="list-disc list-inside ml-4 mt-2">
                    <li><strong>Aguja Corta (Horaria):</strong> Es la más lenta y tranquila. ¡Señala la HORA!</li>
                    <li><strong>Aguja Larga (Minutero):</strong> Es la más rápida y corredora. ¡Señala los MINUTOS!</li>
                </ul>
                <div data-exercise-index="0"></div>
            </div>
            <div class="bg-cyan-50 dark:bg-cyan-900/30 p-4 rounded-lg shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-cyan-800 dark:text-cyan-300">Las Horas Famosas 🌟</h4>
                <p>Cuando el minutero (la aguja larga) está en ciertos números, tiene nombres especiales:</p>
                <ul class="list-disc list-inside ml-4 mt-2">
                    <li>En el <strong>12</strong>: Es "en punto" (ej: 3:00, las tres en punto).</li>
                    <li>En el <strong>3</strong>: Es "y cuarto" (han pasado 15 minutos).</li>
                    <li>En el <strong>6</strong>: Es "y media" (han pasado 30 minutos).</li>
                    <li>En el <strong>9</strong>: Es "menos cuarto" (faltan 15 minutos para la siguiente hora).</li>
                </ul>
                <div data-exercise-index="1"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'match-pairs',
                title: '¡A Practicar!: Las Agujas Mágicas',
                pairs: [
                    { term: 'Aguja Corta', definition: 'Señala la Hora' },
                    { term: 'Aguja Larga', definition: 'Señala los Minutos' },
                ]
            },
            {
                type: 'match-pairs',
                title: '¡A Practicar!: Las Horas Famosas',
                pairs: [
                    { term: 'Aguja larga en el 12', definition: 'en punto' },
                    { term: 'Aguja larga en el 3', definition: 'y cuarto' },
                    { term: 'Aguja larga en el 6', definition: 'y media' },
                    { term: 'Aguja larga en el 9', definition: 'menos cuarto' },
                ]
            }
        ],
        practice: getQuestionsForLesson('reloj_horas_1'),
    },
    {
        id: 'reloj_minutos_1',
        title: 'El Reloj: Contando Minutos',
        period: 3,
        categoryId: 'reloj',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">¡Cada Minuto Cuenta! ⏳</h3>
            <p class="mb-4">La aguja larga, el minutero, es una experta en contar de 5 en 5. ¡Vamos a aprender su truco!</p>
            <div class="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-blue-800 dark:text-blue-300">La Tabla del 5 en el Reloj  Multiply</h4>
                <p>Para saber cuántos minutos han pasado, solo tienes que multiplicar el número que señala el minutero por 5:</p>
                <ul class="list-disc list-inside ml-4 mt-2">
                    <li>Si apunta al <strong>1</strong>: 1 x 5 = 5 minutos.</li>
                    <li>Si apunta al <strong>2</strong>: 2 x 5 = 10 minutos.</li>
                    <li>Si apunta al <strong>7</strong>: 7 x 5 = 35 minutos.</li>
                    <li>Si apunta al <strong>12</strong>: 12 x 5 = 60 minutos (¡una hora completa!).</li>
                </ul>
                <div data-exercise-index="0"></div>
            </div>
            <div class="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-red-800 dark:text-red-300">Formato Digital vs. Analógico  цифровой</h4>
                <p>En un reloj digital, es más fácil. Si ves <strong>08:25</strong>, significa que son las 8 y 25 minutos. En un reloj de agujas, la aguja corta estaría pasando el 8 y la larga estaría en el 5 (porque 5 x 5 = 25).</p>
                <div data-exercise-index="1"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-text',
                title: '¡A Practicar!: Contando de 5 en 5',
                textWithInputs: 'Si el minutero está en el 4, han pasado __INPUT__ minutos. Si está en el 8, han pasado __INPUT__ minutos.',
                correctAnswers: ['20', '40']
            },
            {
                type: 'match-pairs',
                title: '¡A Practicar!: Digital vs. Analógico',
                pairs: [
                    { term: '08:25', definition: 'Aguja larga en el 5' },
                    { term: '10:10', definition: 'Aguja larga en el 2' },
                    { term: '03:35', definition: 'Aguja larga en el 7' },
                ]
            }
        ],
        practice: getQuestionsForLesson('reloj_minutos_1'),
    },
    {
        id: 'reloj_problemas_1',
        title: 'El Reloj: Problemas de Tiempo',
        period: 3,
        categoryId: 'reloj',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">¡Viajando en el Tiempo! 🚀</h3>
            <p class="mb-4">Ahora que sabemos leer la hora, podemos resolver problemas. ¿Cuánto falta? ¿A qué hora termina? ¡Vamos a calcularlo!</p>
            <div class="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-green-800 dark:text-green-300">Sumar y Restar Tiempo ➕➖</h4>
                <p>Resolver problemas de tiempo es simplemente sumar o restar horas y minutos.</p>
                <ul class="list-disc list-inside ml-4 mt-2">
                    <li><strong>"Dentro de..."</strong> o <strong>"dura..."</strong>: ¡Es una SUMA! Si son las 2:00 y la película dura 2 horas, termina a las 4:00.</li>
                    <li><strong>"Hace..."</strong> o <strong>"antes de..."</strong>: ¡Es una RESTA! Si son las 10:00, hace 1 hora eran las 9:00.</li>
                    <li><strong>"¿Cuánto tiempo pasó?"</strong>: ¡También es una RESTA! De las 3:00 a las 5:00 pasaron 5 - 3 = 2 horas.</li>
                </ul>
                <div data-exercise-index="0"></div>
            </div>
             <div class="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-yellow-800 dark:text-yellow-300">¡Cuidado con los 60 Minutos! 🚧</h4>
                <p>Recuerda que una hora solo tiene 60 minutos. Si son las <strong>2:50</strong> y le sumas <strong>20 minutos</strong>:</p>
                <p>Primero le sumas 10 minutos para llegar a las <strong>3:00</strong>. Luego le sumas los otros 10 minutos. ¡El resultado es <strong>3:10</strong>!</p>
                <div data-exercise-index="1"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-text',
                title: '¡A Practicar!: Sumar y Restar Tiempo',
                textWithInputs: 'Si son las 3:00 y la película dura 2 horas, terminará a las __INPUT__:00. Si son las 10:30 y el recreo empezó hace 15 minutos, empezó a las 10:__INPUT__.',
                correctAnswers: ['5', '15']
            },
            {
                type: 'fill-in-the-text',
                title: '¡A Practicar!: Cruzando la Hora',
                textWithInputs: 'Si son las 2:50 y le sumas 20 minutos, la hora final será las 3:__INPUT__.',
                correctAnswers: ['10']
            }
        ],
        practice: getQuestionsForLesson('reloj_problemas_1'),
    }
];