import type { LessonContent } from '../../types';
import { geometriaQuestions } from '../categories/geometria';

const getQuestionsForLesson = (lessonId: string) => {
    const lessonQuestions: Record<number, any[]> = { 1: [], 2: [], 3: [] };
    for (const level in geometriaQuestions) {
        geometriaQuestions[level as unknown as keyof typeof geometriaQuestions].forEach(q => {
            if (q.lessonId === lessonId) {
                lessonQuestions[level as unknown as keyof typeof lessonQuestions].push(q);
            }
        });
    }
    return lessonQuestions;
};

export const geometriaLessons: LessonContent[] = [
    {
        id: 'geometria_p1',
        title: 'Rectas: Paralelas y Perpendiculares 🛤️',
        period: 1,
        categoryId: 'geometria',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">¡Líneas en el Espacio! 🛤️➕</h3>
            <p class="mb-4">Las rectas pueden relacionarse de diferentes formas. ¡Es como el mapa de una ciudad! 🗺️</p>
            
            <div class="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-blue-800 dark:text-blue-300">Rectas Paralelas 🛤️</h4>
                <p>Son aquellas que NUNCA se cortan por más que las alargues. ¡Como las vías del tren! 🚄</p>
                <div data-exercise-index="0"></div>
            </div>

            <div class="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-red-800 dark:text-red-300">Rectas Perpendiculares ➕</h4>
                <p>Se cortan formando un ángulo recto (esquina perfecta, como una L o una T). ¡Como el marco de una ventana! 🖼️</p>
                <div data-exercise-index="1"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-blanks',
                title: 'Tipos de Rectas',
                textWithBlanks: 'Las rectas que nunca se tocan son __BLANK__. Las que forman una esquina perfecta son __BLANK__.',
                blanks: [
                    { correctAnswer: 'paralelas', options: ['paralelas', 'perpendiculares', 'secantes'] },
                    { correctAnswer: 'perpendiculares', options: ['paralelas', 'perpendiculares', 'secantes'] }
                ]
            }
        ],
        practice: getQuestionsForLesson('geometria_p1'),
    },
    {
        id: 'geometria_p2_1',
        title: 'Figuras Planas: Cuadrado y Rectángulo ⏹️',
        period: 1,
        categoryId: 'geometria',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-emerald-600 dark:text-emerald-400">¡Figuras de 4 Lados! ⏹️🖼️</h3>
            <p class="mb-4">El cuadrado y el rectángulo son figuras planas con 4 lados y 4 ángulos rectos. ¡Pero tienen un secreto! 🤫</p>
            
            <div class="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-emerald-800 dark:text-emerald-300">El Cuadrado vs Rectángulo ⏹️</h4>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li><strong>Cuadrado:</strong> Sus 4 lados son exactamente IGUALES. ¡Como una losita del piso!</li>
                    <li><strong>Rectángulo:</strong> Sus lados son iguales de dos en dos. ¡Tiene 2 largos y 2 cortos, como una puerta! 🚪</li>
                </ul>
                <div data-exercise-index="0"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-blanks',
                title: 'Contando Lados',
                textWithBlanks: 'Un cuadrado tiene sus __BLANK__ lados iguales. Un rectángulo tiene lados iguales de __BLANK__ en __BLANK__.',
                blanks: [
                    { correctAnswer: '4', options: ['2', '3', '4'] },
                    { correctAnswer: '2', options: ['2', '3', '4'] },
                    { correctAnswer: '2', options: ['2', '3', '4'] }
                ]
            }
        ],
        practice: getQuestionsForLesson('geometria_p2_1'),
    },
    {
        id: 'geometria_p2_2',
        title: 'Prismas: Cubos y Ortoedros 🧊',
        period: 2,
        categoryId: 'geometria',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-purple-600 dark:text-purple-400">¡Formas con Volumen! 🧊📦</h3>
            <p class="mb-4">Los prismas son cuerpos geométricos que tienen caras, vértices y aristas. ¡No son planos, ocupan un espacio! 📦✨</p>
            
            <div class="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-purple-800 dark:text-purple-300">Cubo y Ortoedro 🧊</h4>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li><strong>Cubo:</strong> Todas sus caras son cuadrados iguales. ¡Como un dado! 🎲</li>
                    <li><strong>Ortoedro:</strong> Sus caras son rectángulos. ¡Como una caja de zapatos! 📦</li>
                </ul>
                <div data-exercise-index="0"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-blanks',
                title: 'Caras y Vértices',
                textWithBlanks: 'Un cubo tiene __BLANK__ caras. Las esquinas de un prisma se llaman __BLANK__.',
                blanks: [
                    { correctAnswer: '6', options: ['4', '6', '8'] },
                    { correctAnswer: 'vértices', options: ['lados', 'caras', 'vértices'] }
                ]
            }
        ],
        practice: getQuestionsForLesson('geometria_p2_2'),
    },
    {
        id: 'geometria_p3',
        title: 'Círculo, Circunferencia y Cilindro ⏺️🥫',
        period: 3,
        categoryId: 'geometria',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-pink-600 dark:text-pink-400">¡Todo es Redondo! ⏺️🥫💫</h3>
            <p class="mb-4">Las figuras redondas tienen partes especiales como el radio y el diámetro. ¡Y el cilindro es su versión en 3D! 🥫✨</p>
            
            <div class="bg-pink-50 dark:bg-pink-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-pink-800 dark:text-pink-300">Círculo y Circunferencia ⏺️</h4>
                <p>La <strong>circunferencia</strong> es solo la línea exterior, y el <strong>círculo</strong> es todo lo de adentro. ¡Como un anillo vs una moneda! 🪙</p>
                <div data-exercise-index="0"></div>
            </div>

            <div class="bg-cyan-50 dark:bg-cyan-900/30 p-4 rounded-lg shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-cyan-800 dark:text-cyan-300">Radio y Diámetro 📏</h4>
                <p>El <strong>diámetro</strong> cruza todo el círculo por el centro. EL <strong>radio</strong> es la mitad del diámetro. ¡Como el radio de una bicicleta! 🚲</p>
                <div data-exercise-index="1"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-blanks',
                title: 'Mediendo Redondeces',
                textWithBlanks: 'Si el radio mide 5 cm, el diámetro mide __BLANK__ cm. El borde del círculo se llama __BLANK__.',
                blanks: [
                    { correctAnswer: '10', options: ['5', '10', '15'] },
                    { correctAnswer: 'circunferencia', options: ['radio', 'diámetro', 'circunferencia'] }
                ]
            }
        ],
        practice: getQuestionsForLesson('geometria_p3'),
    },
];
