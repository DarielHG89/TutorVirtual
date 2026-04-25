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
        id: 'problemas_aritmetica',
        title: 'Desafíos Matemáticos: ¡Aventura en Cuba! 🇨🇺🏝️',
        period: 1,
        categoryId: 'problemas',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-emerald-600 dark:text-emerald-400">¿Qué es un Problema Matemático? 🧐🧩</h3>
            <p class="mb-4">Un problema es una historia corta que tiene números y una pregunta que debemos resolver. ¡Es como ser un detective matemático que busca la verdad! 🕵️‍♂️🔍</p>
            
            <div class="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-emerald-800 dark:text-emerald-300">Paso 1: ¡Los Datos son las Pistas! 🕵️‍♂️👟</h4>
                <p>Lee con cuidado e identifica qué números hay y qué significan. ¡En Cuba resolvemos muchos problemas diarios!</p>
                <p class="mt-2 text-semibold">Ejemplo: "En la cola del agromercado hay 5 personas delante de ti y 3 detrás". ¿Cuántas personas hay en total contando contigo? 🥕🍅</p>
                <div data-exercise-index="0"></div>
            </div>

            <div class="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-yellow-800 dark:text-yellow-300">Paso 2: ¿Qué operación necesito? ➕➖✖️➗</h4>
                <p>Las palabras clave te dan la respuesta:</p>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li><strong>Ganar, juntar, recibir o comprar más:</strong> ¡Es una Suma! ➕</li>
                    <li><strong>Perder, dar, comer, gastar o faltar:</strong> ¡Es una Resta! ➖</li>
                    <li><strong>Repetir varias veces lo mismo:</strong> ¡Multiplicación! ✖️</li>
                    <li><strong>Repartir, hacer grupos iguales:</strong> ¡División! ➗</li>
                </ul>
                <div data-exercise-index="1"></div>
            </div>

            <div class="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-blue-800 dark:text-blue-300">Paso 3 y 4: ¡Calcular y Revisar! 🎯✅</h4>
                <p>Haz la cuenta con cuidado. Al final, piensa: "¿Mi respuesta tiene sentido?". Si compraste 2 mangos y gastaste 10 pesos, ¡no puedes tener 100 mangos de respuesta! 😂</p>
                <div data-exercise-index="2"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-text',
                title: 'Detectives en el Campo 🕵️‍♂️🌾',
                textWithInputs: 'Si en una finca hay 10 palmas y siembran 5 más, tengo que __INPUT__ (operación) para saber el total. El resultado es __INPUT__.',
                correctAnswers: ['sumar', '15']
            },
            {
                type: 'match-pairs',
                title: 'Palabras Mágicas ✨',
                pairs: [
                    { term: 'Juntar o Ganar', definition: 'Suma ➕' },
                    { term: 'Perder o Gastar', definition: 'Resta ➖' },
                    { term: 'Repartir en partes iguales', definition: 'División ➗' },
                    { term: 'Sumar el mismo número varias veces', definition: 'Multiplicación ✖️' },
                ]
            },
            {
                type: 'fill-in-the-text',
                title: 'Sentido Común 🤔',
                textWithInputs: 'Si tengo 20 caramelos y regalo 25, ¿puedo resolver el problema? __INPUT__ (Sí/No). Porque no puedo regalar más de lo que __INPUT__.',
                correctAnswers: ['No', 'tengo']
            }
        ],
        practice: getQuestionsForLesson('problemas_aritmetica'),
    },
    {
        id: 'problemas_logica',
        title: 'Lógica y Curiosidades: ¡Piensa Rápido! 🧠⚡',
        period: 2,
        categoryId: 'problemas',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">¡Más que solo números! 🧠🌀</h3>
            <p class="mb-4">A veces los problemas matemáticos son como acertijos. ¡Necesitas usar tu lógica y fijarte bien en los detalles! 🧩✨</p>
            
            <div class="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-red-800 dark:text-red-300">Atención a los Detalles 👁️🗨️</h4>
                <p>A veces hay información que no necesitas. Por ejemplo: "Luis tenía 5 canicas azules, 2 rojas y se comió un pan". ¿Cuántas canicas tiene Luis? 🥯</p>
                <p class="mt-2 text-semibold">¡El pan no importa para las canicas! No te dejes distraer. 😂</p>
                <div data-exercise-index="0"></div>
            </div>

            <div class="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-orange-800 dark:text-orange-300">Problemas de Posición 🥇🥈🥉</h4>
                <p>Si en una carrera de chivichanas 🏎️ adelantas al que va en SEGUNDO lugar... ¿en qué lugar vas ahora?</p>
                <p class="mt-2 font-bold">¡Muchos dicen primero, pero es SEGUNDO! Porque ahora tú ocupas su lugar. ¡Piensa bien! 😉</p>
                <div data-exercise-index="1"></div>
            </div>

            <div class="bg-teal-50 dark:bg-teal-900/30 p-4 rounded-lg shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-teal-800 dark:text-teal-300">Usa el Dibujo ✏️🎨</h4>
                <p>Si un problema es difícil de imaginar, ¡dibújalo! Haz palitos para representar personas o cuadraditos para las cajas. ¡Ver el problema ayuda mucho a resolverlo! 🖼️✨</p>
                <div data-exercise-index="2"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-text',
                title: '¡No te distraigas! 🙈',
                textWithInputs: 'Tengo 5 gatos, 2 perros y 3 pelotas. El número total de MASCOTAS es __INPUT__.',
                correctAnswers: ['7']
            },
            {
                type: 'match-pairs',
                title: 'Acertijos Lógicos 🎡',
                pairs: [
                    { term: 'Adelantas al 2do', definition: 'Vas 2do' },
                    { term: 'Mes con 28 días', definition: '¡Todos! 😂' },
                    { term: 'Mitad de 2+2', definition: 'Primero suma, luego divide' },
                ]
            },
            {
                type: 'fill-in-the-text',
                title: 'Dibuja y Resuelve 🖍️',
                textWithInputs: 'Si hay 4 filas de 4 personas, dibujo un cuadrado de __INPUT__ por __INPUT__ y veo que hay __INPUT__ personas en total.',
                correctAnswers: ['4', '4', '16']
            }
        ],
        practice: getQuestionsForLesson('problemas_logica'),
    },
];
