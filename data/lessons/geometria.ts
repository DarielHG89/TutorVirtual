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
        title: 'Paralelogramos: Rectángulos y Cuadrados ⏹️',
        period: 1,
        categoryId: 'geometria',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-emerald-600 dark:text-emerald-400">¡Figuras de 4 Lados Especiales! ⏹️🖼️</h3>
            <p class="mb-4">Los <strong>paralelogramos</strong> son figuras con 4 lados que son paralelos dos a dos. Los más famosos son el cuadrado y el rectángulo. ¡Pero tienen un secreto! 🤫</p>
            
            <div class="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-emerald-800 dark:text-emerald-300">Cuadrado y Rectángulo ⏹️</h4>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li><strong>Cuadrado:</strong> Es un paralelogramo con sus 4 lados exactamente IGUALES y 4 ángulos rectos.</li>
                    <li><strong>Rectángulo:</strong> Es un paralelogramo con lados iguales de dos en dos (paralelos e iguales) y 4 ángulos rectos. 🚪</li>
                </ul>
                <div data-exercise-index="0"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-blanks',
                title: 'Propiedades',
                textWithBlanks: 'El cuadrado y el rectángulo son __BLANK__. El cuadrado tiene __BLANK__ lados de igual medida.',
                blanks: [
                    { correctAnswer: 'paralelogramos', options: ['prismas', 'paralelogramos', 'círculos'] },
                    { correctAnswer: '4', options: ['2', '3', '4'] }
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
            <p class="mb-4">Los prismas son cuerpos geométricos que tienen caras, vértices y aristas. Los que tienen caras rectangulares se llaman ortoedros. ¡No son planos, ocupan un espacio! 📦✨</p>
            
            <div class="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-purple-800 dark:text-purple-300">Cubo y Ortoedro 🧊</h4>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li><strong>Cubo:</strong> Todas sus caras son cuadrados iguales. ¡Es un prisma muy especial! 🎲</li>
                    <li><strong>Ortoedro:</strong> Sus caras son rectángulos. ¡Como una caja de fósforos! 📦</li>
                </ul>
                <div data-exercise-index="0"></div>
            </div>

            <div class="bg-pink-50 dark:bg-pink-900/30 p-4 rounded-lg shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-pink-800 dark:text-pink-300">Partes del Prisma 🏗️</h4>
                <p>Todo prisma tiene:</p>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li><strong>Aristas:</strong> Son las líneas donde se unen dos caras.</li>
                    <li><strong>Vértices:</strong> Son las "esquinas" donde se unen las aristas.</li>
                    <li><strong>Caras:</strong> Son las superficies planas.</li>
                </ul>
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
        title: 'Círculo, Circunferencia, Cilindro y Esfera ⏺️⚽',
        period: 3,
        categoryId: 'geometria',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-pink-600 dark:text-pink-400">¡Curvas Maravillosas! ⏺️⚽💫</h3>
            <p class="mb-4">No todo son líneas rectas. ¡El mundo está lleno de curvas geniales como en una pelota o en una lata de refresco! 🥤✨</p>
            
            <div class="bg-pink-50 dark:bg-pink-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-pink-800 dark:text-pink-300">Círculo y Circunferencia ⏺️</h4>
                <p>La <strong>circunferencia</strong> es el borde. El <strong>círculo</strong> es la superficie de adentro. ¡Si el radio es de 2 cm, el diámetro es de 4 cm! 🪙</p>
                <div data-exercise-index="0"></div>
            </div>
 
            <div class="bg-cyan-50 dark:bg-cyan-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-cyan-800 dark:text-cyan-300">Cuerpos Redondos: Cilindro y Esfera ⚽🔋</h4>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-2">
                    <li><strong>Cilindro:</strong> Tiene dos bases circulares iguales y una cara lateral curva. ¡Como una pila AA! 🔋</li>
                    <li><strong>Esfera:</strong> ¡Es totalmente curva! No tiene caras planas ni aristas. ¡Como una pelota de béisbol o el planeta Tierra! 🌎⚾</li>
                </ul>
                <div data-exercise-index="1"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-blanks',
                title: 'Cuerpos Curvos',
                textWithBlanks: 'Una pelota tiene forma de __BLANK__. Una lata tiene forma de __BLANK__.',
                blanks: [
                    { correctAnswer: 'esfera', options: ['cilindro', 'esfera', 'cubo'] },
                    { correctAnswer: 'cilindro', options: ['cilindro', 'esfera', 'cono'] }
                ]
            },
            {
                type: 'match-pairs',
                title: '¿Qué es qué? 🧩',
                pairs: [
                    { term: 'Base circular', definition: 'Cilindro' },
                    { term: 'Superficie curva total', definition: 'Esfera' },
                    { term: 'Línea del borde', definition: 'Circunferencia' },
                    { term: 'El doble del radio', definition: 'Diámetro' }
                ]
            }
        ],
        practice: getQuestionsForLesson('geometria_p3'),
    },
];
