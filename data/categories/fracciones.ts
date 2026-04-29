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
        ...(() => {
            const qs: Question[] = [];
            for (let d = 2; d <= 10 && qs.length < 40; d++) {
                for (let n = 1; n < d && qs.length < 40; n++) {
                    qs.push({
                        type: 'mcq',
                        question: `¿Qué fracción de la tarta de cumpleaños 🎂 se ha coloreado?`,
                        imageUrl: createFractionSVG(n, d, 'pizza'),
                        options: [`${n}/${d}`, `${d}/${n}`, `${n}/${d + 1}`],
                        answer: `${n}/${d}`,
                        hints: [`Cuenta en cuántas partes se dividió la tarta: hay ${d}.`, `Cuenta cuántas partes están pintadas: hay ${n}.`, `El número de arriba es las partes pintadas.`, `El de abajo es el total de partes.`, `La respuesta es ${n}/${d}.`],
                        explanation: `¡Correcto! 🎯 La tarta está dividida en ${d} partes iguales y hemos seleccionado ${n}. Por eso la fracción es **${n}/${d}**. ¡Qué buena pinta! 🎂✨`,
                        lessonId: FRACCIONES_INTRO
                    });
                }
            }
            while (qs.length < 40) qs.push(qs[qs.length - 1]); // fallback
            return qs;
        })(),
        ...(() => {
            const qs: Question[] = [];
            for (let d = 3; d <= 12 && qs.length < 40; d++) {
                for (let n = 1; n < d && qs.length < 40; n++) {
                    qs.push({
                        type: 'mcq',
                        question: `Mira esta barra de guayaba 🍭 dividida en ${d} partes. Si seleccionamos ${n}, ¿cuál es su fracción?`,
                        imageUrl: createFractionSVG(n, d, 'barra'),
                        options: [`${n}/${d}`, `${d}/${n}`, `1/${d}`],
                        answer: `${n}/${d}`,
                        hints: [`Hay ${d} trozos en total.`, `Hay ${n} trozos seleccionados.`, `Junta el ${n} arriba y el ${d} abajo.`, `La fracción correcta es ${n}/${d}.`],
                        explanation: `¡Perfecto! ✅ La barra tiene ${d} trozos en total y hemos marcado ${n}. La fracción es **${n}/${d}**. ¡A merendar! 🍭😋`,
                        lessonId: FRACCIONES_EQUIVALENTES
                    });
                }
            }
            while (qs.length < 40) qs.push(qs[qs.length - 1]); // fallback
            return qs;
        })()
    ],
    2: [
        // === NIVEL 2: 80 preguntas (40 Intro, 40 Equivalentes) ===
        ...(() => {
            const qs: Question[] = [];
            const nombres = ['mitad', 'tercio', 'cuarto', 'quinto', 'sexto', 'séptimo', 'octavo', 'noveno', 'décimo'];
            for (let d = 2; d <= 10 && qs.length < 40; d++) {
                for (let n = 1; n < d && qs.length < 40; n++) {
                    const nombreDenominador = (n > 1 && d !== 2) ? nombres[d - 2] + 's' : (n > 1 && d === 2) ? 'mitades' : nombres[d - 2];
                    const numString = n === 1 ? 'un' : n === 2 ? 'dos' : n === 3 ? 'tres' : n === 4 ? 'cuatro' : n === 5 ? 'cinco' : n === 6 ? 'seis' : n === 7 ? 'siete' : n === 8 ? 'ocho' : 'nueve';
                    
                    qs.push({
                        type: 'input',
                        question: `Escribe con números la fracción "${numString} ${nombreDenominador}": ✍️🔢`,
                        answer: `${n}/${d}`,
                        hints: [`"${numString}" nos dice que el numerador es ${n}.`, `El "${nombreDenominador}" nos indica el denominador ${d}.`, `Usa la barra / para separar.`, `No pongas espacios.`, `Escribe ${n}/${d}.`],
                        explanation: `¡Muy bien escrito! 🌟 " ${numString}" es el numerador (${n}) y el "${nombreDenominador}" nos dice que el de abajo es ${d}. ¡Fracción dominada! ✍️✨`,
                        lessonId: FRACCIONES_INTRO
                    });
                }
            }
            while (qs.length < 40) qs.push(qs[qs.length - 1]); // fallback
            return qs;
        })(),
        ...(() => {
            const qs: Question[] = [];
            let cases = 0;
            for (let d = 2; d <= 8 && qs.length < 40; d++) {
                for (let n = 1; n < d && qs.length < 40; n++) {
                    for (let mult = 2; mult <= 4 && qs.length < 40; mult++) {
                        qs.push({
                            type: 'mcq',
                            question: `¿Cuál de estas fracciones es EQUIVALENTE (vale lo mismo) que ${n}/${d}? 👯‍♂️🔢`,
                            options: [`${n * mult}/${d * mult}`, `${n + 1}/${d + 1}`, `${n}/${d * 3}`].sort(() => Math.random() - 0.5),
                            answer: `${n * mult}/${d * mult}`,
                            hints: [`Para que sea equivalente, debes multiplicar arriba y abajo por el mismo número.`, `Si multiplicas por ${mult}: ${n}x${mult}=${n * mult}, ${d}x${mult}=${d * mult}.`, `Busca ${n * mult}/${d * mult} en las opciones.`, `Equivalente significa 'igual valor'.`],
                            explanation: `¡Bingo! 🎯 ${n}/${d} y ${n * mult}/${d * mult} son fracciones equivalentes (multiplicamos por ${mult}). ¡Son gemelas matemáticas! 👯‍♂️✨`,
                            lessonId: FRACCIONES_EQUIVALENTES
                        });
                    }
                }
            }
            while (qs.length < 40) qs.push(qs[qs.length - 1]); // fallback
            return qs;
        })()
    ],
    3: [
        // === NIVEL 3: 80 preguntas (40 Intro, 40 Equivalentes) ===
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 40; i++) {
                const isNumerador = i % 2 === 0;
                const d = 3 + Math.floor(i / 2);
                const n = (d - 1) - (i % 3);
                qs.push({
                    type: 'input',
                    question: `En la fracción ${n}/${d}, ¿cómo se llama el número de ${isNumerador ? 'arriba' : 'abajo'}? 🧐🆙`,
                    answer: isNumerador ? `numerador` : `denominador`,
                    hints: [isNumerador ? `El de arriba es el "N...".` : `El de abajo es el "D...".`, isNumerador ? `Empieza con N y termina con R.` : `Empieza con D y termina con R.`, `La respuesta es "${isNumerador ? 'numerador' : 'denominador'}".`],
                    explanation: `¡Exacto! 🎯 El número de ${isNumerador ? 'arriba' : 'abajo'} es el **${isNumerador ? 'numerador' : 'denominador'}**. ¡No se te olvida ni una! 🧠✨`,
                    lessonId: FRACCIONES_INTRO
                });
            }
            return qs;
        })(),
        ...(() => {
            const qs: Question[] = [];
            for (let d = 3; d <= 12 && qs.length < 40; d++) {
                for (let n1 = 1; n1 < d - 1 && qs.length < 40; n1++) {
                    for (let n2 = 1; n1 + n2 < d && qs.length < 40; n2++) {
                        qs.push({
                            type: 'input',
                            question: `Calcula la suma de estas fracciones con el mismo denominador: ${n1}/${d} + ${n2}/${d} = ? ➕🧮`,
                            answer: `${n1 + n2}/${d}`,
                            hints: [`Como el denominador es el mismo (${d}), se queda igual abajo.`, `Solo tienes que sumar los numeradores: ${n1} + ${n2}.`, `Pone el resultado arriba y el ${d} abajo.`, `Usa la barra / para separar.`, `La respuesta es ${n1 + n2}/${d}.`],
                            explanation: `¡Maestro de las fracciones! 🌟 Al tener el mismo denominador, solo sumamos los números de arriba: ${n1} + ${n2} = ${n1 + n2}. El resultado es **${n1 + n2}/${d}**. 🧮✨`,
                            lessonId: FRACCIONES_EQUIVALENTES
                        });
                    }
                }
            }
            while (qs.length < 40) qs.push(qs[qs.length - 1]); // fallback
            return qs;
        })()
    ]
};
