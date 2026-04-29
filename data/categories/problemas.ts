
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
        ...(() => {
            const qs: Question[] = [];
            const themes = [
                { item: 'galletas 🍪', verb: 'compro', ext: 'un refresco 🥤' },
                { item: 'panes 🥖', verb: 'hago', ext: 'una torta 🍰' },
                { item: 'lápices ✏️', verb: 'tengo', ext: 'una goma 🧽' },
                { item: 'libros 📚', verb: 'leo', ext: 'una libreta 📓' },
                { item: 'caramelos 🍬', verb: 'regalo', ext: 'un chocolate 🍫' },
                { item: 'juguetes 🧸', verb: 'encuentro', ext: 'una pelota ⚽' },
                { item: 'manzanas 🍎', verb: 'recojo', ext: 'una pera 🍐' },
                { item: 'flores 🌸', verb: 'planto', ext: 'un girasol 🌻' }
            ];
            for (let i = 0; i < 40; i++) {
                const precio1 = 20 + i;
                const precio2 = 10 + i;
                const total = precio1 + precio2;
                const theme = themes[i % themes.length];
                const isMcq = i % 2 === 0;
                qs.push({
                    type: isMcq ? 'mcq' : 'input',
                    question: `Si en la tienda ${theme.verb} ${theme.item} por ${precio1} CUP y ${theme.ext} por ${precio2} CUP, ¿cuánto dinero gasté en total? 🛍️`,
                    imageUrl: createProblemSVG('🛍️', `${precio1} + ${precio2}`),
                    options: isMcq ? [total.toString(), (total - 5).toString(), (total + 5).toString()].sort(() => Math.random() - 0.5) : undefined,
                    answer: total.toString(),
                    hints: [`"Total" significa sumar ambas cantidades.`, `Los números son: ${precio1} y ${precio2}.`, `Suma: ${precio1} + ${precio2}.`, `El resultado final es ${total}.`],
                    explanation: `¡Muy bien, detective! 🕵️ Para saber el gasto total, sumamos ${precio1} CUP más ${precio2} CUP. La operación es: **${precio1} + ${precio2} = ${total}**. ¡En total gastaste ${total} pesos cubanos! 💸✨`,
                    lessonId: PASO_1
                });
            }
            return qs;
        })(),

        // === PASO_2 (40) ===
        { type: 'input', question: 'Tenía 50 CUP, mi mamá me dio 20 más y gasté 10 en un pan. ¿Cuánto me queda? 🥖', imageUrl: createProblemSVG('🥖', '(50+20)-10'), answer: '60', hints:['1. Primero suma lo que tienes ahora: 50 + 20 = 70.', '2. Luego resta lo que gastaste en el pan.', '70 - 10 = ?', 'Sesenta pesos.', '60.'], explanation: `Este es un problema de dos pasos:
        1. **Sumamos** lo que tenías y lo que te dieron: 50 + 20 = 70 CUP. 💰
        2. **Restamos** lo que gastaste: 70 - 10 = 60 CUP. 
        ¡Te quedan 60 pesos para seguir ahorrando! 🐷🪙`, lessonId: PASO_2 },
        ...(() => {
            const qs: Question[] = [];
            const themes = [
                { actor: 'Un niño 👦', obj: 'canicas 🔵', gana: 'ganó', pierde: 'se le perdieron' },
                { actor: 'Una niña 👧', obj: 'cromos 🃏', gana: 'compró', pierde: 'regaló' },
                { actor: 'El maestro 👨‍🏫', obj: 'lápices ✏️', gana: 'encontró', pierde: 'se le rompieron' },
                { actor: 'Mi abuela 👵', obj: 'galletas 🍪', gana: 'horneó', pierde: 'se comió' },
                { actor: 'Un pirata 🏴‍☠️', obj: 'monedas de oro 🪙', gana: 'desenterró', pierde: 'se le cayeron al mar' }
            ];
            for (let i = 0; i < 40; i++) {
                const inicial = 100 + i;
                const gana = 10 + i;
                const pierde = 5 + i;
                const final = inicial + gana - pierde;
                const theme = themes[i % themes.length];
                const isMcq = i % 2 !== 0;
                qs.push({
                    type: isMcq ? 'mcq' : 'input',
                    question: `${theme.actor} tenía ${inicial} ${theme.obj} en su colección. Luego ${theme.gana} ${gana} más, pero después ${theme.pierde} ${pierde}. ¿Cuántas ${theme.obj} tiene ahora? ✨`,
                    imageUrl: createProblemSVG('🏐', `(${inicial}+${gana})-${pierde}`),
                    options: isMcq ? [final.toString(), (final - 10).toString(), (final + 10).toString()].sort(() => Math.random() - 0.5) : undefined,
                    answer: final.toString(),
                    hints: [`Paso 1: Suma a la cantidad inicial: ${inicial} + ${gana}.`, `Paso 2: A ese resultado, réstale: - ${pierde}.`, `El resultado final es ${final}.`],
                    explanation: `¡Qué buen razonamiento! 🧠 Primero sumamos: **${inicial} + ${gana} = ${inicial + gana}**. Luego restamos: **${inicial + gana} - ${pierde} = ${final}**. ¡Increíble! 🏆`,
                    lessonId: PASO_2
                });
            }
            return qs;
        })(),

        // === COMBINADAS (40) ===
        { type: 'input', question: 'Calcula el resultado de esta operación combinada: (10 + 5) x 2 🛡️', imageUrl: createProblemSVG('🧮', '(10+5)*2'), answer: '30', hints:['¡Regla de oro!: Primero resuelve lo que está dentro del paréntesis: 10 + 5.', '10 + 5 = 15.', 'Ahora multiplica ese resultado por 2.', 'El doble de 15.', 'La respuesta es 30.'], explanation: `¡Excelente! En las operaciones combinadas, los paréntesis mandan:
        1. Resolvemos el paréntesis: **(10 + 5) = 15**. 📦
        2. Multiplicamos por 2: **15 x 2 = 30**. ✖️
        ¡El resultado es 30! Recuerda siempre respetar el orden de los superpoderes. 🛡️✨`, lessonId: COMBINADAS },
        ...(() => {
            const qs: Question[] = [];
            const themes = [
                { obj: 'barcos ⛵', verb: 'fabricar', actor: 'un carpintero' },
                { obj: 'robotitos 🤖', verb: 'armar', actor: 'un inventor' },
                { obj: 'castillos 🏰', verb: 'construir', actor: 'una niña' },
                { obj: 'dibujos 🎨', verb: 'pintar', actor: 'un artista' },
                { obj: 'pizzas 🍕', verb: 'cocinar', actor: 'el chef' }
            ];
            for (let i = 0; i < 40; i++) {
                const n1 = 10 + i;
                const n2 = 5 + i;
                const res = (n1 + n2) * 2;
                const theme = themes[i % themes.length];
                const isMcq = i % 2 === 0;
                qs.push({
                    type: isMcq ? 'mcq' : 'input',
                    question: `Para ${theme.verb} sus ${theme.obj}, ${theme.actor} hace este cálculo: (${n1} + ${n2}) x 2 = ? ¿Puedes ayudarle? ⚔️`,
                    imageUrl: createProblemSVG('🛡️', `(${n1}+${n2})*2`),
                    options: isMcq ? [res.toString(), (res + 10).toString(), (res - 10).toString()].sort(() => Math.random() - 0.5) : undefined,
                    answer: res.toString(),
                    hints: [`Primero, haz la suma que está atrapada en el paréntesis: ${n1} + ${n2}.`, `Luego, multiplica ese resultado por 2.`, `El resultado es ${res}.`],
                    explanation: `¡Desafío superado! 🎖️ 1. Sumamos lo del paréntesis: **${n1} + ${n2} = ${n1 + n2}**. 2. Multiplicamos por 2: **${n1 + n2} x 2 = ${res}**. ¡Muy bien hecho! 🛡️🚀`,
                    lessonId: COMBINADAS
                });
            }
            return qs;
        })()
    ],
    2: [
        // === PASO_1 (40) ===
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 40; i++) {
                const vendio = 50 + i * 2;
                const quedan = 30 + i;
                const inicial = vendio + quedan;
                qs.push({
                    type: 'input',
                    question: `En una tienda estatal se vendieron ${vendio} panes por la mañana y aún quedan ${quedan} en los estantes. ¿Cuántos panes había al abrir la tienda? 🥖🏪`,
                    imageUrl: createProblemSVG('🥖', `? = ${vendio} + ${quedan}`),
                    answer: inicial.toString(),
                    hints: [`Para saber cuántos había al inicio, debemos juntar los que se vendieron con los que sobraron.`, `Juntar significa realizar una suma.`, `Suma los vendidos: ${vendio}.`, `Suma los que quedan: ${quedan}.`, `La operación es ${vendio} + ${quedan}.`],
                    explanation: `¡Exacto! 🎯 Para saber la cantidad inicial, sumamos lo que salió de la tienda más lo que todavía está allí:
                    **${vendio} (vendidos) + ${quedan} (quedan) = ${inicial}**. 
                    ¡Al abrir había ${inicial} panes calienticos! 🥖🔥`,
                    lessonId: PASO_1
                });
            }
            return qs;
        })(),

        // === PASO_2 (40) ===
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 40; i++) {
                const cajas = 40 + i;
                const lapicesXcaja = 5;
                const totalLapices = cajas * lapicesXcaja;
                const regalo = 10 + i;
                const quedan = totalLapices - regalo;
                qs.push({
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
                });
            }
            return qs;
        })(),

        // === COMBINADAS (40) ===
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 40; i++) {
                const total = 100 + i;
                const s1 = 20 + i;
                const s2 = 10 + i;
                const sumaParen = s1 + s2;
                const res = total - sumaParen;
                qs.push({
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
                });
            }
            return qs;
        })()
    ],
    3: [
        // === PASO_1 (40) ===
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 40; i++) {
                qs.push({
                    type: 'input',
                    question: `Una cooperativa sembró ${1200 + i * 10} matas de café en un día. Si el plan es de ${5000 + i * 10}, ¿cuántas faltan? 🌱`,
                    answer: (3800).toString(),
                    hints: [`Resta lo sembrado del plan total.`, `${5000 + i * 10} - ${1200 + i * 10}.`, `Faltan miles.`, `Treinta y ocho mil novecientos... no, ¡mira bien!`, `Resultado: 3800.`],
                    explanation: `${5000 + i * 10} - ${1200 + i * 10} = 3800. ¡Faltan 3800 matas! 🌱`,
                    lessonId: PASO_1
                });
            }
            return qs;
        })(),

        // === PASO_2 (40) ===
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 40; i++) {
                qs.push({
                    type: 'input',
                    question: `Un tren lleva ${200 + i} pasajeros. En una estación bajan la cuarta parte y suben 30. ¿Cuántos hay ahora? 🚆`,
                    answer: (Math.round((200 + i) * 0.75 + 30)).toString(),
                    hints: [`Paso 1: Calcula la cuarta parte (divide entre 4).`, `Paso 2: Resta esa cuarta parte del total y suma 30.`, `O multiplica el total por 3/4 y suma 30.`, `Hazlo paso a paso.`, `Resultado esperado: ${Math.round((200 + i) * 0.75 + 30)}.`],
                    explanation: `Se quita 1/4 y se añaden 30. El resultado es ${Math.round((200 + i) * 0.75 + 30)}. 🚆`,
                    lessonId: PASO_2
                });
            }
            return qs;
        })(),

        // === COMBINADAS (40) ===
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 40; i++) {
                qs.push({
                    type: 'input',
                    question: `Calcula: (${50 + i} x 4) / (2 + 2) = ? 🛡️`,
                    answer: (50 + i).toString(),
                    hints: [`Resuelve los dos paréntesis primero.`, `Paréntesis 1: ${50 + i} x 4.`, `Paréntesis 2: 2 + 2 = 4.`, `Luego divide el primer resultado por 4.`, `Fíjate que multiplicar por 4 y dividir por 4 se anulan.`],
                    explanation: `((${50 + i} x 4) / 4) = ${50 + i}. 🛡️`,
                    lessonId: COMBINADAS
                });
            }
            return qs;
        })()
    ]
};
