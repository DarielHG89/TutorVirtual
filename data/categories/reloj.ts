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
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 40; i++) {
                const h = (i % 12) || 12;
                const isMcq = i % 2 === 0;
                qs.push({
                    type: isMcq ? 'mcq' : 'input',
                    question: `¿Qué hora marca este reloj? 🕒`,
                    imageUrl: createClockSVG(h, 0),
                    options: isMcq ? [`Las ${h} en punto`, `Las ${h} y media`, `Las ${h===12?1:h+1} en punto`].sort(() => Math.random() - 0.5) : undefined,
                    answer: isMcq ? `Las ${h} en punto` : h.toString(),
                    hints: [`Mira la aguja corta (la negra). Señala al ${h}.`, `La aguja larga (gris) está en el 12. Eso es "en punto".`, `Son las ${h} con cero minutos.`, `Busca la opción que dice "${h} en punto" o escribe ${h}.`, `La respuesta es ${isMcq ? `"Las ${h} en punto"` : h}.`],
                    explanation: `¡Correcto! 🎯 La aguja corta marca la hora (${h}) y la larga en el 12 indica que son minutos cero o "en punto". ¡Ya sabes leer las horas! 🕒✨`,
                    lessonId: RELOJ_LECTURA
                });
            }
            return qs;
        })(),
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 40; i++) {
                const m = (i % 12) * 5;
                const clockNum = (i % 12) || 12;
                const isMcq = i % 2 !== 0; // alternates for variety
                qs.push({
                    type: isMcq ? 'mcq' : 'input',
                    question: `Si el minutero (la aguja larga) está en el número ${clockNum}, ¿cuántos minutos son? ⏲️`,
                    options: isMcq ? [m.toString(), Math.max(0, m - 5).toString(), (m + 5).toString()].sort(() => Math.random() - 0.5) : undefined,
                    answer: m.toString(),
                    hints: [`Cada número del reloj vale 5 minutos.`, `Multiplica el número por 5.`, `Por ejemplo, en el 1 son 5 min, en el 2 son 10 min...`, `¿Cuánto es ${clockNum} x 5?`, `La respuesta es ${m}.`],
                    explanation: `¡Excelente! 🎯 Los minutos se cuentan de 5 en 5. El número ${clockNum} multiplicado por 5 nos da **${m}** minutos. ¡Estás hecho un relojero! ⏲️✨`,
                    lessonId: RELOJ_MINUTOS
                });
            }
            return qs;
        })(),
        ...(() => {
            const qs: Question[] = [];
            const themes = [
                { activity: 'esperas la guagua 🚌', dt: '1 hora' },
                { activity: 'juegas en el parque ⚽', dt: '1 hora' },
                { activity: 'miras los muñequitos 📺', dt: '1 hora' },
                { activity: 'estudias matemáticas 📚', dt: '1 hora' }
            ];
            for (let i = 0; i < 40; i++) {
                const h = 2 + (i % 5);
                const theme = themes[i % themes.length];
                const isMcq = i % 2 === 0;
                qs.push({
                    type: isMcq ? 'mcq' : 'input',
                    question: `Si son las ${h}:00 y ${theme.activity} por ${theme.dt}, ¿qué hora será cuando termines?`,
                    options: isMcq ? [(h + 1).toString(), (h + 2).toString(), h.toString()].sort(() => Math.random() - 0.5) : undefined,
                    answer: (h + 1).toString(),
                    hints: [`Solo tienes que sumarle 1 a la hora.`, `¿Qué número viene después del ${h}?`, `Son las ${h} más una hora.`, `Es muy fácil, solo cambia el primer número.`, `Serán las ${h + 1}.`],
                    explanation: `¡Muy bien! ✅ ${h} + 1 = **${h + 1}**. La actividad terminará a las ${h + 1}:00. ¡El tiempo pasa volando! ⏳✨`,
                    lessonId: RELOJ_PROBLEMAS
                });
            }
            return qs;
        })()
    ],
    2: [
        // === NIVEL 2: 120 preguntas (40 Lectura, 40 Minutos, 40 Problemas) ===
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 40; i++) {
                const h = (i % 12) || 12;
                const m = 30;
                const isMcq = i % 2 !== 0;
                qs.push({
                    type: isMcq ? 'mcq' : 'input',
                    question: `¿Qué hora indica el reloj si el minutero está en el 6? 🕦`,
                    imageUrl: createClockSVG(h, m),
                    options: isMcq ? [`Las ${h} y media`, `Las ${h} en punto`, `Las ${h} y cuarto`].sort(() => Math.random() - 0.5) : undefined,
                    answer: isMcq ? `Las ${h} y media` : `${h}:30`,
                    hints: [`La aguja larga está en el 6.`, `El 6 representa 30 minutos o "media" hora.`, `La aguja corta está entre el ${h} y el siguiente número.`, `Se lee como "${h} y media", o se escribe "${h}:30".`],
                    explanation: `¡Perfecto! 🎯 Cuando la aguja larga señala el 6, han pasado 30 minutos. Se dice que son las **${h} y media**. 🕦✨`,
                    lessonId: RELOJ_LECTURA
                });
            }
            return qs;
        })(),
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 40; i++) {
                const h = (i % 12) || 12;
                const isMcq = i % 2 === 0;
                qs.push({
                    type: isMcq ? 'mcq' : 'input',
                    question: `Si la aguja larga de los minutos está en el 3 y la de la hora en el ${h}. ¿Cómo se dice la hora? 🕤`,
                    options: isMcq ? [`Las ${h} y cuarto`, `Las ${h} y media`, `Las ${h} en punto`].sort(() => Math.random() - 0.5) : undefined,
                    answer: isMcq ? `Las ${h} y cuarto` : `${h}:15`,
                    hints: [`El 3 representa 15 minutos.`, `15 minutos es la cuarta parte de una hora.`, `Se dice "y cuarto" o se escribe ${h}:15.`],
                    explanation: `¡Muy bien! 🎯 El número 3 en el minutero representa 15 minutos, lo que conocemos como **un cuarto** de hora. 🕤✨`,
                    lessonId: RELOJ_MINUTOS
                });
            }
            return qs;
        })(),
        ...(() => {
            const qs: Question[] = [];
            const themes = [
                { activity: 'Tu programa favorito 📺', timeEndOffset: 12 },
                { activity: 'El partido de béisbol ⚾', timeEndOffset: 25 },
                { activity: 'La clase de dibujo 🎨', timeEndOffset: 45 },
                { activity: 'El concierto de la escuela 🎵', timeEndOffset: 30 }
            ];
            for (let i = 0; i < 40; i++) {
                const startHour = 2 + (i % 8);
                const theme = themes[i % themes.length];
                const startMins = 0;
                const duration = theme.timeEndOffset + (i % 5);
                const isMcq = i % 2 !== 0;
                qs.push({
                    type: isMcq ? 'mcq' : 'input',
                    question: `${theme.activity} empieza a las ${startHour}:00 y termina a las ${startHour}:${duration.toString().padStart(2, '0')}. ¿Cuántos minutos duró?`,
                    options: isMcq ? [duration.toString(), (duration + 5).toString(), (duration - 5).toString()].sort(() => Math.random() - 0.5) : undefined,
                    answer: duration.toString(),
                    hints: [`Solo tienes que mirar los minutos del final.`, `Empezó en el minuto 0 y terminó en el ${duration}.`, `Escribe el tiempo transcurrido en minutos.`, `Duró ${duration} minutos.`],
                    explanation: `¡Exacto! ✅ Si empezó a las ${startHour}:00 y terminó a las ${startHour}:${duration}, pasaron exactamente **${duration}** minutos. ¡Espero que fuera divertido! ✨`,
                    lessonId: RELOJ_PROBLEMAS
                });
            }
            return qs;
        })()
    ],
    3: [
        // === NIVEL 3: 120 preguntas (40 Lectura, 40 Minutos, 40 Problemas) ===
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 40; i++) {
                const h = (i % 12) || 12;
                const m = 45;
                const nextH = h === 12 ? 1 : h + 1;
                const isMcq = i % 2 === 0;
                qs.push({
                    type: isMcq ? 'mcq' : 'input',
                    question: `¿Qué hora es cuando la aguja larga de los minutos apunta al 9 (y la hora está casi en el ${nextH})? 🕘`,
                    imageUrl: createClockSVG(h, m),
                    options: isMcq ? [`Las ${nextH} menos cuarto`, `Las ${h} y cuarto`, `Las ${h} y media`].sort(() => Math.random() - 0.5) : undefined,
                    answer: isMcq ? `Las ${nextH} menos cuarto` : `${h}:45`,
                    hints: [`El número 9 significa que faltan 15 minutos para la siguiente hora.`, `Se dice "menos cuarto".`, `Si la hora actual es el ${h}, vamos para las ${nextH}.`, `La respuesta es ${isMcq ? `"Las ${nextH} menos cuarto"` : `"${h}:45"`}.`],
                    explanation: `¡Excelente! 🎯 La aguja en el 9 indica que faltan solo 15 minutos para completar la hora. Por eso decimos **Las ${nextH} menos cuarto** o escribimos ${h}:45. 🕘✨`,
                    lessonId: RELOJ_LECTURA
                });
            }
            return qs;
        })(),
        ...(() => {
            const qs: Question[] = [];
            const themes = [
                { activity: 'un partido de fútbol ⚽', durH: 1 },
                { activity: 'una película fenomenal 🎬', durH: 2 },
                { activity: 'un viaje de campo 🚌', durH: 1 },
                { activity: 'un evento escolar 🎭', durH: 2 }
            ];
            for (let i = 0; i < 40; i++) {
                const theme = themes[i % themes.length];
                const mins = 5 + (i % 50);
                const totalMins = theme.durH * 60 + mins;
                const isMcq = i % 2 !== 0;
                qs.push({
                    type: isMcq ? 'mcq' : 'input',
                    question: `Si ${theme.activity} dura ${theme.durH} hora(s) y ${mins} minutos, ¿cuántos minutos son en total?`,
                    options: isMcq ? [totalMins.toString(), (totalMins + 10).toString(), (totalMins - 10).toString()].sort(() => Math.random() - 0.5) : undefined,
                    answer: totalMins.toString(),
                    hints: [`Recuerda que 1 hora tiene 60 minutos.`, `Multiplica las ${theme.durH} horas por 60`, `Suma el resto: ${theme.durH * 60} + ${mins}.`, `El total es ${totalMins}.`],
                    explanation: `¡Excelente cálculo! 🎯 Convertimos las horas en minutos y sumamos el resto: ${theme.durH * 60} + ${mins} = **${totalMins}** minutos. ✨`,
                    lessonId: RELOJ_MINUTOS
                });
            }
            return qs;
        })(),
        ...(() => {
            const qs: Question[] = [];
            const themes = [
                { activity: 'Pusiste los frijoles 🍲 en la olla', dur: 20 },
                { activity: 'Entraste al museo 🖼️', dur: 45 },
                { activity: 'Comenzaste la tarea ✍️', dur: 35 },
                { activity: 'Pusiste la sopa 🥣 a hervir', dur: 15 }
            ];
            for (let i = 0; i < 40; i++) {
                const h = 5 + (i % 6);
                const theme = themes[i % themes.length];
                const startMins = 5 + (i % 15);
                const dur = theme.dur + (i % 5);
                const endMins = startMins + dur;
                const isMcq = i % 2 === 0;
                qs.push({
                    type: isMcq ? 'mcq' : 'input',
                    question: `${theme.activity} a las ${h}:${startMins.toString().padStart(2, '0')} y terminaste a las ${h}:${endMins.toString().padStart(2, '0')}. ¿Cuántos minutos pasaron? ⏰`,
                    options: isMcq ? [dur.toString(), (dur + 5).toString(), (dur - 5).toString()].sort(() => Math.random() - 0.5) : undefined,
                    answer: dur.toString(),
                    hints: [`Calcula la diferencia entre los minutos finales y los iniciales.`, `${endMins} - ${startMins} = ?`, `Es una resta simple de minutos.`, `Pasaron ${dur} minutos.`],
                    explanation: `¡Muy bien! 🌟 Restamos el tiempo final del inicial: ${endMins} - ${startMins} = **${dur}** minutos. ¡El tiempo pasa volando! ✨`,
                    lessonId: RELOJ_PROBLEMAS
                });
            }
            return qs;
        })()
    ]
};
