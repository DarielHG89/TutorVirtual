import type { LessonContent } from '../../types';
import { numerosQuestions } from '../categories/numeros';

const getQuestionsForLesson = (lessonId: string) => {
    const lessonQuestions: Record<number, any[]> = { 1: [], 2: [], 3: [] };
    for (const level in numerosQuestions) {
        numerosQuestions[level as unknown as keyof typeof numerosQuestions].forEach(q => {
            if (q.lessonId === lessonId) {
                lessonQuestions[level as unknown as keyof typeof lessonQuestions].push(q);
            }
        });
    }
    return lessonQuestions;
};

export const numerosLessons: LessonContent[] = [
    {
        id: 'numeros_1_1',
        title: 'Consolidación hasta 100',
        period: 1,
        categoryId: 'numeros',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">¡Recordando los números hasta 100! 🚀</h3>
            <p class="mb-4">¡Hola, campeón/a! Vamos a hacer un viaje rápido para recordar a nuestros amigos, los números hasta 100. ¡Son la base de todas nuestras aventuras matemáticas!</p>
            
            <div class="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-blue-800 dark:text-blue-300">Decenas y Unidades 🏗️</h4>
                <p>Imagina los números como equipos de construcción. El número <strong>23</strong> tiene:</p>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li><strong>2 <span class="pronounceable">decenas</span>:</strong> dos grupos de 10 bloques (¡20 bloques!)</li>
                    <li><strong>3 <span class="pronounceable">unidades</span>:</strong> tres bloques sueltos.</li>
                </ul>
                <p class="mt-2 font-semibold">¡Juntos forman la torre 23! <strong>20 + 3 = 23</strong>.</p>
                <div data-exercise-index="0"></div>
            </div>

            <div class="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-green-800 dark:text-green-300">Leer y Escribir Números ✍️</h4>
                <p>Leer los números es como decir un código secreto:</p>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li><strong>45</strong> se lee "cuarenta y cinco".</li>
                    <li><strong>89</strong> se lee "ochenta y nueve".</li>
                    <li><strong>100</strong> es el gran jefe, ¡"cien"! 👑</li>
                </ul>
                <div data-exercise-index="1"></div>
            </div>

             <div class="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-yellow-800 dark:text-yellow-300">Comparar Números 🏆</h4>
                <p>Para saber qué número es más grande, ¡mira primero al jefe de las decenas!</p>
                <p class="mt-2">En <strong>67</strong> y <strong>76</strong>, el 7 de 76 es más grande que el 6 de 67. ¡Así que <strong>76 gana la carrera!</strong> 🏁</p>
                <div data-exercise-index="2"></div>
            </div>
            <div class="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg mt-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-orange-800 dark:text-orange-300">Estimando: ¿A qué pandilla pertenece? 🤔</h4>
                <p>A veces es útil saber a qué "familia de 10" (un número que acaba en cero) se parece más un número. ¡Es como encontrar su vecino más cercano en la calle de los números!</p>
                <p class="mt-2">Imagina el número <strong>37</strong>. ¿Está más cerca del 30 o del 40? ¡Está mucho más cerca del 40! Decimos que "estimamos" o "<span class="pronounceable">redondeamos</span>" 37 a <strong>40</strong>.</p>
                <p class="mt-2">¿Y el <strong>32</strong>? Está más cerquita del 30. Lo redondeamos a <strong>30</strong>. El número que termina en 5 (como 35) está justo en medio, ¡y por un acuerdo de matemáticos, siempre sube al siguiente! 🧗</p>
                <div data-exercise-index="3"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-blanks',
                title: '¡A Practicar!: Decenas y Unidades',
                textWithBlanks: 'El número 73 tiene __BLANK__ decenas y __BLANK__ unidades. Al formar grupos de diez con 50 manzanas obtenemos 5 __BLANK__.',
                blanks: [
                    { correctAnswer: '7', options: ['3', '7', '10'] },
                    { correctAnswer: '3', options: ['3', '7', '0'] },
                    { correctAnswer: 'decenas', options: ['unidades', 'decenas', 'centenas'] }
                ]
            },
            {
                type: 'match-pairs',
                title: '¡A Practicar!: Leer y Escribir Números',
                pairs: [
                    { term: '45', definition: 'cuarenta y cinco' },
                    { term: '89', definition: 'ochenta y nueve' },
                    { term: '21', definition: 'veintiuno' },
                    { term: '98', definition: 'noventa y ocho' },
                ]
            },
            {
                type: 'match-pairs',
                title: '¡A Practicar!: Comparar Números',
                pairs: [
                    { term: '67 __?__ 76', definition: '<' },
                    { term: '91 __?__ 19', definition: '>' },
                    { term: '50 __?__ 50', definition: '=' },
                    { term: '34 __?__ 43', definition: '<' },
                ]
            },
            {
                type: 'fill-in-the-text',
                title: '¡A Practicar!: Estimando',
                textWithInputs: 'El número 37 se redondea a __INPUT__. El número 32 se redondea a __INPUT__. El número 35 se redondea a __INPUT__.',
                correctAnswers: ['40', '30', '40']
            }
        ],
        practice: getQuestionsForLesson('numeros_1_1'),
    },
    {
        id: 'numeros_1_2',
        title: 'Números hasta 10 000',
        period: 1,
        categoryId: 'numeros',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">¡Explorando la galaxia hasta 10 000! 🌌</h3>
            <p class="mb-4">Ahora que somos expertos hasta 100, ¡vamos a una nueva galaxia! La galaxia de los números de <strong>tres y cuatro cifras</strong>. ¡Abróchate el cinturón!</p>
            
            <div class="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-green-800 dark:text-green-300">Nuevos Superhéroes: Centenas y Millares ⭐</h4>
                <p>Conocemos las unidades (1) y las decenas (10). Ahora llegan dos nuevos superhéroes al equipo:</p>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li><strong>La <span class="pronounceable">Centena</span> (100):</strong> ¡Son 10 decenas juntas! ¡Un escuadrón completo!</li>
                    <li><strong>La Unidad de <span class="pronounceable">Millar</span> (1 000):</strong> ¡Son 10 centenas juntas! Se lee "mil" y es el capitán del equipo.</li>
                </ul>
                <div data-exercise-index="0"></div>
            </div>

            <div class="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-purple-800 dark:text-purple-300">Leer Mapas del Tesoro Numéricos 🗺️</h4>
                <p>Leer números grandes es como descifrar un mapa del tesoro. ¡Cada cifra te dice dónde buscar!</p>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li><strong>345:</strong> se lee "trescientos cuarenta y cinco".</li>
                    <li><strong>1 250:</strong> se lee "mil doscientos cincuenta".</li>
                    <li><strong>8 015:</strong> se lee "ocho mil quince". ¡Ojo! 🕵️‍♂️ Si no hay centenas, no se nombran. Para eso ponemos un cero al escribir, ¡es el guardián de la posición!</li>
                </ul>
                <p class="mt-2">A veces se usa un espacio (1 000) para leer mejor los miles y no perdernos en el mapa.</p>
                <div data-exercise-index="1"></div>
            </div>

            <div class="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mt-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-blue-800 dark:text-blue-300">Ubicando números 📍</h4>
                <p>¡Coloca los números donde van en la recta!</p>
                <div data-exercise-index="2"></div>
            </div>
        `,
        interactiveExercises: [
             {
                type: 'fill-in-the-text',
                title: '¡A Practicar!: Superhéroes Numéricos',
                textWithInputs: 'Una centena tiene __INPUT__ decenas. Una unidad de millar tiene __INPUT__ centenas.',
                correctAnswers: ['10', '10']
            },
            {
                type: 'match-pairs',
                title: '¡A Practicar!: Mapas del Tesoro',
                pairs: [
                    { term: '345', definition: 'trescientos cuarenta y cinco' },
                    { term: '1 250', definition: 'mil doscientos cincuenta' },
                    { term: '8 015', definition: 'ocho mil quince' },
                    { term: '5 001', definition: 'cinco mil uno' },
                ]
            },
            {
                type: 'number-line',
                title: '¡A Practicar!: Recta Numérica',
                min: 0,
                max: 10000,
                items: [
                    { value: 5000, label: '5000' },
                    { value: 2500, label: '2500' },
                    { value: 8000, label: '8000' },
                ]
            }
        ],
        practice: getQuestionsForLesson('numeros_1_2'),
    },
    {
        id: 'numeros_1_3',
        title: 'Orden y comparación',
        period: 1,
        categoryId: 'numeros',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">¡El Gran Torneo de los Números! 🥊</h3>
            <p class="mb-4">Para saber qué número es más grande o más pequeño, ¡hay reglas como en un torneo! ¿Estás listo para ser el juez?</p>
            
            <div class="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-red-800 dark:text-red-300">Regla 1: ¡Más cifras, más poder! 💪</h4>
                <p>Es muy fácil: un número con más cifras siempre es más grande. <strong>1 000</strong> (4 cifras) siempre ganará a <strong>999</strong> (3 cifras). ¡Es como un gigante contra un enano!</p>
            </div>

            <div class="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-yellow-800 dark:text-yellow-300">Regla 2: ¡El desempate! 🧐</h4>
                <p>Si tienen las mismas cifras, comparamos de izquierda a derecha, como si leyéramos. En <strong>5<u>2</u>80</strong> y <strong>5<u>1</u>90</strong>:</p>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>Los millares son iguales (5 y 5). ¡Empate! Pasamos a la siguiente ronda.</li>
                    <li>Las centenas: 2 es mayor que 1. ¡El juez declara ganador al <strong>5 280</strong>! 🏆</li>
                </ul>
                <div data-exercise-index="0"></div>
            </div>

            <div class="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-blue-800 dark:text-blue-300">Los Vecinos: Antecesor y Sucesor 🏘️</h4>
                <p>Son los vecinos de al lado de un número:</p>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li><strong><span class="pronounceable">Antecesor</span>:</strong> El que vive "antes" (restamos 1). El antecesor de 1000 es <strong>999</strong>.</li>
                    <li><strong><span class="pronounceable">Sucesor</span>:</strong> El que vive "después" (sumamos 1). El sucesor de 1000 es <strong>1001</strong>.</li>
                </ul>
                <div data-exercise-index="1"></div>
            </div>
             <div class="bg-teal-50 dark:bg-teal-900/30 p-4 rounded-lg mt-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-teal-800 dark:text-teal-300"><span class="pronounceable">Redondeo</span>: ¡A la pandilla más cercana! 🎯</h4>
                <p>¡Podemos hacer lo mismo con números más grandes! Por ejemplo, ¿a qué centena se parece más <strong>470</strong>? ¿A la pandilla del 400 o a la del 500?</p>
                <p class="mt-2">Como 70 está más allá de la mitad del camino (que sería 50), ¡el número 470 se une a la pandilla del <strong>500</strong>!</p>
                <p class="mt-2">¿Y <strong>1 240</strong>? ¿Se parece más a 1 200 o a 1 300? Como 40 está antes de la mitad del camino, se queda con sus amigos del <strong>1 200</strong>.</p>
                <div data-exercise-index="2"></div>
            </div>

            <div class="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg mt-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-indigo-800 dark:text-indigo-300">¿Qué operación usar? 🤔</h4>
                <p>A veces tenemos que pensar qué operación numérica ("+", "-", "x" o "÷") necesitamos para resolver un problema.</p>
                <div data-exercise-index="3"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'match-pairs',
                title: '¡A Practicar!: Comparando Números',
                pairs: [
                    { term: '1000 __?__ 999', definition: '>' },
                    { term: '5280 __?__ 5190', definition: '>' },
                    { term: '4321 __?__ 4325', definition: '<' },
                    { term: '8000 __?__ 8000', definition: '=' },
                ]
            },
            {
                type: 'fill-in-the-text',
                title: '¡A Practicar!: Los Vecinos',
                textWithInputs: 'El antecesor de 1000 es __INPUT__. El sucesor de 1000 es __INPUT__.',
                correctAnswers: ['999', '1001']
            },
            {
                type: 'fill-in-the-text',
                title: '¡A Practicar!: Redondeo',
                textWithInputs: 'El número 470 redondeado a la centena más cercana es __INPUT__. El número 1240 redondeado a la centena más cercana es __INPUT__.',
                correctAnswers: ['500', '1200']
            },
            {
                type: 'choose-the-operation',
                title: '¡A Practicar!: ¿Qué operación usas?',
                problems: [
                    { text: 'Si tengo 40 manzanas y me como 10, ¿para saber cuántas me quedan, qué operación uso?', correctOperation: '-' },
                    { text: 'Tengo 5 bolsas con 20 canicas cada una. Las quiero contar todas. ¿Qué operación es la más rápida?', correctOperation: 'x' }
                ]
            }
        ],
        practice: getQuestionsForLesson('numeros_1_3'),
    }
];