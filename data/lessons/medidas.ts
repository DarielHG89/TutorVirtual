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
        id: 'medidas_longitud_1',
        title: 'Longitud: ¡Midiendo distancias! 📏',
        period: 1,
        categoryId: 'medidas',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">¿Qué tan largo es? 📏🧗</h3>
            <p class="mb-4">Medir la longitud es saber la distancia entre dos puntos. ¡Desde el largo de tu lápiz hasta la distancia a la escuela! 📈</p>
            
            <div class="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-blue-800 dark:text-blue-300">Milímetros, Centímetros y Metros 📏🏗️</h4>
                <p>Usamos diferentes unidades según el tamaño:</p>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li><strong>Centímetro (cm):</strong> Para cosas pequeñas, como un libro 📖.</li>
                    <li><strong>Metro (m):</strong> Para cosas grandes, como una habitación 🏠. 1 metro = 100 cm.</li>
                    <li><strong>Kilómetro (km):</strong> Para distancias muy largas. 1 km = 1000 m.</li>
                </ul>
                <div data-exercise-index="0"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-blanks',
                title: 'Conversiones Rápidas',
                textWithBlanks: 'En 1 metro hay __BLANK__ centímetros. En 2 metros hay __BLANK__ cm.',
                blanks: [
                    { correctAnswer: '100', options: ['10', '100', '1000'] },
                    { correctAnswer: '200', options: ['20', '200', '2000'] }
                ]
            }
        ],
        practice: getQuestionsForLesson('medidas_longitud_1'),
    },
    {
        id: 'medidas_masa_1',
        title: 'Masa: ¿Cuánto pesa? ⚖️🍏',
        period: 1,
        categoryId: 'medidas',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-orange-600 dark:text-orange-400">¡A la pesa! ⚖️🐘</h3>
            <p class="mb-4">La masa nos dice cuánto material tiene un cuerpo. ¡Lo medimos con una pesa o balanza! 🛍️</p>
            
            <div class="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-orange-800 dark:text-orange-300">Gramos y Kilogramos ⚖️🍏</h4>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li><strong>Gramo (g):</strong> Para cosas ligeras, como un sobre de azúcar.</li>
                    <li><strong>Kilogramo (kg):</strong> Para cosas pesadas. 1 kg = 1000 gramos.</li>
                </ul>
                <div data-exercise-index="0"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-blanks',
                title: 'El Peso Correcto',
                textWithBlanks: 'Un kilogramo de arroz tiene __BLANK__ gramos. Si compro 2 kilos, tengo __BLANK__ gramos.',
                blanks: [
                    { correctAnswer: '1000', options: ['10', '100', '1000'] },
                    { correctAnswer: '2000', options: ['20', '200', '2000'] }
                ]
            }
        ],
        practice: getQuestionsForLesson('medidas_masa_1'),
    },
    {
        id: 'medidas_capacidad_1',
        title: 'Capacidad: ¡Llenando pomos! 🥛💧',
        period: 2,
        categoryId: 'medidas',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-cyan-600 dark:text-cyan-400">¿Cuánto cabe? 🥛🥤</h3>
            <p class="mb-4">La capacidad mide cuánto líquido puede contener un recipiente. ¡Como un vaso de leche o un tanque de agua! 💧</p>
            
            <div class="bg-cyan-50 dark:bg-cyan-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-cyan-800 dark:text-cyan-300">El Litro y el Mililitro 🥛🍼</h4>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li><strong>Litro (L):</strong> Para botellas grandes.</li>
                    <li><strong>Mililitro (ml):</strong> Para cantidades pequeñas, como una medicina. 1 L = 1000 ml.</li>
                </ul>
                <div data-exercise-index="0"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-blanks',
                title: 'Midiendo el Jugo 🧃',
                textWithBlanks: 'Una botella de 1 litro tiene __BLANK__ mililitros. Medio litro son __BLANK__ ml.',
                blanks: [
                    { correctAnswer: '1000', options: ['10', '100', '1000'] },
                    { correctAnswer: '500', options: ['50', '250', '500'] }
                ]
            }
        ],
        practice: getQuestionsForLesson('medidas_capacidad_1'),
    },
    {
        id: 'medidas_moneda_1',
        title: 'Moneda: ¡Cuentas claras! 💵💰',
        period: 2,
        categoryId: 'medidas',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-emerald-600 dark:text-emerald-400">El dinero en Cuba 🇨🇺💵</h3>
            <p class="mb-4">Usamos el Peso Cubano (CUP) para comprar cosas. ¡Aprender a contar dinero es muy divertido e importante! 🛍️</p>
            
            <div class="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-emerald-800 dark:text-emerald-300">Billetes y Monedas 🪙💵</h4>
                <p>Tenemos monedas de 1, 2, 5 pesos y billetes de 10, 20, 50, 100... y más. ¡Saber sumar nos ayuda a saber el vuelto!</p>
                <div data-exercise-index="0"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-blanks',
                title: 'En la Bodega',
                textWithBlanks: 'Si compro algo de 15 CUP y pago con 20 CUP, mi vuelto es de __BLANK__ pesos.',
                blanks: [
                    { correctAnswer: '5', options: ['5', '10', '15'] }
                ]
            }
        ],
        practice: getQuestionsForLesson('medidas_moneda_1'),
    },
];
