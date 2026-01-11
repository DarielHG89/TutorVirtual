import type { LessonContent } from '../../types';
import { multiDiviQuestions } from '../categories/multi_divi';

const getQuestionsForLesson = (lessonId: string) => {
    const lessonQuestions: Record<number, any[]> = { 1: [], 2: [], 3: [] };
    for (const level in multiDiviQuestions) {
        multiDiviQuestions[level as unknown as keyof typeof multiDiviQuestions].forEach(q => {
            if (q.lessonId === lessonId) {
                lessonQuestions[level as unknown as keyof typeof lessonQuestions].push(q);
            }
        });
    }
    return lessonQuestions;
};

export const multiDiviLessons: LessonContent[] = [
    {
        id: 'multiplicacion_3_2',
        title: 'Procedimiento escrito de la multiplicación',
        period: 2,
        categoryId: 'multi_divi',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-purple-600 dark:text-purple-400">¡Multiplicando como un Pro! 🚀</h3>
            <p class="mb-4">Multiplicar números grandes es como hacer magia. ¡Con un truco, puedes sumar un número muchas veces súper rápido!</p>
            
            <div class="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-purple-800 dark:text-purple-300">Paso 1: ¡A sus puestos! 🔢</h4>
                <p>Pon el número más grande arriba y el más pequeño (el que multiplica) debajo, a la derecha. ¡Listos para la acción!</p>
                <pre class="bg-white dark:bg-slate-800 p-2 rounded mt-2 text-lg text-slate-700 dark:text-slate-200">  123\n x  2\n-----</pre>
            </div>

            <div class="bg-cyan-50 dark:bg-cyan-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-cyan-800 dark:text-cyan-300">Paso 2: ¡El ataque del número de abajo! 💥</h4>
                <p>El número de abajo va multiplicando a cada uno de los de arriba, empezando por las <strong>unidades</strong> (¡siempre de derecha a izquierda!).</p>
                <ul class="list-disc list-inside ml-4 mt-2">
                    <li>2 x 3 = <strong>6</strong></li>
                    <li>2 x 2 = <strong>4</strong></li>
                    <li>2 x 1 = <strong>2</strong></li>
                </ul>
                 <pre class="bg-white dark:bg-slate-800 p-2 rounded mt-2 text-lg text-slate-700 dark:text-slate-200">  123\n x  2\n-----\n  246</pre>
                 <div data-exercise-index="0"></div>
            </div>

            <div class="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-yellow-800 dark:text-yellow-300">El truco de "llevarse una" (¡otra vez!) 🎈</h4>
                <p>Si una multiplicación da 10 o más, también nos llevamos. En <strong>45 x 3</strong>:</p>
                 <ul class="list-disc list-inside ml-4 mt-2">
                    <li>3 x 5 = 15. Escribimos el <strong>5</strong> y nos "llevamos" el 1 como un globito a la siguiente columna.</li>
                    <li>3 x 4 = 12. ¡No te olvides de sumar el globito que te llevabas! 12 + <strong>1</strong> = 13.</li>
                </ul>
                <p class="mt-2 font-semibold">¡El resultado es <strong>135</strong>! ¡Magia!</p>
                <div data-exercise-index="1"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-text',
                title: '¡A Practicar!: Multiplicación Simple',
                textWithInputs: 'Calcula 123 x 2 = __INPUT__.',
                correctAnswers: ['246']
            },
            {
                type: 'fill-in-the-text',
                title: '¡A Practicar!: Multiplicación con Llevada',
                textWithInputs: 'Calcula 45 x 3 = __INPUT__.',
                correctAnswers: ['135']
            }
        ],
        practice: getQuestionsForLesson('multiplicacion_3_2'),
    },
    {
        id: 'division_3_3',
        title: 'Procedimiento escrito de la división',
        period: 3,
        categoryId: 'multi_divi',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-cyan-600 dark:text-cyan-400">¡Dividiendo tesoros! 💎</h3>
            <p class="mb-4">Dividir es repartir en partes iguales. La división escrita nos ayuda a repartir tesoros grandes entre piratas. ¡Vamos a usar "la cajita"!</p>
            
            <div class="bg-cyan-50 dark:bg-cyan-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-cyan-800 dark:text-cyan-300">La tripulación de la división 🏴‍☠️</h4>
                <p>En <strong>8 ÷ 2 = 4</strong>:</p>
                <ul class="list-disc list-inside ml-4 mt-2">
                    <li><strong>Dividendo (8):</strong> El tesoro total que vamos a repartir.</li>
                    <li><strong>Divisor (2):</strong> Entre cuántos piratas repartimos.</li>
                    <li><strong>Cociente (4):</strong> Cuántas monedas le tocan a cada pirata.</li>
                    <li><strong>Resto:</strong> Las monedas que sobran si no se puede repartir exactamente.</li>
                </ul>
                <div data-exercise-index="0"></div>
            </div>

            <div class="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-yellow-800 dark:text-yellow-300">Los pasos del pirata para 48 ÷ 2</h4>
                <ol class="list-decimal list-inside ml-4 mt-2 space-y-2">
                    <li> <strong>"Coger" un número:</strong> Cogemos la primera cifra del tesoro (4). ¿Podemos repartir 4 monedas entre 2 piratas? ¡Sí!</li>
                    <li> <strong>Buscar en la tabla:</strong> En la tabla del 2, ¿qué número da 4 o se acerca? ¡2x2=4! Le tocan 2 monedas a cada uno.</li>
                    <li> <strong>Restar y bajar:</strong> Ponemos el 2 en el cociente (el botín de cada pirata). 2x2=4. Restamos 4-4=0. ¡No sobra nada! Ahora, ¡bajamos el siguiente número del tesoro, el 8!</li>
                    <li> <strong>Repetir:</strong> Ahora tenemos 8. En la tabla del 2... ¡2x4=8! Le tocan 4 monedas más a cada uno. Ponemos el 4 en el cociente. Restamos 8-8=0. ¡No sobra nada!</li>
                </ol>
                <p class="mt-2 font-semibold">El resultado (cociente) es <strong>24</strong>. ¡Cada pirata se lleva 24 monedas!</p>
                <div data-exercise-index="1"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'match-pairs',
                title: '¡A Practicar!: La Tripulación',
                pairs: [
                    { term: 'Dividendo', definition: 'El tesoro total a repartir.' },
                    { term: 'Divisor', definition: 'El número de piratas entre los que se reparte.' },
                    { term: 'Cociente', definition: 'El botín que le toca a cada pirata.' },
                    { term: 'Resto', definition: 'Las monedas que sobran.' },
                ]
            },
            {
                type: 'fill-in-the-text',
                title: '¡A Practicar!: ¡A Dividir!',
                textWithInputs: 'Al dividir 48 entre 2, el cociente es __INPUT__.',
                correctAnswers: ['24']
            }
        ],
        practice: getQuestionsForLesson('division_3_3'),
    },
];