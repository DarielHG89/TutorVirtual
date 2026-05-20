import type { LessonContent } from '../../types';
import { relojQuestions } from '../categories/reloj';

const getQuestionsForLesson = (lessonId: string) => {
    const lessonQuestions: Record<number, any[]> = { 1: [], 2: [], 3: [] };
    for (const level in relojQuestions) {
        relojQuestions[level as unknown as keyof typeof relojQuestions].forEach(q => {
            if (q.lessonId === lessonId) {
                lessonQuestions[level as unknown as keyof typeof lessonQuestions].push(q);
            }
        });
    }
    return lessonQuestions;
};

export const relojLessons: LessonContent[] = [
    {
        id: 'reloj_lectura',
        title: 'Aprendiendo a leer el Reloj 🕒',
        period: 1,
        categoryId: 'reloj',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">¿Qué hora es? 🕒👣</h3>
            <p class="mb-4">El reloj es la brújula del tiempo. ¡Nos dice cuándo desayunar ☕, cuándo ir a la escuela 🏫 y cuándo jugar! ⚽</p>
            
            <div class="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-blue-800 dark:text-blue-300">Las Manecillas: Corta y Larga 🕗📏</h4>
                <p>En el reloj analógico (el redondo), hay dos flechas muy importantes:</p>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li><strong>La aguja CORTA:</strong> ¡Manda la hora! Se mueve despacio. Si señala el 3, son las 3. 👑</li>
                    <li><strong>La aguja LARGA:</strong> ¡Manda los minutos! Se mueve más rápido. Si señala el 12, es la hora exacta o "en punto".</li>
                </ul>
                <div data-exercise-index="0"></div>
            </div>

            <div class="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-green-800 dark:text-green-300">Las Horas Famosas 🕒🕡🕤</h4>
                <p>Hay momentos del reloj que tienen nombre propio:</p>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li><strong>En punto:</strong> La aguja larga está en el 12.</li>
                    <li><strong>Y media:</strong> La aguja larga está en el 6. ¡Ha pasado media hora!</li>
                    <li><strong>Y cuarto:</strong> La aguja larga está en el 3.</li>
                    <li><strong>Menos cuarto:</strong> La aguja larga está en el 9. ¡Ya casi llega la siguiente hora!</li>
                </ul>
                <div data-exercise-index="1"></div>
            </div>

            <div class="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-yellow-800 dark:text-yellow-300">Mañana (a.m.) o Tarde (p.m.) ☀️🌙</h4>
                <p>El día tiene 24 horas, pero el reloj solo marca 12. ¡Por eso da dos vueltas!</p>
                <p class="mt-2 text-semibold">Usamos <strong>a.m.</strong> para las horas antes del almuerzo (en la mañana) y <strong>p.m.</strong> para las horas después de almorzar (en la tarde y noche). 🍽️🏙️</p>
                <div data-exercise-index="2"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-text',
                title: '¿Quién manda aquí?',
                textWithInputs: 'La aguja corta marca la __INPUT__ y la aguja larga marca los __INPUT__.',
                correctAnswers: ['hora', 'minutos']
            },
            {
                type: 'match-pairs',
                title: 'Nombres Especiales',
                pairs: [
                    { term: 'Aguja larga en el 12', definition: 'En punto' },
                    { term: 'Aguja larga en el 6', definition: 'Y media' },
                    { term: 'Aguja larga en el 3', definition: 'Y cuarto' },
                    { term: 'Aguja larga en el 9', definition: 'Menos cuarto' },
                ]
            },
            {
                type: 'fill-in-the-text',
                title: 'El Día y la Noche ☀️🌙',
                textWithInputs: 'Si son las 8:00 antes de ir a clase, es __INPUT__.m. Si son las 9:00 cuando te vas a dormir, es __INPUT__.m.',
                correctAnswers: ['a', 'p']
            }
        ],
        practice: getQuestionsForLesson('reloj_lectura'),
    },
    {
        id: 'reloj_minutos',
        title: 'Los Minutos: ¡Contando de 5 en 5! ⏲️🏎️',
        period: 2,
        categoryId: 'reloj',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-orange-600 dark:text-orange-400">¡Contar Minutos es Fácil! ⏲️🔢</h3>
            <p class="mb-4">Para saber los minutos exactos, ¡solo necesitas saber la tabla del 5! Cada número del reloj es una parada de guagua que vale 5 minutos. 🚌💨</p>
            
            <div class="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-orange-800 dark:text-orange-300">La Tabla del 5 en el Reloj 🖐️✨</h4>
                <p>Mira los números y multiplícalos por 5:</p>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>Si el minutero está en el 1: <strong>1 x 5 = 5 minutos</strong>.</li>
                    <li>Si está en el 2: <strong>2 x 5 = 10 minutos</strong>.</li>
                    <li>Si está en el 4: <strong>4 x 5 = 20 minutos</strong>... ¡y así sigues!</li>
                </ul>
                <div data-exercise-index="0"></div>
            </div>

            <div class="bg-cyan-50 dark:bg-cyan-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-cyan-800 dark:text-cyan-300">Segundos, Minutos y Horas ⏳🪜</h4>
                <p>¡Todo encaja como un rompecabezas!</p>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li><strong>60 segundos</strong> = 1 minuto. ¡Un estornudo dura poco! 🤧</li>
                    <li><strong>60 minutos</strong> = 1 hora. ¡Una clase de matemática! 📚</li>
                    <li><strong>24 horas</strong> = 1 día completo. 🌍</li>
                </ul>
                <div data-exercise-index="1"></div>
            </div>

            <div class="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-green-800 dark:text-green-300">Reloj Digital vs Analógico 📱🕟</h4>
                <p>En el reloj digital (como el cel del papá 📱), la hora se muestra con números separados por dos puntos (4:15). ¡Es más fácil de leer pero el redondo es más divertido! 😄✨</p>
                <div data-exercise-index="2"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-text',
                title: 'La Multiplicación del Tiempo',
                textWithInputs: 'Si el minutero apunta al 5, son __INPUT__ minutos. Si apunta al 8, son __INPUT__ minutos.',
                correctAnswers: ['25', '40']
            },
            {
                type: 'match-pairs',
                title: 'Equivalencias ⏳',
                pairs: [
                    { term: '1 hora', definition: '60 minutos' },
                    { term: '1 minuto', definition: '60 segundos' },
                    { term: 'Medio día', definition: '12 horas' },
                    { term: 'Un día completo', definition: '24 horas' },
                ]
            },
            {
                type: 'fill-in-the-text',
                title: '¡Casi una Hora!',
                textWithInputs: 'Si han pasado 55 minutos, solo faltan __INPUT__ minutos para completar la hora.',
                correctAnswers: ['5']
            }
        ],
        practice: getQuestionsForLesson('reloj_minutos'),
    },
    {
        id: 'reloj_problemas',
        title: 'Horarios y Duración: ¡No llegues tarde! 🏃💨',
        period: 3,
        categoryId: 'reloj',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-purple-600 dark:text-purple-400">¿Cuánto tiempo ha pasado? ⏳🏃‍♂️</h3>
            <p class="mb-4">Saber medir el tiempo nos ayuda a ser puntuales y a organizar nuestras aventuras. ¡Vamos a resolver problemas de horario! 🎒🌟</p>
            
            <div class="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-purple-800 dark:text-purple-300">Sumar y Restar Tiempo 🪜🔢</h4>
                <p>Si un viaje en tren 🚂 sale a las 2:00 y dura 3 horas, ¿a qué hora llega? ¡Sumamos las horas!</p>
                <p class="mt-2 text-semibold">2:00 + 3 horas = <strong>5:00</strong>. ¡Llegamos a tiempo para la merienda! ☕🍰</p>
                <div data-exercise-index="0"></div>
            </div>

            <div class="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-red-800 dark:text-red-300">Problemas del Horno 🍲🥧</h4>
                <p>En Cuba cocinamos cosas ricas. Si el panetela 🥧 se demora 30 minutos y lo metes al horno a las 3:15...</p>
                <p class="mt-2 font-bold">Sumamos los minutos: 15 + 30 = 45. ¡Estará listo a las <strong>3:45</strong>! 🤤✨</p>
                <div data-exercise-index="1"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-text',
                title: 'El Viaje a la Playa 🏖️',
                textWithInputs: 'Si salgo a las 8:00 a.m. y el viaje dura 2 horas, llegaré a las __INPUT__:00 a.m. a la playa.',
                correctAnswers: ['10']
            },
            {
                type: 'fill-in-the-text',
                title: '¡A merendar!',
                textWithInputs: 'Si la merienda es a las 4:30 y son las 4:10, faltan __INPUT__ minutos para comer.',
                correctAnswers: ['20']
            }
        ],
        practice: getQuestionsForLesson('reloj_problemas'),
    },
    {
        id: 'reloj_calendario',
        title: 'El Calendario: Días, Meses y Años 📅🎂',
        period: 3,
        categoryId: 'reloj',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-emerald-600 dark:text-emerald-400">¡El gran viaje del tiempo! 📅🚀</h3>
            <p class="mb-4">Para medir tiempos largos usamos el <strong>calendario</strong>. ¡Es como un mapa que nos dice dónde estamos en el año!</p>
            
            <div class="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-emerald-800 dark:text-emerald-300">Unidades de Tiempo Largo ⏳📅</h4>
                <p>¡Memoriza estas equivalencias mágicas!:</p>
                <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li><strong>1 año</strong> = 12 meses (o 365 días).</li>
                    <li><strong>1 semestre</strong> = 6 meses.</li>
                    <li><strong>1 trimestre</strong> = 3 meses. ¡Como los períodos de la escuela! 🏫</li>
                    <li><strong>1 mes</strong> = 30 o 31 días (febrero tiene 28).</li>
                    <li><strong>1 semana</strong> = 7 días.</li>
                </ul>
                <div data-exercise-index="0"></div>
            </div>

            <div class="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-indigo-800 dark:text-indigo-300">Tiempo de Gigantes 🖐️🌕</h4>
                <p><strong>Un lustro</strong> = 5 años. <strong>Una década</strong> = 10 años. <strong>Un siglo</strong> = 100 años.</p>
                <div data-exercise-index="1"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-blanks',
                title: 'Conversiones Rápidas',
                textWithBlanks: 'En 2 años hay __BLANK__ meses. En 2 semanas hay __BLANK__ días.',
                blanks: [
                    { correctAnswer: '24', options: ['12', '24', '30'] },
                    { correctAnswer: '14', options: ['7', '10', '14'] }
                ]
            },
            {
                type: 'match-pairs',
                title: 'Equivalencias Extra',
                pairs: [
                    { term: '1 Lustro', definition: '5 años' },
                    { term: '1 Década', definition: '10 años' },
                    { term: '1 Siglo', definition: '100 años' },
                    { term: '1 Semestre', definition: '6 meses' }
                ]
            }
        ],
        practice: getQuestionsForLesson('reloj_calendario'),
    },
];
