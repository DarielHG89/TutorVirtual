import type { LessonContent } from '../../types';
import { sumaRestaQuestions } from '../categories/suma_resta';

const getQuestionsForLesson = (lessonId: string) => {
    const lessonQuestions: Record<number, any[]> = { 1: [], 2: [], 3: [] };
    for (const level in sumaRestaQuestions) {
        sumaRestaQuestions[level as unknown as keyof typeof sumaRestaQuestions].forEach(q => {
            if (q.lessonId === lessonId) {
                lessonQuestions[level as unknown as keyof typeof lessonQuestions].push(q);
            }
        });
    }
    return lessonQuestions;
};

export const sumaRestaLessons: LessonContent[] = [
    {
        id: 'adicion_2_2',
        title: 'Procedimiento escrito de la adición',
        period: 1,
        categoryId: 'suma_resta',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-orange-600 dark:text-orange-400">¡Sumando como los mayores! 🏗️</h3>
            <p class="mb-4">Sumar números grandes es como construir una torre. ¡Se hace piso por piso, empezando desde abajo (las unidades)!</p>
            
            <div class="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-orange-800 dark:text-orange-300">Paso 1: ¡Cada uno a su puesto! 🚶‍♂️🚶‍♀️</h4>
                <p>Ubicamos los <strong>sumandos</strong> en columna usando la <strong>Tabla MCDU</strong>. Cada cifra en su sitio: unidades (U) con unidades, decenas (D) con decenas, centenas (C) con centenas...</p>
                <pre class="bg-white dark:bg-slate-800 p-2 rounded mt-2 text-lg text-slate-700 dark:text-slate-200">  (sumando)  125\n+ (sumando)  243\n-----------</pre>
            </div>

            <div class="bg-cyan-50 dark:bg-cyan-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-cyan-800 dark:text-cyan-300">Paso 2: ¡De derecha a izquierda! 👉</h4>
                <p>¡Siempre empezamos por las <strong>unidades</strong>! Al final obtenemos la <strong>suma o total</strong>.</p>
                <ul class="list-disc list-inside ml-4 mt-2">
                    <li><strong>Unidades:</strong> 5 + 3 = 8</li>
                    <li><strong>Decenas:</strong> 2 + 4 = 6</li>
                    <li><strong>Centenas:</strong> 1 + 2 = 3</li>
                </ul>
                 <pre class="bg-white dark:bg-slate-800 p-2 rounded mt-2 text-lg text-slate-700 dark:text-slate-200">  125\n+ 243\n-----\n  368 (suma o total)</pre>
                 <div data-exercise-index="0"></div>
            </div>

            <div class="bg-pink-50 dark:bg-pink-900/30 p-4 rounded-lg shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-pink-800 dark:text-pink-300">El truco de "llevarse una" 🎈</h4>
                <p>A veces, una columna suma 10 o más. ¡No pasa nada! Si sumamos <strong>18 + 25</strong>:</p>
                 <ul class="list-disc list-inside ml-4 mt-2">
                    <li><strong>Unidades:</strong> 8 + 5 = 13. Escribimos el <strong>3</strong> y nos "llevamos" el 1 (que es una decena) a la columna de las decenas. ¡Es como un globito que sube y espera su turno!</li>
                    <li><strong>Decenas:</strong> 1 + 2 + <strong>1</strong> (la que nos llevamos) = 4.</li>
                </ul>
                <p class="mt-2 font-semibold">¡El resultado es <strong>43</strong>!</p>
                <div data-exercise-index="1"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-text',
                title: '¡A Practicar!: Suma Simple',
                textWithInputs: 'Calcula 125 + 243 = __INPUT__.',
                correctAnswers: ['368']
            },
            {
                type: 'fill-in-the-text',
                title: '¡A Practicar!: Suma con Llevada',
                textWithInputs: 'Calcula 18 + 25 = __INPUT__.',
                correctAnswers: ['43']
            }
        ],
        practice: getQuestionsForLesson('adicion_2_2'),
    },
    {
        id: 'sustraccion_2_3',
        title: 'Procedimiento escrito de la sustracción',
        period: 2,
        categoryId: 'suma_resta',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">¡Sustrayendo como detectives! 🕵️‍♂️</h3>
            <p class="mb-4">Realizar una sustracción de números grandes es como hallar la diferencia. ¡También se hace por columnas, pero a veces el minuendo necesita pedir ayuda!</p>
            
            <div class="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-red-800 dark:text-red-300">Paso 1 y 2: El Minuendo y el Sustraendo</h4>
                <p>En la sustracción, el número de arriba es el <strong>minuendo</strong> y el que resta es el <strong>sustraendo</strong>. El resultado se llama <strong>diferencia</strong>.</p>
                <pre class="bg-white dark:bg-slate-800 p-2 rounded mt-2 text-lg text-slate-700 dark:text-slate-200"> (minuendo)    458\n (sustraendo) - 123\n -----------\n (diferencia)   335</pre>
                <div data-exercise-index="0"></div>
            </div>

            <div class="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-yellow-800 dark:text-yellow-300">El truco de "pedir prestado" 🙏</h4>
                <p>¿Qué pasa si el número de arriba es más pequeño? ¡Le pide ayuda al vecino de la izquierda! En <strong>52 - 18</strong>:</p>
                 <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li><strong>Unidades:</strong> No podemos hacer 2 - 8. ¡El 2 le toca la puerta al 5! "Vecino, ¿me prestas una decena?"</li>
                    <li>El 5, que es muy amable, se convierte en 4 y le da su decena al 2, que se convierte en un súper 12. ¡Ahora sí! <strong>12 - 8 = 4</strong>.</li>
                    <li><strong>Decenas:</strong> Ahora restamos las decenas que quedaron: <strong>4 - 1 = 3</strong>.</li>
                </ul>
                <p class="mt-2 font-semibold">¡El resultado es <strong>34</strong>! ¡Caso resuelto!</p>
                <div data-exercise-index="1"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-text',
                title: '¡A Practicar!: Sustracción Simple',
                textWithInputs: 'Calcula 458 - 123 = __INPUT__.',
                correctAnswers: ['335']
            },
            {
                type: 'fill-in-the-text',
                title: '¡A Practicar!: Sustracción con Sobrepaso',
                textWithInputs: 'Calcula 52 - 18 = __INPUT__.',
                correctAnswers: ['34']
            }
        ],
        practice: getQuestionsForLesson('sustraccion_2_3'),
    },
];