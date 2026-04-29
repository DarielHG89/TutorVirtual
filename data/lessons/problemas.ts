import type { LessonContent } from '../../types';
import { problemasQuestions } from '../categories/problemas';

const getQuestionsForLesson = (lessonId: string) => {
    const lessonQuestions: Record<number, any[]> = { 1: [], 2: [], 3: [] };
    for (const level in problemasQuestions) {
        problemasQuestions[level as unknown as keyof typeof problemasQuestions].forEach(q => {
            if (q.lessonId === lessonId) {
                lessonQuestions[level as unknown as keyof typeof lessonQuestions].push(q);
            }
        });
    }
    return lessonQuestions;
};

export const problemasLessons: LessonContent[] = [
    {
        id: 'single_step_1_2',
        title: 'Problemas de un Paso: ¡Detectives Matemáticos! 🕵️‍♂️🔍',
        period: 1,
        categoryId: 'problemas',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-emerald-600 dark:text-emerald-400">¿Qué es un Problema de un Paso? 🧐🧩</h3>
            <p class="mb-4">Son historias cortas donde solo necesitas hacer **una cuenta** (suma, resta, multiplicación o división) para encontrar la respuesta. ¡Es el nivel básico para convertirte en un experto! 🕵️‍♂️🔍</p>
            
            <div class="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-emerald-800 dark:text-emerald-300">Paso 1: Identificar la Acción 🏃‍♂️💨</h4>
                <p>Lee la pregunta y busca estas palabras clave:</p>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li><strong>"¿Cuánto hay en TOTAL?"</strong> -> Casi siempre es una Suma ➕</li>
                    <li><strong>"¿Cuántos QUEDAN o FALTAN?"</strong> -> Casi siempre es una Resta ➖</li>
                    <li><strong>"Tengo n grupos de x"</strong> -> ¡Multiplicación! ✖️</li>
                </ul>
                <div data-exercise-index="0"></div>
            </div>

            <div class="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-yellow-800 dark:text-yellow-300">Ejemplo Real en Cuba 🇨🇺</h4>
                <p>En el agromercado, un mazo de zanahorias cuesta 40 CUP y un mazo de remolachas cuesta 30 CUP. ¿Cuánto gastas en total? 🥕🍅</p>
                <p class="mt-2 font-bold">¡Sumamos!: 40 + 30 = 70 CUP. ¡Listo en un solo paso! ✅</p>
                <div data-exercise-index="1"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-blanks',
                title: 'La Operación Correcta',
                textWithBlanks: 'Si Juan tiene 10 canicas y pierde 3, tengo que __BLANK__ (operación) para saber cuántas le quedan. El resultado es __BLANK__.',
                blanks: [
                    { correctAnswer: 'restar', options: ['sumar', 'restar', 'multiplicar'] },
                    { correctAnswer: '7', options: ['13', '7', '3'] }
                ]
            },
            {
                type: 'match-pairs',
                title: 'Detectando Palabras',
                pairs: [
                    { term: 'Aumentar', definition: 'Suma ➕' },
                    { term: 'Disminuir', definition: 'Resta ➖' },
                    { term: 'Repartir', definition: 'División ➗' },
                ]
            }
        ],
        practice: getQuestionsForLesson('single_step_1_2'),
    },
    {
        id: 'two_step_1_2',
        title: 'Problemas de Dos Pasos: ¡Doble Desafío! ⚔️🛡️',
        period: 2,
        categoryId: 'problemas',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">¡Doble Acción! 🧠🌀</h3>
            <p class="mb-4">A veces, una sola cuenta no es suficiente. Necesitas resolver una parte primero para poder encontrar la respuesta final. ¡Es como una misión secreta con dos objetivos! 🧩✨</p>
            
            <div class="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-red-800 dark:text-red-300">¿Cómo se resuelven? 📝🔍</h4>
                <p>Imagina que tienes 50 CUP, te dan 20 más pero gastas 10 en un helado 🍦.</p>
                <ul class="list-decimal list-inside ml-4 mt-2 space-y-1">
                    <li><strong>Paso 1:</strong> ¿Cuánto dinero tienes en total antes de comprar el helado? (50 + 20 = 70)</li>
                    <li><strong>Paso 2:</strong> Ahora restas lo del helado del nuevo total. (70 - 10 = 60)</li>
                </ul>
                <div data-exercise-index="0"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-blanks',
                title: 'Buscando el paso oculto',
                textWithBlanks: 'Tengo 3 cajas con 10 lápices cada una y regalo 5. El paso 1 es saber cuántos lápices tengo en total, que son __BLANK__. El paso 2 es restar los que regalé, quedando __BLANK__.',
                blanks: [
                    { correctAnswer: '30', options: ['13', '30', '15'] },
                    { correctAnswer: '25', options: ['35', '25', '10'] }
                ]
            }
        ],
        practice: getQuestionsForLesson('two_step_1_2'),
    },
    {
        id: 'operaciones_combinadas',
        title: 'Operaciones Combinadas: ¡El Escudo de los Paréntesis! 🛡️🧮',
        period: 3,
        categoryId: 'problemas',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-purple-600 dark:text-purple-400">El Orden Importa 🛡️🚀</h3>
            <p class="mb-4">Cuando hay muchas cuentas juntas, usamos los **paréntesis ( )** para proteger la operación que queremos hacer PRIMERO. ¡Es como un escudo de prioridad! 🧮✨</p>
            
            <div class="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-purple-800 dark:text-purple-300">La Regla de Oro 👑</h4>
                <p>Siempre, siempre, siempre se resuelve primero lo que está atrapado dentro del paréntesis.</p>
                <div class="mt-2 font-mono bg-slate-100 dark:bg-slate-800 p-2 rounded">
                    (10 + 5) x 2 = ?<br/>
                    1. Paréntesis: 10 + 5 = 15<br/>
                    2. Multiplicar: 15 x 2 = 30
                </div>
                <div data-exercise-index="0"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-blanks',
                title: 'El Poder del Paréntesis',
                textWithBlanks: 'En (20 - 5) + 10, primero resolvemos el __BLANK__ que da __BLANK__, y luego sumamos 10 para obtener __BLANK__.',
                blanks: [
                    { correctAnswer: 'paréntesis', options: ['paréntesis', 'primer número', 'corchete'] },
                    { correctAnswer: '15', options: ['15', '25', '35'] },
                    { correctAnswer: '25', options: ['15', '25', '35'] }
                ]
            }
        ],
        practice: getQuestionsForLesson('operaciones_combinadas'),
    },
];
