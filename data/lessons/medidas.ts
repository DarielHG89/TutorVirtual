import type { LessonContent } from '../../types';
import { medidasQuestions } from '../categories/medidas';

const getQuestionsForLesson = (lessonId: string) => {
    const lessonQuestions: Record<number, any[]> = { 1: [], 2: [], 3: [] };
    for (const level in medidasQuestions) {
        medidasQuestions[level as unknown as keyof typeof medidasQuestions].forEach(q => {
            if (q.lessonId === lessonId) {
                lessonQuestions[level as unknown as keyof typeof lessonQuestions].push(q);
            }
        });
    }
    return lessonQuestions;
};

export const medidasLessons: LessonContent[] = [
    {
        id: 'medidas_longitud',
        title: 'Medidas de Longitud: ¡Midiendo el Mundo! 📏',
        period: 1,
        categoryId: 'medidas',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">¿Qué es medir? 📏🧗</h3>
            <p class="mb-4">Medir es usar una herramienta para saber qué tamaño tiene algo o qué distancia hay entre dos lugares. ¡Como saber cuánto has crecido este año! 📈</p>
            
            <div class="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-blue-800 dark:text-blue-300">Nuestros Amigos: Centímetro y Metro 📏🏗️</h4>
                <p>Dependiendo de qué tan grande sea lo que medimos, usamos una unidad diferente:</p>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li><strong>El Centímetro (cm):</strong> ¡Es pequeñito! Es más o menos el ancho de tu dedo meñique. Se usa para medir lápices ✏️ o gomas.</li>
                    <li><strong>El Metro (m):</strong> ¡Es grande! Equivale a 100 centímetros. Se usa para medir el ancho de un cuarto o el largo de una guagua 🚌.</li>
                </ul>
                <p class="mt-2 font-semibold">¡Recuerda! 1 metro = 100 centímetros. 💯</p>
                <div data-exercise-index="0"></div>
            </div>

            <div class="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-green-800 dark:text-green-300">El Kilómetro (km) 🛣️🚗</h4>
                <p>Para distancias muy, muy grandes, como el camino de La Habana a Santiago de Cuba, usamos el <strong>Kilómetro</strong>.</p>
                <p class="mt-2 text-semibold">¡1 kilómetro son 1 000 metros! ¡Es una caminata larga! 👣✨</p>
                <div data-exercise-index="1"></div>
            </div>

            <div class="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-yellow-800 dark:text-yellow-300">Estimación: ¿Cuánto medirá? 🤔💭</h4>
                <p>A veces no tenemos una regla, pero podemos adivinar (estimar). Por ejemplo, una puerta mide como 2 metros de alto. ¡Intenta adivinar cuánto mide tu mesa! 🕵️‍♂️</p>
                <div data-exercise-index="2"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-text',
                title: 'Conversiones Mágicas 🪄',
                textWithInputs: 'En 1 metro hay __INPUT__ centímetros. En un kilómetro hay __INPUT__ metros.',
                correctAnswers: ['100', '1000']
            },
            {
                type: 'match-pairs',
                title: '¿Qué unidad usarías?',
                pairs: [
                    { term: 'Un lápiz ✏️', definition: 'Centímetros' },
                    { term: 'Una guagua 🚌', definition: 'Metros' },
                    { term: 'Distancia entre ciudades', definition: 'Kilómetros' },
                    { term: 'Tu cuaderno 📓', definition: 'Centímetros' },
                ]
            },
            {
                type: 'fill-in-the-text',
                title: 'La regla 📏',
                textWithInputs: 'Si la regla marca 0 y el objeto llega hasta el 15, el objeto mide __INPUT__ centímetros.',
                correctAnswers: ['15']
            }
        ],
        practice: getQuestionsForLesson('medidas_longitud'),
    },
    {
        id: 'medidas_peso',
        title: 'Peso y Capacidad: ¡Cargando y Llenando! ⚖️🥛',
        period: 2,
        categoryId: 'medidas',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-orange-600 dark:text-orange-400">¿Pesa mucho o poco? ⚖️🐘</h3>
            <p class="mb-4">Para saber cuánto pesa un objeto, usamos el <strong>gramo</strong> y el <strong>kilogramo</strong>. ¡Es lo que vemos en la pesa de la bodega! 🛍️</p>
            
            <div class="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-orange-800 dark:text-orange-300">Gramo y Kilogramo ⚖️🍏</h4>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li><strong>Gramo (g):</strong> ¡Es ligero como un clip o un grano de arroz! Se usa para cosas pequeñitas.</li>
                    <li><strong>Kilogramo (kg) o "Kilo":</strong> ¡Es más pesado! Equivale a 1 000 gramos. Como un paquete de azúcar o arroz. 🍚</li>
                </ul>
                <p class="mt-2 font-semibold">En Cuba también usamos la <strong>libra</strong>. ¡Una libra son unos 460 gramos aproximadamente!</p>
                <div data-exercise-index="0"></div>
            </div>

            <div class="bg-cyan-50 dark:bg-cyan-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-cyan-800 dark:text-cyan-300">El Litro (L): Midiendo Líquidos 🥛🥤</h4>
                <p>Para medir cuánto líquido cabe en un recipiente, usamos el <strong>Litro</strong>. ¡Como una botella de agua o de refresco de 1.5L! 💧</p>
                <div data-exercise-index="1"></div>
            </div>

            <div class="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-green-800 dark:text-green-300">La Balanza: El Juez del Peso 🤝⚖️</h4>
                <p>La balanza sirve para comparar. Si la balanza se inclina, ¡el objeto pesado baja porque la gravedad tira más de él! 🧱✨</p>
                <div data-exercise-index="2"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-text',
                title: 'Pesos Pesados',
                textWithInputs: 'En un kilogramo hay __INPUT__ gramos. Medio kilo son __INPUT__ gramos.',
                correctAnswers: ['1000', '500']
            },
            {
                type: 'match-pairs',
                title: '¿Mesa o Vaso?',
                pairs: [
                    { term: 'Un pomo de agua 💧', definition: 'Litros' },
                    { term: 'Una calabaza 🎃', definition: 'Kilogramos' },
                    { term: 'Un poquito de sal 🧂', definition: 'Gramos' },
                    { term: 'Un vaso de leche 🥛', definition: 'Mililitros' },
                ]
            },
            {
                type: 'fill-in-the-text',
                title: 'En la Bodega 🛒',
                textWithInputs: 'Si compro 1 kilo de arroz y 1 kilo de frijoles, en total llevo __INPUT__ kilogramos.',
                correctAnswers: ['2']
            }
        ],
        practice: getQuestionsForLesson('medidas_peso'),
    },
];
