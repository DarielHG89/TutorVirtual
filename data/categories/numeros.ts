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
        { type: 'mcq', question: '¿Qué número es "ochenta y siete"? 🧐🔢', options: ['78', '87', '807'], answer: '87', imageUrl: createNumbersSVG('blocks', { d: 8, u: 7 }), hints: ['"Ochenta" significa 8 decenas.', 'Luego viene "y siete" unidades.', 'Busca el 8 y el 7 juntos.', 'Ochenta y siete.', '87.'], explanation: '¡Correcto! 🎯 8 decenas and 7 unidades forman el **87**. ¡Fácil como un helado de Copelia! 🍨✨', lessonId: NUMEROS_1_1 },
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 39; i++) {
                const num = 10 + i;
                const type = i % 3;
                if (type === 0) {
                    qs.push({
                        type: 'input',
                        question: `Escribe con cifras el número representado por estos bloques: 🧱🔢`,
                        imageUrl: createNumbersSVG('blocks', { d: Math.floor(num/10), u: num % 10 }),
                        answer: num.toString(),
                        hints: [`Cuenta las barras (decenas): hay ${Math.floor(num/10)}.`, `Cuenta los cuadritos (unidades): hay ${num % 10}.`, `Ponlos juntos.`, `El número es ${num}.`, `Usa el teclado.`],
                        explanation: `¡Muy bien! 🌟 ${Math.floor(num/10)} decenas y ${num % 10} unidades forman el número **${num}**. ¡Buen conteo! 🧱✨`,
                        lessonId: NUMEROS_1_1
                    });
                } else if (type === 1) {
                    qs.push({
                        type: 'mcq',
                        question: `En el número ${num}, ¿cuántas DECENAS hay? 🔟`,
                        options: [Math.floor(num/10).toString(), (num%10).toString(), '0'].sort(() => Math.random() - 0.5),
                        answer: Math.floor(num/10).toString(),
                        hints: [`La decena es la cifra de la izquierda en un número de dos cifras.`, `¿Cuál es el primer número en ${num}?`, `Representa grupos de 10.`, `Hay ${Math.floor(num/10)} decenas.`, `Marca la opción correcta.`],
                        explanation: `¡Exacto! 🎯 En el número **${num}**, la cifra **${Math.floor(num/10)}** indica las decenas. ¡Dominas el valor posicional! 🔢🚀`,
                        lessonId: NUMEROS_1_1
                    });
                } else {
                    qs.push({
                        type: 'input',
                        question: `¿Qué número tiene ${Math.floor(num/10)} decenas y ${num%10} unidades? 🧩`,
                        answer: num.toString(),
                        hints: [`${Math.floor(num/10)} decenas son ${Math.floor(num/10)*10}.`, `Súmale las ${num%10} unidades.`, `El número es el ${num}.`, `Escríbelo con cifras.`, `Fíjate bien.`],
                        explanation: `¡Excelente! 🎖️ ${Math.floor(num/10)} decenas y ${num%10} unidades forman el **${num}**. ¡Eres un arquitecto de números! 🏗️✨`,
                        lessonId: NUMEROS_1_1
                    });
                }
            }
            return qs;
        })(),

        // --- NUMEROS_1_2 (40) ---
        { type: 'input', question: 'Escribe con cifras: "quinientos sesenta y dos" ✍️📦', answer: '562', imageUrl: createNumbersSVG('blocks', { h: 5, d: 6, u: 2 }), hints:['"Quinientos" es el 500.', '"Sesenta" es el 60.', 'El 2 va al final.', 'Escribe 5, 6, 2.', '562.'], explanation: '¡Perfecto! 🌟 5 centenas, 6 decenas y 2 unidades forman el **562**. ¡Un número bien grande! 📦✨', lessonId: NUMEROS_1_2},
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 39; i++) {
                const num = 100 + i * 20;
                const type = i % 2;
                if (type === 0) {
                    qs.push({
                        type: 'input',
                        question: `¿Qué número forman ${Math.floor(num/100)} centenas y ${Math.floor((num%100)/10)} decenas? 🧩🔢`,
                        imageUrl: createNumbersSVG('blocks', { h: Math.floor(num/100), d: Math.floor((num%100)/10) }),
                        answer: num.toString(),
                        hints: [`${Math.floor(num/100)} centenas son ${Math.floor(num/100) * 100}.`, `${Math.floor((num%100)/10)} decenas son ${Math.floor((num%100)/10) * 10}.`, `Súmalos.`, `No hay unidades sueltas.`, `La respuesta es ${num}.`],
                        explanation: `¡Exacto! 🎯 Es el número **${num}**. ¡Has dominado las centenas! 🏆✨`,
                        lessonId: NUMEROS_1_2
                    });
                } else {
                    const titles = ['ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
                    const hundreds = Math.floor(num/100);
                    qs.push({
                        type: 'mcq',
                        question: `¿Cómo se lee el número ${num}? 🗣️📖`,
                        options: [`${titles[hundreds-1]} ${num%100 === 0 ? '' : 'y algo'}`, 'mil', 'cien'].sort(() => Math.random() - 0.5),
                        answer: `${titles[hundreds-1]}${num%100 === 0 ? '' : (num%100 < 100 && num%100 >= 10 ? ' ' + (num%100).toString() : '')}`,
                        hints: [`Empieza por las centenas: ${hundreds}00.`, `Se dice ${titles[hundreds-1]}.`, `Luego los demás números.`, `Es un número de tres cifras.`, `La respuesta correcta es la que empieza por ${titles[hundreds-1]}.`],
                        explanation: `¡Muy bien leído! 📖 El número **${num}** se lee combinando sus partes. ¡Cada vez lees mejor! 🌟✨`,
                        lessonId: NUMEROS_1_2
                    });
                }
            }
            return qs;
        })(),

        // --- NUMEROS_1_3 (40) ---
        { type: 'mcq', question: '¿Cuál es mayor: 1899 o 1901? ⚖️🚀', options: ['1899', '1901'], answer: '1901', imageUrl: createNumbersSVG('blocks', { h: 9, d: 0, u: 1 }), hints: ['Mira los miles... son iguales (1000).', 'Mira las centenas: 800 contra 900.', 'El que tiene 9 centenas es mayor.', 'Piensa en los años.', '1901.'], explanation: '¡Muy bien! 🎯 **1901** es mayor porque tiene más centenas que 1899. ¡Gran comparación! ⚖️✨', lessonId: NUMEROS_1_3 },
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 39; i++) {
                const val1 = 100 + i * 10;
                const type = i % 2;
                if (type === 0) {
                    qs.push({
                        type: 'mcq',
                        question: `¿Cuál de estos dos números es el MENOR? 🤏📏`,
                        imageUrl: createNumbersSVG('coins', { val: val1 }),
                        options: [val1.toString(), (val1 + 5).toString()],
                        answer: val1.toString(),
                        hints: [`El menor es el que vale menos moneda.`, `Compara ${val1} y ${val1 + 5}.`, `¿Cuál tiene menos unidades?`, `El ${val1} viene antes.`, `La respuesta es ${val1}.`],
                        explanation: `¡Correcto! ✅ **${val1}** es menor que ${val1 + 5}. ¡Sabes bien cuál es el más pequeñito! 🤏✨`,
                        lessonId: NUMEROS_1_3
                    });
                } else {
                    qs.push({
                        type: 'input',
                        question: `Escribe el ANTECESOR de ${val1} (el que viene justo antes): ⬅️🔢`,
                        answer: (val1 - 1).toString(),
                        hints: [`Réstale 1 al número ${val1}.`, `¿Qué número dices antes de ${val1}?`, `Termina en 9.`, `Es el ${val1 - 1}.`, `Última cifra es 9.`],
                        explanation: `¡Exacto! 🎯 El antecesor de ${val1} es **${val1 - 1}**. ¡Conoces muy bien a los vecinos de los números! 🏘️✨`,
                        lessonId: NUMEROS_1_3
                    });
                }
            }
            return qs;
        })(),
    ],
    2: [
        // === NIVEL 2: 120 preguntas (40 por lección) ===
        
        // --- NUMEROS_1_1 (40) ---
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 40; i++) {
                const num = 15 + i*2;
                const type = i % 2;
                if (type === 0) {
                    const target = Math.round(num / 10) * 10;
                    qs.push({
                        type: 'input',
                        question: `¿A qué decena se redondea el número ${num}? 🎯🏹`,
                        imageUrl: createNumbersSVG('blocks', { d: Math.floor(num/10), u: num % 10 }),
                        answer: target.toString(),
                        hints: [`Mira la última cifra (la unidad).`, `Si es 5 o más, subimos.`, `Si es menos de 5, bajamos.`, `La decena más cercana es...`, `Termina en cero.`],
                        explanation: `¡Bingo! 🌟 El número ${num} se redondea a **${target}**. ¡Tienes una puntería matemática excelente! 🏹✨`,
                        lessonId: NUMEROS_1_1
                    });
                } else {
                    const descomp = `${Math.floor(num/10)}0 + ${num%10}`;
                    qs.push({
                        type: 'input',
                        question: `Descompón el número ${num} en sumandos (ejemplo: 23 = 20 + 3): 🧩`,
                        answer: descomp,
                        hints: [`Separa las decenas de las unidades.`, `¿Cuánto valen ${Math.floor(num/10)} decenas? (${Math.floor(num/10)*10})`, `Súmale las ${num%10} unidades.`, `Escribe: XX + Y`, `La respuesta es ${descomp}.`],
                        explanation: `¡Genial! 🎯 El número ${num} se descompone en **${descomp}**. ¡Estás analizando los números por dentro! 🧬✨`,
                        lessonId: NUMEROS_1_1
                    });
                }
            }
            return qs;
        })(),

        // --- NUMEROS_1_2 (40) ---
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 40; i++) {
                const num = 1000 + i * 215;
                const type = i % 2;
                if (type === 0) {
                    const h = Math.floor(num / 100);
                    qs.push({
                        type: 'input',
                        question: `¿Cuántas centenas completas hay en el número ${num}? 📦💯`,
                        answer: h.toString(),
                        hints: [`Una centena son 100 unidades.`, `Divide ${num} entre 100.`, `Tapa las dos últimas cifras.`, `Necesitas ${h} billetes de 100.`, `La respuesta es ${h}.`],
                        explanation: `¡Genial! 🎯 El número ${num} tiene **${h}** centenas completas. ¡Casi llenas un camión! 🚚✨`,
                        lessonId: NUMEROS_1_2
                    });
                } else {
                    const h = Math.floor((num % 1000) / 100);
                    qs.push({
                        type: 'mcq',
                        question: `En el número ${num}, ¿qué cifra ocupa el lugar de las CENTENAS? 🏰`,
                        options: [h.toString(), Math.floor(num/1000).toString(), (Math.floor(num/10)%10).toString()].sort(() => Math.random() - 0.5),
                        answer: h.toString(),
                        hints: [`La centena es la tercera cifra contando desde la derecha.`, `Unidades, Decenas, CENTENAS...`, `Es el número ${h}.`, `Fíjate bien en la posición.`, `Marca el ${h}.`],
                        explanation: `¡Exacto! 🎯 En **${num}**, el **${h}** es el jefe de las centenas. ¡Tu vista matemática es de águila! 🦅✨`,
                        lessonId: NUMEROS_1_2
                    });
                }
            }
            return qs;
        })(),

        // --- NUMEROS_1_3 (40) ---
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 40; i++) {
                const num = 500 + i * 50;
                const type = i % 2;
                if (type === 0) {
                    qs.push({
                        type: 'input',
                        question: `Escribe el SUCESOR de ${num}: ➡️🔢`,
                        imageUrl: createNumbersSVG('blocks', { h: Math.floor(num/100), d: Math.floor((num%100)/10)}),
                        answer: (num + 1).toString(),
                        hints: [`Súmale 1 al número ${num}.`, `Es el vecino de la derecha.`, `¿Qué sigue después de ${num}?`, `Cambia la unidad.`, `La respuesta es ${num + 1}.`],
                        explanation: `¡Correcto! ✅ El sucesor de ${num} es **${num + 1}**. ¡Sigue avanzando paso a paso! 🚀✨`,
                        lessonId: NUMEROS_1_3
                    });
                } else {
                    const comp = num > (num - 25) ? '>' : '<';
                    qs.push({
                        type: 'mcq',
                        question: `Compara: ${num} ___ ${num - 25}. ¿Qué signo va en el medio? ⚖️`,
                        options: ['>', '<', '='],
                        answer: '>',
                        hints: [`${num} es mayor que ${num - 25}.`, `La "boca" del cocodrilo se come al más grande.`, `El mayor es ${num}.`, `Usa el signo >.`, `Más es mejor.`],
                        explanation: `¡Perfecto! 🎯 **${num} > ${num - 25}**. ¡Sabes comparar como un experto! ⚖️✨`,
                        lessonId: NUMEROS_1_3
                    });
                }
            }
            return qs;
        })(),
    ],
    3: [
        // === NIVEL 3: 120 preguntas (40 por lección) ===
        
        // --- NUMEROS_1_1 (40) ---
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 40; i++) {
                const tens = 4 + Math.floor(i / 10); 
                const units = i % 10;
                const num = tens * 10 + units;
                qs.push({
                    type: 'input',
                    question: `Adivinanza: Soy un número de dos cifras. Mi decena es ${tens} y la suma de mis cifras es ${tens + units}. ¿Quién soy? 🕵️‍♂️🔢`,
                    answer: num.toString(),
                    hints: [`La primera cifra es ${tens}.`, `La otra cifra sumada con ${tens} da ${tens + units}.`, `Esa cifra es ${units}.`, `Junta el ${tens} y el ${units}.`, `El número es ${num}.`],
                    explanation: `¡Excelente detective! 🕵️‍♂️ Si la decena es ${tens} y las cifras deben sumar ${tens + units}, la unidad obligatoriamente es ${units} (${tens} + ${units} = ${tens + units}). ¡El número secreto es el **${num}**! 🔍✨`,
                    lessonId: NUMEROS_1_1
                });
            }
            return qs;
        })(),

        // --- NUMEROS_1_2 (40) ---
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 40; i++) {
                const um = 1 + Math.floor(i / 5); 
                const c = (i % 5) * 2; 
                const total = um * 1000 + c * 100;
                qs.push({
                    type: 'input',
                    question: `¿A cuántas CENTENAS equivalen ${um} millares y ${c} centenas juntos? 🧮💯`,
                    answer: (total / 100).toString(),
                    hints: [`Calcula el total: ${um}000 + ${c}00 = ${total}.`, `1 centena = 100.`, `Divide ${total} entre 100.`, `Quita los últimos dos ceros.`, `La respuesta es ${total / 100}.`],
                    explanation: `¡Brillante! 🌟 ${um} millares (${um*10} centenas) y ${c} centenas más suman un total de **${total / 100}** centenas. ¡Eres un maestro de las conversiones! 🏆✨`,
                    lessonId: NUMEROS_1_2
                });
            }
            return qs;
        })(),

        // --- NUMEROS_1_3 (40) ---
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 40; i++) {
                const start = 9000 + i * 20;
                const nums = [start, start + 1, start - 1].sort(() => Math.random() - 0.5);
                const sorted = [...nums].sort((a,b) => a-b);
                qs.push({
                    type: 'input',
                    question: `Ordena estos tres números de MENOR a MAYOR: ${nums.join(', ')} 🔢↕️`,
                    answer: sorted.join(', '),
                    hints: [`Busca el más pequeño de los tres.`, `Luego el del medio.`, `Y al final el más grande.`, `Escríbelos separados por coma y espacio: num1, num2, num3`, `Fíjate en las unidades.`],
                    explanation: `¡Buen trabajo! 🎯 Para ordenar de menor a mayor, comparamos cifra a cifra. El orden correcto es **${sorted.join(', ')}**. 
                    - ${sorted[0]} es el menor.
                    - ${sorted[1]} está en el medio.
                    - ${sorted[2]} es el mayor.
                    ¡Tienes el control total de los números! 🏗️✨`,
                    lessonId: NUMEROS_1_3
                });
            }
            return qs;
        })(),
    ]
};
