import type { LessonContent } from '../../types';
import { fraccionesQuestions } from '../categories/fracciones';

const getQuestionsForLesson = (lessonId: string) => {
    const lessonQuestions: Record<number, any[]> = { 1: [], 2: [], 3: [] };
    for (const level in fraccionesQuestions) {
        fraccionesQuestions[level as unknown as keyof typeof fraccionesQuestions].forEach(q => {
            if (q.lessonId === lessonId) {
                lessonQuestions[level as unknown as keyof typeof lessonQuestions].push(q);
            }
        });
    }
    return lessonQuestions;
};

export const fraccionesLessons: LessonContent[] = [
    {
        id: 'fracciones_intro',
        title: 'Fracciones: ¡Partes de un Todo! 🍕',
        period: 1,
        categoryId: 'fracciones',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-orange-600 dark:text-orange-400">¿Qué es una Fracción? 🧐🍽️</h3>
            <p class="mb-4">Imagina que tienes una pizza 🍕 deliciosa y la cortas en partes iguales. Cada una de esas partes es una <strong>fracción</strong> del total. ¡Es así de sencillo!</p>
            
            <div class="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-orange-800 dark:text-orange-300">Numerador y Denominador 🔢</h4>
                <p>Una fracción tiene dos números separados por una rayita. Cada uno tiene un trabajo muy importante:</p>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li><strong>El de arriba (Numerador):</strong> Te dice cuántas partes has tomado o coloreado. 😋</li>
                    <li><strong>El de abajo (Denominador):</strong> Te dice en cuántas partes iguales se dividió el total. 🔪</li>
                </ul>
                <p class="mt-2 font-semibold">Ejemplo: En <strong>1/4</strong>, hemos tomado 1 parte de un total de 4. ¡Un cuarto de pizza!</p>
                <div data-exercise-index="0"></div>
            </div>

            <div class="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-green-800 dark:text-green-300">¿Cómo se leen las Fracciones? 👄💬</h4>
                <p>Leer fracciones es como aprender un nuevo idioma:</p>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li><strong>1/2:</strong> Un medio (la mitad).</li>
                    <li><strong>1/3:</strong> Un tercio.</li>
                    <li><strong>1/4:</strong> Un cuarto.</li>
                    <li><strong>1/5:</strong> Un quinto.</li>
                </ul>
                <p class="mt-2">¡Y así seguimos con sexto, séptimo, octavo, noveno y décimo! 🔟</p>
                <div data-exercise-index="1"></div>
            </div>

            <div class="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-blue-800 dark:text-blue-300">Fracciones en la Vida Real 🇨🇺🛍️</h4>
                <p>Usamos fracciones todo el tiempo. Por ejemplo, en la bodega cuando pedimos <strong>media libra</strong> de café ☕ o <strong>un cuarto</strong> de queso 🧀. ¡Las fracciones nos ayudan a comprar justo lo que necesitamos!</p>
                <div data-exercise-index="2"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-text',
                title: 'Partes de la Fracción',
                textWithInputs: 'En 3/4, el número 3 se llama __INPUT__ y el número 4 se llama __INPUT__.',
                correctAnswers: ['numerador', 'denominador']
            },
            {
                type: 'match-pairs',
                title: '¿Cómo se lee?',
                pairs: [
                    { term: '1/2', definition: 'Un medio' },
                    { term: '1/3', definition: 'Un tercio' },
                    { term: '1/4', definition: 'Un cuarto' },
                    { term: '1/5', definition: 'Un quinto' },
                ]
            },
            {
                type: 'fill-in-the-text',
                title: '¡En la Bodega!',
                textWithInputs: 'Si pides la mitad de una libra, estás pidiendo __INPUT__/2 libra. Si pides un cuarto, es 1/__INPUT__ libra.',
                correctAnswers: ['1', '4']
            }
        ],
        practice: getQuestionsForLesson('fracciones_intro'),
    },
    {
        id: 'fracciones_equivalentes',
        title: 'Fracciones Equivalentes: ¡Gemelas Matemáticas! 👯‍♂️',
        period: 2,
        categoryId: 'fracciones',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-purple-600 dark:text-purple-400">¿Qué significa Equivalente? 🤔⚖️</h3>
            <p class="mb-4">Las fracciones <strong>equivalentes</strong> son aquellas que valen lo mismo, aunque se escriban con números diferentes. ¡Son como el mismo regalo pero con papeles de colores distintos! 🎁✨</p>
            
            <div class="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-purple-800 dark:text-purple-300">Ejemplo de la Pizza 🍕🍕</h4>
                <p>Si te comen <strong>1/2</strong> pizza, es lo mismo que si comes <strong>2/4</strong>. ¡Míralo bien! Estás comiendo exactamente la misma cantidad, solo que cortada en más trozos.</p>
                <p class="mt-2 font-semibold">1/2 = 2/4 = 4/8. ¡Todas son gemelas! 👯‍♂️</p>
                <div data-exercise-index="0"></div>
            </div>

            <div class="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-yellow-800 dark:text-yellow-300">¿Cómo encontrar Fracciones Equivalentes? 🪄</h4>
                <p>¡Es muy fácil! Solo tienes que multiplicar (o dividir) el número de arriba y el de abajo por el <strong>mismo número</strong>.</p>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>Si tienes 1/3 y multiplicas por 2: 1x2=<strong>2</strong> y 3x2=<strong>6</strong>. ¡Así que 1/3 = 2/6!</li>
                </ul>
                <p class="mt-2">¡Es como usar una lupa para ver las partes más pequeñas! 🔍</p>
                <div data-exercise-index="1"></div>
            </div>

            <div class="bg-cyan-50 dark:bg-cyan-900/30 p-4 rounded-lg shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-cyan-800 dark:text-cyan-300">Comparar Fracciones ⚖️🧐</h4>
                <p>Para saber cuál es mayor, fíjate en el denominador. Si dividimos lo mismo en más partes, ¡cada parte será más pequeñita! 🤏</p>
                <p class="mt-2">Así que <strong>1/2</strong> es mucho más grande que <strong>1/8</strong>. ¡Mejor la mitad que un octavo! 😂</p>
                <div data-exercise-index="2"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-text',
                title: 'Encontrando Gemelas 👯‍♂️',
                textWithInputs: 'Si multiplico 1/2 por 3 arriba y abajo, obtengo __INPUT__/__INPUT__, que es equivalente.',
                correctAnswers: ['3', '6']
            },
            {
                type: 'match-pairs',
                title: 'Parejas Equivalentes',
                pairs: [
                    { term: '1/2', definition: '2/4' },
                    { term: '1/3', definition: '3/9' },
                    { term: '2/5', definition: '4/10' },
                    { term: '10/10', definition: '1 (El todo)' },
                ]
            },
            {
                type: 'fill-in-the-text',
                title: '¿Cuál es mayor? ⚖️',
                textWithInputs: 'Entre 1/2 y 1/4, la fracción mayor es __INPUT__/2. Entre 3/4 y 1/4, la mayor es __INPUT__/4.',
                correctAnswers: ['1', '3']
            }
        ],
        practice: getQuestionsForLesson('fracciones_equivalentes'),
    },
];
