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
        id: 'geometria_figuras',
        title: 'Figuras Planas: ¡El Mundo de las Formas! 📐',
        period: 1,
        categoryId: 'geometria',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-pink-600 dark:text-pink-400">¡Todo tiene una forma! ⏹️⏺️🔼</h3>
            <p class="mb-4">Si miras a tu alrededor en tu casa 🏠 o en la calle 🛣️, veras que todo está hecho de formas. ¡Vamos a conocer a las figuras planas más famosas!</p>
            
            <div class="bg-pink-50 dark:bg-pink-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-pink-800 dark:text-pink-300">El Triángulo, Cuadrado y Rectángulo 📐⏹️</h4>
                <p>Estas figuras tienen lados rectos y esquinas llamadas <strong>vértices</strong>:</p>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li><strong>Triángulo:</strong> ¡Tiene 3 lados y 3 vértices! Como un pedazo de pizza 🍕.</li>
                    <li><strong>Cuadrado:</strong> Tiene 4 lados <strong>igualitos</strong>. Como una losita del piso.</li>
                    <li><strong>Rectángulo:</strong> Tiene 4 lados, pero son iguales de dos en dos. ¡Como una puerta! 🚪</li>
                </ul>
                <div data-exercise-index="0"></div>
            </div>

            <div class="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-blue-800 dark:text-blue-300">El Círculo y el Óvalo ⏺️🥚</h4>
                <p>¡Estas figuras son curvas y no tienen esquinas! Son suaves como una pelota ⚽.</p>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li><strong>Círculo:</strong> Es perfectamente redondo. Como una moneda de 1 peso 🪙.</li>
                    <li><strong>Óvalo:</strong> Es alargado, como un huevo de gallina 🥚.</li>
                </ul>
                <div data-exercise-index="1"></div>
            </div>

            <div class="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-yellow-800 dark:text-yellow-300">Lados y Vértices 📏📍</h4>
                <p>Para identificar una figura, cuenta sus partes:</p>
                <p class="mt-2 text-semibold">Los <strong>lados</strong> son las líneas rectas que forman el borde, y los <strong>vértices</strong> son los puntitos donde se unen dos lados. ¡Cuenta bien y sabrás quién es quién! 🕵️‍♂️</p>
                <div data-exercise-index="2"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-text',
                title: 'Contando Partes',
                textWithInputs: 'Un triángulo tiene __INPUT__ lados. Un cuadrado tiene __INPUT__ vértices.',
                correctAnswers: ['3', '4']
            },
            {
                type: 'match-pairs',
                title: '¿A qué se parece?',
                pairs: [
                    { term: 'Círculo', definition: 'Una moneda 🪙' },
                    { term: 'Triángulo', definition: 'Un trozo de pizza 🍕' },
                    { term: 'Rectángulo', definition: 'Una puerta 🚪' },
                    { term: 'Cuadrado', definition: 'Una ventana' },
                ]
            },
            {
                type: 'fill-in-the-text',
                title: 'La Diferencia 🤔',
                textWithInputs: 'El __INPUT__ tiene sus 4 lados iguales, pero el __INPUT__ los tiene iguales de dos en dos.',
                correctAnswers: ['cuadrado', 'rectángulo']
            }
        ],
        practice: getQuestionsForLesson('geometria_figuras'),
    },
    {
        id: 'geometria_cuerpos',
        title: 'Cuerpos Geométricos: ¡Formas con Volumen! 📦',
        period: 2,
        categoryId: 'geometria',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-purple-600 dark:text-purple-400">¿Qué es el Volumen? 📦🏐</h3>
            <p class="mb-4">A diferencia de las figuras planas, los <strong>cuerpos geométricos</strong> tienen volumen, ¡ocupan un lugar en el espacio! Son objetos que puedes agarrar con las manos. 👐</p>
            
            <div class="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-purple-800 dark:text-purple-300">El Cubo y el Prisma 🧊🎁</h4>
                <p>Tienen caras planas y no ruedan:</p>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li><strong>Cubo:</strong> Todas sus caras son cuadrados iguales. ¡Como un dado! 🎲.</li>
                    <li><strong>Prisma:</strong> Sus caras pueden ser rectángulos. Como una caja de leche 🥛 o de medicinas.</li>
                </ul>
                <div data-exercise-index="0"></div>
            </div>

            <div class="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-orange-800 dark:text-orange-300">Esfera, Cilindro y Cono 🏀🥤🍦</h4>
                <p>Estos cuerpos tienen partes curvas y ¡pueden rodar! 🏎️💨</p>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li><strong>Esfera:</strong> Es redonda por todos lados. Como una pelota de béisbol ⚾.</li>
                    <li><strong>Cilindro:</strong> Tiene dos bases circulares planas y es curvo por los lados. Como una lata de refresco 🥤.</li>
                    <li><strong>Cono:</strong> Tiene una base circular y termina en punta. Como un barquillo de helado 🍦.</li>
                </ul>
                <div data-exercise-index="1"></div>
            </div>

            <div class="bg-cyan-50 dark:bg-cyan-900/30 p-4 rounded-lg shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-cyan-800 dark:text-cyan-300">Aristas y Caras 🧱📐</h4>
                <p>En los cuerpos geométricos hablamos de:</p>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li><strong>Caras:</strong> Son las superficies planas del cuerpo.</li>
                    <li><strong>Aristas:</strong> Son las líneas donde se unen dos caras.</li>
                </ul>
                <div data-exercise-index="2"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-text',
                title: '¿Rueda o no Rueda?',
                textWithInputs: 'Un cubo __INPUT__ rueda, pero una esfera __INPUT__ puede rodar perfectamente.',
                correctAnswers: ['no', 'sí']
            },
            {
                type: 'match-pairs',
                title: 'Cita en la Cocina 👩‍🍳',
                pairs: [
                    { term: 'Lata de tomate', definition: 'Cilindro' },
                    { term: 'Naranja', definition: 'Esfera' },
                    { term: 'Caja de galletas', definition: 'Prisma' },
                    { term: 'Helado de barquillo', definition: 'Cono' },
                ]
            },
            {
                type: 'fill-in-the-text',
                title: 'Partes del Cuerpo',
                textWithInputs: 'Las superficies planas de un cuerpo se llaman __INPUT__ y las líneas donde se unen son las __INPUT__.',
                correctAnswers: ['caras', 'aristas']
            }
        ],
        practice: getQuestionsForLesson('geometria_cuerpos'),
    },
];
