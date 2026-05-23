import type { Question } from '../../../../../types';

// IDs de lecciones
const MULTIPLICACION = 'multiplicacion_3_1';
const DIVISION = 'division_3_2';
const DIVISION_ESCRITA = 'division_3_3';

// Helper para crear representaciones visuales de multi y divi
const createMultiDivSVG = (type: 'multi' | 'div' | 'galera', a: number, b: number): string => {
    let content = '';
    let viewBox = "0 0 100 100";
    if (type === 'multi') {
        let maxX = 100;
        let maxY = 100;
        // Filas y columnas de puntos
        for (let r = 0; r < a; r++) {
            for (let c = 0; c < b; c++) {
                const x = c * 8 + 10;
                const y = r * 8 + 10;
                content += `<circle cx="${x}" cy="${y}" r="3" fill="#FBBC05" stroke="#B8860B" stroke-width="0.5" />`;
                maxX = Math.max(maxX, x + 10);
                maxY = Math.max(maxY, y + 20);
            }
        }
        content += `<text x="5" y="${maxY + 5}" font-size="8" fill="#B8860B" font-family="sans-serif">${a} filas x ${b} col</text>`;
        viewBox = `0 0 ${maxX} ${maxY + 15}`;
    } else if (type === 'div') {
        let maxX = 100;
        let maxY = 100;
        // Reparto en cajas
        const total = a;
        const groups = b;
        const perGroup = Math.floor(total / groups);
        for (let g = 0; g < groups; g++) {
            const bx = (g % 3) * 30 + 5;
            const by = Math.floor(g / 3) * 30 + 5;
            content += `<rect x="${bx}" y="${by}" width="25" height="25" rx="2" fill="none" stroke="#4285F4" stroke-dasharray="2" />`;
            for (let i = 0; i < perGroup; i++) {
                const dotX = bx + (i % 3) * 6 + 6;
                const dotY = by + Math.floor(i / 3) * 6 + 6;
                content += `<circle cx="${dotX}" cy="${dotY}" r="2" fill="#EA4335" />`;
            }
            maxX = Math.max(maxX, bx + 30);
            maxY = Math.max(maxY, by + 30);
        }
        viewBox = `0 0 ${maxX} ${maxY}`;
    } else if (type === 'galera') {
        content += `<text x="15" y="45" font-family="monospace" font-size="24" font-weight="bold">${a}</text>`;
        content += `<line x1="45" y1="20" x2="45" y2="55" stroke="black" stroke-width="2" />`;
        content += `<line x1="45" y1="55" x2="85" y2="55" stroke="black" stroke-width="2" />`;
        content += `<text x="55" y="45" font-family="monospace" font-size="24" font-weight="bold">${b}</text>`;
        content += `<text x="10" y="85" font-size="10" fill="#666" font-family="sans-serif">¿Cuál es el cociente?</text>`;
        viewBox = "0 0 100 100";
    }
    return `data:image/svg+xml;base64,${btoa(`<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">${content}</svg>`)}`;
};

