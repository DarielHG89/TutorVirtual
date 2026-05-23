import type { Question } from '../../../../../types';

// IDs de lecciones
const ADICION = 'adicion_2_2';
const SUSTRACCION = 'sustraccion_2_3';

// Helper para crear representaciones visuales de aritmética
const createMathSVG = (type: 'add' | 'sub', a: number, b: number): string => {
    let content = '';
    let viewBox = "0 0 100 100";
    let maxX = 100;
    let maxY = 100;
    if (type === 'add') {
        // Círculos para el primer número
        for (let i = 0; i < a; i++) {
            const x = (i % 5) * 8 + 5;
            const y = Math.floor(i / 5) * 8 + 10;
            content += `<circle cx="${x}" cy="${y}" r="3" fill="#4285F4" />`;
            maxX = Math.max(maxX, x + 10);
            maxY = Math.max(maxY, y + 10);
        }
        content += `<text x="${maxX}" y="30" font-size="12" font-weight="bold" font-family="sans-serif">+</text>`;
        let offset = maxX + 10;
        // Círculos para el segundo número
        for (let i = 0; i < b; i++) {
            const x = (i % 5) * 8 + offset;
            const y = Math.floor(i / 5) * 8 + 10;
            content += `<circle cx="${x}" cy="${y}" r="3" fill="#34A853" />`;
            maxX = Math.max(maxX, x + 10);
            maxY = Math.max(maxY, y + 10);
        }
    } else {
        // Círculos totales
        for (let i = 0; i < a; i++) {
            const x = (i % 10) * 8 + 10;
            const y = Math.floor(i / 10) * 8 + 20;
            if (i < a - b) {
                content += `<circle cx="${x}" cy="${y}" r="3" fill="#EA4335" />`;
            } else {
                // Tachados
                content += `<circle cx="${x}" cy="${y}" r="3" fill="#CCCCCC" />`;
                content += `<line x1="${x-2}" y1="${y-2}" x2="${x+2}" y2="${y+2}" stroke="black" stroke-width="1" />`;
            }
            maxX = Math.max(maxX, x + 10);
            maxY = Math.max(maxY, y + 10);
        }
    }
    viewBox = `0 0 ${maxX} ${maxY}`;
    return `data:image/svg+xml;base64,${btoa(`<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">${content}</svg>`)}`;
};

