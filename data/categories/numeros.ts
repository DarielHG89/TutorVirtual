import type { Question } from '../../types';

// IDs de lecciones
const NUMEROS_1_1 = 'numeros_1_1';
const NUMEROS_1_2 = 'numeros_1_2';
const NUMEROS_1_3 = 'numeros_1_3';

// Helper para crear representaciones visuales de números
const createNumbersSVG = (type: 'blocks' | 'coins' | 'items', data: any): string => {
    let content = '';
    if (type === 'blocks') {
        const { um, h, d, u } = data;
        let x = 5;
        // Millares (cubos morados)
        for (let i = 0; i < (um || 0); i++) {
            content += `<rect x="${x}" y="5" width="25" height="25" fill="#A142F4" stroke="white" stroke-width="1" />`;
            x += 27;
        }
        x = 5;
        // Centenas (cuadrados azules)
        for (let i = 0; i < (h || 0); i++) {
            content += `<rect x="${x}" y="35" width="18" height="18" fill="#4285F4" stroke="white" stroke-width="1" />`;
            x += 20;
        }
        x = 5;
        // Decenas (barras rojas)
        for (let i = 0; i < (d || 0); i++) {
            content += `<rect x="${x}" y="60" width="4" height="30" fill="#EA4335" stroke="white" stroke-width="1" />`;
            x += 6;
        }
        x = 50;
        // Unidades (cuadritos amarillos)
        for (let i = 0; i < (u || 0); i++) {
            content += `<rect x="${x + (i%5)*8}" y="${60 + Math.floor(i/5)*8}" width="6" height="6" fill="#FBBC05" stroke="white" stroke-width="1" />`;
        }
    } else if (type === 'coins') {
        const { val } = data;
        content += `<circle cx="50" cy="50" r="35" fill="#FFD700" stroke="#B8860B" stroke-width="2" />`;
        content += `<text x="50" y="58" font-family="Arial" font-size="28" fill="#B8860B" text-anchor="middle" font-weight="bold">${val}</text>`;
        content += `<text x="50" y="78" font-family="Arial" font-size="10" fill="#B8860B" text-anchor="middle">CUP</text>`;
    } else if (type === 'items') {
        const { icon, count } = data;
        for (let i = 0; i < count; i++) {
            const row = Math.floor(i / 10);
            const col = i % 10;
            content += `<text x="${col * 10 + 2}" y="${row * 12 + 15}" font-size="10">${icon}</text>`;
        }
    }
    return `data:image/svg+xml;base64,${btoa(`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${content}</svg>`)}`;
};

