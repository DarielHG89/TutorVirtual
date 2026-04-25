import type { Question } from '../../types';

// IDs de lecciones
const FRACCIONES_INTRO = 'fracciones_intro';
const FRACCIONES_EQUIVALENTES = 'fracciones_equivalentes';

// Helper para crear representaciones visuales de fracciones
const createFractionSVG = (num: number, den: number, type: 'pizza' | 'barra'): string => {
    let content = '';
    if (type === 'pizza') {
        const radius = 40;
        const cx = 50, cy = 50;
        // Fondo (círculo completo)
        content += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="#F5F5F5" stroke="#333" stroke-width="2" />`;
        // Porciones pintadas
        for (let i = 0; i < num; i++) {
            const startAngle = (i * 360) / den;
            const endAngle = ((i + 1) * 360) / den;
            const x1 = cx + radius * Math.cos((Math.PI * (startAngle - 90)) / 180);
            const y1 = cy + radius * Math.sin((Math.PI * (startAngle - 90)) / 180);
            const x2 = cx + radius * Math.cos((Math.PI * (endAngle - 90)) / 180);
            const y2 = cy + radius * Math.sin((Math.PI * (endAngle - 90)) / 180);
            const largeArc = 360 / den > 180 ? 1 : 0;
            content += `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z" fill="#FF5722" stroke="white" stroke-width="1" />`;
        }
        // Líneas divisoras
        for (let i = 0; i < den; i++) {
            const angle = (i * 360) / den;
            const x = cx + radius * Math.cos((Math.PI * (angle - 90)) / 180);
            const y = cy + radius * Math.sin((Math.PI * (angle - 90)) / 180);
            content += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#333" stroke-width="1" />`;
        }
    } else {
        const width = 80, height = 30;
        const xStart = 10, yStart = 35;
        const step = width / den;
        content += `<rect x="${xStart}" y="${yStart}" width="${width}" height="${height}" fill="#F5F5F5" stroke="#333" stroke-width="2" />`;
        for (let i = 0; i < num; i++) {
            content += `<rect x="${xStart + i * step}" y="${yStart}" width="${step}" height="${height}" fill="#4CAF50" stroke="white" stroke-width="1" />`;
        }
        for (let i = 1; i < den; i++) {
            content += `<line x1="${xStart + i * step}" y1="${yStart}" x2="${xStart + i * step}" y2="${yStart + height}" stroke="#333" stroke-width="1" />`;
        }
    }
    return `data:image/svg+xml;base64,${btoa(`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${content}</svg>`)}`;
};

