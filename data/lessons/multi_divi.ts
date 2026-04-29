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
        id: 'multiplicacion_3_1',
        title: 'Multiplicación y sus Secretos 🚀',
        period: 1,
        categoryId: 'multi_divi',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-purple-600 dark:text-purple-400">¡Multiplicar es como tener Súper Poderes! 🦸‍♂️💥</h3>
            <p class="mb-4">¿Te imaginas tener que sumar 5 + 5 + 5 + 5 + 5 + 5? ¡Qué aburrido! 🥱 Para eso existe la <strong>multiplicación</strong>, la forma más rápida de sumar el mismo número muchas veces.</p>
            
            <div class="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-purple-800 dark:text-purple-300">¿Qué es Multiplicar? 🧩</h4>
                <p>Es una "suma abreviada". Por ejemplo, si tienes 3 cajas de refrescos 🥤 y cada una tiene 6 botellas:</p>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>Suma: 6 + 6 + 6 = 18</li>
                    <li>Multiplicación: <strong>3 x 6 = 18</strong></li>
                </ul>
                <p class="mt-2">¡Llegas al mismo resultado mucho más rápido! 🏃💨</p>
                <div data-exercise-index="0"></div>
            </div>

            <div class="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-yellow-800 dark:text-yellow-300">Los Factores y el Producto 🔢</h4>
                <p>En una multiplicación, los números que se multiplican se llaman <strong>factores</strong> y el resultado se llama <strong>producto</strong>. ¡Como en una fábrica!</p>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li><strong>4</strong> (Factor) x <strong>5</strong> (Factor) = <strong>20</strong> (Producto)</li>
                </ul>
                <p class="mt-2 font-semibold">Recuerda: ¡El orden de los factores no altera el producto! 2 x 5 es lo mismo que 5 x 2. 🔄</p>
                <div data-exercise-index="1"></div>
            </div>

            <div class="bg-cyan-50 dark:bg-cyan-900/30 p-4 rounded-lg shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-cyan-800 dark:text-cyan-300">Multiplicar por 10, 100 y 1000 🪄</h4>
                <p>¡Esto es como magia! Solo tienes que añadir los ceros al final del número:</p>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>5 x <strong>10</strong> = 5<strong>0</strong></li>
                    <li>5 x <strong>100</strong> = 5<strong>00</strong></li>
                    <li>5 x <strong>1000</strong> = 5<strong>000</strong></li>
                </ul>
                <p class="mt-2">¡Añadir ceros es el truco más divertido! 🎩✨</p>
                <div data-exercise-index="2"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-blanks',
                title: 'De Suma a Multiplicación',
                textWithBlanks: '4 + 4 + 4 es igual a __BLANK__ x __BLANK__ que da __BLANK__.',
                blanks: [
                    { correctAnswer: '3', options: ['3', '4', '12'] },
                    { correctAnswer: '4', options: ['3', '4', '12'] },
                    { correctAnswer: '12', options: ['8', '12', '16'] }
                ]
            },
            {
                type: 'match-pairs',
                title: '¡No importa el orden!',
                pairs: [
                    { term: '2 x 8', definition: '8 x 2' },
                    { term: '5 x 3', definition: '3 x 5' },
                    { term: '10 x 4', definition: '4 x 10' },
                    { term: '6 x 7', definition: '7 x 6' },
                ]
            },
            {
                type: 'fill-in-the-blanks',
                title: 'El truco de los ceros',
                textWithBlanks: '12 x 10 = __BLANK__. 7 x 100 = __BLANK__. 9 x 1000 = __BLANK__.',
                blanks: [
                    { correctAnswer: '120', options: ['120', '1200', '12'] },
                    { correctAnswer: '700', options: ['70', '700', '7000'] },
                    { correctAnswer: '9000', options: ['90', '900', '9000'] }
                ]
            }
        ],
        practice: getQuestionsForLesson('multiplicacion_3_1'),
    },
    {
        id: 'division_3_2',
        title: 'División: ¡A repartir el Botín! 💎',
        period: 2,
        categoryId: 'multi_divi',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-cyan-600 dark:text-cyan-400">¡Repartir es la clave! 🤝🍔</h3>
            <p class="mb-4">Imagina que tienes una pizza 🍕 de 8 porciones y tienes que repartirla entre 4 amigos. ¿Cuántas le tocan a cada uno? ¡Eso es <strong>dividir</strong>!</p>
            
            <div class="bg-cyan-50 dark:bg-cyan-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-cyan-800 dark:text-cyan-300">La División es Repartir Equitativamente ⚖️</h4>
                <p>Dividir significa hacer grupos iguales. Si tienes 12 caramelos 🍬 y quieres hacer 3 montoncitos iguales:</p>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li><strong>12 ÷ 3 = 4</strong></li>
                </ul>
                <p class="mt-2">¡Cada montón tendrá 4 caramelos! 🤝✨</p>
                <div data-exercise-index="0"></div>
            </div>

            <div class="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-red-800 dark:text-red-300">Las Partes de la División 🏴‍☠️</h4>
                <p>Como en un equipo de piratas, cada número tiene un nombre:</p>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li><strong>Dividendo:</strong> El tesoro total (lo que repartes).</li>
                    <li><strong>Divisor:</strong> El número de piratas (entre cuántos repartes).</li>
                    <li><strong>Cociente:</strong> Lo que le toca a cada uno (el resultado).</li>
                    <li><strong>Resto:</strong> Lo que sobra (si no se puede repartir todo).</li>
                </ul>
                <div data-exercise-index="1"></div>
            </div>

            <div class="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-green-800 dark:text-green-300">Multiplicar vs Dividir 🔄</h4>
                <p>¡Son como hermanos gemelos que hacen cosas opuestas! Si sabes multiplicar, ¡ya sabes dividir!</p>
                <p class="mt-2">¿Por qué? Porque si <strong>3 x 4 = 12</strong>, entonces <strong>12 ÷ 3 = 4</strong>. ¡Es como ir y volver por el mismo camino! 🛤️</p>
                <div data-exercise-index="2"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-blanks',
                title: 'Repartiendo Galletas 🍪',
                textWithBlanks: 'Si tengo 20 galletas y las reparto entre 4 niños, a cada uno le tocan __BLANK__ galletas.',
                blanks: [
                    { correctAnswer: '5', options: ['4', '5', '6'] }
                ]
            },
            {
                type: 'match-pairs',
                title: 'Nombres de los Piratas',
                pairs: [
                    { term: 'Lo que reparto', definition: 'Dividendo' },
                    { term: 'Entre cuántos', definition: 'Divisor' },
                    { term: 'Lo que le toca a cada uno', definition: 'Cociente' },
                    { term: 'Lo que sobra', definition: 'Resto' },
                ]
            },
            {
                type: 'fill-in-the-blanks',
                title: 'La Operación Inversa 🔄',
                textWithBlanks: 'Si 6 x 5 = 30, entonces 30 ÷ 6 = __BLANK__. Si 2 x 9 = 18, entonces 18 ÷ 2 = __BLANK__.',
                blanks: [
                    { correctAnswer: '5', options: ['5', '6', '10'] },
                    { correctAnswer: '9', options: ['2', '9', '18'] }
                ]
            }
        ],
        practice: getQuestionsForLesson('division_3_2'),
    },
];