export const sumaRestaQuestions: Record<number, Question[]> = {
    1: [
        // === NIVEL 1: 80 preguntas (40 Adición, 40 Sustracción) ===
        ...(() => {
            const qs: Question[] = [];
            const themes = [
                { item: 'panes 🥖', action: 'compraste' },
                { item: 'manzanas 🍎', action: 'recolectaste' },
                { item: 'libros 📚', action: 'leíste' },
                { item: 'caramelos 🍬', action: 'encontraste' },
                { item: 'lápices ✏️', action: 'conseguiste' }
            ];
            for (let i = 0; i < 3; i++) {
                const a = 5 + i;
                const b = 2 + (i % 5);
                const theme = themes[i % themes.length];
                const isMcq = i % 2 === 0;
                qs.push({
                    type: isMcq ? 'mcq' : 'input',
                    question: `Si los sumandos son ${a} y ${b} ${theme.item}, ¿cuál es la suma o total?`,
                    imageUrl: createMathSVG('add', a, b),
                    options: isMcq ? [(a + b).toString(), (a + b + 2).toString(), (a + b - 1).toString()].sort(() => Math.random() - 0.5) : undefined,
                    answer: (a + b).toString(),
                    hints: [`Une los sumandos.`, `Suma ${a} más ${b}.`, `Cuenta los círculos en la imagen.`, `El resultado es la suma o total.`],
                    explanation: `¡Muy bien! 🎯 Al unir los sumandos ${a} y ${b}, obtenemos la suma de **${a + b}**. ¡Excelente trabajo! ✨`,
                    lessonId: ADICION
                });
            }
            return qs;
        })(),
        ...(() => {
            const qs: Question[] = [];
            const themes = [
                { item: 'mangos 🥭', action: 'regalaste' },
                { item: 'galletas 🍪', action: 'te comiste' },
                { item: 'chapas 🍾', action: 'perdiste' },
                { item: 'pesos 💵', action: 'gastaste' }
            ];
            for (let i = 0; i < 3; i++) {
                const a = 10 + i;
                const b = 1 + (i % 8);
                const theme = themes[i % themes.length];
                const isMcq = i % 2 !== 0;
                qs.push({
                    type: isMcq ? 'mcq' : 'input',
                    question: `Si el minuendo es ${a} ${theme.item} y el sustraendo es ${b}, ¿cuál es la diferencia?`,
                    imageUrl: createMathSVG('sub', a, b),
                    options: isMcq ? [(a - b).toString(), (a - b + 2).toString(), (a - b - 1).toString()].sort(() => Math.random() - 0.5) : undefined,
                    answer: (a - b).toString(),
                    hints: [`Recuerda: minuendo - sustraendo = diferencia.`, `A ${a} quítale ${b}.`, `¿Cuánto es ${a} - ${b}?`, `La diferencia es ${a - b}.`],
                    explanation: `¡Correcto! ✅ Al restar el sustraendo del minuendo, la diferencia es **${a - b}**. ¡Eres muy inteligente! 🌟`,
                    lessonId: SUSTRACCION
                });
            }
            return qs;
        })()
    ],
    2: [
        // === NIVEL 2: 80 preguntas (40 Adición, 40 Sustracción) ===
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 3; i++) {
                const a = 25 + i * 2;
                const b = 15 + i;
                const isMcq = i % 2 === 0;
                qs.push({
                    type: isMcq ? 'mcq' : 'input',
                    question: `Realiza el cálculo en columna: Suma ${a} y ${b}. ¡Controla la llevada! 🧮🔢`,
                    imageUrl: createMathSVG('add', Math.floor(a/10), Math.floor(b/10)),
                    options: isMcq ? [(a + b).toString(), (a + b + 10).toString(), (a + b - 10).toString()].sort(() => Math.random() - 0.5) : undefined,
                    answer: (a + b).toString(),
                    hints: [`Alinea las unidades: ${a%10} + ${b%10}.`, `Si sumas más de 9, ¡te llevas una a las decenas! 🎈`, `Suma las decenas incluyendo la que te llevaste.`, `El total es ${a + b}.`],
                    explanation: `¡Excelente cálculo! 🎯 Colocando los sumandos en columna y sumando correctamente obtenemos **${a + b}**. ¡Dominas el algoritmo! 🧠✨`,
                    lessonId: ADICION
                });
            }
            return qs;
        })(),
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 3; i++) {
                const a = 50 + i * 2;
                const b = 12 + i;
                const isMcq = i % 2 !== 0;
                qs.push({
                    type: isMcq ? 'mcq' : 'input',
                    question: `Encuentra la diferencia entre ${a} y ${b} usando el cálculo en columna. ➖📉`,
                    imageUrl: createMathSVG('sub', 20, 5), // Representativo
                    options: isMcq ? [(a - b).toString(), (a - b + 10).toString(), (a - b - 10).toString()].sort(() => Math.random() - 0.5) : undefined,
                    answer: (a - b).toString(),
                    hints: [`Alinea minuendo y sustraendo en la tabla MCDU.`, `Resta unidades. Si el minuendo es menor, pide a la decena vecina.`, `¿Cuánto es ${a} - ${b}?`, `La diferencia es ${a - b}.`],
                    explanation: `¡Muy bien hecho! ✅ La diferencia entre el minuendo ${a} y el sustraendo ${b} es **${a - b}**. ¡Las restas ya no tienen secretos! 🛡️✨`,
                    lessonId: SUSTRACCION
                });
            }
            return qs;
        })()
    ],
    3: [
        // === NIVEL 3: 80 preguntas (40 Adición, 40 Sustracción) ===
        ...(() => {
            const qs: Question[] = [];
            const themes = [
                { leg1: 'de La Habana a Varadero 🚌', leg2: 'de Varadero a Matanzas' },
                { leg1: 'de comprar los juguetes 🧸', leg2: 'de comprar los libros 📚' },
                { leg1: 'en pintar la pared 🎨', leg2: 'en arreglar la puerta 🚪' },
                { leg1: 'por las manzanas 🍎', leg2: 'por los plátanos 🍌' }
            ];
            for (let i = 0; i < 3; i++) {
                const a = 250 + i * 15;
                const b = 175 + i * 10;
                const theme = themes[i % themes.length];
                const isMcq = i % 2 === 0;
                qs.push({
                    type: isMcq ? 'mcq' : 'input',
                    question: `El costo ${theme.leg1} es $${a},00 y ${theme.leg2} es $${b},00. ¿Cuánto gastas en total? 💰`,
                    options: isMcq ? [(a + b).toString(), (a + b + 50).toString(), (a + b - 50).toString()].sort(() => Math.random() - 0.5) : undefined,
                    answer: (a + b).toString(),
                    hints: [`Suma los precios alineándolos en la columna.`, `Cientos con cientos, decenas con decenas...`, `¿Cuánto es ${a} + ${b}?`, `El total es ${a + b}.`],
                    explanation: `¡Perfecto! 🌍 Sumando los gastos, el total es de **$${a + b},00**. ¡Muy bien calculado! ✨`,
                    lessonId: ADICION
                });
            }
            return qs;
        })(),
        ...(() => {
            const qs: Question[] = [];
            const themes = [
                { item: 'en el agro 🌽' },
                { item: 'en la pizzería 🍕' },
                { item: 'en la juguetera 🧸' },
                { item: 'en la panadería 🥖' }
            ];
            for (let i = 0; i < 3; i++) {
                const total = 1000 + i * 50;
                const gasto = 450 + i * 25;
                const theme = themes[i % themes.length];
                const isMcq = i % 2 !== 0;
                qs.push({
                    type: isMcq ? 'mcq' : 'input',
                    question: `Si tenías $${total},00 pesos y gastaste $${gasto},00 ${theme.item}, ¿cuántos pesos te sobraron? 💵`,
                    options: isMcq ? [(total - gasto).toString(), (total - gasto + 100).toString(), (total - gasto - 100).toString()].sort(() => Math.random() - 0.5) : undefined,
                    answer: (total - gasto).toString(),
                    hints: [`Es una sustracción: $${total} - $${gasto}.`, `Halla la diferencia entre los valores.`, `Haz la comprobación sumando el resultado al gasto.`, `La respuesta es ${total - gasto}.`],
                    explanation: `¡Cálculo exacto! 🎯 Te sobraron **$${total - gasto},00** pesos. ¡Eres muy bueno administrando el ahorro! 💵🧤✨`,
                    lessonId: SUSTRACCION
                });
            }
            return qs;
        })()
    ]
};
