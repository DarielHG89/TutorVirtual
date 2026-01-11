
import type { Question } from '../../types';

// IDs de lecciones para claridad
const RELOJ_HORAS_1 = 'reloj_horas_1';
const RELOJ_MINUTOS_1 = 'reloj_minutos_1';
const RELOJ_PROBLEMAS_1 = 'reloj_problemas_1';

// Función para crear SVGs de relojes dinámicamente
const createClockSVG = (hour: number, minute: number): string => {
    const hourAngle = (hour % 12) * 30 + minute * 0.5;
    const minuteAngle = minute * 6;
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="#fef9c3" stroke="black" stroke-width="3"/>
            <g transform="translate(50,50)">
                <!-- Marcas de horas -->
                <text x="0" y="-35" text-anchor="middle" font-size="10" font-weight="bold">12</text>
                <text x="35" y="3.5" text-anchor="middle" font-size="10" font-weight="bold">3</text>
                <text x="0" y="42" text-anchor="middle" font-size="10" font-weight="bold">6</text>
                <text x="-35" y="3.5" text-anchor="middle" font-size="10" font-weight="bold">9</text>
                 <!-- Marcas de minutos -->
                ${[...Array(60)].map((_, i) => `<line x1="0" y1="-42" x2="0" y2="-44" stroke="gray" stroke-width="${i % 5 === 0 ? 2 : 1}" transform="rotate(${i * 6})"/>`).join('')}
                <!-- Agujas -->
                <line x1="0" y1="0" x2="0" y2="-25" stroke="black" stroke-width="4" transform="rotate(${hourAngle})"/>
                <line x1="0" y1="0" x2="0" y2="-40" stroke="black" stroke-width="2.5" transform="rotate(${minuteAngle})"/>
                <circle cx="0" cy="0" r="4" fill="black"/>
            </g>
        </svg>
    `;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};


export const relojQuestions: Record<number, Question[]> = {
    1: [
        // =================================================================================================
        // NIVEL 1: 40 PREGUNTAS POR LECCIÓN
        // =================================================================================================

        // === Lección: Horas y Fracciones (RELOJ_HORAS_1) - 40 preguntas ===
        { type: 'mcq', question: '¿Qué hora es? 🕒', imageUrl: createClockSVG(3, 0), options: ['Las 12 en punto', 'Las 3 en punto', 'Las 6 en punto'], answer: 'Las 3 en punto', hints:['La aguja corta (horaria) señala la hora.', 'La aguja larga (minutero) está en el 12, lo que significa "en punto".', 'La aguja corta está apuntando directamente al 3.', 'Son las tres en punto.', '3:00.'], explanation: 'La aguja corta (horaria) señala el 3 y la aguja larga (minutero) está en el 12. ¡Son las 3 en punto! ✅', lessonId: RELOJ_HORAS_1},
        { type: 'mcq', question: '¿Qué hora marca el reloj?', imageUrl: createClockSVG(6, 30), options: ['Las 6 en punto', 'Las 6 y media', 'Las 7 y media'], answer: 'Las 6 y media', hints:['La aguja larga está en el 6. ¿Qué significa eso?', 'Significa "y media" o 30 minutos.', 'La aguja corta está a mitad de camino entre el 6 y el 7.', 'Ya pasaron las 6, pero aún no son las 7.', 'Seis y treinta.'], explanation: 'La aguja corta pasó el 6 y la larga está en el 6 (30 minutos). ¡Son las 6 y media! 🕡', lessonId: RELOJ_HORAS_1},
        { type: 'mcq', question: 'Observa el reloj. ¿Qué hora es?', imageUrl: createClockSVG(9, 15), options: ['Las 9 y cuarto', 'Las 3 y cuarto', 'Las 9 y media'], answer: 'Las 9 y cuarto', hints:['La aguja larga está en el 3. ¿Qué significa?', 'Significa "y cuarto" o 15 minutos.', 'La aguja corta está un poquito después del 9.', 'Son las nueve y quince.', '9:15.'], explanation: 'La aguja corta pasó un poco el 9 y la larga está en el 3 (15 minutos). ¡Son las 9 y cuarto! 🕤', lessonId: RELOJ_HORAS_1},
        { type: 'mcq', question: '¿Qué hora se muestra aquí?', imageUrl: createClockSVG(1, 45), options: ['Las 2 menos cuarto', 'Las 9 y cuarto', 'La 1 y media'], answer: 'Las 2 menos cuarto', hints:['La aguja larga está en el 9.', 'Cuando está en el 9, significa que faltan 15 minutos para la siguiente hora.', 'La siguiente hora después de la 1 es las 2.', 'La aguja corta está casi llegando al 2.', 'Faltan 15 para las 2.'], explanation: 'La aguja larga en el 9 significa "menos cuarto". Como la corta se acerca al 2, son las 2 menos cuarto (o la 1 y 45). 🕜', lessonId: RELOJ_HORAS_1},
        { type: 'mcq', question: '¿Cuál es la aguja de las horas?', options: ['La corta', 'La larga', 'La más delgada'], answer: 'La corta', hints:['Es la que se mueve más despacio.', 'Se llama aguja horaria.', 'La aguja larga es la de los minutos.', 'Es la más gordita.', 'La aguja pequeña.'], explanation: 'La aguja corta y más gruesa es la que marca las horas. ¡Es la jefa del reloj! 👑', lessonId: RELOJ_HORAS_1},
        ...[1,2,4,5,7,8,10,11,12].map((h): Question => ({
             type: 'mcq', question: `¿Qué hora es?`, imageUrl: createClockSVG(h, 0), options: [`Las ${h} en punto`, `Las ${h} y media`, `Las 12 en punto`], answer: `Las ${h} en punto`, hints:['La aguja larga está en el 12.', 'Cuando la aguja larga está en el 12 es "en punto".', `La aguja corta señala al ${h}.`, `Son las ${h}.`, 'La respuesta es la primera opción.'], explanation: `¡Correcto! Son las ${h} en punto.`, lessonId: RELOJ_HORAS_1
        })),
        ...[1,2,3,4,5,7,8,9,10,11,12].map((h): Question => ({
             type: 'mcq', question: `¿Qué hora es?`, imageUrl: createClockSVG(h, 30), options: [`Las ${h} y media`, `Las ${h+1} y media`, `Las ${h} en punto`], answer: `Las ${h} y media`, hints:['La aguja larga está en el 6.', 'Cuando está en el 6 es "y media".', 'La aguja corta está entre el '+h+' y el '+(h+1)+'.', `Ya pasó la hora ${h}.`, `Son las ${h} y media.`], explanation: `¡Muy bien! Son las ${h} y media.`, lessonId: RELOJ_HORAS_1
        })),
         ...[1,2,4,5,6,7,8,10,11,12].map((h): Question => ({
             type: 'mcq', question: `¿Qué hora es?`, imageUrl: createClockSVG(h, 15), options: [`Las ${h} en punto`, `Las ${h} y cuarto`, `Las ${h} y media`], answer: `Las ${h} y cuarto`, hints:['La aguja larga está en el 3.', 'Cuando está en el 3 es "y cuarto".', `La aguja corta pasó un poquito del ${h}.`, `Son las ${h} y 15 minutos.`, `La respuesta es "y cuarto".`], explanation: `¡Genial! Son las ${h} y cuarto.`, lessonId: RELOJ_HORAS_1
        })),
        ...[2,3,4,5,6,7,8,9,10,11,12].map((h): Question => ({
             type: 'mcq', question: `¿Qué hora es?`, imageUrl: createClockSVG(h-1, 45), options: [`Las ${h} menos cuarto`, `Las ${h-1} y cuarto`, `Las ${h} en punto`], answer: `Las ${h} menos cuarto`, hints:['La aguja larga está en el 9.', 'Cuando está en el 9 es "menos cuarto".', `La aguja corta está casi llegando a las ${h}.`, `Faltan 15 minutos para las ${h}.`, `La respuesta es "menos cuarto".`], explanation: `¡Excelente! Son las ${h} menos cuarto.`, lessonId: RELOJ_HORAS_1
        })),
        
        // === Lección: Contando Minutos (RELOJ_MINUTOS_1) - 40 preguntas ===
        { type: 'input', question: 'Si el minutero (aguja larga) apunta al 2, ¿cuántos minutos han pasado?', imageUrl: createClockSVG(1, 10), answer: '10', hints:['Cada número del reloj representa 5 minutos para el minutero.', 'Tienes que multiplicar el número por 5.', '2 x 5 = ?', 'Diez.', '10.'], explanation: 'Multiplicamos el número 2 por 5, lo que nos da 10 minutos. ¡Es la tabla del 5! 👍', lessonId: RELOJ_MINUTOS_1},
        { type: 'mcq', question: '¿Qué hora es? (Formato digital)', imageUrl: createClockSVG(4, 20), options: ['4:04', '4:20', '5:20'], answer: '4:20', hints:['La aguja corta (hora) está un poco después del 4.', 'La aguja larga (minutos) está en el 4.', 'Para saber los minutos, multiplica 4 x 5.', '4 x 5 = 20.', 'Son las cuatro y veinte.'], explanation: 'La hora es 4 y los minutos son 4x5=20. ¡La hora es 4:20! ✅', lessonId: RELOJ_MINUTOS_1},
        { type: 'input', question: '¿Cuántos minutos tiene una hora?', answer: '60', hints:['El minutero da una vuelta completa al reloj.', 'Pasa por los 12 números.', '12 x 5 = ?', 'Sesenta.', '60.'], explanation: 'Una hora tiene 60 minutos. ¡Por eso el reloj tiene 60 marquitas pequeñas! ⏳', lessonId: RELOJ_MINUTOS_1},
        { type: 'mcq', question: '¿Qué hora es? (Formato digital)', imageUrl: createClockSVG(7, 50), options: ['7:50', '8:50', '10:35'], answer: '7:50', hints:['La aguja corta está casi en el 8, pero todavía no ha llegado. Así que la hora es 7.', 'La aguja larga está en el 10.', 'Para los minutos, multiplica 10 x 5.', '10 x 5 = 50.', 'Siete y cincuenta.'], explanation: 'La hora es 7 y los minutos son 10x5=50. ¡Son las 7:50, casi las 8! 🕗', lessonId: RELOJ_MINUTOS_1},
        ...[1,2,3,4,5,6,7,8,9,10,11,12].map((n): Question => ({
             type: 'input', question: `Si el minutero apunta al ${n}, ¿cuántos minutos son?`, answer: (n*5).toString(), hints:['El truco es multiplicar el número por 5.', `Calcula ${n} x 5.`, `Usa la tabla del 5.`, `La respuesta es ${n*5}.`, `No confundas con la hora.`], explanation: `Cuando el minutero está en el ${n}, han pasado ${n}x5 = ${n*5} minutos.`, lessonId: RELOJ_MINUTOS_1
        })),
        ...[1,2,3,4,6,7,8,9,11,12].map((h): Question => ({
             type: 'mcq', question: `¿Qué hora es?`, imageUrl: createClockSVG(h, 25), options: [`${h}:05`, `${h}:25`, `${h+1}:25`], answer: `${h}:25`, hints:['La aguja larga está en el 5.', '5 x 5 = 25 minutos.', `La aguja corta está después del ${h}.`, `Son las ${h} y 25.`, 'La respuesta es la segunda opción.'], explanation: `La hora es ${h} y los minutos son 5x5=25. La hora es ${h}:25.`, lessonId: RELOJ_MINUTOS_1
        })),
        ...[1,2,3,4,5,6,7,8,9,10,11,12].map((h): Question => ({
             type: 'mcq', question: `¿Qué hora es?`, imageUrl: createClockSVG(h, 40), options: [`${h}:40`, `${h}:08`, `${h+1}:40`], answer: `${h}:40`, hints:['La aguja larga está en el 8.', '8 x 5 = 40 minutos.', `La aguja corta está más cerca de la siguiente hora, pero aún son las ${h}.`, `Son las ${h} y 40.`, 'La respuesta es la primera opción.'], explanation: `La hora es ${h} y los minutos son 8x5=40. La hora es ${h}:40.`, lessonId: RELOJ_MINUTOS_1
        })),

        // === Lección: Problemas de Tiempo (RELOJ_PROBLEMAS_1) - 40 preguntas ===
        { type: 'mcq', question: 'Son las 2:00. ¿Qué hora será dentro de 3 horas?', imageUrl: createClockSVG(2, 0), options: ['Las 3:00', 'Las 5:00', 'Las 2:03'], answer: 'Las 5:00', hints:['"Dentro de" significa sumar tiempo.', 'Solo tienes que sumar las horas.', '2 + 3 = ?', 'Cinco.', 'Serán las 5 en punto.'], explanation: 'Sumamos las horas: 2 + 3 = 5. Serán las 5:00. ¡Fácil! 👍', lessonId: RELOJ_PROBLEMAS_1},
        { type: 'mcq', question: 'Un recreo dura 30 minutos. Si empieza a las 10:00, ¿a qué hora termina?', imageUrl: createClockSVG(10, 0), options: ['A las 10:30', 'A las 11:00', 'A las 10:03'], answer: 'A las 10:30', hints:['Tienes que sumarle 30 minutos a la hora de inicio.', '10:00 + 30 minutos = ?', '30 minutos es "media hora".', 'Las diez y media.', '10:30.'], explanation: 'Si empieza a las 10:00 y dura 30 minutos, termina a las 10:30. ¡A jugar! ⚽', lessonId: RELOJ_PROBLEMAS_1},
        { type: 'input', question: 'El partido de pelota empezó a las 4:00 y terminó a las 6:00. ¿Cuántas horas duró?', answer: '2', hints:['Tienes que calcular la diferencia de tiempo.', 'Del 4 al 6, ¿cuántos números hay?', '6 - 4 = ?', 'Dos.', 'Duró 2 horas.'], explanation: 'Para saber cuánto tiempo pasó, restamos la hora de inicio de la hora final: 6 - 4 = 2 horas. ⚾', lessonId: RELOJ_PROBLEMAS_1},
        ...Array.from({ length: 37 }).map((_, i): Question => {
            const startHour = (i % 12) + 1;
            const duration = (i % 5) + 1;
            const endHour = (startHour + duration -1) % 12 + 1;
            return {
                type: 'mcq',
                question: `El programa de TV empieza a las ${startHour}:00 y dura ${duration} hora(s). ¿A qué hora termina?`,
                imageUrl: createClockSVG(startHour, 0),
                options: [`Las ${endHour}:00`, `Las ${startHour + duration}:00`, `Las ${endHour-1}:00`],
                answer: `Las ${endHour}:00`,
                hints: [`Tienes que sumar la duración a la hora de inicio.`, `Calcula ${startHour} + ${duration}.`, `Recuerda que después de las 12 viene la 1.`, `La respuesta es a las ${endHour}.`, `Suma las horas.` ],
                explanation: `Sumamos la duración a la hora de inicio: ${startHour} + ${duration} = ${startHour + duration}, que en un reloj de 12 horas son las ${endHour}:00.`,
                lessonId: RELOJ_PROBLEMAS_1
            };
        }),
    ],
    2: [
        // =================================================================================================
        // NIVEL 2: 40 PREGUNTAS POR LECCIÓN
        // =================================================================================================

        // === Lección: Horas y Fracciones (RELOJ_HORAS_1) - 40 preguntas ===
        { type: 'mcq', question: 'Las 8 de la mañana también se escribe como...', options: ['8:00 p.m.', '8:00 a.m.', '20:00'], answer: '8:00 a.m.', hints:['"a.m." significa "antes del mediodía".', 'Es por la mañana, cuando vas a la escuela.', '"p.m." es por la tarde o la noche.', '20:00 es un formato de 24 horas para la noche.', 'La respuesta es 8:00 a.m.'], explanation: 'Para diferenciar la mañana de la tarde, usamos a.m. (antes del mediodía) y p.m. (pasado el mediodía). ¡Las 8 de la mañana es 8:00 a.m.! ☀️', lessonId: RELOJ_HORAS_1},
        ...Array.from({ length: 39 }).map((_, i): Question => {
            const hour = (i % 12) + 1;
            const period = i % 2 === 0 ? 'mañana' : 'tarde';
            const answer = period === 'mañana' ? 'a.m.' : 'p.m.';
            return {
                type: 'mcq',
                question: `Las ${hour} de la ${period}, ¿se escribe con "a.m." o "p.m."?`,
                options: ['a.m.', 'p.m.'],
                answer: answer,
                hints: [`"a.m." es para la mañana (desde la medianoche hasta el mediodía).`, `"p.m." es para la tarde y la noche (desde el mediodía hasta la medianoche).`, `La ${period} es...`, `Piensa si ya almorzaste o no.`, `La respuesta correcta es ${answer}.`],
                explanation: `Las horas de la ${period} se indican con "${answer}".`,
                lessonId: RELOJ_HORAS_1
            };
        }),

        // === Lección: Contando Minutos (RELOJ_MINUTOS_1) - 40 preguntas ===
        { type: 'input', question: 'El reloj marca las 3:15. ¿Qué hora será dentro de 10 minutos?', imageUrl: createClockSVG(3, 15), answer: '3:25', hints:['Solo tienes que sumar los minutos.', '15 + 10 = ?', 'Veinticinco.', 'La hora no cambia, siguen siendo las 3.', 'Serán las tres y veinticinco.'], explanation: 'Sumamos los minutos: 15 + 10 = 25. La hora final es 3:25. ¡El tiempo vuela! ✈️', lessonId: RELOJ_MINUTOS_1},
        ...Array.from({ length: 39 }).map((_, i): Question => {
            const startMinute = (i % 11) * 5; // 0, 5, ..., 50
            const startHour = (i % 12) + 1;
            const duration = 10 + (i % 5); // 10 a 14
            const endMinute = startMinute + duration;
            return {
                type: 'input',
                question: `Son las ${startHour}:${startMinute < 10 ? '0' : ''}${startMinute}. ¿Qué hora será dentro de ${duration} minutos? (Formato H:MM)`,
                answer: `${startHour}:${endMinute < 10 ? '0' : ''}${endMinute}`,
                hints: [`La hora no va a cambiar porque no pasamos de 60 minutos.`, `Solo tienes que sumar los minutos.`, `Calcula ${startMinute} + ${duration}.`, `El resultado de la suma es ${endMinute}.`, `La hora final es ${startHour}:${endMinute < 10 ? '0' : ''}${endMinute}.`],
                explanation: `Sumamos los minutos a la hora inicial: ${startMinute} + ${duration} = ${endMinute}. La nueva hora es ${startHour}:${endMinute < 10 ? '0' : ''}${endMinute}.`,
                lessonId: RELOJ_MINUTOS_1
            };
        }),

        // === Lección: Problemas de Tiempo (RELOJ_PROBLEMAS_1) - 40 preguntas ===
        { type: 'input', question: 'Salgo a jugar a las 4:30. Si juego durante 20 minutos, ¿a qué hora termino?', imageUrl: createClockSVG(4, 30), answer: '4:50', hints:['Suma los 20 minutos a la hora de inicio.', '30 minutos + 20 minutos = ?', 'Son 50 minutos.', 'La hora sigue siendo las 4.', 'Terminas a las cuatro y cincuenta.'], explanation: 'Sumamos los minutos de juego: 30 + 20 = 50. Terminas de jugar a las 4:50. ¡A merendar! 😋', lessonId: RELOJ_PROBLEMAS_1},
        { type: 'mcq', question: 'La película empieza a las 7:15 y termina a las 8:15. ¿Cuánto duró?', options: ['15 minutos', '1 hora', '2 horas'], answer: '1 hora', hints:['Los minutos son los mismos (15).', 'Solo ha cambiado la hora.', 'De las 7 a las 8, ¿cuánto tiempo pasa?', 'Pasa una hora exacta.', '60 minutos.'], explanation: 'Desde las 7:15 hasta las 8:15 ha pasado exactamente una hora. ¡Una película de duración perfecta! 🍿', lessonId: RELOJ_PROBLEMAS_1},
        ...Array.from({ length: 38 }).map((_, i): Question => {
            const startHour = (i % 12) + 1;
            const startMinute = (i % 6) * 10; // 0, 10, ..., 50
            const duration = 20 + i; // 20 a 57
            let endMinute = startMinute + duration;
            let endHour = startHour;
            if (endMinute >= 60) {
                endHour = (startHour % 12) + 1;
                endMinute = endMinute - 60;
            }
            return {
                type: 'input',
                question: `El pan del horno necesita ${duration} minutos. Si lo meto a las ${startHour}:${startMinute < 10 ? '0' : ''}${startMinute}, ¿a qué hora estará listo? (Formato H:MM)`,
                answer: `${endHour}:${endMinute < 10 ? '0' : ''}${endMinute}`,
                hints: [`Suma los minutos de cocción a la hora inicial.`, `Calcula ${startMinute} + ${duration}.`, `¡Cuidado! Si el resultado es 60 o más, pasa a la siguiente hora.`, `Por ejemplo, si son 50 + 20 = 70 min, eso es 1 hora y 10 min.`, `La respuesta es ${endHour}:${endMinute < 10 ? '0' : ''}${endMinute}.`],
                explanation: `Sumamos ${duration} minutos a las ${startHour}:${startMinute < 10 ? '0' : ''}${startMinute}. La hora final es ${endHour}:${endMinute < 10 ? '0' : ''}${endMinute}.`,
                lessonId: RELOJ_PROBLEMAS_1
            };
        }),
    ],
    3: [
        // =================================================================================================
        // NIVEL 3: 40 PREGUNTAS POR LECCIÓN
        // =================================================================================================
        
        // --- Lección: Horas y Fracciones (RELOJ_HORAS_1) - 40 preguntas ===
        { type: 'input', question: '¿Cuántos minutos son 3 horas?', answer: '180', hints:['Cada hora tiene 60 minutos.', 'Tienes que multiplicar 60 por 3.', '60 + 60 + 60 = ?', 'Un truco: 6 x 3 = 18, y añades el cero.', 'Ciento ochenta.'], explanation: 'Multiplicamos los minutos de una hora por 3: 60 x 3 = 180 minutos. ¡Mucho tiempo! ⏳', lessonId: RELOJ_HORAS_1},
        ...Array.from({ length: 39 }).map((_, i): Question => {
            const hours = 2 + (i % 5);
            const minutes = hours * 60;
            return {
                type: 'input',
                question: `${hours} horas, ¿cuántos minutos son?`,
                answer: minutes.toString(),
                hints: [`Una hora tiene 60 minutos.`, `Para convertir horas a minutos, multiplicas por 60.`, `La operación es ${hours} x 60.`, `Un truco: ${hours} x 6 y luego añades un cero.`, `La respuesta es ${minutes}.`],
                explanation: `Multiplicamos el número de horas por 60 para obtener el total de minutos: ${hours} × 60 = ${minutes} minutos.`,
                lessonId: RELOJ_HORAS_1
            };
        }),

        // === Lección: Contando Minutos (RELOJ_MINUTOS_1) - 40 preguntas ===
        { type: 'input', question: '¿Cuántos segundos hay en 2 minutos?', answer: '120', hints:['Un minuto tiene 60 segundos.', 'Tienes que multiplicar 60 por 2.', '60 + 60 = ?', 'El doble de 60.', 'Ciento veinte.'], explanation: 'Multiplicamos los segundos de un minuto por 2: 60 x 2 = 120 segundos. ¡Tic, tac! ⏱️', lessonId: RELOJ_MINUTOS_1},
        ...Array.from({ length: 39 }).map((_, i): Question => {
            const minutes = 2 + (i % 9);
            const seconds = minutes * 60;
            return {
                type: 'input',
                question: `¿Cuántos segundos hay en ${minutes} minutos?`,
                answer: seconds.toString(),
                hints: [`Un minuto tiene 60 segundos.`, `Para convertir minutos a segundos, multiplicas por 60.`, `La operación es ${minutes} x 60.`, `Un truco: ${minutes} x 6 y luego añades un cero.`, `La respuesta es ${seconds}.`],
                explanation: `Multiplicamos el número de minutos por 60 para obtener el total de segundos: ${minutes} × 60 = ${seconds} segundos.`,
                lessonId: RELOJ_MINUTOS_1
            };
        }),

        // === Lección: Problemas de Tiempo (RELOJ_PROBLEMAS_1) - 40 preguntas ===
        { type: 'input', question: 'La película empezó a las 5:30 y duró 90 minutos. ¿A qué hora terminó?', answer: '7:00', hints:['90 minutos es 1 hora y 30 minutos.', 'Paso 1: Suma 1 hora a las 5:30. Serían las 6:30.', 'Paso 2: Ahora, a las 6:30, súmale los 30 minutos que faltan.', '6:30 + 30 minutos = ?', 'Las 7 en punto.'], explanation: '90 minutos es una hora y media. Si a las 5:30 le sumas una hora, son las 6:30. Si le sumas la media hora que falta, llegas a las 7:00. ¡Fin de la película! 🎬', lessonId: RELOJ_PROBLEMAS_1},
        { type: 'mcq', question: 'Salgo de casa a las 8:10. Tardo 15 min en llegar a la escuela. ¿A qué hora llego?', options: ['8:15', '8:25', '8:55'], answer: '8:25', hints:['Suma los minutos del viaje a la hora de salida.', '10 minutos + 15 minutos = ?', '25 minutos.', 'La hora no cambia.', 'Llegas a las 8 y 25.'], explanation: 'Sumamos los minutos: 10 + 15 = 25. Llegas a la escuela a las 8:25. ¡Justo a tiempo! 🔔', lessonId: RELOJ_PROBLEMAS_1},
        { type: 'input', question: 'El autobús pasa cada 20 minutos. Si el último pasó a las 9:05, ¿a qué hora pasará el siguiente?', answer: '9:25', hints:['Suma 20 minutos a la hora que pasó.', '9:05 + 20 minutos = ?', '5 + 20 = 25.', 'La hora no cambia.', 'Pasará a las 9 y 25.'], explanation: 'Sumamos el intervalo de tiempo a la última pasada: 9:05 + 20 minutos = 9:25. ¡No lo pierdas! 🚌', lessonId: RELOJ_PROBLEMAS_1},
        ...Array.from({ length: 37 }).map((_, i): Question => {
            const startTimeHour = 8 + Math.floor(i / 10);
            const startTimeMinute = (i % 6) * 10;
            const duration = 75; // 1 hora y 15 minutos
            const endHour = startTimeHour + 1;
            const endMinute = (startTimeMinute + 15) % 60;

            return {
                type: 'input',
                question: `Un examen empieza a las ${startTimeHour}:${startTimeMinute < 10 ? '0':''}${startTimeMinute} y dura ${duration} minutos. ¿A qué hora termina? (Formato H:MM)`,
                answer: `${endHour}:${endMinute < 10 ? '0':''}${endMinute}`,
                hints: [`${duration} minutos es 1 hora y 15 minutos.`, `Primero, suma 1 hora a la hora de inicio.`, `A ${startTimeHour}:${startTimeMinute < 10 ? '0':''}${startTimeMinute} le sumas 1 hora y son las ${startTimeHour+1}:${startTimeMinute < 10 ? '0':''}${startTimeMinute}.`, `Ahora, suma los 15 minutos que faltan.`, `La respuesta es ${endHour}:${endMinute < 10 ? '0':''}${endMinute}.`],
                explanation: `Sumamos 1 hora y 15 minutos a la hora de inicio. ${startTimeHour}:${startTimeMinute < 10 ? '0':''}${startTimeMinute} + 1h = ${startTimeHour+1}:${startTimeMinute < 10 ? '0':''}${startTimeMinute}. Luego + 15 min = ${endHour}:${endMinute < 10 ? '0':''}${endMinute}.`,
                lessonId: RELOJ_PROBLEMAS_1
            };
        }),
    ]
};
