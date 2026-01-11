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
        id: 'division_3_4',
        title: 'Ejercitación y problemas',
        period: 3,
        categoryId: 'problemas',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-emerald-600 dark:text-emerald-400">¡Conviértete en un Superdetective de Problemas! 🕵️‍♀️</h3>
            <p class="mb-4">¡Ya conoces todos los superpoderes: sumar, restar, multiplicar y dividir! Ahora vamos a usarlos para resolver misterios (problemas). ¡Ponte tu lupa y tu gabardina!</p>
            
            <div class="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-lg mb-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-emerald-800 dark:text-emerald-300">El Plan Secreto de 4 Pasos</h4>
                <ol class="list-decimal list-inside ml-4 mt-2 space-y-3">
                    <li>
                        <strong>Leer y Entender (La Misión):</strong> Lee el problema despacio. ¿Qué te están preguntando? ¡Busca la pregunta! ❓ Es la pista más importante.
                    </li>
                    <li>
                        <strong>Encontrar las Pistas (Las Huellas):</strong> Busca los números y las palabras clave en el problema. Son como las huellas que deja el culpable.
                    </li>
                    <li>
                        <strong>Elegir el Superpoder (La Herramienta):</strong> Decide qué operación necesitas. Cada palabra clave te sugiere una herramienta:
                        <ul class="list-disc list-inside ml-6 mt-2 bg-white dark:bg-slate-700 p-2 rounded">
                            <li><strong>Sumar (+):</strong> juntar, en total, añadir, más que...</li>
                            <li><strong>Restar (-):</strong> quedan, faltan, diferencia, menos que...</li>
                            <li><strong>Multiplicar (x):</strong> en total (con grupos iguales), cada uno, doble, triple...</li>
                            <li><strong>Dividir (÷):</strong> repartir, en cada uno, mitad, tercera parte...</li>
                        </ul>
                    </li>
                    <li>
                        <strong>¡Resolver y Comprobar! (El Veredicto):</strong> Haz la operación y piensa si el resultado tiene sentido. ¿Un caramelo no puede costar 1000 pesos, verdad? ¡Usa tu lógica de detective!
                    </li>
                </ol>
                <div data-exercise-index="0"></div>
            </div>
        `,
        interactiveExercises: [
            {
                type: 'choose-the-operation',
                title: '¡A Practicar!: Elige el Superpoder Correcto',
                problems: [
                    { text: 'Juan tenía 10 manzanas y compró 5 más. ¿Cuántas tiene en total?', correctOperation: '+' },
                    { text: 'Había 15 pájaros en un árbol y 7 se volaron. ¿Cuántos quedaron?', correctOperation: '-' },
                    { text: 'Compré 4 cajas con 6 refrescos cada una. ¿Cuántos refrescos tengo?', correctOperation: 'x' },
                    { text: 'Tengo 20 caramelos para repartir en partes iguales entre 5 amigos. ¿Cuántos le tocan a cada uno?', correctOperation: '÷' }
                ]
            }
        ],
        practice: getQuestionsForLesson('division_3_4'),
    },
     {
        id: 'operaciones_combinadas',
        title: 'Operaciones Combinadas',
        period: 3,
        categoryId: 'problemas',
        theory: `
            <h3 class="text-2xl font-bold mb-4 text-rose-600 dark:text-rose-400">¡El Orden de los Superpoderes! 🛡️⚔️</h3>
            <p class="mb-4">Cuando en un problema hay varias operaciones, ¡no podemos hacerlas en cualquier orden! Hay unas reglas, como en un juego de mesa.</p>
            <div class="bg-rose-50 dark:bg-rose-900/30 p-4 rounded-lg my-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-rose-800 dark:text-rose-300">Regla 1: ¡Los Paréntesis Mandan! ()</h4>
                <p>Si ves algo dentro de un paréntesis, ¡eso es lo primero que tienes que resolver, sin importar qué operación sea!</p>
                <p class="mt-2">En <strong>(2 + 3) x 4</strong>, primero haces 2+3=5, y luego 5x4=20.</p>
            </div>
            <div class="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg my-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-amber-800 dark:text-amber-300">Regla 2: Multiplicación y División Primero ✖️➗</h4>
                <p>Después de los paréntesis, las multiplicaciones y divisiones tienen prioridad sobre las sumas y restas. Son más "fuertes".</p>
                 <p class="mt-2">En <strong>2 + 3 x 4</strong>, primero haces 3x4=12, y luego 2+12=14. ¡No hagas 2+3 primero!</p>
            </div>
             <div class="bg-lime-50 dark:bg-lime-900/30 p-4 rounded-lg my-4 shadow-inner">
                <h4 class="text-xl font-bold mb-2 text-lime-800 dark:text-lime-300">Regla 3: Sumas y Restas al Final ➕➖</h4>
                <p>Una vez que solo queden sumas y restas, las haces de izquierda a derecha, como lees un libro.</p>
                 <p class="mt-2">En <strong>10 - 4 + 2</strong>, primero haces 10-4=6, y luego 6+2=8.</p>
            </div>
            <div data-exercise-index="0"></div>
        `,
        interactiveExercises: [
            {
                type: 'fill-in-the-text',
                title: '¡A Practicar!: El Orden Correcto',
                textWithInputs: '(2 + 3) x 4 = __INPUT__.  2 + 3 x 4 = __INPUT__.  10 - 4 + 2 = __INPUT__.',
                correctAnswers: ['20', '14', '8']
            }
        ],
        practice: getQuestionsForLesson('operaciones_combinadas'),
    },
];