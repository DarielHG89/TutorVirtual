import type { Question } from '../../types';

// IDs de lecciones
const MULTIPLICACION = 'multiplicacion_3_1';
const DIVISION = 'division_3_2';

// Helper para crear representaciones visuales de multi y divi
const createMultiDivSVG = (type: 'multi' | 'div', a: number, b: number): string => {
    let content = '';
    if (type === 'multi') {
        // Filas y columnas de puntos
        for (let r = 0; r < a; r++) {
            for (let c = 0; c < b; c++) {
                const x = c * 8 + 10;
                const y = r * 8 + 10;
                content += `<circle cx="${x}" cy="${y}" r="3" fill="#FBBC05" stroke="#B8860B" stroke-width="0.5" />`;
            }
        }
        content += `<text x="5" y="95" font-size="8" fill="#B8860B">${a} filas x ${b} columnas</text>`;
    } else {
        // Reparto en cajas
        const total = a;
        const groups = b;
        const perGroup = Math.floor(total / groups);
        for (let g = 0; g < groups; g++) {
            const bx = (g % 3) * 30 + 5;
            const by = Math.floor(g / 3) * 30 + 5;
            content += `<rect x="${bx}" y="${by}" width="25" height="25" rx="2" fill="none" stroke="#4285F4" stroke-dasharray="2" />`;
            for (let i = 0; i < perGroup; i++) {
                const dotX = bx + (i % 3) * 6 + 5;
                const dotY = by + Math.floor(i / 3) * 6 + 5;
                content += `<circle cx="${dotX}" cy="${dotY}" r="2" fill="#EA4335" />`;
            }
        }
    }
    return `data:image/svg+xml;base64,${btoa(`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${content}</svg>`)}`;
};

