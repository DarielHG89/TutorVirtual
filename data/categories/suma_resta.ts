import type { Question } from '../../types';

// IDs de lecciones
const ADICION = 'adicion_2_2';
const SUSTRACCION = 'sustraccion_2_3';

// Helper para crear representaciones visuales de aritmética
const createMathSVG = (type: 'add' | 'sub', a: number, b: number): string => {
    let content = '';
    if (type === 'add') {
        // Círculos para el primer número
        for (let i = 0; i < a; i++) {
            const x = (i % 5) * 8 + 5;
            const y = Math.floor(i / 5) * 8 + 10;
            content += `<circle cx="${x}" cy="${y}" r="3" fill="#4285F4" />`;
        }
        content += `<text x="45" y="30" font-size="12" font-weight="bold">+</text>`;
        // Círculos para el segundo número
        for (let i = 0; i < b; i++) {
            const x = (i % 5) * 8 + 55;
            const y = Math.floor(i / 5) * 8 + 10;
            content += `<circle cx="${x}" cy="${y}" r="3" fill="#34A853" />`;
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
        }
    }
    return `data:image/svg+xml;base64,${btoa(`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${content}</svg>`)}`;
};

export const sumaRestaQuestions: Record<number, Question[]> = {
    1: [
        // === NIVEL 1: 80 preguntas (40 Adición, 40 Sustracción) ===
        ...Array.from({ length: 40 }).map((_, i): Question => {
            const a = 5 + i;
            const b = 2 + (i % 5);
            return {
                type: 'input',
                question: `Si en la bodega compraste ${a} panes y luego ${b} más, ¿cuántos panes tienes en total? 🥖🥖`,
                imageUrl: createMathSVG('add', a, b),
                answer: (a + b).toString(),
                hints: [`Tienes que juntar los panes.`, `Suma ${a} más ${b}.`, `Cuenta los círculos azules y verdes en la imagen.`, `El resultado es más de ${a}.`, `Llegas al número ${(a+b).toString()}.`],
                explanation: `¡Muy bien! 🎯 Si juntas ${a} panes con otros ${b}, al final tienes **${a + b}** panes para el desayuno. ¡Riquísimo! ☕🥖✨`,
                lessonId: ADICION
            };
        }),
        ...Array.from({ length: 40 }).map((_, i): Question => {
            const a = 10 + i;
            const b = 1 + (i % 8);
            return {
                type: 'input',
                question: `Tenías ${a} mangos 🥭 y regalaste ${b} a tu vecino. ¿Cuántos mangos te quedan ahora?`,
                imageUrl: createMathSVG('sub', a, b),
                answer: (a - b).toString(),
                hints: [`Regalar significa que ahora tienes menos. Es una resta.`, `A ${a} quítale ${b}.`, `Mira la imagen: cuenta solo los círculos rojos (los grises son los que regalaste).`, `¿Cuánto es ${a} - ${b}?`, `Te quedan ${a - b}.`],
                explanation: `¡Correcto! ✅ Al compartir tus mangos, ahora te quedan **${a - b}**. ¡Eres muy generoso! 🥭🌟`,
                lessonId: SUSTRACCION
            };
        })
    ],
    2: [
        // === NIVEL 2: 80 preguntas (40 Adición, 40 Sustracción) ===
        ...Array.from({ length: 40 }).map((_, i): Question => {
            const a = 25 + i * 2;
            const b = 15 + i;
            return {
                type: 'input',
                question: `Calcula la suma de ${a} y ${b}. ¡Ojo con la llevada! 🧮🔢`,
                imageUrl: createMathSVG('add', Math.floor(a/10), Math.floor(b/10)),
                answer: (a + b).toString(),
                hints: [`Suma las unidades primero: ${a%10} + ${b%10}.`, `Si te pasas de 9, ¡te llevas una para las decenas! 🎈`, `Ahora suma las decenas: ${Math.floor(a/10)} + ${Math.floor(b/10)} + la que te llevabas.`, `El resultado empieza con ${Math.floor((a+b)/10)}.`, `Es ${a + b}.`],
                explanation: `¡Excelente cálculo! 🎯 Sumando unidades y decenas correctamente obtenemos **${a + b}**. ¡Eres una calculadora humana! 🧠✨`,
                lessonId: ADICION
            };
        }),
        ...Array.from({ length: 40 }).map((_, i): Question => {
            const a = 50 + i * 2;
            const b = 12 + i;
            return {
                type: 'input',
                question: `A ${a} le restamos ${b}. ¿Cuál es el resultado? ➖📉`,
                imageUrl: createMathSVG('sub', 20, 5), // Representativo
                answer: (a - b).toString(),
                hints: [`Resta las unidades. Si el de arriba es menor, pide prestado al vecino.`, `Resta las decenas: no olvides que si prestaste, ahora tienes una menos.`, `Hazlo paso a paso.`, `¿Cuánto es ${a} - ${b}?`, `El resultado es ${a - b}.`],
                explanation: `¡Muy bien hecho! ✅ La diferencia entre ${a} y ${b} es **${a - b}**. ¡Las restas ya no tienen secretos para ti! 🛡️✨`,
                lessonId: SUSTRACCION
            };
        })
    ],
    3: [
        // === NIVEL 3: 80 preguntas (40 Adición, 40 Sustracción) ===
        ...Array.from({ length: 40 }).map((_, i): Question => {
            const a = 250 + i * 15;
            const b = 175 + i * 10;
            return {
                type: 'input',
                question: `Un viaje en guagua 🚌 de La Habana a Varadero cuesta ${a} CUP y de Varadero a Matanzas cuesta ${b} CUP. ¿Cuánto gastas en total? 💰🗺️`,
                answer: (a + b).toString(),
                hints: [`Suma los precios de los dos viajes.`, `Cientos con cientos, decenas con decenas...`, `¿Cuánto es ${a} + ${b}?`, `Es una suma de tres cifras.`, `El total es ${a + b}.`],
                explanation: `¡Perfecto viajero! 🌍 Sumando los dos pasajes, el gasto total es de **${a + b}** CUP. ¡Disfruta el paisaje! 🌴🏖️`,
                lessonId: ADICION
            };
        }),
        ...Array.from({ length: 40 }).map((_, i): Question => {
            const total = 1000 + i * 50;
            const gasto = 450 + i * 25;
            return {
                type: 'input',
                question: `Si tenías un billete de ${total} pesos y gastaste ${gasto} en el agro, ¿cuántos pesos te sobraron? 💵🌽`,
                answer: (total - gasto).toString(),
                hints: [`Es una resta: ${total} - ${gasto}.`, `Resta primero los cientos.`, `Ahora resta el resto.`, `Piensa en el vuelto que te darían.`, `La respuesta es ${total - gasto}.`],
                explanation: `¡Cálculo exacto! 🎯 Te sobraron **${total - gasto}** pesos. ¡Eres muy bueno administrando el dinero! 💵🧤✨`,
                lessonId: SUSTRACCION
            };
        })
    ]
};
