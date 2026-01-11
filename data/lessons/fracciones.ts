import type { LessonContent } from '../../types';
import { multiDiviQuestions } from '../categories/multi_divi';
import { numerosQuestions } from '../categories/numeros';

const getQuestionsForLesson = (lessonId: string) => {
    const lessonQuestions: Record<number, any[]> = { 1: [], 2: [], 3: [] };
    const allQuestions = { ...multiDiviQuestions, ...numerosQuestions };
    for (const level in allQuestions) {
        allQuestions[level as unknown as keyof typeof allQuestions].forEach(q => {
            if (q.lessonId === lessonId) {
                lessonQuestions[level as unknown as keyof typeof lessonQuestions].push(q);
            }
        });
    }
    return lessonQuestions;
};

export const fraccionesLessons: LessonContent[] = [
    {
        id: 'fracciones_intro',
        title: 'Fracciones y Decimales en la Recta',
        period: 3,
        categoryId: 'numeros',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-orange-600 dark:text-orange-400">¡El Mundo de las Fracciones y Decimales! 🍕</h3>
            <p class="mb-4">Una fracción y un decimal son dos formas de hablar de <strong>trozos de algo</strong>. ¡Como cuando compartes una pizza con tus amigos!</p>
            
            <div class="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-orange-800 dark:text-orange-300">Las Partes de una Fracción</h4>
                <p>Una fracción tiene dos números. En <strong>1/4</strong>, el 4 de abajo (denominador) nos dice que la pizza se partió en 4 trozos, y el 1 de arriba (numerador) nos dice que cogimos 1 trozo.</p>
                <div data-exercise-index="0"></div>
            </div>

            <div class="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg my-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-indigo-800 dark:text-indigo-300">Los Decimales con Coma</h4>
                <p>Los decimales usan una coma para separar los trozos del entero. ¡Son como las migajas!</p>
                <ul class="list-disc list-inside ml-4 mt-2">
                    <li><strong>0,5</strong> es lo mismo que <strong>1/2</strong>. ¡Es la mitad de algo!</li>
                    <li><strong>0,25</strong> es lo mismo que <strong>1/4</strong>. ¡Un cuarto!</li>
                </ul>
                <div data-exercise-index="1"></div>
            </div>
             <div class="bg-teal-50 dark:bg-teal-900/30 p-4 rounded-lg my-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-teal-800 dark:text-teal-300">La Recta Numérica 📏</h4>
                <p>Podemos colocar todos estos "trozos" en una línea para ver cuál es más grande. ¡Es como una carrera para ver quién llega más lejos desde el 0!</p>
                <div data-exercise-index="2"></div>
            </div>
        `,
        interactiveExercises: [
             {
                type: 'fill-in-the-text',
                title: '¡A Practicar!: Las Partes de una Fracción',
                textWithInputs: 'En la fracción 3/4, el numerador es __INPUT__ y el denominador es __INPUT__.',
                correctAnswers: ['3', '4']
            },
            {
                type: 'match-pairs',
                title: '¡A Practicar!: Decimales y Fracciones',
                pairs: [
                    { term: '0,5', definition: '1/2' },
                    { term: '0,25', definition: '1/4' },
                    { term: '0,75', definition: '3/4' },
                ]
            },
            {
                type: 'number-line',
                title: '¡A Practicar!: ¡Ordena en la Recta!',
                min: 0,
                max: 1,
                items: [
                    { value: 0.5, label: '1/2' },
                    { value: 0.25, label: '0,25' },
                    { value: 1, label: '1' },
                    { value: 0.75, label: '3/4' },
                    { value: 0, label: '0' },
                ]
            }
        ],
        practice: getQuestionsForLesson('fracciones_intro'),
    },
    {
        id: 'fracciones_equivalentes',
        title: 'Fracciones Equivalentes',
        period: 3,
        categoryId: 'numeros',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-teal-600 dark:text-teal-400">¡Fracciones Gemelas! 👯</h3>
            <p class="mb-4">Las fracciones equivalentes son fracciones que se escriben diferente, ¡pero valen lo mismo! Son como gemelos con ropa distinta.</p>
            <p>Imagina que tienes <strong>1/2</strong> de una pizza. Si cortas ese trozo por la mitad, ahora tienes <strong>2/4</strong> de la pizza. ¡Es la misma cantidad de pizza!</p>
            <div class="bg-teal-50 dark:bg-teal-900/30 p-4 rounded-lg my-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-teal-800 dark:text-teal-300">¿Cómo encontrar gemelos?</h4>
                <p>¡Es fácil! Multiplica (o divide) el número de arriba y el de abajo <strong>por el mismo número</strong>.</p>
                <p class="mt-2">Para <strong>2/3</strong>, si multiplicamos por 2: (2x2) / (3x2) = <strong>4/6</strong>. ¡Son equivalentes!</p>
                <p class="mt-2"><strong>Simplificar</strong> es hacer lo contrario: dividir para encontrar el gemelo más simple. Para <strong>6/8</strong>, si dividimos por 2: (6÷2) / (8÷2) = <strong>3/4</strong>.</p>
                <div data-exercise-index="0"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-text',
                title: '¡A Practicar!: Fracciones Gemelas',
                textWithInputs: 'Una fracción equivalente a 1/2 es 2/__INPUT__. La fracción 6/8 se puede simplificar a 3/__INPUT__.',
                correctAnswers: ['4', '4']
            }
        ],
        practice: getQuestionsForLesson('fracciones_equivalentes'),
    },
    {
        id: 'decimales_intro',
        title: 'El Mundo de los Decimales',
        period: 3,
        categoryId: 'numeros',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">¡Los números con coma! ,</h3>
            <p class="mb-4">Los decimales son otra forma de hablar de "trozos". Son los números que viven después de la coma decimal. ¡Son como las migajas de un número entero!</p>
            <div class="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg my-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-indigo-800 dark:text-indigo-300">Décimas y Centésimas</h4>
                <p>El primer número después de la coma se llama <strong>décima</strong> (es como partir algo en 10 trozos).</p>
                <ul class="list-disc list-inside ml-4 mt-2">
                    <li><strong>0,1</strong> se lee "una décima" (es lo mismo que 1/10).</li>
                    <li><strong>0,5</strong> se lee "cinco décimas" (es lo mismo que 5/10 o 1/2, ¡la mitad!).</li>
                </ul>
                 <p class="mt-4">El segundo número después de la coma se llama <strong>centésima</strong> (es como partir algo en 100 trocitos).</p>
                 <ul class="list-disc list-inside ml-4 mt-2">
                    <li><strong>0,01</strong> se lee "una centésima" (es 1/100).</li>
                    <li><strong>0,25</strong> se lee "veinticinco centésimas" (es 25/100 o 1/4).</li>
                </ul>
                 <p class="mt-4 font-semibold">En el dinero, los decimales son los centavos. <strong>$1,50</strong> es un peso y cincuenta centavos.</p>
                 <div data-exercise-index="0"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'match-pairs',
                title: '¡A Practicar!: Fracciones y Decimales',
                pairs: [
                    { term: '0,5', definition: '1/2 (la mitad)' },
                    { term: '0,25', definition: '1/4 (un cuarto)' },
                    { term: '0,1', definition: '1/10 (una décima)' },
                    { term: '0,75', definition: '3/4 (tres cuartos)' },
                ]
            }
        ],
        practice: getQuestionsForLesson('decimales_intro'),
    },
];