import type { Question } from '../../types';

// IDs de lecciones para claridad
const MEDIDAS_LONGITUD_1 = 'medidas_longitud_1';
const MEDIDAS_MASA_1 = 'medidas_masa_1';
const MEDIDAS_CAPACIDAD_1 = 'medidas_capacidad_1';
const MEDIDAS_MONEDA_1 = 'medidas_moneda_1';

// Helper to create simple SVGs for measurement questions
const createMedidasSVG = (
    type: 'ruler' | 'balance' | 'beaker' | 'coins' | 'item', 
    args: { val1?: number; val2?: number; unit?: string; item1?: string; item2?: string; total?: number }
): string => {
    let svgContent = '';
    const { val1 = 1, val2 = 5, unit = 'cm', item1 = '🐜', item2 = '🚪', total=100 } = args;

    switch (type) {
        case 'ruler':
            svgContent = `
                <rect x="10" y="40" width="80" height="20" fill="#fef3c7" stroke="black" stroke-width="1"/>
                <line x1="10" y1="40" x2="10" y2="30" stroke="black" stroke-width="1"/>
                <text x="10" y="25" font-size="8" text-anchor="middle">0</text>
                <line x1="50" y1="40" x2="50" y2="30" stroke="black" stroke-width="1"/>
                <text x="50" y="25" font-size="8" text-anchor="middle">${val1}</text>
                <line x1="90" y1="40" x2="90" y2="30" stroke="black" stroke-width="1"/>
                <text x="90" y="25" font-size="8" text-anchor="middle">${val2}</text>
                <text x="50" y="70" font-size="12" text-anchor="middle">Una regla en ${unit}</text>
            `;
            break;
        case 'balance':
            const tilt = (val1 > val2) ? -5 : (val1 < val2) ? 5 : 0;
            svgContent = `
                <g transform="rotate(${tilt} 50 50)">
                    <line x1="20" y1="50" x2="80" y2="50" stroke="brown" stroke-width="3"/>
                    <line x1="20" y1="50" x2="20" y2="60" stroke="brown" stroke-width="2"/>
                    <line x1="80" y1="50" x2="80" y2="60" stroke="brown" stroke-width="2"/>
                    <rect x="10" y="60" width="20" height="5" fill="#d1d5db"/>
                    <rect x="70" y="60" width="20" height="5" fill="#d1d5db"/>
                    <text x="20" y="55" font-size="20" text-anchor="middle">${item1}</text>
                    <text x="80" y="55" font-size="20" text-anchor="middle">${item2}</text>
                </g>
                <polygon points="45,50 55,50 50,80" fill="brown"/>
                <rect x="40" y="80" width="20" height="5" fill="brown"/>
            `;
            break;
        case 'beaker':
             svgContent = `
                <rect x="30" y="10" width="40" height="80" fill="none" stroke="black" stroke-width="2"/>
                <rect x="30" y="${10 + 80 * (1 - (val1/total))}" width="40" height="${80 * (val1/total)}" fill="#60a5fa"/>
                <line x1="25" y1="${10 + 80 * (1 - (val1/total))}" x2="30" y2="${10 + 80 * (1 - (val1/total))}" stroke="black" stroke-width="1"/>
                <text x="20" y="${15 + 80 * (1 - (val1/total))}" font-size="8" text-anchor="end">${val1}${unit}</text>
                <line x1="25" y1="10" x2="30" y2="10" stroke="black" stroke-width="1"/>
                <text x="20" y="15" font-size="8" text-anchor="end">${total}${unit}</text>
            `;
            break;
        case 'coins':
            const coin1 = `<g><circle cx="30" cy="50" r="15" fill="#fcd34d"/><text x="30" y="55" font-size="12" text-anchor="middle">${val1}</text></g>`;
            const bill1 = `<g><rect x="50" y="35" width="40" height="20" fill="#a7f3d0"/><text x="70" y="50" font-size="12" text-anchor="middle">${val2}</text></g>`;
             svgContent = `${val1 ? coin1 : ''}${val2 ? bill1 : ''}<text x="50" y="80" font-size="10" text-anchor="middle">${unit}</text>`;
            break;
        case 'item':
            svgContent = `
                <text x="50" y="50" font-size="40" text-anchor="middle">${item1}</text>
                <rect x="30" y="65" width="40" height="20" fill="#fef3c7"/>
                <text x="50" y="80" font-size="12" text-anchor="middle">${val1} ${unit}</text>
            `;
            break;
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${svgContent}</svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

export const medidasQuestions: Record<number, Question[]> = {
    1: [
        // =================================================================================================
        // Nivel 1 - 40 preguntas por lección
        // =================================================================================================

        // --- Lección: Longitud (MEDIDAS_LONGITUD_1) ---
        { type: 'mcq', question: '¿Qué usarías para medir el largo de un lápiz? ✏️', imageUrl: createMedidasSVG('ruler', { val1: 15, val2: 30, unit: 'cm' }), options: ['Una regla en cm', 'Una cinta de km'], answer: 'Una regla en cm', hints:['Un lápiz es un objeto pequeño.', 'Los kilómetros son para distancias muy grandes, como entre ciudades.', 'Los centímetros son para cosas pequeñas.', 'La regla es la herramienta perfecta para esto.', 'La unidad debe ser "cm".'], explanation: 'Para objetos pequeños como un lápiz, usamos centímetros (cm). ¡Una regla es la herramienta ideal! 👍', lessonId: MEDIDAS_LONGITUD_1},
        { type: 'mcq', question: '¿Qué es más largo, 1 metro o 1 centímetro?', options: ['1 metro', '1 centímetro', 'Son iguales'], answer: '1 metro', hints:['Un metro es para medir cosas como una puerta.', 'Un centímetro es para medir cosas como una uña.', 'Necesitas 100 centímetros para hacer un metro.', 'El metro es la unidad más grande.', 'Piensa en un paso largo (metro) vs el ancho de tu dedo (centímetro).'], explanation: 'Un metro (m) es 100 veces más grande que un centímetro (cm). ¡El metro es el gigante de los dos! 📏', lessonId: MEDIDAS_LONGITUD_1},
        { type: 'mcq', question: 'Para medir la altura de una casa, ¿qué unidad usarías? 🏠', options: ['Metros (m)', 'Centímetros (cm)', 'Kilómetros (km)'], answer: 'Metros (m)', hints:['Una casa es bastante grande.', 'Medirla en centímetros sería usar números muy, muy grandes y difíciles.', 'Los kilómetros son para distancias entre ciudades.', 'La unidad más lógica es el metro.', 'Una casa tiene varios metros de altura.'], explanation: 'Para objetos grandes como una casa, usamos metros (m). ¡Es la medida más cómoda y lógica! ✅', lessonId: MEDIDAS_LONGITUD_1},
        ...(() => {
            const qs: Question[] = [];
            const items = [
                { name: 'una hormiga 🐜', unit: 'cm', answer: 'cm' }, { name: 'un libro 📖', unit: 'cm', answer: 'cm' },
                { name: 'una puerta 🚪', unit: 'm', answer: 'm' }, { name: 'una piscina 🏊', unit: 'm', answer: 'm' },
                { name: 'la distancia a la playa 🏖️', unit: 'km', answer: 'km' }, { name: 'el largo de un carro 🚗', unit: 'm', answer: 'm' },
                { name: 'una goma de borrar', unit: 'cm', answer: 'cm' },
            ];
            for(let i=0; i<37; i++) {
                const item = items[i % items.length];
                qs.push({
                    type: 'mcq',
                    question: `¿En qué unidad medirías ${item.name}?`,
                    imageUrl: createMedidasSVG('item', {item1: item.name.split(' ')[1]}),
                    options: ['cm', 'm', 'km'],
                    answer: item.answer,
                    hints: [`Piensa en el tamaño del objeto.`, `¿Es muy pequeño, mediano o una distancia muy grande?`, `cm es para cosas pequeñas.`, `m es para cosas medianas o grandes.`, `km es para distancias enormes.` ],
                    explanation: `Para ${item.name}, la unidad más adecuada es el ${item.answer === 'cm' ? 'centímetro' : item.answer === 'm' ? 'metro' : 'kilómetro'}. ¡A cada objeto su medida!`,
                    lessonId: MEDIDAS_LONGITUD_1
                });
            }
            return qs;
        })(),

        // --- Lección: Masa (MEDIDAS_MASA_1) ---
        { type: 'mcq', question: 'En la balanza, ¿qué pesa más? ⚖️', imageUrl: createMedidasSVG('balance', { val1: 1, val2: 5, item1: '🍎', item2: '🍉' }), options: ['La manzana', 'La sandía'], answer: 'La sandía', hints:['La balanza se inclina hacia el lado más pesado.', 'El lado de la sandía está más abajo.', 'Una sandía es mucho más grande y pesada que una manzana.', 'El lado que baja es el que tiene más masa.', 'La sandía pesa más.'], explanation: 'La balanza se inclina hacia la sandía, lo que nos dice que tiene más masa (pesa más) que la manzana. 🍉', lessonId: MEDIDAS_MASA_1},
        { type: 'mcq', question: 'Para pesar una pluma, ¿qué unidad usarías? 깃', options: ['Gramos (g)', 'Kilogramos (kg)'], answer: 'Gramos (g)', hints:['Una pluma es extremadamente ligera.', 'Los kilogramos son para cosas pesadas como una persona.', 'Los gramos son para cosas muy ligeras.', 'Necesitas 1000 gramos para hacer 1 kilogramo.', 'La unidad correcta es el gramo.'], explanation: 'Para objetos muy ligeros como una pluma, usamos gramos (g). ¡Es la medida para los pesos pluma! 😉', lessonId: MEDIDAS_MASA_1},
        { type: 'mcq', question: 'Un saco de arroz se pesa en...', imageUrl: createMedidasSVG('item', {item1: '🍚', val1: 5, unit: 'kg'}), options: ['Gramos (g)', 'Kilogramos (kg)'], answer: 'Kilogramos (kg)', hints:['Un saco de arroz es pesado.', 'Pesarlo en gramos daría un número enorme.', 'La unidad más cómoda para esto es el kilogramo.', 'El kilogramo es 1000 veces más grande que el gramo.', 'La respuesta es kg.'], explanation: 'Para objetos pesados como un saco de arroz, usamos kilogramos (kg). ¡Es la unidad de los pesos pesados! 🏋️', lessonId: MEDIDAS_MASA_1},
        ...(() => {
            const qs: Question[] = [];
            const items = [
                { name: 'una persona 🧍', answer: 'kg' }, { name: 'un anillo 💍', answer: 'g' },
                { name: 'un camión 🚚', answer: 'kg' }, { name: 'una fresa 🍓', answer: 'g' },
                { name: 'una maleta 🧳', answer: 'kg' }, { name: 'un grano de arroz 🍚', answer: 'g' }
            ];
            for (let i = 0; i < 37; i++) {
                const item = items[i % items.length];
                qs.push({
                    type: 'mcq',
                    question: `¿En qué unidad pesarías ${item.name}?`,
                    imageUrl: createMedidasSVG('item', {item1: item.name.split(' ')[1]}),
                    options: ['g', 'kg'],
                    answer: item.answer,
                    hints: [`¿Es algo muy ligero o algo pesado?`, `g es para cosas ligeras.`, `kg es para cosas pesadas.`, `Piensa si lo puedes levantar fácilmente con una mano.`, `La unidad lógica es ${item.answer}.`],
                    explanation: `Para pesar ${item.name}, la unidad más lógica es el ${item.answer === 'g' ? 'gramo' : 'kilogramo'}.`,
                    lessonId: MEDIDAS_MASA_1
                });
            }
            return qs;
        })(),

        // --- Lección: Capacidad (MEDIDAS_CAPACIDAD_1) ---
        { type: 'mcq', question: '¿Qué recipiente tiene más líquido? 💧', imageUrl: createMedidasSVG('beaker', { val1: 200, total: 500, unit: 'ml' }), options: ['Uno con 200 ml', 'Uno con 100 ml'], answer: 'Uno con 200 ml', hints:['Compara los números 200 y 100.', '200 es mayor que 100.', 'Más mililitros significa más líquido.', 'El que tiene 200 ml está más lleno.', 'La respuesta es el que tiene más cantidad.'], explanation: 'El recipiente con 200 ml tiene más líquido porque 200 es un número mayor que 100. ¡Más para beber! 🥤', lessonId: MEDIDAS_CAPACIDAD_1},
        { type: 'mcq', question: 'Para medir el agua en una piscina, ¿qué usarías? 🏊', options: ['Litros (L)', 'Mililitros (ml)'], answer: 'Litros (L)', hints:['Una piscina contiene una cantidad enorme de agua.', 'Medirla en mililitros (gotitas) sería imposible.', 'El litro es una unidad mucho más grande y adecuada.', 'Los mililitros son para cosas pequeñas como un jarabe.', 'La respuesta es Litros.'], explanation: 'Para grandes cantidades de líquido como en una piscina, usamos litros (L). ¡Serían millones de mililitros! 🌊', lessonId: MEDIDAS_CAPACIDAD_1},
        { type: 'mcq', question: 'Una cucharadita de jarabe se mide en...', imageUrl: createMedidasSVG('item', {item1: '🥄', val1: 5, unit: 'ml'}), options: ['Litros (L)', 'Mililitros (ml)'], answer: 'Mililitros (ml)', hints:['Una cucharadita es una cantidad muy pequeña de líquido.', 'Los litros son para botellas grandes.', 'La unidad para cantidades pequeñas es el mililitro.', 'Piensa en las jeringas para dar medicina.', 'La respuesta es ml.'], explanation: 'Para cantidades tan pequeñas como una cucharada de jarabe, usamos mililitros (ml). ¡La medida precisa para la salud! 🧑‍⚕️', lessonId: MEDIDAS_CAPACIDAD_1},
        ...(() => {
            const qs: Question[] = [];
            const items = [
                { name: 'un perfume 🧴', answer: 'ml' }, { name: 'un tanque de agua en una azotea', answer: 'L' },
                { name: 'un vaso de jugo 🧃', answer: 'ml' }, { name: 'la gasolina de un carro ⛽', answer: 'L' },
                { name: 'una gota de lluvia 💧', answer: 'ml' }
            ];
            for (let i = 0; i < 37; i++) {
                const item = items[i % items.length];
                qs.push({
                    type: 'mcq',
                    question: `El líquido de ${item.name}, ¿en qué lo medirías?`,
                    imageUrl: createMedidasSVG('item', {item1: item.name.split(' ')[1]}),
                    options: ['ml', 'L'],
                    answer: item.answer,
                    hints: [`¿Es una cantidad muy pequeña de líquido o una cantidad grande?`, `ml es para cantidades pequeñas.`, `L es para cantidades grandes.`, `Piensa si cabe en un vaso o si necesitas un cubo.`, `La unidad correcta es ${item.answer}.` ],
                    explanation: `Para medir ${item.name}, la unidad más adecuada es el ${item.answer === 'ml' ? 'mililitro' : 'litro'}.`,
                    lessonId: MEDIDAS_CAPACIDAD_1
                });
            }
            return qs;
        })(),

        // --- Lección: Moneda (MEDIDAS_MONEDA_1) ---
        { type: 'input', question: 'Si tienes un billete de 20 CUP y una moneda de 5 CUP, ¿cuánto dinero tienes?', imageUrl: createMedidasSVG('coins', { val1: 5, val2: 20, unit: 'CUP' }), answer: '25', hints:['Tienes que juntar el valor de ambos.', 'Juntar es sumar.', '20 + 5 = ?', 'Veinticinco.', '25.'], explanation: 'Sumamos el valor del billete y la moneda: 20 + 5 = 25 CUP. ¡Listo para comprar! 🛍️', lessonId: MEDIDAS_MONEDA_1},
        { type: 'mcq', question: '¿Qué vale más, un billete de 50 CUP o un billete de 100 CUP?', options: ['50 CUP', '100 CUP'], answer: '100 CUP', hints:['Compara los números 50 y 100.', '100 es más grande que 50.', 'El billete de 100 te permite comprar más cosas.', 'Cien es el doble de cincuenta.', 'El billete de 100.'], explanation: 'El billete de 100 CUP tiene más valor que el de 50 CUP. ¡Puedes comprar el doble de cosas! 💰', lessonId: MEDIDAS_MONEDA_1},
        { type: 'input', question: 'Tienes 3 monedas de 1 CUP. ¿Cuánto dinero es?', imageUrl: createMedidasSVG('coins', { val1: 1, val2: 1, unit: 'CUP' }), answer: '3', hints:['Suma el valor de las tres monedas.', '1 + 1 + 1 = ?', 'También puedes multiplicar: 3 x 1.', 'Tres.', '3.'], explanation: 'Si tienes tres monedas de 1 peso, en total tienes 3 pesos. ¡Así de fácil! 👍', lessonId: MEDIDAS_MONEDA_1},
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 37; i++) {
                const val1 = [1, 3, 5][i % 3];
                const val2 = [20, 50, 100][i % 3];
                qs.push({
                    type: 'input',
                    question: `¿Cuánto dinero hay en la imagen?`,
                    imageUrl: createMedidasSVG('coins', {val1, val2, unit: 'CUP'}),
                    answer: (val1 + val2).toString(),
                    hints: [`Suma el valor del billete y de la moneda.`, `El billete vale ${val2}.`, `La moneda vale ${val1}.`, `La operación es ${val2} + ${val1}.`, `La respuesta es ${val1 + val2}.` ],
                    explanation: `Sumamos el valor del billete (${val2} CUP) y la moneda (${val1} CUP) para un total de ${val1 + val2} CUP.`,
                    lessonId: MEDIDAS_MONEDA_1
                });
            }
            return qs;
        })(),
    ],
    2: [
        // =================================================================================================
        // Nivel 2 - 40 preguntas por lección
        // =================================================================================================

        // --- Lección: Longitud (MEDIDAS_LONGITUD_1) ---
        { type: 'input', question: '¿Cuántos centímetros hay en 1 metro?', answer: '100', hints:['La palabra "centi" viene de cien.', 'En 1 metro caben 100 centímetros.', 'Cien.', 'Un 1 con dos ceros.', 'Es una conversión que debes memorizar.'], explanation: '¡Exacto! 1 metro es igual a 100 centímetros. ¡Es la regla de oro de la longitud! 📏', lessonId: MEDIDAS_LONGITUD_1},
        { type: 'input', question: 'Un palo mide 2 metros. ¿Cuántos centímetros mide?', imageUrl: createMedidasSVG('item', {item1: '📏', val1: 2, unit: 'm'}), answer: '200', hints:['Si 1 metro son 100 cm...', '...2 metros serán el doble.', '100 + 100 = ?', 'O puedes multiplicar: 2 x 100.', 'Doscientos.'], explanation: 'Multiplicamos los metros por 100 para convertirlos a centímetros: 2 x 100 = 200 cm. 👍', lessonId: MEDIDAS_LONGITUD_1},
        { type: 'mcq', question: '¿Cuántos metros hay en 1 kilómetro?', options: ['10', '100', '1000'], answer: '1000', hints:['La palabra "kilo" significa mil.', 'Un kilómetro es una distancia muy grande.', 'Son mil metros.', 'Un 1 con tres ceros.', '1000.'], explanation: '¡Correcto! 1 kilómetro es igual a 1000 metros. ¡Es una distancia para campeones! 🏃', lessonId: MEDIDAS_LONGITUD_1},
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 37; i++) {
                const metros = i + 2;
                const centimetros = metros * 100;
                qs.push({
                    type: 'input',
                    question: `Si un pasillo de tu escuela mide ${metros} metros de largo, ¿cuántos centímetros mide en total? 🏫📏`,
                    imageUrl: createMedidasSVG('ruler', { val1: metros, val2: metros * 2, unit: 'm' }),
                    answer: centimetros.toString(),
                    hints: [`¡Atención!: 1 metro es igual a 100 centímetros.`, `Para pasar de metros a centímetros, debes multiplicar el número por 100.`, `La operación es ${metros} x 100.`, `Un truco rápido: añade dos ceros al final del número ${metros}.`, `El resultado final es ${centimetros}.`],
                    explanation: `¡Muy bien calculado! 📏 Para convertir de metros a centímetros, multiplicamos por 100:
                **${metros} m x 100 = ${centimetros} cm**. 
                ¡El pasillo mide ${centimetros} centímetros de punta a punta! 🏃💨`,
                    lessonId: MEDIDAS_LONGITUD_1
                });
            }
            return qs;
        })(),

        // --- Lección: Masa (MEDIDAS_MASA_1) ---
        { type: 'input', question: '¿Cuántos gramos hay exactamente en 1 kilogramo? ⚖️🔢', answer: '1000', hints:['La palabra "kilo" significa mil.', 'Es una unidad que usamos para pesar cosas como el arroz.', 'En 1 kg caben mil unidades pequeñas llamadas gramos.', 'Un 1 con tres ceros.', 'Mil.'], explanation: '¡Correcto! 💪 1 kilogramo (kg) equivale a **1000 gramos (g)**. ¡Es la medida estándar para los pesos en la cocina y la bodega! ⚖️✨', lessonId: MEDIDAS_MASA_1},
        { type: 'input', question: 'Un paquete de café cubano pesa 3 kilogramos. ¿Cuántos gramos pesa en total? ☕⚖️', imageUrl: createMedidasSVG('item', {item1: '☕', val1: 3, unit: 'kg'}), answer: '3000', hints:['Sabemos que 1 kg = 1000 g.', 'Para saber cuánto son 3 kg, multiplicamos 3 por 1000.', '3 x 1000 = ?', 'Un 3 con tres ceros.', 'Tres mil.'], explanation: `¡Excelente! ☕ Como cada kilogramo tiene 1000 gramos, multiplicamos:
        **3 kg x 1000 = 3000 g**. 
        ¡Ese paquete tiene 3000 gramos de puro aroma! ☕🤤`, lessonId: MEDIDAS_MASA_1},
        { type: 'mcq', question: '¿Qué pesa más: 2 kilogramos de boniato o 2000 gramos de boniato? 🍠⚖️', options: ['2 kilogramos', '2000 gramos', 'Pesan exactamente lo mismo'], answer: 'Pesan exactamente lo mismo', hints:['Primero hagamos la conversión: 1 kg = 1000 g.', 'Entonces, 2 kg son iguales a 2000 g.', 'Compara 2000 g con 2000 g.', 'No hay uno mayor que otro.', 'Son iguales.'], explanation: '¡Justo así! 😉 Como 1 kg es igual a 1000 g, 2000 g es exactamente lo mismo que 2 kg. ¡El mismo peso dicho con palabras diferentes! 🍠✨', lessonId: MEDIDAS_MASA_1},
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 37; i++) {
                const kg = i + 2;
                const gramos = kg * 1000;
                qs.push({
                    type: 'input',
                    question: `Si compras una calabaza que pesa ${kg} kg en el agromercado, ¿cuántos gramos pesa? 🎃⚖️`,
                    imageUrl: createMedidasSVG('item', {item1: '🎃', val1: kg, unit: 'kg'}),
                    answer: gramos.toString(),
                    hints: [`Recuerda la regla: 1 kg = 1000 gramos.`, `Multiplica los kilogramos por 1000.`, `La operación es ${kg} x 1000.`, `Añade tres ceros al final del número ${kg}.`, `El resultado es ${gramos}.`],
                    explanation: `¡Buen trabajo! 🎃 Para pasar de kilogramos a gramos, multiplicamos por 1000:
                **${kg} kg x 1000 = ${gramos} g**. 
                ¡Tu calabaza pesa ${gramos} gramos! 🥧✨`,
                    lessonId: MEDIDAS_MASA_1
                });
            }
            return qs;
        })(),

        // --- Lección: Capacidad (MEDIDAS_CAPACIDAD_1) ---
        { type: 'input', question: '¿Cuántos mililitros hay en 1 litro de leche? 🥛💧', answer: '1000', hints:['La palabra "mili" nos da la pista de mil.', 'Es la cantidad de líquido que cabe en una botella estándar.', 'En 1 litro caben 1000 partes pequeñitas llamadas mililitros.', 'Un 1 seguido de tres ceros.', 'Mil.'], explanation: '¡Exacto! 🥛 1 litro (L) es igual a **1000 mililitros (ml)**. ¡Es la medida perfecta para llenar tu vaso! 🥛✨', lessonId: MEDIDAS_CAPACIDAD_1},
        { type: 'input', question: 'Una botella de refresco familiar tiene 2 litros. ¿Cuántos mililitros tiene? 🍾🥤', imageUrl: createMedidasSVG('item', {item1: '🥤', val1: 2, unit: 'L'}), answer: '2000', hints:['Si 1 L = 1000 ml...', '...2 L serán el doble.', 'Multiplica 2 x 1000.', 'Dos mil.', '2000.'], explanation: `¡Muy bien! 🥳 Multiplicamos los litros por 1000 para obtener los mililitros:
        **2 L x 1000 = 2000 ml**. 
        ¡Tienes 2000 mililitros para compartir con tus amigos! 🥤🙌`, lessonId: MEDIDAS_CAPACIDAD_1},
        { type: 'mcq', question: '¿Qué cantidad es mayor: medio litro o 500 mililitros? 🥛💧', options: ['Medio litro', '500 mililitros', 'Son la misma cantidad'], answer: 'Son la misma cantidad', hints:['Si 1 litro entero son 1000 ml...', '...la mitad de un litro (medio litro) es la mitad de 1000 ml.', 'La mitad de 1000 es 500.', 'Entonces, medio litro son 500 ml.', 'Son lo mismo.'], explanation: '¡Correcto! 🎯 Puesto que 1 litro son 1000 ml, la mitad es exactamente 500 ml. Medio litro y 500 ml son dos formas de llamar a la misma cantidad de jugo. 🧃✨', lessonId: MEDIDAS_CAPACIDAD_1},
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 37; i++) {
                const L = i + 2;
                const mililitros = L * 1000;
                qs.push({
                    type: 'input',
                    question: `Si llenas un cubo con ${L} litros de agua para limpiar la casa, ¿cuántos mililitros de agua tienes? 🪣💧`,
                    imageUrl: createMedidasSVG('beaker', { val1: L, total: L + 5, unit: 'L' }),
                    answer: mililitros.toString(),
                    hints: [`Recuerda: 1 Litro = 1000 mililitros.`, `Multiplica la cantidad de litros por 1000.`, `La operación es ${L} x 1000.`, `Añade tres ceros al número ${L}.`, `El resultado es ${mililitros}.`],
                    explanation: `¡Excelente! 🌊 Para convertir de litros a mililitros, multiplicamos por 1000:
                **${L} L x 1000 = ${mililitros} ml**. 
                ¡Tienes ${mililitros} mililitros de agua listos para usar! 🪣✨`,
                    lessonId: MEDIDAS_CAPACIDAD_1
                });
            }
            return qs;
        })(),

        // --- Lección: Moneda (MEDIDAS_MONEDA_1) ---
        { type: 'input', question: 'Un helado en la barquillera cuesta 18 CUP. Si pagas con un billete de 20 CUP, ¿cuánto dinero te deben devolver de vuelto? 🍦💵', imageUrl: createMedidasSVG('item', {item1: '🍦', val1: 18, unit: 'CUP'}), answer: '2', hints:['El "vuelto" es la diferencia entre lo que diste y lo que costó.', 'Debes hacer una resta.', '20 (billete) - 18 (helado) = ?', 'Solo faltan 2 para llegar a 20.', 'Dos pesos.'], explanation: `¡Muy bien calculado! 🍦 Restamos el precio del dinero entregado: **20 - 18 = 2 CUP**. 
        ¡Te deben devolver 2 pesos cubanos de vuelto! 💸😉`, lessonId: MEDIDAS_MONEDA_1},
        { type: 'mcq', question: 'Quieres comprar un juguete que cuesta 80 CUP. ¿Cuál es el billete más pequeño que te alcanza para pagar? 🧸💰', options: ['Un billete de 50', 'Un billete de 100', 'Un billete de 20'], answer: 'Un billete de 100', hints:['Necesitas un billete que sea mayor o igual a 80.', '50 es menor que 80, no te alcanza.', '20 también es menor que 80.', '100 es mayor que 80, así que con ese sí puedes pagar.', 'Te sobraría dinero.'], explanation: '¡Exacto! 🧸 Como el juguete cuesta 80 CUP, el billete de 100 CUP es el único que cubre el precio. ¡Incluso te sobrarán 20 pesos de vuelto! 💵✨', lessonId: MEDIDAS_MONEDA_1},
        { type: 'input', question: 'Si tienes 5 monedas de 3 CUP cada una, ¿cuánto dinero tienes en total? 🪙💰', answer: '15', hints:['Tienes 5 veces 3 pesos.', 'Puedes sumar 3+3+3+3+3.', 'O multiplicar 5 x 3.', 'Tabla del 5 o del 3.', 'Quince.'], explanation: `¡Magnífico! 🚀 Multiplicamos la cantidad de monedas por su valor:
        **5 monedas x 3 pesos = 15 CUP**. 
        ¡Ya tienes 15 pesos para tu alcancía! 🐷🪙✨`, lessonId: MEDIDAS_MONEDA_1},
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 37; i++) {
                const price = 10 + i;
                const paid = Math.ceil((price + 1) / 10) * 10;
                const change = paid - price;
                qs.push({
                    type: 'input',
                    question: `Un refresco de lata cuesta ${price} CUP. Si pagas con un billete de ${paid} CUP, ¿cuánto dinero te queda de vuelto? 🥤💸`,
                    imageUrl: createMedidasSVG('coins', { val1: 0, val2: paid, unit: 'CUP' }),
                    answer: change.toString(),
                    hints: [`El vuelto es lo que te sobra después de pagar.`, `Resta el precio (${price}) del dinero que entregaste (${paid}).`, `La operación es ${paid} - ${price}.`, `Haz la cuenta con cuidado.`, `La respuesta es ${change}.`],
                    explanation: `¡Esa es la cuenta! 🎯 Restamos el precio al dinero entregado: 
                **${paid} - ${price} = ${change} CUP**. 
                ¡Te quedan ${change} pesos cubanos de vuelto! 💸✨`,
                    lessonId: MEDIDAS_MONEDA_1
                });
            }
            return qs;
        })(),
    ],
    3: [
        // =================================================================================================
        // Nivel 3 - 40 preguntas por lección
        // =================================================================================================

        // --- Lección: Longitud (MEDIDAS_LONGITUD_1) ---
        { type: 'input', question: 'Corro 1500 metros. ¿Cuántos kilómetros son?', answer: '1.5', hints:['Para pasar de metros a kilómetros, hay que dividir entre 1000.', '1500 ÷ 1000.', '1000 metros es 1 km.', 'Los 500 metros que sobran son medio kilómetro.', 'Uno y medio.'], explanation: 'Dividimos los metros entre 1000: 1500 / 1000 = 1.5 km. ¡Has corrido un kilómetro y medio! 🏃‍♀️', lessonId: MEDIDAS_LONGITUD_1},
        { type: 'mcq', question: 'Un rectángulo mide 2 metros de largo y 50 cm de ancho. ¿Cuál es su perímetro en cm?', options: ['250 cm', '500 cm', '450 cm'], answer: '500 cm', hints:['¡Cuidado, las unidades son diferentes! Primero convierte todo a cm.', '2 metros son 200 cm.', 'El perímetro es la suma de todos los lados: 200 + 200 + 50 + 50.', '400 + 100 = ?', '500 cm.'], explanation: 'Primero convertimos 2 m a 200 cm. Luego calculamos el perímetro: 200+200+50+50 = 500 cm. ¡Atención al detalle! 🕵️', lessonId: MEDIDAS_LONGITUD_1},
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 38; i++) {
                const km = 1 + i*0.1;
                qs.push({
                    type: 'input',
                    question: `${km} km, ¿cuántos metros son?`,
                    answer: (km * 1000).toString(),
                    hints: [`Recuerda que 1 km = 1000 metros.`, `Para convertir de km a m, multiplicamos por 1000.`, `La operación es ${km} x 1000.`, `Mover la coma decimal tres lugares a la derecha.`, `La respuesta es ${km * 1000}.`],
                    explanation: `Multiplicamos los kilómetros por 1000: ${km} km × 1000 = ${km * 1000} m.`,
                    lessonId: MEDIDAS_LONGITUD_1
                });
            }
            return qs;
        })(),

        // --- Lección: Masa (MEDIDAS_MASA_1) ---
        { type: 'input', question: 'Compro 1 kg de arroz y 500 g de frijoles. ¿Cuántos kilogramos compré en total?', answer: '1.5', hints:['Primero, convierte todo a la misma unidad. Usemos kilogramos.', '500 gramos es medio kilogramo (0.5 kg).', 'Ahora suma los pesos: 1 kg + 0.5 kg.', 'Uno y medio.', '1.5 kg.'], explanation: 'Convertimos 500 g a 0.5 kg. Luego sumamos: 1 kg + 0.5 kg = 1.5 kg. ¡La compra pesa un kilo y medio! 🛒', lessonId: MEDIDAS_MASA_1},
        { type: 'mcq', question: 'Un camión puede cargar 2000 kg. Si ya lleva 1200 kg, ¿cuántos kilogramos más puede llevar?', options: ['800 kg', '3200 kg', '1000 kg'], answer: '800 kg', hints:['Es una resta para saber lo que "falta".', '2000 - 1200 = ?', '20 - 12 = 8.', 'Añade los dos ceros.', '800.'], explanation: 'Restamos la carga actual de la capacidad máxima: 2000 - 1200 = 800 kg. ¡Aún queda espacio! 📦', lessonId: MEDIDAS_MASA_1},
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 38; i++) {
                const g = 1200 + i * 50;
                const kg = g/1000;
                qs.push({
                    type: 'input',
                    question: `${g} gramos, ¿cuántos kilogramos son? (usa punto para decimal)`,
                    answer: kg.toString(),
                    hints: [`Recuerda que 1000 gramos = 1 kilogramo.`, `Para convertir de gramos a kilogramos, divides entre 1000.`, `La operación es ${g} / 1000.`, `Mover la coma decimal tres lugares a la izquierda.`, `La respuesta es ${kg}.` ],
                    explanation: `Dividimos los gramos entre 1000: ${g} g / 1000 = ${kg} kg.`,
                    lessonId: MEDIDAS_MASA_1
                });
            }
            return qs;
        })(),

        // --- Lección: Capacidad (MEDIDAS_CAPACIDAD_1) ---
        { type: 'input', question: 'De una botella de 2 litros de agua, sirvo un vaso de 250 ml. ¿Cuántos ml quedan en la botella?', answer: '1750', hints:['Primero, convierte todo a mililitros.', '2 litros son 2000 ml.', 'Ahora resta el vaso que serviste.', '2000 - 250 = ?', '1750.'], explanation: 'Convertimos 2 L a 2000 ml. Luego restamos el agua servida: 2000 ml - 250 ml = 1750 ml. ¡Aún queda mucha agua! 💧', lessonId: MEDIDAS_CAPACIDAD_1},
        { type: 'mcq', question: '¿Cuántos vasos de 500 ml puedo llenar con una jarra de 3 litros?', options: ['4', '5', '6'], answer: '6', hints:['Convierte todo a la misma unidad. Usemos ml.', '3 litros son 3000 ml.', 'Ahora divide el total de la jarra entre la capacidad de un vaso.', '3000 ÷ 500 = ? (Es como 30 ÷ 5).', 'Seis.'], explanation: 'La jarra tiene 3000 ml. Si cada vaso tiene 500 ml, podemos llenar 3000 / 500 = 6 vasos. ¡Refresco para todos! 🧃', lessonId: MEDIDAS_CAPACIDAD_1},
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 38; i++) {
                const ml = 250 * (i + 1);
                qs.push({
                    type: 'input',
                    question: `Tengo una jarra de 2 litros (2000 ml). Si le echo ${ml} ml de jugo, ¿cuántos ml le faltan para llenarse?`,
                    answer: (2000 - ml).toString(),
                    hints: [`La capacidad total es 2000 ml.`, `Ya tienes ${ml} ml.`, `Para saber lo que "falta", tienes que restar.`, `La operación es 2000 - ${ml}.`, `La respuesta es ${2000-ml}.` ],
                    explanation: `Restamos la cantidad actual de la capacidad total: 2000 ml - ${ml} ml = ${2000-ml} ml.`,
                    lessonId: MEDIDAS_CAPACIDAD_1
                });
            }
            return qs;
        })(),

        // --- Lección: Moneda (MEDIDAS_MONEDA_1) ---
        { type: 'input', question: 'Compro 3 panes a 15 CUP cada uno y un refresco de 25 CUP. ¿Cuánto pagué en total?', answer: '70', hints:['Paso 1: Calcula el costo de los panes.', '3 x 15 = 45 CUP.', 'Paso 2: Suma el costo del refresco.', '45 + 25 = ?', 'Setenta.'], explanation: 'Los panes cuestan 3x15=45 CUP. El total es 45 + 25 = 70 CUP. ¡Una buena merienda! 🥖🥤', lessonId: MEDIDAS_MONEDA_1},
        { type: 'mcq', question: 'Tengo 200 CUP. ¿Cuántos helados de 25 CUP puedo comprar como máximo?', options: ['4', '8', '10'], answer: '8', hints:['Es una división: ¿Cuántas veces cabe 25 en 200?', 'Piensa en las monedas: ¿cuántas monedas de 25 centavos hay en 2 pesos?', 'En 100 CUP caben 4 helados (4x25=100).', 'En 200 CUP cabrá el doble.', 'Ocho.'], explanation: 'Dividimos el dinero total entre el precio de cada helado: 200 ÷ 25 = 8 helados. ¡Invita a tus amigos! 🍦', lessonId: MEDIDAS_MONEDA_1},
        ...(() => {
            const qs: Question[] = [];
            for (let i = 0; i < 38; i++) {
                const numItems = 2 + (i % 3);
                const itemPrice = 20 + i;
                const totalCost = numItems * itemPrice;
                const paid = Math.ceil(totalCost / 50) * 50;
                const change = paid - totalCost;
                qs.push({
                    type: 'input',
                    question: `Compro ${numItems} dulces a ${itemPrice} CUP cada uno. Si pago con ${paid} CUP, ¿cuánto me devuelven?`,
                    answer: change.toString(),
                    hints: [`Paso 1: Calcula el costo total de los dulces (multiplicación).`, `${numItems} x ${itemPrice} = ${totalCost}.`, `Paso 2: Calcula el vuelto (resta).`, `${paid} - ${totalCost} = ?`, `La respuesta es ${change}.`],
                    explanation: `Primero calculamos el costo total: ${numItems} × ${itemPrice} = ${totalCost} CUP. Luego, el vuelto es ${paid} - ${totalCost} = ${change} CUP.`,
                    lessonId: MEDIDAS_MONEDA_1
                });
            }
            return qs;
        })(),
    ]
};
