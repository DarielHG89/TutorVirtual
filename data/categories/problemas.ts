
import type { Question } from '../../types';

// Lesson IDs
const PASO_1 = 'single_step_1_2';
const PASO_2 = 'two_step_1_2';
const COMBINADAS = 'operaciones_combinadas';

// Helper to create simple SVGs for problems
const createProblemSVG = (
    item: string,
    text?: string
): string => {
    let itemContent = `<text x="50" y="55" font-size="40" text-anchor="middle" dominant-baseline="middle">${item}</text>`;
    
    if (text) {
        itemContent += `<text x="50" y="85" font-size="10" text-anchor="middle" font-weight="bold">${text}</text>`;
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${itemContent}</svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

export const problemasQuestions: Record<number, Question[]> = {
    1: [
        // === PASO_1 (40) ===
        { type: 'input', question: 'En un jardín hay 25 rosas rojas y 12 blancas. ¿Cuántas rosas hay en total? 🌹', imageUrl: createProblemSVG('🌷', '25 + 12'), answer: '37', hints:['"Total" significa sumar.', '25 + 12 = ?', 'Suma unidades y luego decenas.', 'Treinta y siete.', '37.'], explanation: 'Sumamos las rosas: 25 + 12 = 37 rosas. 💐', lessonId: PASO_1 },
        { type: 'mcq', question: 'Tengo 10 caramelos y mi amigo me da 5. ¿Cuántos tengo en total?', imageUrl: createProblemSVG('🍬', '10 + 5'), options: ['15', '5', '105'], answer: '15', hints:['Sumar:', '10 + 5 = ?', 'Quince.', 'Es una decena y media.', '15.'], explanation: '10 + 5 = 15 caramelos. 🍬', lessonId: PASO_1 },
        { type: 'input', question: 'Había 18 pájaros en un árbol y se volaron 7. ¿Cuántos quedaron?', imageUrl: createProblemSVG('🐦', '18 - 7'), answer: '11', hints:['Restar:', '18 - 7 = ?', 'Once.', 'Al 8 le quitas 7.', '11.'], explanation: '18 - 7 = 11 pájaros. 🐦', lessonId: PASO_1 },
        { type: 'mcq', question: 'Compré 4 cajas con 6 refrescos cada una. ¿Cuántos refrescos tengo?', imageUrl: createProblemSVG('🥤', '4 x 6'), options: ['24', '10', '2'], answer: '24', hints:['Multiplicar:', '4 x 6 = ?', 'Veinticuatro.', 'Tabla del 4 o del 6.', '24.'], explanation: '4 x 6 = 24 refrescos. 🥤', lessonId: PASO_1 },
        { type: 'input', question: 'Tengo 20 bombones para repartir entre 4 niños. ¿Cuántos le tocan a cada uno?', imageUrl: createProblemSVG('🍫', '20 / 4'), answer: '5', hints:['Dividir:', '20 / 4 = ?', 'Cinco.', 'Tabla del 4: 4 x ? = 20.', '5.'], explanation: '20 / 4 = 5 bombones cada uno. 🍫', lessonId: PASO_1 },
        ...Array.from({ length: 35 }).map((_, i): Question => {
            const precio1 = 20 + i;
            const precio2 = 10 + i;
            const total = precio1 + precio2;
            return {
                type: 'input',
                question: `Si en la bodega compro un paquete de galletas por ${precio1} CUP y un refresco por ${precio2} CUP, ¿cuánto dinero gasté en total? 🍪🥤`,
                imageUrl: createProblemSVG('🛍️', `${precio1} + ${precio2}`),
                answer: total.toString(),
                hints: [`"Total" significa que debes unir o sumar ambas cantidades.`, `Identifica los números: ${precio1} y ${precio2}.`, `Realiza la suma: ${precio1} + ${precio2}.`, `Suma primero las unidades y luego las decenas.`, `El resultado final es ${total}.`],
                explanation: `¡Muy bien, detective! 🕵️ Para saber el gasto total, sumamos el precio de las galletas (${precio1} CUP) más el precio del refresco (${precio2} CUP). 
                La operación es: **${precio1} + ${precio2} = ${total}**. 
                ¡En total gastaste ${total} pesos cubanos! 💸✨`,
                lessonId: PASO_1
            };
        }),

        // === PASO_2 (40) ===
        { type: 'input', question: 'Tenía 50 CUP, mi mamá me dio 20 más y gasté 10 en un pan. ¿Cuánto me queda? 🥖', imageUrl: createProblemSVG('🥖', '(50+20)-10'), answer: '60', hints:['1. Primero suma lo que tienes ahora: 50 + 20 = 70.', '2. Luego resta lo que gastaste en el pan.', '70 - 10 = ?', 'Sesenta pesos.', '60.'], explanation: `Este es un problema de dos pasos:
        1. **Sumamos** lo que tenías y lo que te dieron: 50 + 20 = 70 CUP. 💰
        2. **Restamos** lo que gastaste: 70 - 10 = 60 CUP. 
        ¡Te quedan 60 pesos para seguir ahorrando! 🐷🪙`, lessonId: PASO_2 },
        ...Array.from({ length: 39 }).map((_, i): Question => {
            const inicial = 100 + i;
            const gana = 10 + i;
            const pierde = 5 + i;
            const final = inicial + gana - pierde;
            return {
                type: 'input',
                question: `Un niño tenía ${inicial} canicas en su bolsita. Jugando en el parque ganó ${gana} canicas, pero luego se le rompieron ${pierde}. ¿Cuántas canicas tiene ahora? 🔵✨`,
                imageUrl: createProblemSVG('🏐', `(${inicial}+${gana})-${pierde}`),
                answer: final.toString(),
                hints: [`Paso 1: Suma las canicas que ganó al total inicial: ${inicial} + ${gana}.`, `Paso 2: A ese resultado, réstale las que se rompieron: - ${pierde}.`, `Hazlo con calma, paso a paso.`, `Sigue la historia del problema para saber qué hacer.`, `El resultado final es ${final}.`],
                explanation: `¡Qué buen razonamiento! 🧠
                Primero, calculamos cuántas canicas llegó a tener: **${inicial} + ${gana} = ${inicial + gana}**. 📈
                Luego, quitamos las que se rompieron: **${inicial + gana} - ${pierde} = ${final}**. 📉
                ¡Ahora tiene ${final} canicas listas para seguir jugando! 🔵🏆`,
                lessonId: PASO_2
            };
        }),

        // === COMBINADAS (40) ===
        { type: 'input', question: 'Calcula el resultado de esta operación combinada: (10 + 5) x 2 🛡️', imageUrl: createProblemSVG('🧮', '(10+5)*2'), answer: '30', hints:['¡Regla de oro!: Primero resuelve lo que está dentro del paréntesis: 10 + 5.', '10 + 5 = 15.', 'Ahora multiplica ese resultado por 2.', 'El doble de 15.', 'La respuesta es 30.'], explanation: `¡Excelente! En las operaciones combinadas, los paréntesis mandan:
        1. Resolvemos el paréntesis: **(10 + 5) = 15**. 📦
        2. Multiplicamos por 2: **15 x 2 = 30**. ✖️
        ¡El resultado es 30! Recuerda siempre respetar el orden de los superpoderes. 🛡️✨`, lessonId: COMBINADAS },
        ...Array.from({ length: 39 }).map((_, i): Question => {
            const n1 = 10 + i;
            const n2 = 5 + i;
            const res = (n1 + n2) * 2;
            return {
                type: 'input',
                question: `Resuelve este desafío matemático respetando el orden: (${n1} + ${n2}) x 2 = ? ⚔️`,
                imageUrl: createProblemSVG('🛡️', `(${n1}+${n2})*2`),
                answer: res.toString(),
                hints: [`Primero, haz la suma que está atrapada en el paréntesis: ${n1} + ${n2}.`, `Luego, multiplica ese resultado por 2.`, `Multiplicar por 2 es buscar el doble.`, `No olvides que el paréntesis es lo primero.`, `El resultado es ${res}.`],
                explanation: `¡Desafío superado! 🎖️
                1. Primero sumamos lo del paréntesis: **${n1} + ${n2} = ${n1 + n2}**. ➕
                2. Luego multiplicamos por 2: **${n1 + n2} x 2 = ${res}**. ✖️
                ¡Muy bien hecho! Los paréntesis ya no tienen secretos para ti. 🛡️🚀`,
                lessonId: COMBINADAS
            };
        })
    ],
    2: [
        // === PASO_1 (40) ===
        ...Array.from({ length: 40 }).map((_, i): Question => {
            const vendio = 50 + i * 2;
            const quedan = 30 + i;
            const inicial = vendio + quedan;
            return {
                type: 'input',
                question: `En una tienda estatal se vendieron ${vendio} panes por la mañana y aún quedan ${quedan} en los estantes. ¿Cuántos panes había al abrir la tienda? 🥖🏪`,
                imageUrl: createProblemSVG('🥖', `? = ${vendio} + ${quedan}`),
                answer: inicial.toString(),
                hints: [`Para saber cuántos había al inicio, debemos juntar los que se vendieron con los que sobraron.`, `Juntar significa realizar una suma.`, `Suma los vendidos: ${vendio}.`, `Suma los que quedan: ${quedan}.`, `La operación es ${vendio} + ${quedan}.`],
                explanation: `¡Exacto! 🎯 Para saber la cantidad inicial, sumamos lo que salió de la tienda más lo que todavía está allí:
                **${vendio} (vendidos) + ${quedan} (quedan) = ${inicial}**. 
                ¡Al abrir había ${inicial} panes calienticos! 🥖🔥`,
                lessonId: PASO_1
            };
        }),

        // === PASO_2 (40) ===
        ...Array.from({ length: 40 }).map((_, i): Question => {
            const cajas = 40 + i;
            const lapicesXcaja = 5;
            const totalLapices = cajas * lapicesXcaja;
            const regalo = 10 + i;
            const quedan = totalLapices - regalo;
            return {
                type: 'input',
                question: `Un maestro tiene ${cajas} cajas de lápices. Cada caja tiene ${lapicesXcaja} lápices adentro. Si regala ${regalo} lápices a sus alumnos aplicados, ¿cuántos lápices le quedan? ✏️🏫`,
                imageUrl: createProblemSVG('📦', `(${cajas}x5)-${regalo}`),
                answer: quedan.toString(),
                hints: [`Paso 1: Calcula el total de lápices multiplicando las cajas por los lápices de cada una: ${cajas} x 5.`, `Paso 2: A ese total, réstale los lápices que el maestro regaló: - ${regalo}.`, `Es un problema de dos pasos: primero multiplicar y luego restar.`, `Recuerda las tablas de multiplicar.`, `El resultado es ${quedan}.`],
                explanation: `¡Magnífico trabajo! 🌟
                1. Primero hallamos el total de lápices: **${cajas} cajas x 5 lápices = ${totalLapices}** lápices en total. ✏️
                2. Luego restamos los que regaló: **${totalLapices} - ${regalo} = ${quedan}**. 🎁
                ¡Al maestro le quedan ${quedan} lápices todavía! 📏📖`,
                lessonId: PASO_2
            };
        }),

        // === COMBINADAS (40) ===
        ...Array.from({ length: 40 }).map((_, i): Question => {
            const total = 100 + i;
            const s1 = 20 + i;
            const s2 = 10 + i;
            const sumaParen = s1 + s2;
            const res = total - sumaParen;
            return {
                type: 'input',
                question: `¿Cuál es el resultado de proteger esta operación?: ${total} - (${s1} + ${s2}) = ? 🛡️✨`,
                imageUrl: createProblemSVG('🔢', `${total}-(${s1}+${s2})`),
                answer: res.toString(),
                hints: [`¡Recuerda siempre!: El paréntesis se resuelve antes que cualquier otra cosa.`, `Paso 1: Suma lo que está adentro del paréntesis: ${s1} + ${s2}.`, `Paso 2: Resta ese resultado al número inicial: ${total} - (resultado).`, `No restes de izquierda a derecha sin mirar los paréntesis.`, `El resultado final es ${res}.`],
                explanation: `¡Perfecto! Has seguido las reglas del orden matemático:
                1. Resolvemos el paréntesis primero: **${s1} + ${s2} = ${sumaParen}**. 📦
                2. Hacemos la resta final: **${total} - ${sumaParen} = ${res}**. 📉
                ¡Eres un experto en operaciones combinadas! 🛡️🏆`,
                lessonId: COMBINADAS
            };
        })
    ],
    3: [
        // === PASO_1 (40) ===
        ...Array.from({ length: 40 }).map((_, i): Question => ({
            type: 'input',
            question: `Una cooperativa sembró ${1200 + i * 10} matas de café en un día. Si el plan es de ${5000 + i * 10}, ¿cuántas faltan? 🌱`,
            answer: (3800).toString(),
            hints: [`Resta lo sembrado del plan total.`, `${5000 + i * 10} - ${1200 + i * 10}.`, `Faltan miles.`, `Treinta y ocho mil novecientos... no, ¡mira bien!`, `Resultado: 3800.`],
            explanation: `${5000 + i * 10} - ${1200 + i * 10} = 3800. ¡Faltan 3800 matas! 🌱`,
            lessonId: PASO_1
        })),

        // === PASO_2 (40) ===
        ...Array.from({ length: 40 }).map((_, i): Question => ({
            type: 'input',
            question: `Un tren lleva ${200 + i} pasajeros. En una estación bajan la cuarta parte y suben 30. ¿Cuántos hay ahora? 🚆`,
            answer: (Math.round((200 + i) * 0.75 + 30)).toString(),
            hints: [`Paso 1: Calcula la cuarta parte (divide entre 4).`, `Paso 2: Resta esa cuarta parte del total y suma 30.`, `O multiplica el total por 3/4 y suma 30.`, `Hazlo paso a paso.`, `Resultado esperado: ${Math.round((200 + i) * 0.75 + 30)}.`],
            explanation: `Se quita 1/4 y se añaden 30. El resultado es ${Math.round((200 + i) * 0.75 + 30)}. 🚆`,
            lessonId: PASO_2
        })),

        // === COMBINADAS (40) ===
        ...Array.from({ length: 40 }).map((_, i): Question => ({
            type: 'input',
            question: `Calcula: (${50 + i} x 4) / (2 + 2) = ? 🛡️`,
            answer: (50 + i).toString(),
            hints: [`Resuelve los dos paréntesis primero.`, `Paréntesis 1: ${50 + i} x 4.`, `Paréntesis 2: 2 + 2 = 4.`, `Luego divide el primer resultado por 4.`, `Fíjate que multiplicar por 4 y dividir por 4 se anulan.`],
            explanation: `((${50 + i} x 4) / 4) = ${50 + i}. 🛡️`,
            lessonId: COMBINADAS
        }))
    ]
};
