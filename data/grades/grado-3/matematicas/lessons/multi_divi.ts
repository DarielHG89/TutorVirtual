import type { LessonContent } from '../../../../../types';
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
    {
        id: 'division_3_resto',
        title: 'División con Resto: ¡Lo que sobra importa! 🍎♻️',
        period: 2,
        categoryId: 'multi_divi',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-rose-600 dark:text-rose-400">¿Qué pasa si no podemos repartir todo? 🍎🤔</h3>
            <p class="mb-4">A veces, al repartir objetos en grupos iguales, sobran algunos que no alcanzan para completar otro grupo. ¡Eso que sobra es el <strong>resto</strong>!</p>
            
            <div class="bg-rose-50 dark:bg-rose-900/30 p-4 rounded-lg mb-4 shadow-inner text-center">
                <h4 class="text-xl font-bold mb-2 text-rose-800 dark:text-rose-300">Ejemplo: Repartiendo Manzanas 🍎</h4>
                <p>Si tienes 7 manzanas y las quieres poner en 2 cestas:</p>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1 text-left">
                    <li>Pones 3 en cada cesta (3 x 2 = 6).</li>
                    <li>Sobra <strong>1</strong> manzana que no puedes poner en ninguna cesta sin que una tenga más que la otra.</li>
                </ul>
                <p class="mt-2 font-mono font-bold text-lg">7 ÷ 2 = 3 y sobra 1</p>
                <div data-exercise-index="0"></div>
            </div>

            <div class="bg-amber-50 dark:bg-yellow-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-amber-800 dark:text-amber-300">La Regla de Oro del Resto 👑</h4>
                <p>El <strong>resto</strong> siempre, siempre tiene que ser <strong>más pequeño</strong> que el divisor. ¡Si es igual o mayor, significa que aún podías repartir más!</p>
                <p class="mt-2 italic">Si divides entre 5, el resto solo puede ser 0, 1, 2, 3 o 4.</p>
                <div data-exercise-index="1"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-blanks',
                title: 'Calculando el Resto',
                textWithBlanks: 'Si divido 13 entre 4: Caben __BLANK__ veces (4 x 3 = 12) y el resto es __BLANK__.',
                blanks: [
                    { correctAnswer: '3', options: ['2', '3', '4'] },
                    { correctAnswer: '1', options: ['1', '2', '3'] }
                ]
            },
            {
                type: 'fill-in-the-blanks',
                title: '¿Es posible este resto?',
                textWithBlanks: 'Si dividimos un número entre 3, el resto __BLANK__ es IMPOSIBLE.',
                blanks: [
                    { correctAnswer: '4', options: ['0', '1', '2', '4'] }
                ]
            }
        ],
        practice: getQuestionsForLesson('division_3_resto'),
    },
    {
        id: 'division_3_3',
        title: 'División Escrita: El método de la Galera 🏰',
        period: 2,
        categoryId: 'multi_divi',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-orange-600 dark:text-orange-400">¡División Larga! 📝🔢</h3>
            <p class="mb-4">Para dividir números más grandes, usamos un dibujo especial que llamamos <strong>galera</strong> (|___). ¡Es como una casita para los números!</p>
            
            <div class="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg mb-4 shadow-inner text-center">
                <h4 class="text-xl font-bold mb-2 text-orange-800 dark:text-orange-300">¿Cómo se escribe? ✍️</h4>
                <div class="font-mono text-2xl border-2 border-orange-300 dark:border-orange-700 p-4 inline-block rounded bg-white dark:bg-slate-800">
                    <div class="flex items-center justify-center">
                        <span class="mr-1">36</span>
                        <div class="border-l-2 border-b-2 border-slate-600 dark:border-slate-400 pl-2">3</div>
                    </div>
                </div>
                <p class="mt-2">El 36 (Dividendo) va fuera, y el 3 (Divisor) va dentro de la galera.</p>
                <div data-exercise-index="0"></div>
            </div>

            <div class="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-blue-800 dark:text-blue-300">Paso a Paso 🪜</h4>
                <ol class="list-decimal list-inside space-y-2">
                    <li><strong>Mira el primer número:</strong> En 36, el primero es el 3.</li>
                    <li><strong>Divide:</strong> 3 ÷ 3 = 1. Escribe el 1 debajo del divisor.</li>
                    <li><strong>Sigue con el próximo:</strong> Ahora el 6. 6 ÷ 3 = 2. Escribe el 2 al lado del 1.</li>
                    <li><strong>¡Resultado!:</strong> Obtenemos 12.</li>
                </ol>
                <div data-exercise-index="1"></div>
            </div>

            <div class="bg-pink-50 dark:bg-pink-900/30 p-4 rounded-lg shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-pink-800 dark:text-pink-300">¡Comprueba tu trabajo! ✅</h4>
                <p>Para estar seguros, haz la operación inversa: multiplica el resultado (Cociente) por el Divisor.</p>
                <p class="mt-2 font-mono font-bold">Cociente x Divisor = Dividendo</p>
                <p class="italic text-sm mt-1">Ejemplo: 12 x 3 = 36. ¡Correcto! 🎉</p>
                <div data-exercise-index="2"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-blanks',
                title: 'Colocando en la Galera',
                textWithBlanks: 'Si queremos dividir 48 entre 4, escribimos el __BLANK__ a la izquierda y el __BLANK__ dentro de la galera.',
                blanks: [
                    { correctAnswer: '48', options: ['4', '48', '12'] },
                    { correctAnswer: '4', options: ['4', '48', '12'] }
                ]
            },
            {
                type: 'fill-in-the-blanks',
                title: 'Dividiendo paso a paso',
                textWithBlanks: 'Para 84 ÷ 2: Primero, 8 ÷ 2 = __BLANK__. Luego, 4 ÷ 2 = __BLANK__. El resultado es __BLANK__.',
                blanks: [
                    { correctAnswer: '4', options: ['2', '4', '8'] },
                    { correctAnswer: '2', options: ['1', '2', '4'] },
                    { correctAnswer: '42', options: ['42', '24', '12'] }
                ]
            },
            {
                type: 'match-pairs',
                title: '¡Compruébalo!',
                pairs: [
                    { term: '22 (Cociente) x 2', definition: '44' },
                    { term: '11 (Cociente) x 5', definition: '55' },
                    { term: '31 (Cociente) x 3', definition: '93' },
                    { term: '12 (Cociente) x 4', definition: '48' },
                ]
            }
        ],
        practice: getQuestionsForLesson('division_3_3'),
    },
    {
        id: 'multiplicacion_escrita_3_4',
        title: 'Multiplicación Escrita a un Paso 🏢',
        period: 2,
        categoryId: 'multi_divi',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">Multiplicar por pasos 🧗‍♂️</h3>
            <p class="mb-4">Para multiplicar números grandes, los escribimos uno debajo del otro. ¡Pero aquí el número de abajo visita todas las habitaciones del número de arriba! 🏢</p>
            
            <div class="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg mb-4 shadow-inner text-center">
                <h4 class="text-xl font-bold mb-2 text-indigo-800 dark:text-indigo-300">Paso 1: Colocar los números ✍️</h4>
                <p>El número más grande arriba y el más pequeño abajo, alineados por la derecha.</p>
                <div class="font-mono text-2xl p-4 inline-block rounded bg-white dark:bg-slate-800 mt-2 text-slate-700 dark:text-slate-200">
                    <div class="text-right">43</div>
                    <div class="border-b-2 border-slate-600 dark:border-slate-400 text-right">x 2</div>
                </div>
                <div data-exercise-index="0"></div>
            </div>

            <div class="bg-teal-50 dark:bg-teal-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-teal-800 dark:text-teal-300">Paso 2: ¡A multiplicar! 🚀</h4>
                <ol class="list-decimal list-inside space-y-2">
                    <li>Multiplicamos <strong>2 x 3</strong> (unidades). Nos da 6. Lo escribimos abajo.</li>
                    <li>Multiplicamos <strong>2 x 4</strong> (decenas). Nos da 8. Lo escribimos debajo de las decenas.</li>
                    <li>¡Listo! El resultado es <strong>86</strong>.</li>
                </ol>
                <div data-exercise-index="1"></div>
            </div>

            <div class="bg-pink-50 dark:bg-pink-900/30 p-4 rounded-lg shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-pink-800 dark:text-pink-300">¿Y si nos llevamos una? 🎈</h4>
                <p>Si la multiplicación da 10 o más (ej: <strong>24 x 3</strong>):</p>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li><strong>3 x 4 = 12</strong>. Escribimos el 2 y nos llevamos el 1.</li>
                    <li><strong>3 x 2 = 6</strong>. Le sumamos el 1 que llevábamos (6 + 1 = 7).</li>
                    <li>El resultado es <strong>72</strong>. ¡Fácil! 😎</li>
                </ul>
                <div data-exercise-index="2"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-blanks',
                title: 'Multiplicando Unidades y Decenas',
                textWithBlanks: 'En 32 x 3: Primero 3 x 2 = __BLANK__. Luego 3 x 3 = __BLANK__. El resultado es __BLANK__.',
                blanks: [
                    { correctAnswer: '6', options: ['5', '6', '8'] },
                    { correctAnswer: '9', options: ['6', '9', '12'] },
                    { correctAnswer: '96', options: ['96', '69', '36'] }
                ]
            },
            {
                type: 'fill-in-the-blanks',
                title: 'Llevando al vecino',
                textWithBlanks: 'En 15 x 4: 4x5=20 (llevo __BLANK__). 4x1=4, más lo que llevaba es __BLANK__. Da 60.',
                blanks: [
                    { correctAnswer: '2', options: ['1', '2', '3'] },
                    { correctAnswer: '6', options: ['4', '5', '6'] }
                ]
            },
            {
                type: 'match-pairs',
                title: 'Resuelve estas rápidas',
                pairs: [
                    { term: '21 x 4', definition: '84' },
                    { term: '12 x 3', definition: '36' },
                    { term: '15 x 2', definition: '30' },
                    { term: '11 x 7', definition: '77' },
                ]
            }
        ],
        practice: getQuestionsForLesson('multiplicacion_escrita_3_4'),
    },
];