export const fraccionesQuestions: Record<number, Question[]> = {
    1: [
        // === NIVEL 1: 80 preguntas (40 Intro, 40 Equivalentes) ===
        ...Array.from({ length: 40 }).map((_, i): Question => {
            const den = 2 + (i % 7);
            const num = 1 + (Math.floor(i / 7) % (den - 1 || 1));
            return {
                type: 'mcq',
                question: `¿Qué fracción de la tarta de cumpleaños 🎂 se ha coloreado?`,
                imageUrl: createFractionSVG(num, den, 'pizza'),
                options: [`${num}/${den}`, `${den}/${num}`, `${num}/${den + 1}`],
                answer: `${num}/${den}`,
                hints: [`Cuenta en cuántas partes se dividió la tarta: hay ${den}.`, `Cuenta cuántas partes están pintadas de naranja: hay ${num}.`, `El número de arriba es las partes pintadas.`, `El de abajo es el total de partes.`, `La respuesta es ${num}/${den}.`],
                explanation: `¡Correcto! 🎯 La tarta está dividida en ${den} partes iguales y hemos seleccionado ${num}. Por eso la fracción es **${num}/${den}**. ¡Qué buena pinta! 🎂✨`,
                lessonId: FRACCIONES_INTRO
            };
        }),
        ...Array.from({ length: 40 }).map((_, i): Question => {
            const den = 4 + (i % 5);
            const num = 2;
            return {
                type: 'mcq',
                question: `Mira esta barra de guayaba 🍭 dividida en ${den} partes. ¿Cuál es su nombre?`,
                imageUrl: createFractionSVG(num, den, 'barra'),
                options: [`${num}/${den}`, `${den}/${num}`, `1/${den}`],
                answer: `${num}/${den}`,
                hints: [`Hay ${den} trozos en total.`, `Hay ${num} trozos verdes.`, `Junta el ${num} arriba y el ${den} abajo.`, `Se lee como "${num} ${den === 4 ? 'cuartos' : den === 5 ? 'quintos' : 'partes'}".`, `Es ${num}/${den}.`],
                explanation: `¡Perfecto! ✅ La barra tiene ${den} trozos y marcamos ${num}. La fracción es **${num}/${den}**. ¡A merendar! 🍭😋`,
                lessonId: FRACCIONES_EQUIVALENTES
            };
        })
    ],
    2: [
        // === NIVEL 2: 80 preguntas (40 Intro, 40 Equivalentes) ===
        ...Array.from({ length: 40 }).map((_, i): Question => {
            const den = 5 + (i % 5);
            const num = 1;
            return {
                type: 'input',
                question: `Escribe con números la fracción "un ${den === 5 ? 'quinto' : den === 6 ? 'sexto' : den === 7 ? 'séptimo' : 'octavo'}": ✍️🔢`,
                answer: `1/${den}`,
                hints: [`"Un" significa que el numerador es 1.`, `El ${den === 5 ? 'quinto' : '...'} significa que el denominador es ${den}.`, `Usa la barra / para separar.`, `No pongas espacios.`, `Escribe 1/${den}.`],
                explanation: `¡Muy bien escrito! 🌟 "Un" es el numerador (1) y el nombre del denominador nos indica el número de abajo (${den}). ¡Fracción dominada! ✍️✨`,
                lessonId: FRACCIONES_INTRO
            };
        }),
        ...Array.from({ length: 40 }).map((_, i): Question => {
            const mult = 2;
            const n = 1;
            const d = 2 + (i % 3);
            return {
                type: 'mcq',
                question: `¿Cuál de estas fracciones es EQUIVALENTE (vale lo mismo) que ${n}/${d}? 👯‍♂️🔢`,
                options: [`${n*mult}/${d*mult}`, `${n+1}/${d+1}`, `${n}/${d*3}`],
                answer: `${n*mult}/${d*mult}`,
                hints: [`Para que sea equivalente, multiplica arriba y abajo por el mismo número.`, `Si multiplicas por 2: ${n}x2=${n*mult}, ${d}x2=${d*mult}.`, `Representan la misma cantidad de pizza.`, `Busca ${n*mult}/${d*mult} en las opciones.`, `Equivalente significa 'igual valor'.`],
                explanation: `¡Bingo! 🎯 ${n}/${d} y ${n*mult}/${d*mult} son fracciones equivalentes porque representan la misma porción del total. ¡Son gemelas matemáticas! 👯‍♂️✨`,
                lessonId: FRACCIONES_EQUIVALENTES
            };
        })
    ],
    3: [
        // === NIVEL 3: 80 preguntas (40 Intro, 40 Equivalentes) ===
        ...Array.from({ length: 40 }).map((_, i): Question => {
            const den = 10 + i;
            return {
                type: 'input',
                question: `En la fracción 7/${den}, ¿cómo se llama el número de arriba? 🧐🆙`,
                answer: `numerador`,
                hints: [`El de arriba es el "N...".`, `El de abajo es el denominador.`, `Es el número que indica cuántas partes tomamos.`, `Empieza con N y termina con R.`, `La respuesta es "numerador".`],
                explanation: `¡Exacto! 🎯 El número de arriba siempre es el **numerador**. ¡No se te olvida ni una! 🧠✨`,
                lessonId: FRACCIONES_INTRO
            };
        }),
        ...Array.from({ length: 40 }).map((_, i): Question => {
            const den = 20 + i;
            const num1 = 2;
            const num2 = 3;
            return {
                type: 'input',
                question: `Calcula la suma de estas fracciones con el mismo denominador: ${num1}/${den} + ${num2}/${den} = ? ➕🧮`,
                answer: `${num1+num2}/${den}`,
                hints: [`Como el denominador es el mismo (${den}), se queda igual abajo.`, `Solo tienes que sumar los numeradores: ${num1} + ${num2}.`, `Pone el resultado arriba y el ${den} abajo.`, `Usa la barra / para separar.`, `La respuesta es ${num1+num2}/${den}.`],
                explanation: `¡Maestro de las fracciones! 🌟 Al tener el mismo denominador, solo sumamos los números de arriba: ${num1} + ${num2} = ${num1+num2}. El resultado es **${num1+num2}/${den}**. 🧮✨`,
                lessonId: FRACCIONES_EQUIVALENTES
            };
        })
    ]
};
