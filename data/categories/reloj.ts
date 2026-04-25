import type { Question } from '../../types';

// IDs de lecciones
const RELOJ_LECTURA = 'reloj_lectura';
const RELOJ_MINUTOS = 'reloj_minutos';
const RELOJ_PROBLEMAS = 'reloj_problemas';

// Helper para crear representaciones visuales de relojes
const createClockSVG = (h: number, m: number): string => {
    const hAngle = (h % 12) * 30 + m * 0.5;
    const mAngle = m * 6;
    const content = `
        <circle cx="50" cy="50" r="45" fill="#FFF" stroke="#333" stroke-width="2" />
        <circle cx="50" cy="50" r="2" fill="#333" />
        <line x1="50" y1="50" x2="${50 + 25 * Math.sin((hAngle * Math.PI) / 180)}" y2="${50 - 25 * Math.cos((hAngle * Math.PI) / 180)}" stroke="#000" stroke-width="3" stroke-linecap="round" />
        <line x1="50" y1="50" x2="${50 + 35 * Math.sin((mAngle * Math.PI) / 180)}" y2="${50 - 35 * Math.cos((mAngle * Math.PI) / 180)}" stroke="#666" stroke-width="2" stroke-linecap="round" />
        ${[...Array(12)].map((_, i) => {
            const a = (i + 1) * 30;
            const x = 50 + 38 * Math.sin((a * Math.PI) / 180);
            const y = 50 - 38 * Math.cos((a * Math.PI) / 180);
            return `<text x="${x}" y="${y+2}" font-size="6" text-anchor="middle" fill="#333">${i + 1}</text>`;
        }).join('')}
    `;
    return `data:image/svg+xml;base64,${btoa(`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${content}</svg>`)}`;
};

