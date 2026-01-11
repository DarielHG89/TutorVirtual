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
        title: 'Midiendo el Mundo: Longitud',
        period: 3, // Assuming it fits here
        categoryId: 'medidas',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">Midiendo Distancias 📏</h3>
            <p class="mb-4">¿Cómo sabemos si algo es largo o corto? ¡Midiendo! Usamos diferentes herramientas para diferentes tamaños.</p>
            <div class="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-blue-800 dark:text-blue-300">Centímetro (cm) - Para cosas pequeñas 🐜</h4>
                <p>Un centímetro es pequeñito, como el ancho de tu uña. Usamos una regla para medir en cm cosas como una goma de borrar, un lápiz o un insecto.</p>
            </div>
            <div class="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-green-800 dark:text-green-300">Metro (m) - Para cosas medianas 🚪</h4>
                <p>Un metro es mucho más grande. ¡Necesitas 100 cm para hacer 1 metro! Lo usamos para medir el alto de una puerta, el largo de una habitación o tu propia estatura.</p>
            </div>
            <div class="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-red-800 dark:text-red-300">Kilómetro (km) - ¡Para súper distancias! 🚗</h4>
                <p>Un kilómetro es ¡enorme! Son 1000 metros juntos. Lo usamos para medir la distancia entre ciudades, como de La Habana a Varadero.</p>
            </div>
            <div data-exercise-index="0"></div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-blanks',
                title: '¡A Practicar!: ¿Qué mido con qué?',
                textWithBlanks: 'Para medir un lápiz usamos __BLANK__. Para medir una puerta usamos __BLANK__. Para ir a otra ciudad usamos __BLANK__.',
                blanks: [
                    { correctAnswer: 'cm', options: ['m', 'km', 'cm'] },
                    { correctAnswer: 'm', options: ['cm', 'km', 'm'] },
                    { correctAnswer: 'km', options: ['cm', 'm', 'km'] }
                ]
            }
        ],
        practice: getQuestionsForLesson('medidas_longitud_1'),
    },
    {
        id: 'medidas_masa_1',
        title: '¿Cuánto Pesa?: Masa',
        period: 3,
        categoryId: 'medidas',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">El Misterio del Peso ⚖️</h3>
            <p class="mb-4">Algunas cosas son ligeras como una pluma y otras pesadas como una piedra. ¡Para saber cuánto pesan, usamos la balanza!</p>
            <div class="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-green-800 dark:text-green-300">Gramo (g) - Para los pesos pluma 깃</h4>
                <p>Un gramo es un peso muy, muy pequeño. Un clip, una hoja de papel o una hormiga pesan unos pocos gramos. ¡Es para cosas muy ligeras!</p>
            </div>
            <div class="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-purple-800 dark:text-purple-300">Kilogramo (kg) - Para los pesos pesados 🏋️</h4>
                <p>Un kilogramo es mucho más. ¡Necesitas 1000 gramos para hacer 1 kilogramo! Lo usamos para pesar un saco de arroz, una persona o una maleta.</p>
                <p class="mt-2 font-semibold">¡Recuerda el acertijo! Un kilo de plumas pesa lo mismo que un kilo de piedras. ¡Un kilo es un kilo!</p>
                <div data-exercise-index="0"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-blanks',
                title: '¡A Practicar!: ¿Ligero o Pesado?',
                textWithBlanks: 'Para pesar una fresa usamos __BLANK__. Para pesar una persona usamos __BLANK__.',
                blanks: [
                    { correctAnswer: 'gramos (g)', options: ['kilogramos (kg)', 'gramos (g)'] },
                    { correctAnswer: 'kilogramos (kg)', options: ['gramos (g)', 'kilogramos (kg)'] }
                ]
            }
        ],
        practice: getQuestionsForLesson('medidas_masa_1'),
    },
    {
        id: 'medidas_capacidad_1',
        title: '¿Cuánto Cabe?: Capacidad',
        period: 3,
        categoryId: 'medidas',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-cyan-600 dark:text-cyan-400">Llenando Recipientes 💧</h3>
            <p class="mb-4">La capacidad nos dice cuánto líquido (como agua, leche o refresco) cabe dentro de algo. ¡Vamos a ver las medidas!</p>
            <div class="bg-cyan-50 dark:bg-cyan-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-cyan-800 dark:text-cyan-300">Litro (L) - La botella grande 🍾</h4>
                <p>El litro es la unidad principal. Una botella grande de refresco o un cartón de leche suelen tener 1 litro. Lo usamos para medir cantidades que podemos ver bien.</p>
            </div>
            <div class="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-yellow-800 dark:text-yellow-300">Mililitro (ml) - La gotita 💧</h4>
                <p>El mililitro es súper pequeño. ¡Necesitas 1000 de estas "gotitas" para llenar una botella de 1 litro! Se usa para medir medicamentos, perfumes o pociones mágicas.</p>
                 <p class="mt-2 font-semibold">Entonces, 1 Litro = 1000 mililitros. ¡No lo olvides!</p>
                 <div data-exercise-index="0"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-blanks',
                title: '¡A Practicar!: ¿Poco o Mucho?',
                textWithBlanks: 'El líquido de una piscina se mide en __BLANK__. Un frasco de perfume se mide en __BLANK__.',
                blanks: [
                    { correctAnswer: 'Litros (L)', options: ['Mililitros (ml)', 'Litros (L)'] },
                    { correctAnswer: 'Mililitros (ml)', options: ['Litros (L)', 'Mililitros (ml)'] }
                ]
            }
        ],
        practice: getQuestionsForLesson('medidas_capacidad_1'),
    },
    {
        id: 'medidas_moneda_1',
        title: 'Nuestro Dinero: Peso Cubano',
        period: 3,
        categoryId: 'medidas',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-emerald-600 dark:text-emerald-400">Contando el Dinero 💰</h3>
            <p class="mb-4">En Cuba, usamos el Peso Cubano (CUP) para comprar. ¡Aprender a usarlo bien es un superpoder!</p>
            <div class="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-emerald-800 dark:text-emerald-300">Monedas y Billetes 🪙</h4>
                <p>Tenemos monedas para cantidades pequeñas (como 1, 3 o 5 pesos) y billetes para cantidades más grandes (como 20, 50, 100 pesos o más).</p>
            </div>
            <div class="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-orange-800 dark:text-orange-300">Juntar y Pagar 🤝</h4>
                <p>Para saber cuánto dinero tienes, tienes que <strong>sumar</strong> el valor de todas tus monedas y billetes.</p>
                <p class="mt-2">Cuando compras algo, tienes que <strong>restar</strong> el precio de lo que compras a tu dinero para saber cuánto te queda o cuánto te tienen que devolver (el "vuelto").</p>
                <div data-exercise-index="0"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-text',
                title: '¡A Practicar!: Contando Dinero',
                textWithInputs: 'Si tengo 2 billetes de 20 CUP y 1 moneda de 5 CUP, en total tengo __INPUT__ CUP. Si compro algo de 30 CUP, me devuelven __INPUT__ CUP.',
                correctAnswers: ['45', '15']
            }
        ],
        practice: getQuestionsForLesson('medidas_moneda_1'),
    }
];