export const numerosQuestions: Record<number, Question[]> = {
    1: [
        // === NIVEL 1: 120 preguntas (40 por lección) ===
        
        // --- NUMEROS_1_1 (40) ---
        { type: 'mcq', question: '¿Qué número es "ochenta y siete"? 🧐🔢', options: ['78', '87', '807'], answer: '87', imageUrl: createNumbersSVG('blocks', { d: 8, u: 7 }), hints: ['"Ochenta" significa 8 decenas.', 'Luego viene "y siete" unidades.', 'Busca el 8 y el 7 juntos.', 'Ochenta y siete.', '87.'], explanation: '¡Correcto! 🎯 8 decenas y 7 unidades forman el **87**. ¡Fácil como un helado de Copelia! 🍨✨', lessonId: NUMEROS_1_1 },
        ...Array.from({ length: 39 }).map((_, i): Question => {
            const num = 10 + i;
            return {
                type: 'input',
                question: `Escribe con cifras el número que ves representado en los bloques: 🧱🔢`,
                imageUrl: createNumbersSVG('blocks', { d: Math.floor(num/10), u: num % 10 }),
                answer: num.toString(),
                hints: [`Cuenta las barras rojas (decenas). Hay ${Math.floor(num/10)}.`, `Cuenta los cuadritos amarillos (unidades). Hay ${num % 10}.`, `Pon el número de barras primero y el de cuadritos después.`, `El número es el ${num}.`, `Usa el teclado numérico.`],
                explanation: `¡Muy bien! 🌟 ${Math.floor(num/10)} decenas y ${num % 10} unidades forman el número **${num}**. ¡Buen conteo! 🧱✨`,
                lessonId: NUMEROS_1_1
            };
        }),

        // --- NUMEROS_1_2 (40) ---
        { type: 'input', question: 'Escribe con cifras: "quinientos sesenta y dos" ✍️📦', answer: '562', imageUrl: createNumbersSVG('blocks', { h: 5, d: 6, u: 2 }), hints:['"Quinientos" es el 500.', '"Sesenta" es el 60.', 'El 2 va al final.', 'Escribe 5, 6, 2.', '562.'], explanation: '¡Perfecto! 🌟 5 centenas, 6 decenas y 2 unidades forman el **562**. ¡Un número bien grande! 📦✨', lessonId: NUMEROS_1_2},
        ...Array.from({ length: 39 }).map((_, i): Question => {
            const num = 100 + i * 20;
            return {
                type: 'input',
                question: `Escribe el número formado por ${Math.floor(num/100)} centenas y ${Math.floor((num%100)/10)} decenas: 🧩🔢`,
                imageUrl: createNumbersSVG('blocks', { h: Math.floor(num/100), d: Math.floor((num%100)/10) }),
                answer: num.toString(),
                hints: [`${Math.floor(num/100)} centenas son ${Math.floor(num/100) * 100}.`, `${Math.floor((num%100)/10)} decenas son ${Math.floor((num%100)/10) * 10}.`, `Súmalos y obtén el número.`, `El número termina en 0 porque no hay unidades sueltas.`, `La respuesta es ${num}.`],
                explanation: `¡Exacto! 🎯 Es el número **${num}**. ¡Has dominado las centenas! 🏆✨`,
                lessonId: NUMEROS_1_2
            };
        }),

        // --- NUMEROS_1_3 (40) ---
        { type: 'mcq', question: '¿Cuál es mayor: 1899 o 1901? ⚖️🚀', options: ['1899', '1901'], answer: '1901', imageUrl: createNumbersSVG('blocks', { h: 9, d: 0, u: 1 }), hints: ['Mira los miles... son iguales (1000).', 'Mira las centenas: 800 contra 900.', 'El que tiene 9 centenas es mayor.', 'Piensa en los años.', '1901.'], explanation: '¡Muy bien! 🎯 **1901** es mayor porque tiene más centenas que 1899. ¡Gran comparación! ⚖️✨', lessonId: NUMEROS_1_3 },
        ...Array.from({ length: 39 }).map((_, i): Question => {
            const val1 = 100 + i * 10;
            const val2 = val1 + 5;
            return {
                type: 'mcq',
                question: `¿Cuál de estos dos números es el MENOR? 🤏📏`,
                imageUrl: createNumbersSVG('coins', { val: val1 }),
                options: [val1.toString(), val2.toString()],
                answer: val1.toString(),
                hints: [`El menor es el que vale menos moneda.`, `Compara ${val1} y ${val2}.`, `¿Cuál tiene menos unidades?`, `El ${val1} viene antes que el ${val2}.`, `La respuesta es ${val1}.`],
                explanation: `¡Correcto! ✅ **${val1}** es menor que ${val2}. ¡Sabes bien cuál es el más pequeñito! 🤏✨`,
                lessonId: NUMEROS_1_3
            };
        }),
    ],
    2: [
        // === NIVEL 2: 120 preguntas (40 por lección) ===
        
        // --- NUMEROS_1_1 (40) ---
        ...Array.from({ length: 40 }).map((_, i): Question => {
            const num = 15 + i*2;
            const target = Math.round(num / 10) * 10;
            return {
                type: 'input',
                question: `¿A qué decena se redondea el número ${num}? 🎯🏹`,
                imageUrl: createNumbersSVG('blocks', { d: Math.floor(num/10), u: num % 10 }),
                answer: target.toString(),
                hints: [`Mira la última cifra (la unidad).`, `Si es 5, 6, 7, 8 o 9, subimos a la siguiente decena.`, `Si es 4, 3, 2 o 1, bajamos.`, `La decena más cercana es...`, `Termina en cero.`],
                explanation: `¡Bingo! 🌟 El número ${num} se redondea a **${target}**. ¡Tienes una puntería matemática excelente! 🏹✨`,
                lessonId: NUMEROS_1_1
            };
        }),

        // --- NUMEROS_1_2 (40) ---
        ...Array.from({ length: 40 }).map((_, i): Question => {
            const num = 1000 + i * 215;
            const h = Math.floor(num / 100);
            return {
                type: 'input',
                question: `¿Cuántas centenas completas hay en el número ${num}? 📦💯`,
                answer: h.toString(),
                hints: [`Una centena son 100 unidades.`, `Divide ${num} entre 100.`, `O simplemente "tapa" las dos últimas cifras del número.`, `¿Cuántos billetes de 100 pesos necesitas?`, `La respuesta es ${h}.`],
                explanation: `¡Genial! 🎯 El número ${num} tiene **${h}** centenas completas. ¡Casi llenas un camión de centenas! 🚚✨`,
                lessonId: NUMEROS_1_2
            };
        }),

        // --- NUMEROS_1_3 (40) ---
        ...Array.from({ length: 40 }).map((_, i): Question => {
            const num = 500 + i * 50;
            return {
                type: 'input',
                question: `Escribe el sucesor (el número que sigue) de ${num}: ➡️🔢`,
                imageUrl: createNumbersSVG('blocks', { h: Math.floor(num/100), d: Math.floor((num%100)/10)}),
                answer: (num + 1).toString(),
                hints: [`Solo súmale 1 al número ${num}.`, `Es el vecino de al lado en la recta numérica.`, `¿Qué dices después de ${num}?`, `Es muy fácil, solo cambia la unidad.`, `La respuesta es ${num + 1}.`],
                explanation: `¡Correcto! ✅ El sucesor de ${num} es **${num + 1}**. ¡Sigue avanzando paso a paso! 🚀✨`,
                lessonId: NUMEROS_1_3
            };
        }),
    ],
    3: [
        // === NIVEL 3: 120 preguntas (40 por lección) ===
        
        // --- NUMEROS_1_1 (40) ---
        ...Array.from({ length: 40 }).map((_, i): Question => {
            const tens = 4 + (i % 5);
            const units = 5;
            const num = tens * 10 + units;
            return {
                type: 'input',
                question: `Soy un número de dos cifras. Mi decena es ${tens} y la suma de mis cifras es ${tens + units}. ¿Quién soy? 🕵️‍♂️🔢`,
                answer: num.toString(),
                hints: [`La primera cifra es ${tens}.`, `La otra cifra debe sumar ${tens + units} cuando la juntes con ${tens}.`, `¿Qué número sumado con ${tens} da ${tens + units}?`, `Es el 5.`, `El número es el ${num}.`],
                explanation: `¡Excelente detective! 🕵️‍♂️ Si la decena es ${tens} y las cifras suman ${tens + units}, la unidad tiene que ser ${units}. ¡El número es el **${num}**! 🔍✨`,
                lessonId: NUMEROS_1_1
            };
        }),

        // --- NUMEROS_1_2 (40) ---
        ...Array.from({ length: 40 }).map((_, i): Question => {
            const um = 2 + (i % 7);
            const c = (i * 2) % 10;
            const total = um * 1000 + c * 100;
            return {
                type: 'input',
                question: `¿A cuántas centenas equivalen ${um} millares y ${c} centenas? 🧮💯`,
                answer: (total / 100).toString(),
                hints: [`Calcula el número total primero: ${um}000 + ${c}00 = ${total}.`, `Ahora divídelo entre 100.`, `Tapa los dos últimos ceros.`, `¿Cuántos grupos de 100 hay en ${total}?`, `La respuesta es ${total / 100}.`],
                explanation: `¡Brillante! 🌟 ${um} millares y ${c} centenas forman el número ${total}, que son exactamente **${total / 100}** centenas. ¡Eres un maestro de las equivalencias! 🏆✨`,
                lessonId: NUMEROS_1_2
            };
        }),

        // --- NUMEROS_1_3 (40) ---
        ...Array.from({ length: 40 }).map((_, i): Question => {
            const start = 9000 + i * 20;
            const nums = [start, start + 1, start - 1].sort(() => Math.random() - 0.5);
            const sorted = [...nums].sort((a,b) => a-b);
            return {
                type: 'input',
                question: `Ordena de MENOR a MAYOR: ${nums.join(', ')} 🔢↕️`,
                answer: sorted.join(', '),
                hints: [`Busca el más chiquito. Es el que tiene la unidad más pequeña.`, `Luego el del medio.`, `Y al final el más grande.`, `Escríbelos así: num1, num2, num3`, `Separa con coma y espacio.`],
                explanation: `¡Buen trabajo! 🎯 El orden correcto es **${sorted.join(', ')}**. ¡Tienes el control total de los números grandes! 🏗️✨`,
                lessonId: NUMEROS_1_3
            };
        }),
    ]
};