export const multiDiviQuestions: Record<number, Question[]> = {
    1: [
        // === NIVEL 1: 80 preguntas (40 Multiplicación, 40 División) ===
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 3; i++) {
                const a = 2 + (i % 4);
                const b = 3 + (Math.floor(i / 4) % 3);
                qs.push({
                    type: 'input',
                    question: `Si tienes ${a} bolsitas de caramelos y cada una trae ${b} caramelos, ¿cuántos tienes en total? 🍬🛍️`,
                    imageUrl: createMultiDivSVG('multi', a, b),
                    answer: (a * b).toString(),
                    hints: [`Es una suma repetida: suma ${b} unas ${a} veces.`, `Mira la imagen: cuenta todas las bolitas amarillas.`, `¿Cuánto es ${a} veces ${b}?`, `Multiplica ${a} x ${b}.`, `La respuesta es ${a * b}.`],
                    explanation: `¡Excelente! 🎯 Multiplicar ${a} por ${b} es lo mismo que sumar ${b} ${a} veces. En total tienes **${a * b}** caramelos para disfrutar. 🍬✨`,
                    lessonId: MULTIPLICACION
                });
            }
            return qs;
        })(),
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 3; i++) {
                const groups = 2 + (i % 3);
                const perGroup = 2 + (Math.floor(i / 3) % 4);
                const total = groups * perGroup;
                qs.push({
                    type: 'input',
                    question: `Repartes ${total} limones 🍋 en ${groups} vasijas por igual. ¿Cuántos limones pones en cada vasija?`,
                    imageUrl: createMultiDivSVG('div', total, groups),
                    answer: perGroup.toString(),
                    hints: [`Repartir es dividir.`, `Pon la misma cantidad en cada una de las ${groups} vasijas.`, `Busca un número que multiplicado por ${groups} dé ${total}.`, `${groups} x ? = ${total}.`, `La respuesta es ${perGroup}.`],
                    explanation: `¡Muy bien repartido! 🍋 Si divides ${total} entre ${groups}, a cada vasija le tocan **${perGroup}** limones. ¡Perfecto para una limonada! 🥤✨`,
                    lessonId: DIVISION
                });
            }
            return qs;
        })()
    ],
    2: [
        // === NIVEL 2: 80 preguntas (40 Multiplicación, 40 División) ===
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 3; i++) {
                if (i % 2 === 0) {
                    // Truco de los ceros: multiplicando por 10 o 100
                    const a = 12 + i;
                    const b = i % 4 === 0 ? 10 : 100;
                    qs.push({
                        type: 'input',
                        question: `Calcula: ${a} x ${b}. ¡Usa el truco de los ceros! 🧮🚀`,
                        answer: (a * b).toString(),
                        hints: [`Cuando multiplicas por 10 agregas un cero.`, `Cuando multiplicas por 100 agregas dos ceros al final.`, `Escribe de nuevo el ${a}.`, `Añádele los ceros del ${b}.`, `El resultado es ${a * b}.`],
                        explanation: `¡Fácil y rápido! ⚡ Al multiplicar un número por ${b}, simplemente agregamos los ceros al final para obtener **${a * b}**. ¡El poder de los ceros! ✨`,
                        lessonId: MULTIPLICACION
                    });
                } else {
                    const a = 12 + i;
                    const b = 3 + (i % 3);
                    qs.push({
                        type: 'input',
                        question: `Calcula: ${a} x ${b}. ¡Hazlo paso a paso! 🧮🚀`,
                        imageUrl: createMultiDivSVG('multi', Math.floor(a/4), 4),
                        answer: (a * b).toString(),
                        hints: [`Multiplica ${b} por las unidades: ${b} x ${a % 10}.`, `Luego multiplica ${b} por las decenas: ${b} x ${Math.floor(a/10)}0.`, `Súmalo todo.`, `Usa la libreta si te ayuda.`, `El resultado es ${a * b}.`],
                        explanation: `¡Genial! 🎯 Multiplicando por partes (${b}x${a%10} y ${b}x${Math.floor(a/10)}0) y sumando, llegamos a **${a * b}**. ¡Eres un rayo calculando! ⚡✨`,
                        lessonId: MULTIPLICACION
                    });
                }
            }
            return qs;
        })(),
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 3; i++) {
                if (i % 2 === 0) {
                    const quotient = 10 + i;
                    const divisor = i % 4 === 0 ? 10 : 100;
                    const total = quotient * divisor;
                    qs.push({
                        type: 'input',
                        question: `Calcula: ${total} : ${divisor}. ¡Usa el truco de quitar ceros! ✂️0️⃣`,
                        answer: quotient.toString(),
                        hints: [`Cuando divides por 10 quitas un cero.`, `Cuando divides por 100 quitas dos ceros.`, `¿Cuántos ceros tiene el ${divisor}?`, `Quítale esos ceros al ${total}.`, `La respuesta es ${quotient}.`],
                        explanation: `¡Muy astuto! 🎯 Al dividir un número entre ${divisor}, simplemente eliminamos la misma cantidad de ceros del final. El resultado es **${quotient}**. ¡Como por arte de magia! 🪄✨`,
                        lessonId: DIVISION
                    });
                } else {
                    const perGroup = 11 + i;
                    const groups = 2 + (i % 4);
                    const total = perGroup * groups;
                    qs.push({
                        type: 'input',
                        question: `Si repartes ${total} canicas 🔵 entre ${groups} amigos, ¿cuántas le tocan a cada uno?`,
                        imageUrl: createMultiDivSVG('div', 20, groups),
                        answer: perGroup.toString(),
                        hints: [`Divide ${total} entre ${groups}.`, `Empieza dividiendo las decenas.`, `¿Cuántas veces cabe el ${groups} en el ${total}?`, `Es un reparto exacto.`, `La respuesta es ${perGroup}.`],
                        explanation: `¡Reparto perfecto! 🎯 Cada amigo recibe **${perGroup}** canicas. ¡A jugar a las bolas! 🔵✨`,
                        lessonId: DIVISION
                    });
                }
            }
            // División con resto (Nivel 2)
            for (let i = 0; i < 3; i++) {
                const divisor = 2 + (i % 5);
                const quotient = 5 + (i % 10);
                const remainder = 1 + (i % (divisor - 1 || 1));
                const total = (divisor * quotient) + remainder;
                qs.push({
                    type: 'input',
                    question: `Calcula el resto de esta división: ${total} ÷ ${divisor} 🍎♻️`,
                    answer: remainder.toString(),
                    hints: [`¿Cuántas veces cabe el ${divisor} en ${total}?`, `Cabe ${quotient} veces porque ${divisor} x ${quotient} = ${divisor * quotient}.`, `Ahora resta: ${total} - ${divisor * quotient}.`, `Lo que sobra es el resto.`],
                    explanation: `¡Correcto! 👀 En la división ${total} ÷ ${divisor}, el cociente es ${quotient} y sobran **${remainder}**. ¡El resto siempre es menor que el divisor! ✨`,
                    lessonId: 'division_3_resto'
                });
            }
            return qs;
        })()
    ],
    3: [
        // === NIVEL 3: 80 preguntas (40 Multiplicación, 40 División) ===
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 3; i++) {
                const a = 45 + i * 5;
                const b = 6 + (i % 4);
                qs.push({
                    type: 'input',
                    question: `En un camión 🚚 vienen ${a} cajas de tabaco, y cada caja trae ${b} mazos. ¿Cuántos mazos de tabaco trae el camión en total?`,
                    answer: (a * b).toString(),
                    hints: [`Es una multiplicación: ${a} x ${b}.`, `Multiplica primero las unidades y lleva lo que sobre.`, `Luego las decenas y suma lo que llevabas.`, `¿Cuánto es ${a} multiplicado por ${b}?`, `El resultado es ${a * b}.`],
                    explanation: `¡Cálculo de experto! 🎩 Multiplicamos las cajas por los mazos: ${a} x ${b} = **${a * b}**. ¡Carga completa! 🚚✨`,
                    lessonId: MULTIPLICACION
                });
            }
            return qs;
        })(),
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 3; i++) {
                const divisor = 5 + (i % 5);
                const quotient = 25 + i * 2;
                const total = divisor * quotient;
                qs.push({
                    type: 'input',
                    question: `Tienes ${total} galletas 🍪 y quieres hacer ${divisor} paquetes iguales. ¿Cuántas galletas tendrá cada paquete?`,
                    answer: quotient.toString(),
                    hints: [`Divide ${total} entre ${divisor}.`, `Usa el método de la casita (división larga).`, `¿Cuántas veces cabe el ${divisor} en el ${total}?`, `No sobra ninguna galleta.`, `La respuesta es ${quotient}.`],
                    explanation: `¡Maestro de la división! 🎯 Podrás armar los ${divisor} paquetes con **${quotient}** galletas cada uno. ¡Bien empaquetado! 📦✨`,
                    lessonId: DIVISION
                });
            }
            // Problemas de división con resto (Nivel 3)
            qs.push({
                type: 'input',
                question: 'Una obrera empaqueta 55 vasos en cajas de 6 vasos cada una. ¿Cuántos vasos le sobran? 🏺📦',
                answer: '1',
                hints: ['Divide 55 entre 6.', 'Busca en la tabla del 6: 6 x 9 = 54.', 'Calcula la diferencia: 55 - 54.', 'Uno.'],
                explanation: '55 ÷ 6 = 9 y sobra **1**. Se llenan 9 cajas y queda un vaso suelto. 🏺',
                lessonId: 'division_3_resto'
            });
            qs.push({
                type: 'input',
                question: 'Para un auto nuevo se necesitan 5 gomas. ¿Cuántas gomas sobran si tenemos 878 gomas para armar autos? 🚗🛞',
                answer: '3',
                hints: ['Divide 878 entre 5.', 'En la división larga: el último residuo es el que sobra.', 'Resta hasta el final.', 'Tres.'],
                explanation: '878 ÷ 5 da 175 autos y sobran **3** gomas. ¡Muy bien calculado! 🛞',
                lessonId: 'division_3_resto'
            });
            return qs;
        })(),
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 3; i++) {
                const divisor = 2 + (i % 3);
                const quotient = 10 + i;
                const total = divisor * quotient;
                qs.push({
                    type: 'input',
                    question: `Resuelve la siguiente división usando el método de la galera: ${total} ÷ ${divisor} 🏰`,
                    imageUrl: createMultiDivSVG('galera', total, divisor),
                    answer: quotient.toString(),
                    hints: [`Mira el dibujo.`, `¿Cuántas veces cabe el ${divisor} en el primer dígito del ${total}?`, `Es una división sin resto.`, `La respuesta es ${quotient}.`],
                    explanation: `¡Magnífico! 🏰 Al dividir ${total} entre ${divisor} usando la galera, obtenemos un cociente de **${quotient}**. ¡Has conquistado el castillo de la división! 🏰✨`,
                    lessonId: DIVISION_ESCRITA
                });
            }
            return qs;
        })(),
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 3; i++) {
                const a = 32 + i * 2;
                const b = 2 + (i % 4);
                qs.push({
                    type: 'input',
                    question: `Resuelve esta multiplicación paso a paso: ${a} x ${b} 🏢`,
                    answer: (a * b).toString(),
                    hints: [`Colocamos el ${a} arriba y el ${b} abajo.`, `Primero: ${b} x ${a % 10}.`, `Segundo: ${b} x ${Math.floor(a / 10)}, más lo que lleves si es el caso.`, `El resultado es ${a * b}.`],
                    explanation: `¡Magnífico! Al multiplicar de forma escrita, paso a paso, obtenemos que ${a} x ${b} = **${a * b}**. ¡Eres un maestro de las alturas numéricas! 🏢✨`,
                    lessonId: 'multiplicacion_escrita_3_4'
                });
            }
            return qs;
        })()
    ]
};
