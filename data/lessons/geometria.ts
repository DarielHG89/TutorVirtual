import type { LessonContent } from '../../types';
import { geometriaQuestions } from '../categories/geometria';

const getQuestionsForLesson = (lessonId: string) => {
    const lessonQuestions: Record<number, any[]> = { 1: [], 2: [], 3: [] };
    for (const level in geometriaQuestions) {
        geometriaQuestions[level as unknown as keyof typeof geometriaQuestions].forEach(q => {
            if (q.lessonId === lessonId) {
                lessonQuestions[level as unknown as keyof typeof geometriaQuestions].push(q);
            }
        });
    }
    return lessonQuestions;
};

export const geometriaLessons: LessonContent[] = [
    {
        id: 'geometria_p1',
        title: 'Rectas paralelas y perpendiculares',
        period: 1,
        categoryId: 'geometria',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">¡Líneas Rectas por todas partes! 🏙️</h3>
            <p class="mb-4">Las líneas rectas son como caminos. ¡Algunos nunca se cruzan y otros forman esquinas perfectas! Vamos a explorar la ciudad de las líneas.</p>
            
            <div class="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-indigo-800 dark:text-indigo-300">Rectas <span class="pronounceable">Paralelas</span> ⏸️</h4>
                <p>Son como dos amigos que caminan siempre uno al lado del otro, ¡a la misma distancia! <strong>¡Nunca, nunca se tocan, por más que alargues el camino!</strong></p>
                <p class="mt-2">Imagina las <strong>vías de un tren</strong> 🛤️, los bordes de una regla 📏, o las cuerdas de una guitarra. ¡Esas son líneas paralelas!</p>
            </div>

            <div class="bg-teal-50 dark:bg-teal-900/30 p-4 rounded-lg shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-teal-800 dark:text-teal-300">Rectas <span class="pronounceable">Perpendiculares</span> ➕</h4>
                <p>Estas rectas sí que se cruzan, ¡y lo hacen formando una <strong>esquina perfecta de 90 grados</strong>! Como una cruz perfecta o la letra "L".</p>
                <p class="mt-2">Mira la <strong>esquina de tu libro</strong> 📖, de una ventana, o el cruce de dos calles en un mapa. ¡Ahí tienes líneas perpendiculares!</p>
                <div data-exercise-index="0"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'match-pairs',
                title: '¡A Practicar!: ¡Empareja los Conceptos!',
                pairs: [
                    { term: 'Paralelas', definition: 'Líneas que nunca se tocan, como las vías del tren.' },
                    { term: 'Perpendiculares', definition: 'Líneas que se cruzan formando una esquina perfecta (+).' },
                    { term: 'Vías de tren', definition: 'Paralelas' },
                    { term: 'Esquina de un libro', definition: 'Perpendiculares' },
                ]
            }
        ],
        practice: getQuestionsForLesson('geometria_p1'),
    },
    {
        id: 'geometria_p2_1',
        title: 'Rectángulo y cuadrado',
        period: 2,
        categoryId: 'geometria',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-cyan-600 dark:text-cyan-400">¡Explorando Cuadrados y Rectángulos! 🖼️</h3>
            <p class="mb-4">Estas dos figuras son muy famosas, ¡están por todas partes! Un libro, una puerta, una ventana, la pantalla de tu tablet...</p>
            
            <div class="bg-cyan-50 dark:bg-cyan-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-cyan-800 dark:text-cyan-300">El <span class="pronounceable">Rectángulo</span> ▭</h4>
                <p>Es una figura plana con <strong>4 lados</strong> y <strong>4 esquinas perfectas</strong> (ángulos rectos).</p>
                <ul class="list-disc list-inside ml-4 mt-2">
                    <li>Tiene dos lados largos iguales y dos lados cortos iguales.</li>
                    <li>Sus lados opuestos son paralelos. ¡Como dos pares de amigos caminando!</li>
                </ul>
            </div>

            <div class="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-yellow-800 dark:text-yellow-300">El <span class="pronounceable">Cuadrado</span> 🔲</h4>
                <p>¡Un cuadrado es un <strong>rectángulo súper especial y equilibrado</strong>!</p>
                <ul class="list-disc list-inside ml-4 mt-2">
                    <li>También tiene 4 lados y 4 esquinas perfectas.</li>
                    <li>¡Pero su superpoder es que sus <strong>4 lados son todos exactamente iguales</strong>!</li>
                </ul>
                <div data-exercise-index="0"></div>
            </div>

            <div class="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-green-800 dark:text-green-300"><span class="pronounceable">Perímetro</span> y <span class="pronounceable">Área</span>: La Valla y el Jardín 🌿</h4>
                <p><strong>Perímetro:</strong> Es la suma de todos sus lados. ¡Como poner una <strong>valla</strong> alrededor de un jardín para que no se escape el perro!</p>
                <p class="mt-2"><strong>Área:</strong> Es todo el espacio de adentro. ¡Como plantar césped o <strong>pintar</strong> todo el jardín por dentro! Se calcula: <strong>largo x ancho</strong>.</p>
                <div data-exercise-index="1"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-blanks',
                title: '¡A Practicar!: Propiedades',
                textWithBlanks: 'Un __BLANK__ tiene 4 lados iguales. Un __BLANK__ tiene 2 lados largos y 2 cortos. Ambos tienen __BLANK__ ángulos rectos.',
                blanks: [
                    { correctAnswer: 'cuadrado', options: ['rectángulo', 'círculo'] },
                    { correctAnswer: 'rectángulo', options: ['cuadrado', 'perímetro'] },
                    { correctAnswer: '4', options: ['2', '6'] }
                ]
            },
            {
                type: 'fill-in-the-text',
                title: '¡A Practicar!: Perímetro y Área',
                textWithInputs: 'El perímetro de un cuadrado de lado 5 cm es __INPUT__ cm. El área de un rectángulo de largo 4 cm y ancho 3 cm es __INPUT__ cm².',
                correctAnswers: ['20', '12']
            }
        ],
        practice: getQuestionsForLesson('geometria_p2_1'),
    },
    {
        id: 'geometria_p2_2',
        title: 'Prisma (ortoedro y cubo)',
        period: 2,
        categoryId: 'geometria',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-rose-600 dark:text-rose-400">¡Figuras en 3D: Saltamos al Mundo Real! 🌍</h3>
            <p class="mb-4">¡Dejamos el papel y saltamos al mundo de los objetos que podemos tocar! Estas figuras tienen volumen, como una caja, un dado o un edificio.</p>
            
            <div class="bg-rose-50 dark:bg-rose-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-rose-800 dark:text-rose-300">Las partes de una figura 3D</h4>
                <p>Todas estas figuras tienen un esqueleto formado por:</p>
                <ul class="list-disc list-inside ml-4 mt-2">
                    <li><strong><span class="pronounceable">Caras</span>:</strong> Las partes planas y lisas, como los lados de un dado.</li>
                    <li><strong><span class="pronounceable">Aristas</span>:</strong> Los bordes, donde se juntan dos caras. ¡Como el filo de una caja!</li>
                    <li><strong><span class="pronounceable">Vértices</span>:</strong> Las esquinitas o puntas donde se juntan varias aristas.</li>
                </ul>
                <div data-exercise-index="0"></div>
            </div>

            <div class="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-amber-800 dark:text-amber-300">El <span class="pronounceable">Cubo</span> 🧊</h4>
                <p>Es el más perfecto de todos. ¡Como un dado 🎲 o un cubito de hielo!</p>
                <ul class="list-disc list-inside ml-4 mt-2">
                    <li>Tiene <strong>6 caras</strong>, y todas son <strong>cuadrados iguales</strong>.</li>
                    <li>Tiene <strong>12 aristas</strong> (bordes).</li>
                    <li>Tiene <strong>8 vértices</strong> (esquinas).</li>
                </ul>
            </div>

            <div class="bg-lime-50 dark:bg-lime-900/30 p-4 rounded-lg shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-lime-800 dark:text-lime-300">El <span class="pronounceable">Ortoedro</span> (o Prisma Rectangular) 📦</h4>
                <p>Es como un cubo que se ha estirado. ¡Como una caja de zapatos, un ladrillo o un libro!</p>
                <ul class="list-disc list-inside ml-4 mt-2">
                    <li>También tiene <strong>6 caras</strong>, pero son <strong>rectángulos</strong>.</li>
                    <li>También tiene <strong>12 aristas</strong> y <strong>8 vértices</strong>, ¡igual que el cubo!</li>
                </ul>
                <div data-exercise-index="1"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'match-pairs',
                title: '¡A Practicar!: Las Partes del Prisma',
                pairs: [
                    { term: 'Caras', definition: 'Las partes planas y lisas (6 en total).' },
                    { term: 'Aristas', definition: 'Los bordes donde se juntan las caras (12 en total).' },
                    { term: 'Vértices', definition: 'Las esquinas donde se juntan los bordes (8 en total).' },
                ]
            },
             {
                type: 'fill-in-the-blanks',
                title: '¡A Practicar!: ¿Cubo o Ortoedro?',
                textWithBlanks: 'Las 6 caras de un __BLANK__ son cuadrados iguales. Las 6 caras de un __BLANK__ son rectángulos.',
                blanks: [
                    { correctAnswer: 'cubo', options: ['ortoedro', 'cilindro'] },
                    { correctAnswer: 'ortoedro', options: ['cubo', 'esfera'] },
                ]
            }
        ],
        practice: getQuestionsForLesson('geometria_p2_2'),
    },
    {
        id: 'geometria_p3',
        title: 'Circunferencia, círculo y cilindro',
        period: 3,
        categoryId: 'geometria',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-pink-600 dark:text-pink-400">¡Figuras Redondas y Rodantes! 🔵</h3>
            <p class="mb-4">No todas las figuras tienen esquinas. ¡Vamos a explorar el mundo de las curvas, donde todo fluye!</p>
            
            <div class="bg-pink-50 dark:bg-pink-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-pink-800 dark:text-pink-300"><span class="pronounceable">Círculo</span> vs. <span class="pronounceable">Circunferencia</span>: ¡No son lo mismo! 🤔</h4>
                <p>Es como un plato y el borde del plato:</p>
                <ul class="list-disc list-inside ml-4 mt-2">
                    <li><strong>Circunferencia:</strong> Es solo el <strong>borde</strong>, la línea curva que lo encierra. ¡Como un hula-hoop o un anillo!</li>
                    <li><strong>Círculo:</strong> Es el borde <strong>Y TODO LO DE DENTRO</strong>, como una galleta redonda, una moneda o una pizza entera.</li>
                </ul>
                <div data-exercise-index="0"></div>
            </div>

            <div class="bg-violet-50 dark:bg-violet-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-violet-800 dark:text-violet-300"><span class="pronounceable">Radio</span> y <span class="pronounceable">Diámetro</span>: Las medidas secretas 📏</h4>
                <p>Son dos medidas súper importantes del círculo:</p>
                <ul class="list-disc list-inside ml-4 mt-2">
                    <li><strong>Radio (r):</strong> La distancia desde el centro exacto hasta cualquier punto del borde. ¡Es el brazo del círculo!</li>
                    <li><strong>Diámetro (d):</strong> La línea que cruza todo el círculo pasando por el centro. <strong>¡El diámetro es el doble que el radio!</strong> (d = 2 x r). ¡Son dos brazos extendidos!</li>
                </ul>
                <div data-exercise-index="1"></div>
            </div>

            <div class="bg-lime-50 dark:bg-lime-900/30 p-4 rounded-lg shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-lime-800 dark:text-lime-300">El <span class="pronounceable">Cilindro</span> 🥫</h4>
                <p>Es una figura 3D que puede rodar. ¡Como una lata de refresco, un rollo de papel o el tronco de una palmera!</p>
                <ul class="list-disc list-inside ml-4 mt-2">
                    <li>Tiene <strong>dos bases</strong> que son <strong>círculos</strong> iguales y paralelos.</li>
                    <li>Tiene una superficie lateral curva.</li>
                    <li>No tiene vértices (esquinas). ¡Por eso rueda tan bien!</li>
                </ul>
                <div data-exercise-index="2"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'match-pairs',
                title: '¡A Practicar!: Círculo vs. Circunferencia',
                pairs: [
                    { term: 'Círculo', definition: 'El borde y todo lo de adentro, como una moneda.' },
                    { term: 'Circunferencia', definition: 'Solo el borde, como un anillo.' },
                ]
            },
            {
                type: 'match-pairs',
                title: '¡A Practicar!: Las partes del Círculo',
                pairs: [
                    { term: 'Radio', definition: 'La mitad del diámetro.' },
                    { term: 'Diámetro', definition: 'El doble del radio.' },
                ]
            },
            {
                type: 'fill-in-the-text',
                title: '¡A Practicar!: El Cilindro',
                textWithInputs: 'Un cilindro tiene __INPUT__ bases circulares y __INPUT__ vértices.',
                correctAnswers: ['2', '0']
            }
        ],
        practice: getQuestionsForLesson('geometria_p3'),
    },
];