export const multiDiviQuestions: Record<number, Question[]> = {
    1: [
        // === NIVEL 1: 80 preguntas (40 Multiplicación, 40 División) ===
        ...Array.from({ length: 40 }).map((_, i): Question => {
            const a = 2 + (i % 4);
            const b = 3 + (Math.floor(i / 4) % 3);
            return {
                type: 'input',
                question: `Si tienes ${a} bolsitas de caramelos y cada una trae ${b} caramelos, ¿cuántos tienes en total? 🍬🛍️`,
                imageUrl: createMultiDivSVG('multi', a, b),
                answer: (a * b).toString(),
                hints: [`Es una suma repetida: suma ${b} unas ${a} veces.`, `Mira la imagen: cuenta todas las bolitas amarillas.`, `¿Cuánto es ${a} veces ${b}?`, `Multiplica ${a} x ${b}.`, `La respuesta es ${a * b}.`],
                explanation: `¡Excelente! 🎯 Multiplicar ${a} por ${b} es lo mismo que sumar ${b} ${a} veces. En total tienes **${a * b}** caramelos para disfrutar. 🍬✨`,
                lessonId: MULTIPLICACION
            };
        }),
        ...Array.from({ length: 40 }).map((_, i): Question => {
            const groups = 2 + (i % 3);
            const perGroup = 2 + (Math.floor(i / 3) % 4);
            const total = groups * perGroup;
            return {
                type: 'input',
                question: `Repartes ${total} limones 🍋 en ${groups} vasijas por igual. ¿Cuántos limones pones en cada vasija?`,
                imageUrl: createMultiDivSVG('div', total, groups),
                answer: perGroup.toString(),
                hints: [`Repartir es dividir.`, `Pon la misma cantidad en cada una de las ${groups} vasijas.`, `Busca un número que multiplicado por ${groups} dé ${total}.`, `${groups} x ? = ${total}.`, `La respuesta es ${perGroup}.`],
                explanation: `¡Muy bien repartido! 🍋 Si divides ${total} entre ${groups}, a cada vasija le tocan **${perGroup}** limones. ¡Perfecto para una limonada! 🥤✨`,
                lessonId: DIVISION
            };
        })
    ],
    2: [
        // === NIVEL 2: 80 preguntas (40 Multiplicación, 40 División) ===
        ...Array.from({ length: 40 }).map((_, i): Question => {
            const a = 12 + i;
            const b = 3 + (i % 3);
            return {
                type: 'input',
                question: `Calcula: ${a} x ${b}. ¡Hazlo paso a paso! 🧮🚀`,
                imageUrl: createMultiDivSVG('multi', Math.floor(a/4), 4),
                answer: (a * b).toString(),
                hints: [`Multiplica ${b} por las unidades: ${b} x ${a % 10}.`, `Luego multiplica ${b} por las decenas: ${b} x ${Math.floor(a/10)}0.`, `Súmalo todo.`, `Usa la libreta si te ayuda.`, `El resultado es ${a * b}.`],
                explanation: `¡Genial! 🎯 Multiplicando por partes (${b}x${a%10} y ${b}x${Math.floor(a/10)}0) y sumando, llegamos a **${a * b}**. ¡Eres un rayo calculando! ⚡✨`,
                lessonId: MULTIPLICACION
            };
        }),
        ...Array.from({ length: 40 }).map((_, i): Question => {
            const perGroup = 11 + i;
            const groups = 2 + (i % 4);
            const total = perGroup * groups;
            return {
                type: 'input',
                question: `Si repartes ${total} canicas 🔵 entre ${groups} amigos, ¿cuántas le tocan a cada uno?`,
                imageUrl: createMultiDivSVG('div', 20, groups),
                answer: perGroup.toString(),
                hints: [`Divide ${total} entre ${groups}.`, `Empieza dividiendo las decenas.`, `¿Cuántas veces cabe el ${groups} en el ${total}?`, `Es un reparto exacto.`, `La respuesta es ${perGroup}.`],
                explanation: `¡Reparto perfecto! 🎯 Cada amigo recibe **${perGroup}** canicas. ¡A jugar a las bolas! 🔵✨`,
                lessonId: DIVISION
            };
        })
    ],
    3: [
        // === NIVEL 3: 80 preguntas (40 Multiplicación, 40 División) ===
        ...Array.from({ length: 40 }).map((_, i): Question => {
            const a = 45 + i * 5;
            const b = 6 + (i % 4);
            return {
                type: 'input',
                question: `En un camión 🚚 vienen ${a} cajas de tabaco, y cada caja trae ${b} mazos. ¿Cuántos mazos de tabaco trae el camión en total?`,
                answer: (a * b).toString(),
                hints: [`Es una multiplicación: ${a} x ${b}.`, `Multiplica primero las unidades y lleva lo que sobre.`, `Luego las decenas y suma lo que llevabas.`, `¿Cuánto es ${a} multiplicado por ${b}?`, `El resultado es ${a * b}.`],
                explanation: `¡Cálculo de experto! 🎩 Multiplicamos las cajas por los mazos: ${a} x ${b} = **${a * b}**. ¡Carga completa! 🚚✨`,
                lessonId: MULTIPLICACION
            };
        }),
        ...Array.from({ length: 40 }).map((_, i): Question => {
            const divisor = 5 + (i % 5);
            const quotient = 25 + i * 2;
            const total = divisor * quotient;
            return {
                type: 'input',
                question: `Tienes ${total} galletas 🍪 y quieres hacer ${divisor} paquetes iguales. ¿Cuántas galletas tendrá cada paquete?`,
                answer: quotient.toString(),
                hints: [`Divide ${total} entre ${divisor}.`, `Usa el método de la casita (división larga).`, `¿Cuántas veces cabe el ${divisor} en el ${total}?`, `No sobra ninguna galleta.`, `La respuesta es ${quotient}.`],
                explanation: `¡Maestro de la división! 🎯 Podrás armar los ${divisor} paquetes con **${quotient}** galletas cada uno. ¡Bien empaquetado! 📦✨`,
                lessonId: DIVISION
            };
        })
    ]
};