export const relojQuestions: Record<number, Question[]> = {
    1: [
        // === NIVEL 1: 120 preguntas (40 Lectura, 40 Minutos, 40 Problemas) ===
        ...Array.from({ length: 40 }).map((_, i): Question => {
            const h = (i % 12) || 12;
            return {
                type: 'mcq',
                question: `¿Qué hora marca este reloj? 🕒`,
                imageUrl: createClockSVG(h, 0),
                options: [`Las ${h} en punto`, `Las ${h} y media`, `Las ${h} y cuarto`],
                answer: `Las ${h} en punto`,
                hints: [`Mira la aguja corta (la negra). Señala al ${h}.`, `La aguja larga (gris) está en el 12. Eso es "en punto".`, `Son las ${h} con cero minutos.`, `Busca la opción que dice "${h} en punto".`, `La respuesta es Las ${h} en punto.`],
                explanation: `¡Correcto! 🎯 La aguja corta marca la hora (${h}) y la larga en el 12 indica que son minutos cero o "en punto". ¡Ya sabes leer las horas! 🕒✨`,
                lessonId: RELOJ_LECTURA
            };
        }),
        ...Array.from({ length: 40 }).map((_, i): Question => {
            const m = (i % 12) * 5;
            return {
                type: 'input',
                question: `Si el minutero (la aguja larga) está en el número ${i % 12 || 12}, ¿cuántos minutos son? ⏲️`,
                answer: m.toString(),
                hints: [`Cada número del reloj vale 5 minutos.`, `Multiplica el número por 5.`, `Por ejemplo, en el 1 son 5 min, en el 2 son 10 min...`, `¿Cuánto es ${i % 12 || 12} x 5?`, `La respuesta es ${m}.`],
                explanation: `¡Excelente! 🎯 Los minutos se cuentan de 5 en 5. El número ${i % 12 || 12} multiplicado por 5 nos da **${m}** minutos. ¡Estás hecho un relojero! ⏲️✨`,
                lessonId: RELOJ_MINUTOS
            };
        }),
        ...Array.from({ length: 40 }).map((_, i): Question => {
            const h = 2 + (i % 5);
            return {
                type: 'input',
                question: `Si son las ${h}:00 y esperas la guagua 🚌 por 1 hora, ¿qué hora será cuando llegue?`,
                answer: (h + 1).toString(),
                hints: [`Solo tienes que sumarle 1 a la hora.`, `¿Qué número viene después del ${h}?`, `Son las ${h} más una hora.`, `Es muy fácil, solo cambia el primer número.`, `Serán las ${h + 1}.`],
                explanation: `¡Muy bien! ✅ ${h} + 1 = **${h + 1}**. La guagua llegará a las ${h + 1}:00. ¡Ojalá pase puntual! 🚌✨`,
                lessonId: RELOJ_PROBLEMAS
            };
        })
    ],
    2: [
        // === NIVEL 2: 120 preguntas (40 Lectura, 40 Minutos, 40 Problemas) ===
        ...Array.from({ length: 40 }).map((_, i): Question => {
            const h = (i % 12) || 12;
            const m = 30;
            return {
                type: 'mcq',
                question: `¿Qué hora indica el reloj? 🕦`,
                imageUrl: createClockSVG(h, m),
                options: [`Las ${h} y media`, `Las ${h} en punto`, `Las ${h} y cuarto`],
                answer: `Las ${h} y media`,
                hints: [`La aguja larga está en el 6.`, `El 6 representa 30 minutos o "media" hora.`, `La aguja corta está entre el ${h} y el siguiente número.`, `Se lee como "${h} y media".`, `La respuesta es la primera opción.`],
                explanation: `¡Perfecto! 🎯 Cuando la aguja larga señala el 6, han pasado 30 minutos. Se dice que son las **${h} y media**. 🕦✨`,
                lessonId: RELOJ_LECTURA
            };
        }),
        ...Array.from({ length: 40 }).map((_, i): Question => {
            const m = 15;
            const h = (i % 12) || 12;
            return {
                type: 'mcq',
                question: `Si la aguja larga está en el 3, ¿cómo se dice esa parte de la hora? 🕤`,
                options: [`Y cuarto`, `Y media`, `En punto`],
                answer: `Y cuarto`,
                hints: [`El 3 representa 15 minutos.`, `15 minutos es la cuarta parte de una hora.`, `Se dice "y cuarto".`, `No es "y media" porque eso es el 6.`, `Se lee como "Las ${h} y cuarto".`],
                explanation: `¡Muy bien! 🎯 El número 3 en el minutero representa 15 minutos, lo que conocemos como **un cuarto** de hora. 🕤✨`,
                lessonId: RELOJ_MINUTOS
            };
        }),
        ...Array.from({ length: 40 }).map((_, i): Question => {
            const start = 10 + (i % 15);
            return {
                type: 'input',
                question: `Tu programa favorito 📺 empieza a las 4:00 y termina a las 4:${start}. ¿Cuántos minutos duró?`,
                answer: start.toString(),
                hints: [`Solo tienes que mirar los minutos del final.`, `Empezó en el minuto 0 y terminó en el ${start}.`, `La diferencia es de ${start} minutos.`, `Escribe solo el número.`, `Duró ${start} minutos.`],
                explanation: `¡Exacto! ✅ Si empezó a las 4:00 y terminó a las 4:${start}, pasaron exactamente **${start}** minutos. ¡Espero que fuera divertido! 📺✨`,
                lessonId: RELOJ_PROBLEMAS
            };
        })
    ],
    3: [
        // === NIVEL 3: 120 preguntas (40 Lectura, 40 Minutos, 40 Problemas) ===
        ...Array.from({ length: 40 }).map((_, i): Question => {
            const h = (i % 12) || 12;
            const m = 45;
            return {
                type: 'mcq',
                question: `¿Qué hora es cuando la aguja larga apunta al 9? 🕘`,
                imageUrl: createClockSVG(h, m),
                options: [`Las ${h + 1} menos cuarto`, `Las ${h} y cuarto`, `Las ${h} y media`],
                answer: `Las ${h + 1} menos cuarto`,
                hints: [`El número 9 significa que faltan 15 minutos para la siguiente hora.`, `Se dice "menos cuarto".`, `Si la hora actual es el ${h}, vamos para las ${h + 1}.`, `Faltan 15 para las ${h + 1}.`, `La respuesta es Las ${h + 1} menos cuarto.`],
                explanation: `¡Excelente! 🎯 La aguja en el 9 indica que faltan solo 15 minutos para completar la hora. Por eso decimos **${h + 1} menos cuarto**. 🕘✨`,
                lessonId: RELOJ_LECTURA
            };
        }),
        ...Array.from({ length: 40 }).map((_, i): Question => {
            const total = 60 + i;
            return {
                type: 'input',
                question: `Si un partido de fútbol ⚽ dura 1 hora y ${i} minutos, ¿cuántos minutos son en total?`,
                answer: total.toString(),
                hints: [`Recuerda que 1 hora tiene 60 minutos.`, `Suma 60 + ${i}.`, `Multiplica las horas por 60 y suma el resto.`, `Calcula la suma.`, `El total es ${total}.`],
                explanation: `¡Excelente cálculo! 🎯 Convertimos la hora en 60 minutos y le sumamos los ${i} adicionales: 60 + ${i} = **${total}** minutos. ⚽✨`,
                lessonId: RELOJ_MINUTOS
            };
        }),
        ...Array.from({ length: 40 }).map((_, i): Question => {
            const start = 15 + i;
            const end = start + 20;
            return {
                type: 'input',
                question: `Pusiste los frijoles 🍲 en la olla de presión a las 11:${start} y los quitaste a las 11:${end}. ¿Cuántos minutos estuvieron al fuego?`,
                answer: `20`,
                hints: [`Calcula la diferencia entre los minutos.`, `${end} - ${start} = ?`, `Es una resta simple de minutos.`, `Estuvieron 20 minutos.`, `La respuesta es 20.`],
                explanation: `¡Muy bien! 🍲 Restamos el tiempo final del inicial: ${end} - ${start} = **20** minutos. ¡Esos frijoles van a quedar blanditos! 😋✨`,
                lessonId: RELOJ_PROBLEMAS
            };
        })
    ]
};
