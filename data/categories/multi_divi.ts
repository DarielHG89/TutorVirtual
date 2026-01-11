import type { Question } from '../../types';

// IDs de lecciones para claridad
const MULTIPLICACION_3_2 = 'multiplicacion_3_2';
const DIVISION_3_3 = 'division_3_3';
const FRACCIONES_INTRO = 'fracciones_intro';

// Función para crear SVGs de fracciones
const createFractionSVG = (numerator: number, denominator: number, type: 'circle' | 'bar' = 'circle'): string => {
    let svgContent = '';
    if (type === 'circle') {
        const angleStep = 360 / denominator;
        let path = '';
        for (let i = 0; i < numerator; i++) {
            const startAngle = i * angleStep;
            const endAngle = (i + 1) * angleStep;
            const startX = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
            const startY = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
            const endX = 50 + 40 * Math.cos((endAngle - 90) * Math.PI / 180);
            const endY = 50 + 40 * Math.sin((endAngle - 90) * Math.PI / 180);
            const largeArcFlag = angleStep > 180 ? 1 : 0;
            path += `M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY} Z `;
        }
        
        let lines = '';
        for (let i = 0; i < denominator; i++) {
            const angle = i * angleStep;
            const x = 50 + 40 * Math.cos((angle - 90) * Math.PI / 180);
            const y = 50 + 40 * Math.sin((angle - 90) * Math.PI / 180);
            lines += `<line x1="50" y1="50" x2="${x}" y2="${y}" stroke="gray" stroke-width="1"/>`;
        }

        svgContent = `
            <circle cx="50" cy="50" r="40" fill="white" stroke="black" stroke-width="2"/>
            <path d="${path}" fill="#60a5fa"/>
            ${lines}
            <circle cx="50" cy="50" r="40" fill="none" stroke="black" stroke-width="2"/>
        `;
    } else { // bar
        const rectWidth = 100 / denominator;
        let filledRects = '';
        for (let i = 0; i < numerator; i++) {
            filledRects += `<rect x="${10 + i * rectWidth}" y="10" width="${rectWidth}" height="30" fill="#4ade80"/>`;
        }
        let lines = '';
        for (let i = 1; i < denominator; i++) {
            lines += `<line x1="${10 + i * rectWidth}" y1="10" x2="${10 + i * rectWidth}" y2="40" stroke="black" stroke-width="1"/>`;
        }
        svgContent = `
            <rect x="10" y="10" width="100" height="30" fill="white" stroke="black" stroke-width="2"/>
            ${filledRects}
            ${lines}
        `;
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${type === 'bar' ? 120 : 100} ${type === 'bar' ? 50 : 100}">${svgContent}</svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};


export const multiDiviQuestions: Record<number, Question[]> = {
    1: [
        // === Lección: Multiplicación sin llevada (MULTIPLICACION_3_2) - 40 preguntas ===
        { type: 'input', question: 'Calcula: 23 x 3 = ? 🤔', answer: '69', hints:['Primero, multiplica las unidades: 3 x 3 = 9. 🎯', 'Luego, multiplica las decenas: 3 x 2 = 6. 💪', 'Junta los dos resultados en orden.', 'El número termina en 9 y empieza en 6.', 'Sesenta y nueve.'], explanation: 'Multiplicamos por partes: 3x3=9 (unidades) y 3x20=60 (decenas). El resultado es 60 + 9 = 69. ¡Perfecto! ✅', lessonId: MULTIPLICACION_3_2},
        { type: 'input', question: '111 x 5 = ? ✨', answer: '555', hints:['El 5 multiplica a cada uno de los 1.', '5 x 1 (unidades) = 5.', '5 x 1 (decenas) = 5.', '5 x 1 (centenas) = 5.', 'El resultado es un número con tres cifras iguales. 🎰'], explanation: 'Al multiplicar 5 por cada una de las cifras (1, 10 y 100), el resultado es 555. ¡Un número mágico! 🧙', lessonId: MULTIPLICACION_3_2},
        { type: 'mcq', question: '40 x 2 = ? 🚀', options: ['42', '80', '402'], answer: '80', hints:['"x 2" es lo mismo que "el doble".', '¿Cuál es el doble de 40? ➕', 'Un truco: 4 x 2 = 8, y luego le añades el cero que guardaste. 🤫', 'Ochenta.', 'No es una suma, ¡cuidado!'], explanation: 'Multiplicar 40x2 es lo mismo que sumar 40+40, que da 80. También puedes hacer 4x2=8 y añadir el cero. ¡Vas a la velocidad de la luz! ⚡', lessonId: MULTIPLICACION_3_2},
        { type: 'input', question: '202 x 4 = ? 🧐', answer: '808', hints:['Multiplica de derecha a izquierda. ➡️', '4 x 2 (unidades) = 8.', '4 x 0 (decenas) = 0. ¡El cero es poderoso! ✨', '4 x 2 (centenas) = 8.', 'Junta los resultados: 8, 0, 8.'], explanation: 'Multiplicamos cada cifra por 4: 4x2=8, 4x0=0, 4x2=8. El resultado es 808. ¡Un número capicúa!  palindrome', lessonId: MULTIPLICACION_3_2},
        { type: 'mcq', question: '12 x 4 = ? 🍀', options: ['48', '16', '36'], answer: '48', hints:['Primero las unidades: 4 x 2 = 8.', 'Luego las decenas: 4 x 1 = 4.', 'El resultado termina en 8.', 'El resultado empieza en 4.', 'Cuarenta y ocho.'], explanation: 'Multiplicando las unidades (4x2=8) y las decenas (4x1=4), obtenemos 48. ¡Muy bien hecho! 👏', lessonId: MULTIPLICACION_3_2},
        { type: 'input', question: 'Un paquete tiene 20 galletas. ¿Cuántas galletas hay en 4 paquetes? 🍪', answer: '80', hints:['Es una suma repetida: 20+20+20+20.', 'Una forma más rápida es multiplicar.', '20 x 4 = ?', '4 x 2 = 8. Ahora añade el cero al final. 👻', '80 galletas.'], explanation: 'Multiplicamos el número de paquetes por las galletas en cada uno: 4 x 20 = 80 galletas. ¡Un montón de galletas! 😋', lessonId: MULTIPLICACION_3_2},
        { type: 'mcq', question: 'Cualquier número multiplicado por 0 es...', options: ['El mismo número', '1', '0'], answer: '0', hints:['El cero es un "agujero negro" en la multiplicación. ⚫', 'Todo lo que multiplica se lo "traga" y lo convierte en cero.', '5 x 0 = 0.', '1000 x 0 = 0.', 'La respuesta es 0.'], explanation: 'Cualquier número multiplicado por cero siempre da como resultado cero. ¡Es una regla de oro! 🥇', lessonId: MULTIPLICACION_3_2},
        { type: 'input', question: '13 x 3 = ? 🎯', answer: '39', hints:['Unidades: 3 x 3 = 9.', 'Decenas: 3 x 1 = 3.', 'El resultado es 39.', 'Treinta y nueve.', 'Es como sumar 13+13+13.'], explanation: 'Hacemos 3x3=9 y 3x1=3. El resultado es 39. ¡Directo al blanco! 🎯', lessonId: MULTIPLICACION_3_2},
        { type: 'mcq', question: '25 x 1 = ? 🪞', options: ['26', '25', '1'], answer: '25', hints:['Cualquier número multiplicado por 1...', '...se queda igual. ¡No cambia!', 'El 1 es el espejo de la multiplicación. 🪞', 'El resultado es 25.', 'Veinticinco.'], explanation: 'Todo número multiplicado por 1 da como resultado el mismo número. ¡Es la propiedad de identidad! 😎', lessonId: MULTIPLICACION_3_2},
        { type: 'input', question: 'Tengo 5 cajas con 6 refrescos cada una. ¿Cuántos refrescos tengo? 🥤', answer: '30', hints:['Tienes 5 grupos de 6.', 'Es una multiplicación: 5 x 6 = ?', 'Repasa la tabla del 5 o del 6.', 'Treinta.', 'Termina en 0.'], explanation: 'Para saber el total, multiplicamos las cajas por los refrescos: 5 x 6 = 30 refrescos. ¡Salud! 🥳', lessonId: MULTIPLICACION_3_2},
        ...Array.from({ length: 30 }).map((_, i): Question => {
            const num1 = 11 + i;
            const num2 = (i % 3) + 2; // Multiplica por 2, 3 o 4
            const answer = num1 * num2;
            return {
                type: 'input',
                question: `${num1} x ${num2} = ?`,
                answer: answer.toString(),
                hints: [`Multiplica ${num2} por las unidades de ${num1}.`, `Luego multiplica ${num2} por las decenas de ${num1}.`, `Alinea los números en tu mente como si fuera en papel. ✍️`, `Es como sumar ${num1} un total de ${num2} veces.`, `El resultado es ${answer}.` ],
                explanation: `Multiplicamos el número de abajo (${num2}) por cada cifra del de arriba. Unidades: ${num2}x${num1%10}. Decenas: ${num2}x${Math.floor(num1/10)}. El resultado final es ${answer}.`,
                lessonId: MULTIPLICACION_3_2
            };
        }),

        // === Lección: División exacta (DIVISION_3_3) - 40 preguntas ===
        { type: 'input', question: 'Calcula: 48 ÷ 2 = ? 🤔', answer: '24', hints:['"÷ 2" es lo mismo que "la mitad".', 'Divide la primera cifra: 4 ÷ 2 = 2.', 'Ahora divide la segunda cifra: 8 ÷ 2 = 4.', 'Junta los resultados: 2 y 4.', 'Veinticuatro.'], explanation: 'Dividimos por partes: la mitad de 4 es 2, y la mitad de 8 es 4. El resultado es 24. ¡Genial! ✅', lessonId: DIVISION_3_3},
        { type: 'input', question: '69 ÷ 3 = ? 💡', answer: '23', hints:['Reparte 6 entre 3. ¿Cuánto toca?', '6 ÷ 3 = 2.', 'Ahora reparte 9 entre 3.', '9 ÷ 3 = 3.', 'El resultado es 23.'], explanation: 'Dividimos 6 entre 3, que es 2. Y 9 entre 3, que es 3. El resultado es 23. ¡Qué inteligente! 🧠', lessonId: DIVISION_3_3},
        { type: 'mcq', question: '84 ÷ 4 = ? 🎯', options: ['21', '24', '12'], answer: '21', hints:['Reparte el 8 entre 4. 8 ÷ 4 = 2.', 'Reparte el 4 entre 4. 4 ÷ 4 = 1.', 'El resultado es 21.', 'Veintiuno.', 'No es 24.'], explanation: 'Dividimos 8 entre 4 (da 2) y 4 entre 4 (da 1). El resultado es 21. ¡En el centro! 🎯', lessonId: DIVISION_3_3},
        { type: 'input', question: 'Si repartes 55 caramelos entre 5 amigos, ¿cuántos le tocan a cada uno? 🍬', answer: '11', hints:['La palabra "repartir" es la clave para dividir.', '55 ÷ 5 = ?', '5 ÷ 5 = 1.', 'La otra cifra es igual: 5 ÷ 5 = 1.', 'El resultado tiene dos cifras iguales.'], explanation: 'Dividimos 55 entre 5. Como 5÷5=1, el resultado es 11. ¡Un reparto justo! 🤝', lessonId: DIVISION_3_3},
        { type: 'mcq', question: '99 ÷ 9 = ? 🧑‍🏫', options: ['9', '10', '11'], answer: '11', hints:['9 ÷ 9 = 1.', 'La otra cifra es igual: 9 ÷ 9 = 1.', 'El resultado es 11.', 'Once.', '11.'], explanation: 'Al dividir 99 entre 9, dividimos cada cifra por separado, obteniendo 11. ¡Clase de matemática! 🧑‍🏫', lessonId: DIVISION_3_3},
        { type: 'input', question: 'Calcula: 80 ÷ 2 = ? 🚀', answer: '40', hints:['Es la mitad de 80.', 'Piensa en 8 ÷ 2 = 4.', 'Ahora no te olvides de añadir el cero. 👻', 'Cuarenta.', '40.'], explanation: 'La mitad de 80 es 40. También puedes hacer 8÷2=4 y añadir el cero. ¡Despegando! 🚀', lessonId: DIVISION_3_3},
        { type: 'input', question: '100 ÷ 5 = ? 💰', answer: '20', hints:['¿Cuántas monedas de 5 CUP necesitas para tener 100?', 'Un truco: 10 ÷ 5 = 2.', 'Ahora añade el cero del 100.', 'Veinte.', '20.'], explanation: 'Podemos pensar en 100 como 10 decenas. 10 dividido entre 5 es 2, así que son 2 decenas, o 20. ¡Dinero, dinero! 🤑', lessonId: DIVISION_3_3},
        { type: 'mcq', question: 'Tengo 36 postalitas y hago montones de 3. ¿Cuántos montones hago? 🃏', options: ['12', '13', '10'], answer: '12', hints:['"Hacer montones" es una forma de dividir.', '36 ÷ 3 = ?', '3 ÷ 3 = 1.', '6 ÷ 3 = 2.', 'El resultado es 12.'], explanation: 'Dividimos el total de postalitas entre el tamaño de cada montón: 36 ÷ 3 = 12 montones. ¡A coleccionar! ✨', lessonId: DIVISION_3_3},
        { type: 'mcq', question: '¿Cuánto es 20 ÷ 1? 🤔', options: ['20', '1', '21'], answer: '20', hints:['Cualquier número dividido entre 1...', '...se queda igual. ¡No cambia!', 'Si repartes 20 caramelos para una sola persona...', '...le tocan los 20 caramelos. ¡Qué suerte! 횡재', 'La respuesta es 20.'], explanation: 'Cualquier número dividido por 1 da como resultado el mismo número. ¡Repartir entre uno es no repartir! 😂', lessonId: DIVISION_3_3},
        { type: 'input', question: 'Reparto 10 mangos entre 2 personas. ¿Cuántos le tocan a cada una? 🥭', answer: '5', hints:['Repartir en partes iguales es dividir.', '10 ÷ 2 = ?', 'Es la mitad de 10.', 'Cinco.', '5.'], explanation: 'Dividimos los mangos entre las personas: 10 ÷ 2 = 5 mangos para cada una. ¡Qué rico! 😋', lessonId: DIVISION_3_3},
        ...Array.from({ length: 30 }).map((_, i): Question => {
            const divisor = (i % 4) + 2; // 2, 3, 4, 5
            const quotient = 11 + i;
            const dividend = divisor * quotient;
            return {
                type: 'input',
                question: `Reparto ${dividend} canicas entre ${divisor} amigos. ¿Cuántas le tocan a cada uno?`,
                answer: quotient.toString(),
                hints: [`La palabra "reparto" te indica que debes dividir.`, `La operación es ${dividend} ÷ ${divisor}.`, `Busca en la tabla del ${divisor} un número que te dé ${dividend}.`, `${divisor} x ? = ${dividend}.`, `El número que buscas es ${quotient}.`],
                explanation: `Para repartir en partes iguales, dividimos el total de canicas (${dividend}) entre el número de amigos (${divisor}). El resultado es ${quotient} canicas para cada uno.`,
                lessonId: DIVISION_3_3
            };
        }),

        // === Lección: Introducción a Fracciones (FRACCIONES_INTRO) - 40 preguntas ===
        { type: 'mcq', question: '¿Qué fracción representa la parte coloreada de la pizza 🍕?', imageUrl: createFractionSVG(2, 4, 'circle'), options: ['1/2', '1/4', '3/4'], answer: '1/2', hints:['¿En cuántas partes está dividida la pizza en total? (Denominador)', 'Está dividida en 4 partes.', '¿Cuántas partes están pintadas? (Numerador)', 'Hay 2 partes pintadas.', 'La fracción es 2/4, que es lo mismo que...'], explanation: 'El círculo está dividido en 4 partes y 2 de ellas están coloreadas. La fracción es 2/4, que es equivalente a 1/2 (un medio o la mitad). ¡Te comiste la mitad! 🍕', lessonId: FRACCIONES_INTRO},
        { type: 'input', question: 'En la fracción 2/5, ¿cuál es el numerador?', answer: '2', hints:['El numerador es el número de arriba. ⬆️', 'Es el que te dice cuántas partes coges.', 'El 5 es el denominador (el de abajo).', 'El número de arriba es el 2.', 'No es el 5.'], explanation: 'El numerador es siempre el número que está encima de la línea de la fracción. En este caso, es el 2. ¡Fácil! ✅', lessonId: FRACCIONES_INTRO},
        { type: 'mcq', question: '¿Cómo se lee la fracción 1/2?', options: ['Un dos', 'Uno de dos', 'Un medio'], answer: 'Un medio', hints:['Es la forma especial de decir "la mitad".', 'No se dice "un dos", ¡suena raro!', 'Su nombre de superhéroe es "un medio". 🦸', 'Imagina media naranja.', 'No es "uno sobre dos", aunque lo parezca.'], explanation: 'La fracción 1/2 tiene un nombre especial y muy común: "un medio" o "la mitad". 🌗', lessonId: FRACCIONES_INTRO},
        { type: 'input', question: 'En la fracción 3/8, ¿cuál es el denominador?', answer: '8', hints:['El denominador es el número de abajo. ⬇️', 'Es el que dice en cuántas partes se divide el total.', 'El 3 es el numerador (el de arriba).', 'El número de abajo es el 8.', 'Piensa en "Denominador = Debajo".'], explanation: 'El denominador es el número de abajo en una fracción, el que nos dice el total de partes. Aquí, es el 8. ¡Lo tienes! 👍', lessonId: FRACCIONES_INTRO},
        { type: 'mcq', question: 'Si me como la mitad de una guayaba, ¿qué fracción me he comido? 🍈', options: ['1/4', '1/2', '2/1'], answer: '1/2', hints:['"La mitad" tiene una fracción que la representa.', 'Es cuando divides algo en 2 partes y coges 1.', 'Se lee "un medio".', 'Es 1/2.', 'No es 2/1, ¡eso serían dos guayabas enteras!'], explanation: 'Comerse "la mitad" de algo es lo mismo que comerse 1/2 de ello. ¡Qué aproveche! 😋', lessonId: FRACCIONES_INTRO},
        { type: 'mcq', question: '¿Qué fracción representa la imagen?', imageUrl: createFractionSVG(2, 3, 'bar'), options: ['1/3', '2/3', '3/2'], answer: '2/3', hints:['¿En cuántas partes iguales está dividida la barra? (Denominador)', 'Está dividida en 3 partes.', '¿Cuántas partes están pintadas de verde? (Numerador)', 'Hay 2 partes pintadas.', 'La fracción es 2 arriba y 3 abajo.'], explanation: 'La barra está dividida en 3 partes iguales y 2 están coloreadas, lo que representa 2/3 (dos tercios). ¡Pan comido! 🍞', lessonId: FRACCIONES_INTRO},
        { type: 'input', question: 'Escribe con números la fracción "tres quintos".', answer: '3/5', hints:['"Tres" es el número de arriba (numerador).', '"Quintos" viene de 5, y es el número de abajo (denominador).', 'El 3 va sobre la línea.', 'El 5 va debajo de la línea.', '3 sobre 5.'], explanation: '"Tres" es el numerador y "quintos" nos dice que el denominador es 5. Se escribe 3/5. ¡Súper! ✨', lessonId: FRACCIONES_INTRO},
        { type: 'mcq', question: '¿Qué significa el denominador?', options: ['Las partes que cojo', 'En cuántas partes se divide el todo', 'El número más grande'], answer: 'En cuántas partes se divide el todo', hints:['Es el número de abajo.', 'Si una pizza tiene 8 trozos en total, el denominador es 8.', 'Indica el tamaño de los trozos (cuanto más grande, más pequeños los trozos).', 'No es las que te comes, esas son el numerador.', 'Es el total de divisiones.'], explanation: 'El denominador (el número de abajo) nos dice en cuántas partes iguales se ha dividido el objeto entero. ¡Es la regla del juego! 🎲', lessonId: FRACCIONES_INTRO},
        { type: 'input', question: 'Si una tarta se corta en 6 trozos y cojo 1, ¿qué fracción he cogido?', answer: '1/6', hints:['El número de abajo es en cuántos trozos se cortó en total.', 'El denominador es 6.', 'El número de arriba es cuántos cogiste.', 'El numerador es 1.', 'Se lee "un sexto".'], explanation: 'Has cogido 1 trozo de un total de 6, así que la fracción es 1/6 (un sexto). 🍰', lessonId: FRACCIONES_INTRO},
        { type: 'mcq', question: '¿Qué es más grande, 1/4 de una pizza o 3/4 de la misma pizza?', options: ['1/4', '3/4', 'Son iguales'], answer: '3/4', hints:['En ambos casos, la pizza está cortada en el mismo número de trozos (4).', 'En un caso coges 1 trozo.', 'En el otro caso coges 3 trozos.', '¿Qué es más, 1 trozo o 3 trozos?', '3/4 es más grande, ¡casi toda la pizza!'], explanation: 'Si la pizza se divide en los mismos trozos (el denominador es igual), es más grande la fracción que coge más trozos (el numerador mayor). 3 es más que 1, así que 3/4 es mayor. ¡Más para ti! 😋', lessonId: FRACCIONES_INTRO},
        ...Array.from({ length: 30 }).map((_, i): Question => {
            const denominator = (i % 10) + 3; // Denominadores de 3 a 12
            const numerator = Math.floor(i / 10) + 1; // Numeradores 1, 2, 3
            if (numerator >= denominator) return null; // Evita fracciones impropias por ahora
            return {
                type: 'mcq',
                question: `¿Qué fracción se muestra en la imagen?`,
                imageUrl: createFractionSVG(numerator, denominator, i % 2 === 0 ? 'circle' : 'bar'),
                options: [`${numerator}/${denominator}`, `${denominator}/${numerator}`, `${numerator}/${denominator+1}`],
                answer: `${numerator}/${denominator}`,
                hints: [`Primero, cuenta el número total de partes. Ese es el denominador (abajo).`, `Hay ${denominator} partes en total.`, `Ahora, cuenta cuántas partes están pintadas. Ese es el numerador (arriba).`, `Hay ${numerator} partes pintadas.`, `La fracción correcta es ${numerator} sobre ${denominator}.`],
                explanation: `La figura está dividida en ${denominator} partes iguales y ${numerator} de ellas están coloreadas, lo que representa la fracción ${numerator}/${denominator}.`,
                lessonId: FRACCIONES_INTRO
            };
        }).filter(Boolean) as Question[],
    ],
    2: [
        // === Lección: Multiplicación con llevada (MULTIPLICACION_3_2) - 40 preguntas ===
        { type: 'input', question: 'Calcula llevando: 15 x 5 = ? 🎈', answer: '75', hints:['Primero las unidades: 5 x 5 = 25.', 'Pones el 5 (de las unidades) y te "llevas" el 2 (de las decenas). 🎈', 'Ahora las decenas: 5 x 1 = 5.', '¡Suma el globito que te llevabas! 5 + 2 = 7.', 'El resultado es 75.'], explanation: 'Hacemos 5x5=25 (ponemos 5, llevamos 2). Luego 5x1=5, más los 2 que llevábamos, son 7. Total: 75. ¡Bien hecho! 👍', lessonId: MULTIPLICACION_3_2},
        { type: 'input', question: '24 x 4 = ? 💪', answer: '96', hints:['Unidades: 4 x 4 = 16.', 'Pones el 6 y te llevas 1. 🎈', 'Decenas: 4 x 2 = 8.', 'Suma la que te llevabas: 8 + 1 = 9.', 'El resultado es 96.'], explanation: 'Multiplicamos 4x4=16 (ponemos 6, llevamos 1). Luego 4x2=8, y sumamos el 1 que llevábamos: 9. Total: 96. ¡Eres fuerte! 💪', lessonId: MULTIPLICACION_3_2},
        { type: 'mcq', question: '125 x 3 = ? 🎯', options: ['365', '375', '385'], answer: '375', hints:['3 x 5 = 15. Pones 5, llevas 1. 🎈', '3 x 2 = 6. Más 1 que llevabas = 7.', '3 x 1 = 3.', 'El resultado es 375.', 'Trescientos setenta y cinco.'], explanation: 'Multiplicando y llevando: 3x5=15 (llevo 1), 3x2=6+1=7, 3x1=3. El resultado es 375. ¡Directo al blanco! 🎯', lessonId: MULTIPLICACION_3_2},
        { type: 'input', question: 'Un edificio tiene 8 pisos y en cada piso hay 4 apartamentos. ¿Cuántos apartamentos hay? 🏢', answer: '32', hints:['Es una multiplicación para encontrar el total.', '8 pisos, con 4 en CADA uno.', '8 x 4 = ?', 'Repasa la tabla del 8 o del 4.', 'Treinta y dos.'], explanation: 'Multiplicamos el número de pisos por los apartamentos en cada uno: 8 x 4 = 32 apartamentos. ¡Un edificio grande! 🏙️', lessonId: MULTIPLICACION_3_2},
        { type: 'mcq', question: '48 x 2 = ? ➕', options: ['86', '98', '96'], answer: '96', hints:['Es el doble de 48. Puedes sumar 48+48.', 'Con multiplicación: 2 x 8 = 16. Pones 6, llevas 1. 🎈', '2 x 4 = 8. Más 1 que llevabas = 9.', 'El resultado es 96.', 'No es 86, ¡cuidado con la llevada!'], explanation: 'El doble de 48 es 96. También puedes hacer la multiplicación: 2x8=16 (llevo 1), 2x4=8+1=9. Resultado: 96. ¡Genial! ✨', lessonId: MULTIPLICACION_3_2},
        { type: 'input', question: '36 x 3 = ? 💯', answer: '108', hints:['Unidades: 3 x 6 = 18. Pones 8, llevas 1. 🎈', 'Decenas: 3 x 3 = 9.', 'Suma la llevada: 9 + 1 = 10.', 'El resultado es 108.', 'Ciento ocho.'], explanation: 'Multiplicamos 3x6=18 (ponemos 8, llevamos 1). Luego 3x3=9, y más 1 que llevábamos, son 10. Total: 108. ¡Pasaste de 100! 🚀', lessonId: MULTIPLICACION_3_2},
        { type: 'input', question: 'Calcula: 250 x 4 = ? 💰', answer: '1000', hints:['Unidades: 4 x 0 = 0.', 'Decenas: 4 x 5 = 20. Pones 0, llevas 2. 🎈', 'Centenas: 4 x 2 = 8. Más 2 que llevabas = 10.', 'El resultado es 1000.', 'También puedes pensar en 4 billetes de 250 CUP.'], explanation: 'Podemos pensar en 4 billetes de 250 pesos. Dos billetes son 500, y cuatro son 1000. ¡Un billete de los grandes! 💵', lessonId: MULTIPLICACION_3_2},
        { type: 'mcq', question: 'Si una hora tiene 60 minutos, ¿cuántos minutos hay en 3 horas? 🕒', options: ['180', '120', '63'], answer: '180', hints:['Es una multiplicación.', '60 minutos CADA hora, por 3 horas.', '60 x 3 = ?', 'Un truco: 6 x 3 = 18. Añade el cero al final.', '180.'], explanation: 'Multiplicamos los minutos de una hora por 3: 60 x 3 = 180 minutos. ¡Mucho tiempo! ⏳', lessonId: MULTIPLICACION_3_2},
        { type: 'input', question: '109 x 7 = ? 🤓', answer: '763', hints:['7 x 9 = 63. Pones 3, llevas 6. 🎈', '7 x 0 = 0. Más 6 que llevabas = 6.', '7 x 1 = 7.', 'El resultado es 763.', 'Setecientos sesenta y tres.'], explanation: 'Multiplicando por partes y llevando: 7x9=63 (llevo 6), 7x0=0+6=6, 7x1=7. El resultado es 763. ¡Cálculo de experto! 🧑‍🏫', lessonId: MULTIPLICACION_3_2},
        { type: 'input', question: 'Un mes tiene (aproximadamente) 30 días. ¿Cuántos días hay en 5 meses? 📅', answer: '150', hints:['Multiplica 30 x 5.', 'Es una suma repetida: 30+30+30+30+30.', 'Un truco: 5 x 3 = 15.', 'Añade el cero del 30 al final.', '150.'], explanation: 'Multiplicamos los días de un mes por 5: 30 x 5 = 150 días. ¡Casi medio año! 🗓️', lessonId: MULTIPLICACION_3_2},
        ...Array.from({ length: 30 }).map((_, i): Question => {
            const num1 = 15 + i;
            const num2 = (i % 5) + 3; // Multiplica por 3, 4, 5, 6, 7
            const answer = num1 * num2;
            return {
                type: 'input',
                question: `${num1} x ${num2} = ?`,
                answer: answer.toString(),
                hints: [`Multiplica ${num2} por las unidades de ${num1}.`, `La operación de unidades es ${num2} x ${num1 % 10}.`, `Pones la unidad del resultado y te llevas la decena. 🎈`, `Multiplica ${num2} por la decena de ${num1} y suma lo que te llevas.`, `Usa papel y lápiz si lo necesitas. ✍️`],
                explanation: `Multiplicamos por partes. ${num2} x ${num1 % 10} = ${num2*(num1%10)}. Pones el último dígito y te llevas el resto. Luego ${num2} x ${Math.floor(num1 / 10)} y le sumas lo que te llevabas. El resultado es ${answer}.`,
                lessonId: MULTIPLICACION_3_2
            };
        }),

        // === Lección: División con resto (DIVISION_3_3) - 40 preguntas ===
        { type: 'input', question: 'Calcula el cociente: 49 ÷ 2 = ? 🤔', answer: '24', hints:['No es una división exacta. ¡Va a sobrar algo!', 'Divide 4 entre 2. Da 2.', 'Ahora baja el 9. ¿Cuántas veces cabe el 2 en el 9 sin pasarse?', 'Cabe 4 veces (2x4=8).', 'El cociente es 24. (Y sobra 1)'], explanation: '4÷2=2. Luego, en el 9, el 2 cabe 4 veces (2x4=8). El cociente (el resultado) es 24 y el resto es 1 (de 8 a 9). ¡Buen trabajo! 👍', lessonId: DIVISION_3_3},
        { type: 'input', question: 'Si divides 17 entre 3, ¿cuál es el resto? 🧐', answer: '2', hints:['Busca en la tabla del 3 el número más cercano a 17 sin pasarse.', '3 x 5 = 15. ¡Ese es!', 'El cociente es 5.', 'Para saber el resto, calcula la diferencia: 17 - 15 = ?', 'El resto es 2.'], explanation: '3 cabe 5 veces en 17 (3x5=15). La diferencia entre 17 y 15 es 2, que es el resto. ¡Perfecto! ✨', lessonId: DIVISION_3_3},
        { type: 'mcq', question: 'Calcula: 50 ÷ 4 = ? (cociente y resto)', options: ['Cociente 12, resto 2', 'Cociente 10, resto 10', 'Cociente 13, resto 0'], answer: 'Cociente 12, resto 2', hints:['Coge el 5. ¿Cuántas veces cabe 4 en 5? Cabe 1 vez y sobra 1.', 'Bajas el 0, y ahora tienes un 10.', '¿Cuántas veces cabe 4 en 10? Cabe 2 veces (4x2=8) y sobran 2.', 'El cociente es 12.', 'El resto es 2.'], explanation: 'Dividiendo 50 entre 4, obtenemos un cociente de 12 y un resto de 2. ¡División de experto! 🧑‍🏫', lessonId: DIVISION_3_3},
        { type: 'input', question: 'Reparto 25 lápices entre 6 amigos. ¿Cuántos sobran? ✏️', answer: '1', hints:['Repartir es dividir: 25 ÷ 6 = ?', 'Busca en la tabla del 6 un número cercano a 25 sin pasarse.', '6 x 4 = 24. A cada amigo le tocan 4 lápices.', 'Para saber los que sobran, resta: 25 - 24 = ?', 'Sobra 1.'], explanation: 'Cada amigo recibe 4 lápices (6x4=24), y sobra 1 lápiz que no se puede repartir. ¡Ese es para ti! 😉', lessonId: DIVISION_3_3},
        { type: 'mcq', question: '100 ÷ 3 = ? (cociente y resto)', options: ['Cociente 30, resto 10', 'Cociente 33, resto 1', 'Cociente 33, resto 0'], answer: 'Cociente 33, resto 1', hints:['Coge el 10. 10 ÷ 3 = 3, y sobra 1.', 'Bajas el 0, y tienes 10 de nuevo.', '10 ÷ 3 = 3, y sobra 1.', 'El cociente es 33.', 'El resto final es 1.'], explanation: '100 dividido entre 3 da 33 con un resto de 1, porque 33 x 3 = 99. ¡Casi exacto! 🎯', lessonId: DIVISION_3_3},
        { type: 'input', question: '85 ÷ 8 = ? (solo el cociente)', answer: '10', hints:['Coge el 8. 8 ÷ 8 = 1.', 'Bajas el 5. ¿Cuántas veces cabe el 8 en el 5?', 'No cabe ninguna vez, así que pones un 0 en el cociente.', 'El cociente es 10.', 'El resto sería 5.'], explanation: '8÷8=1. Al bajar el 5, como 8 no cabe en 5, ponemos un 0 en el cociente. El cociente es 10 y el resto 5. ¡Atención al detalle! 🕵️', lessonId: DIVISION_3_3},
        { type: 'input', question: 'Calcula el resto de 47 ÷ 9.', answer: '2', hints:['Busca en la tabla del 9.', '9 x 5 = 45. Es el más cercano a 47 sin pasarse.', 'El cociente es 5.', 'Resta para encontrar lo que sobra: 47 - 45 = ?', 'El resto es 2.'], explanation: '9x5=45. La diferencia entre 47 y 45 es 2, que es el resto de la división. 👍', lessonId: DIVISION_3_3},
        { type: 'mcq', question: 'Un granjero tiene 32 huevos y los guarda en cartones de 6. ¿Cuántos cartones llena y cuántos huevos sobran? 🥚', options: ['5 cartones, sobran 2', '6 cartones, sobran 0', '5 cartones, sobran 0'], answer: '5 cartones, sobran 2', hints:['Hay que dividir 32 entre 6.', 'Busca en la tabla del 6: 6x5 = 30.', 'Puede llenar 5 cartones.', '¿Cuántos huevos le sobran?', '32 - 30 = 2.'], explanation: 'Llena 5 cartones (6x5=30 huevos) y le sobran 2 huevos. ¡No hay que romperlos! 🍳', lessonId: DIVISION_3_3},
        { type: 'input', question: 'Calcula el cociente de 121 ÷ 10.', answer: '12', hints:['Dividir por 10 es un truco.', 'La última cifra (1) será el resto.', 'Lo que queda del número es el cociente.', 'El cociente es 12.', '12.'], explanation: 'Al dividir por 10, el cociente es el número sin su última cifra (12) y el resto es esa última cifra (1). ¡Un atajo de campeón! 🏆', lessonId: DIVISION_3_3},
        { type: 'mcq', question: 'Si 7 x 8 = 56, ¿cuánto es 57 ÷ 7? (cociente y resto)', options: ['Cociente 7, resto 8', 'Cociente 8, resto 1', 'Cociente 8, resto 0'], answer: 'Cociente 8, resto 1', hints:['La división es la operación contraria a la multiplicación.', 'Sabemos que 7x8 es 56.', '57 es uno más que 56.', 'Entonces, el 7 cabe 8 veces y sobra...', 'Sobra 1.'], explanation: 'Como 7x8=56, sabemos que el 7 cabe 8 veces en 57, y sobrará la diferencia entre 57 y 56, que es 1. ¡Usando la lógica! 🧠', lessonId: DIVISION_3_3},
        ...Array.from({ length: 30 }).map((_, i): Question => {
            const divisor = (i % 7) + 3; // 3 a 9
            const dividend = 20 + i * 2;
            const quotient = Math.floor(dividend / divisor);
            const remainder = dividend % divisor;
            return {
                type: 'input',
                question: `Tengo ${dividend} mangos y hago grupos de ${divisor}. ¿Cuántos mangos me sobran?`,
                answer: remainder.toString(),
                hints: [`La pregunta es sobre lo que "sobra", es decir, el resto.`, `Divide ${dividend} entre ${divisor}.`, `Busca en la tabla del ${divisor}: ${divisor} x ${quotient} = ${quotient * divisor}.`, `Resta ese resultado del total: ${dividend} - ${quotient * divisor}.`, `El resto siempre es más pequeño que ${divisor}.`],
                explanation: `Al dividir ${dividend} entre ${divisor}, el cociente es ${quotient} y el resto es ${remainder}. Te sobran ${remainder} mangos.`,
                lessonId: DIVISION_3_3
            };
        }),

        // === Lección: Fracciones equivalentes y comparación (FRACCIONES_INTRO) - 40 preguntas ===
        { type: 'mcq', question: '¿Qué fracción es equivalente a 1/2? 🤔', options: ['2/3', '3/4', '4/8'], answer: '4/8', hints: ['Una fracción equivalente representa la misma cantidad, como dos nombres para la misma persona.', '1/2 es la mitad. ¿Cuál de las opciones es también la mitad de su total?', '4 es la mitad de 8. ¡Bingo!', 'También se obtiene multiplicando arriba y abajo por el mismo número: 1x4=4, 2x4=8.', '4/8 es la respuesta.'], explanation: 'La fracción 4/8 es equivalente a 1/2 porque 4 es la mitad de 8, igual que 1 es la mitad de 2. Representan la misma porción. ¡Son gemelas! 👯', lessonId: FRACCIONES_INTRO },
        { type: 'mcq', question: '¿Cuál es mayor, 1/3 o 1/4? (Imagina una pizza) 🍕', options: ['1/3', '1/4', 'Son iguales'], answer: '1/3', hints: ['Si divides una pizza en 3 trozos, ¿son más grandes o más pequeños que si la divides en 4?', 'Mientras más grande el denominador (el número de abajo), más pequeño es el trozo.', 'Un tercio es un trozo más grande que un cuarto.', 'Es mejor que te toque 1/3 de la pizza.', 'Menos personas para repartir = trozo más grande.'], explanation: 'Cuando el numerador es el mismo (1), la fracción más grande es la que tiene el denominador más pequeño. Un trozo de una pizza dividida en 3 es más grande que uno de una pizza dividida en 4. ¡Más para ti! 😋', lessonId: FRACCIONES_INTRO },
        { type: 'input', question: 'Escribe una fracción equivalente a 2/5. ✍️', answer: '4/10', hints: ['Multiplica el número de arriba y el de abajo por el MISMO número.', 'Puedes multiplicarlos por 2.', 'Numerador: 2 x 2 = 4.', 'Denominador: 5 x 2 = 10.', 'Una respuesta posible es 4/10.'], explanation: 'Para encontrar una fracción equivalente, multiplicamos numerador y denominador por el mismo número. Por ejemplo, por 2: (2x2)/(5x2) = 4/10. ¡6/15 también sería correcto! ¡Hay infinitas! ♾️', lessonId: FRACCIONES_INTRO },
        { type: 'mcq', question: 'La imagen muestra 4/4. ¿A qué número entero equivale?', imageUrl: createFractionSVG(4, 4, 'circle'), options: ['1', '4', '0'], answer: '1', hints: ['Si tienes todos los trozos en los que se dividió algo...', '...tienes la cosa entera. ¡Completa!', '4 de 4 trozos es la pizza completa.', 'La pizza completa es 1 pizza.', 'Siempre que el número de arriba y el de abajo son iguales, la fracción vale 1.'], explanation: 'Cuando el numerador y el denominador son iguales (4/4, 3/3, etc.), la fracción es igual a la unidad entera (1). ¡Te comiste toda la pizza! 🥳', lessonId: FRACCIONES_INTRO },
        { type: 'mcq', question: '¿Cómo se lee la fracción 5/8?', options: ['Cinco y ocho', 'Cinco octavos', 'Ocho quintos'], answer: 'Cinco octavos', hints: ['El número de arriba se lee normal ("cinco").', 'El de abajo (8) se lee como un número ordinal: "octavos".', 'No es "ocho quintos", eso sería 8/5.', 'No es "cinco y ocho".', 'Cinco octavos.'], explanation: 'La fracción 5/8 se lee "cinco octavos". ¡Lenguaje de matemáticos! 🧑‍🏫', lessonId: FRACCIONES_INTRO },
        { type: 'mcq', question: '¿Qué fracción es mayor que 1/2?', options: ['1/4', '2/5', '3/4'], answer: '3/4', hints: ['1/2 es la mitad. 1/4 es menos de la mitad.', 'Para 2/5, la mitad de 5 es 2.5. Como 2 es menor que 2.5, 2/5 es menos de la mitad.', 'Para 3/4, la mitad de 4 es 2. Como 3 es mayor que 2, 3/4 es más de la mitad.', 'Busca la fracción donde el numerador es más de la mitad del denominador.'], explanation: '3/4 es mayor que 1/2 porque 3 es más de la mitad de 4. ¡Un buen trozo! 👍', lessonId: FRACCIONES_INTRO },
        { type: 'input', question: 'Simplifica la fracción 6/8. 🔬', answer: '3/4', hints:['Simplificar es hacer los números más pequeños, pero que la fracción valga lo mismo.', 'Busca un número que pueda dividir al 6 y al 8.', 'Ambos se pueden dividir entre 2.', '6 ÷ 2 = 3.', '8 ÷ 2 = 4. La fracción es 3/4.'], explanation: 'Para simplificar 6/8, dividimos tanto el numerador como el denominador por 2, lo que nos da la fracción equivalente 3/4. ¡Más simple, mismo valor! ✨', lessonId: FRACCIONES_INTRO },
        { type: 'mcq', question: '¿Qué fracción representa 1?', options: ['1/10', '10/1', '10/10'], answer: '10/10', hints: ['Para que una fracción sea igual a 1 (la unidad completa)...', '...el número de arriba y el de abajo deben ser iguales.', '10/10 significa que tienes 10 partes de un total de 10. ¡Lo tienes todo!', '1/10 es un trocito pequeño.', '10/1 es 10 unidades enteras.'], explanation: 'Cualquier fracción donde el numerador es igual al denominador es igual a 1. ¡El 100%! 💯', lessonId: FRACCIONES_INTRO },
        { type: 'input', question: 'En un grupo de 6 amigos, 4 son niñas. ¿Qué fracción del grupo son niñas? (Simplificada)', answer: '2/3', hints: ['La fracción inicial es 4/6.', 'Ahora hay que simplificarla.', 'Puedes dividir el 4 y el 6 entre el mismo número.', 'Ambos son divisibles por 2.', '4÷2=2, 6÷2=3. La fracción es 2/3.'], explanation: 'La fracción que representa a las niñas es 4/6. Simplificando (dividiendo ambos por 2), obtenemos 2/3. ¡Dos de cada tres! 👧👧👦', lessonId: FRACCIONES_INTRO },
        { type: 'mcq', question: '¿Qué imagen representa 2/2?', options: [{ text: 'Medio círculo pintado', imageUrl: createFractionSVG(1, 2, 'circle')}, { text: 'Círculo entero pintado', imageUrl: createFractionSVG(2, 2, 'circle')}], answer: 'Círculo entero pintado', hints: ['2/2 significa que el círculo está dividido en 2 partes.', 'Y que las 2 partes están pintadas.', 'Eso es el círculo completo.', 'La imagen que está completamente pintada.', '2/2 es igual a 1.'], explanation: 'La fracción 2/2 es igual a 1, lo que representa la figura completa. ¡El todo! 🌎', lessonId: FRACCIONES_INTRO },
        ...Array.from({ length: 30 }).map((_, i): Question => {
            const factor = (i % 4) + 2; // 2, 3, 4, 5
            const num = (i % 7) + 1; // 1 a 7
            const den = num + (i % 5) + 2; // 3 a 14
            return {
                type: 'mcq',
                question: `¿Cuál de estas fracciones es equivalente a ${num}/${den}?`,
                options: [`${num*factor}/${den*factor}`, `${num+factor}/${den+factor}`, `${num*factor}/${den}`],
                answer: `${num*factor}/${den*factor}`,
                hints: [`Para que sea equivalente, debes multiplicar arriba y abajo por el mismo número.`, `La segunda opción suma, eso no crea equivalencia.`, `La tercera opción solo multiplica arriba, eso cambia el valor.`, `Solo la primera opción multiplica arriba y abajo por lo mismo (${factor}).`, `Verifica la multiplicación: ${num}x${factor} y ${den}x${factor}.` ],
                explanation: `Multiplicando el numerador (${num}) y el denominador (${den}) por el mismo número (${factor}), obtenemos la fracción equivalente ${num*factor}/${den*factor}.`,
                lessonId: FRACCIONES_INTRO
            };
        }),
    ],
    3: [
        // === Lección: Multiplicación compleja (MULTIPLICACION_3_2) - 40 preguntas ===
        { type: 'input', question: 'Calcula con varias llevadas: 456 x 7 = ? 🤯', answer: '3192', hints:['7 x 6 = 42. Pones el 2, y te llevas 4. 🎈', '7 x 5 = 35. Más 4 que llevabas = 39. Pones el 9, y te llevas 3. 🎈🎈', '7 x 4 = 28. Más 3 que llevabas = 31.', 'El resultado es 3192.', 'Tres mil ciento noventa y dos.'], explanation: 'Haciendo las multiplicaciones por partes y sumando las llevadas, obtenemos 3192. ¡Un cálculo de campeón! 🏆', lessonId: MULTIPLICACION_3_2},
        { type: 'input', question: '1234 x 5 = ? 🔢', answer: '6170', hints:['5 x 4 = 20. Pones 0, llevas 2. 🎈', '5 x 3 = 15. Más 2 = 17. Pones 7, llevas 1. 🎈', '5 x 2 = 10. Más 1 = 11. Pones 1, llevas 1. 🎈', '5 x 1 = 5. Más 1 = 6.', 'El resultado es 6170.'], explanation: 'Multiplicando cada cifra por 5 y sumando las llevadas correspondientes, el resultado es 6170. ¡Como una escalera! 🪜', lessonId: MULTIPLICACION_3_2},
        { type: 'mcq', question: 'Un cine tiene 12 filas con 15 asientos cada una. ¿Cuántas personas caben? 🍿', options: ['180', '150', '120'], answer: '180', hints:['Es una multiplicación: 12 x 15.', 'Un truco: 10 x 15 = 150.', 'Ahora suma lo que falta: 2 x 15, que es 30.', 'Junta los dos resultados: 150 + 30 = ?', '180.'], explanation: 'Multiplicamos las filas por los asientos: 12 x 15. Podemos hacerlo como (10x15)+(2x15) = 150+30 = 180. ¡Cine lleno! 🎬', lessonId: MULTIPLICACION_3_2},
        { type: 'input', question: 'Un año tiene 365 días. ¿Cuántos días hay en 3 años (sin contar bisiestos)? 🗓️', answer: '1095', hints:['Hay que multiplicar 365 x 3.', '3 x 5 = 15. Pones 5, llevas 1. 🎈', '3 x 6 = 18. Más 1 = 19. Pones 9, llevas 1. 🎈', '3 x 3 = 9. Más 1 = 10.', 'El resultado es 1095.'], explanation: 'Multiplicamos los días de un año por 3: 365 x 3 = 1095 días. ¡Muchos amaneceres! 🌅', lessonId: MULTIPLICACION_3_2},
        { type: 'mcq', question: '805 x 9 = ? 🧐', options: ['7245', '7205', '8045'], answer: '7245', hints:['9 x 5 = 45. Pones 5, llevas 4. 🎈', '9 x 0 = 0. Más 4 que llevabas = 4.', '9 x 8 = 72.', 'El resultado es 7245.', 'Siete mil doscientos cuarenta y cinco.'], explanation: 'Multiplicando por partes y llevando: 9x5=45 (llevo 4), 9x0=0+4=4, 9x8=72. El resultado es 7245. ¡El cero no te engañó! 😎', lessonId: MULTIPLICACION_3_2},
        { type: 'input', question: 'Si un corazón late 70 veces por minuto, ¿cuántas veces late en una hora (60 minutos)? 💖', answer: '4200', hints:['Hay que multiplicar 70 x 60.', 'Un truco: multiplica los números sin los ceros: 7 x 6.', '7 x 6 = 42.', 'Ahora añade los dos ceros que quitaste (uno del 70 y otro del 60).', '4200.'], explanation: 'Multiplicamos los latidos por minuto por los minutos en una hora: 70 x 60. Un truco es hacer 7x6=42 y añadir los dos ceros. ¡Son 4200 latidos! ❤️', lessonId: MULTIPLICACION_3_2},
        { type: 'mcq', question: '25 x 25 = ? 💥', options: ['525', '625', '425'], answer: '625', hints:['Es un número famoso en matemáticas.', 'Termina en 5.', 'Puedes hacerlo por partes: 25x20=500 y 25x5=125. Súmalos.', '500 + 125 = 625.', 'Seiscientos veinticinco.'], explanation: '25 por 25 es 625. ¡Un cuadrado perfecto! Es un resultado que te encontrarás muchas veces. 🤓', lessonId: MULTIPLICACION_3_2},
        { type: 'input', question: 'Un camión transporta 150 cajas. Cada caja pesa 5 kg. ¿Cuál es el peso total de la carga? 🚚', answer: '750', hints:['Es una multiplicación: 150 x 5.', 'Un truco: 15 x 5 = 75.', 'Ahora añade el cero del 150.', '750.', 'Setecientos cincuenta.'], explanation: 'Multiplicamos el número de cajas por el peso de cada una: 150 x 5 = 750 kg. ¡Una carga pesada! 🏋️', lessonId: MULTIPLICACION_3_2},
        { type: 'input', question: 'Calcula: 99 x 9 = ? 🧙', answer: '891', hints:['Un truco: 100 x 9 = 900.', 'Pero multiplicaste 100 en vez de 99, te pasaste por un grupo de 9.', 'Así que al resultado, quítale 9.', '900 - 9 = 891.', 'Ochocientos noventa y uno.'], explanation: 'Es más fácil hacer 100x9=900 y luego restar 9. El resultado es 891. ¡Magia matemática! 🧙‍♂️', lessonId: MULTIPLICACION_3_2},
        { type: 'mcq', question: 'Una escuela tiene 12 aulas con 25 estudiantes en cada una. ¿Cuántos estudiantes hay en total?', options:['300', '250', '350'], answer: '300', hints:['Es 12 x 25.', 'Un truco: 4 aulas de 25 son 100 estudiantes.', '¿Cuántos grupos de 4 aulas hay en 12? Hay 3 grupos.', 'Son 3 grupos de 100.', '300.'], explanation: 'Multiplicamos las aulas por los estudiantes: 12 x 25. Un truco es pensar que 4x25=100. Como 12 es 3x4, el resultado es 3x100 = 300 estudiantes. 🏫', lessonId: MULTIPLICACION_3_2},
        ...Array.from({ length: 30 }).map((_, i): Question => {
            const num1 = 101 + i * 5;
            const num2 = (i % 8) + 2; // Multiplica por 2 a 9
            const answer = num1 * num2;
            return {
                type: 'input',
                question: `${num1} x ${num2} = ?`,
                answer: answer.toString(),
                hints: [`Multiplica ${num2} por cada cifra de ${num1}, de derecha a izquierda.`, `Primero, ${num2} x 1.`, `Luego, ${num2} x 0. ¡Cuidado con la llevada!`, `Finalmente, ${num2} x 1 y suma la llevada.`, `El resultado es ${answer}.`],
                explanation: `Multiplicamos por partes: ${num2}x1=${num2}, ${num2}x0=0, ${num2}x1=${num2}. Hay que tener cuidado con las llevadas. El resultado correcto es ${answer}.`,
                lessonId: MULTIPLICACION_3_2
            };
        }),

        // === Lección: División compleja (DIVISION_3_3) - 40 preguntas ===
        { type: 'input', question: 'Calcula: 125 ÷ 5 = ? 🤔', answer: '25', hints:['Coge las dos primeras cifras: 12. ¿Cuántas veces cabe 5 en 12?', 'Cabe 2 veces (5x2=10) y sobran 2.', 'Bajas el 5. Ahora tienes 25.', '¿Cuántas veces cabe 5 en 25?', 'Cabe 5 veces (5x5=25). El resultado es 25.'], explanation: 'Hacemos la división por partes: 12÷5 da 2 y sobran 2. Bajamos el 5, formando 25. 25÷5 da 5. El resultado es 25. ¡Genial! ✅', lessonId: DIVISION_3_3},
        { type: 'mcq', question: 'Tengo 150 caramelos para repartir entre 6 amigos. ¿Cuántos le doy a cada uno?', options: ['20', '25', '30'], answer: '25', hints:['Es una división: 150 ÷ 6.', 'Coge el 15. ¿Cuántas veces cabe 6 en 15? 6x2=12, sobran 3.', 'Bajas el 0. Ahora tienes 30.', '¿Cuántas veces cabe 6 en 30? 6x5=30.', 'El resultado es 25.'], explanation: 'Dividimos 150 entre 6. 15÷6=2 (sobran 3). Bajamos el 0 y formamos 30. 30÷6=5. El resultado es 25 caramelos para cada uno. 🍬', lessonId: DIVISION_3_3},
        { type: 'input', question: 'Un libro de 300 páginas se lee en 10 días. ¿Cuántas páginas se leen por día?', answer: '30', hints:['"Por día" indica repartir, o sea, dividir.', '300 ÷ 10 = ?', 'Dividir entre 10 es como quitar un cero.', '30.', 'Treinta.'], explanation: 'Dividimos el total de páginas entre los días: 300 ÷ 10 = 30 páginas por día. 📖', lessonId: DIVISION_3_3},
        { type: 'mcq', question: 'Un viaje de 400 km se hace en 8 horas. ¿Cuántos km se recorren por hora (velocidad promedio)?', options: ['50', '40', '60'], answer: '50', hints:['Es una división: 400 ÷ 8.', 'Un truco: 40 ÷ 8 = 5.', 'Ahora añade el cero que quitaste.', '50.', 'Cincuenta.'], explanation: 'Dividimos la distancia entre el tiempo: 400 ÷ 8 = 50. Se recorren 50 km cada hora. 🚗', lessonId: DIVISION_3_3},
        { type: 'input', question: 'Calcula: 909 ÷ 9 = ? 🧐', answer: '101', hints:['9 ÷ 9 = 1.', 'Bajas el 0. ¿Cuántas veces cabe 9 en 0? Cabe 0 veces.', 'Bajas el 9. 9 ÷ 9 = 1.', 'El resultado es 101.', 'Ciento uno.'], explanation: 'Dividimos por partes: 9÷9=1. Al bajar el 0, no cabe, ponemos un 0 en el cociente. Bajamos el 9, y 9÷9=1. El resultado es 101. ¡Cuidado con el cero del medio! 😉', lessonId: DIVISION_3_3},
        { type: 'input', question: 'En una fábrica se hicieron 1200 refrescos. Si se ponen en cajas de 6, ¿cuántas cajas se llenan?', answer: '200', hints:['Es una división: 1200 ÷ 6.', 'Un truco: 12 ÷ 6 = 2.', 'Ahora añade los dos ceros que quitaste.', '200.', 'Doscientas.'], explanation: 'Dividimos el total de refrescos entre la capacidad de cada caja: 1200 ÷ 6 = 200 cajas. 🥤', lessonId: DIVISION_3_3},
        { type: 'mcq', question: '¿Cuál es la cuarta parte de 1000?', options: ['200', '250', '500'], answer: '250', hints:['"La cuarta parte" es dividir entre 4.', '1000 ÷ 4 = ?', 'La mitad de 1000 es 500.', 'La mitad de 500 es 250.', '250.'], explanation: 'La cuarta parte de 1000 es 250. Es como dividir dos veces por la mitad. 💡', lessonId: DIVISION_3_3},
        { type: 'input', question: 'Reparto 315 CUP entre 3 personas. ¿Cuánto le toca a cada una?', answer: '105', hints:['3 ÷ 3 = 1.', 'Bajas el 1. ¿Cuántas veces cabe 3 en 1? 0 veces.', 'Bajas el 5, formando 15. 15 ÷ 3 = 5.', 'El resultado es 105.', 'Ciento cinco.'], explanation: 'Dividiendo 315 entre 3, obtenemos 105. A cada persona le tocan 105 CUP. 💰', lessonId: DIVISION_3_3},
        { type: 'mcq', question: 'Si 15 x 10 = 150, ¿cuánto es 150 ÷ 15?', options: ['10', '15', '1'], answer: '10', hints:['La división es la operación inversa de la multiplicación.', 'Si A x B = C, entonces C ÷ A = B.', 'Si 15 x 10 = 150, entonces 150 ÷ 15 tiene que ser...', '10.', 'Diez.'], explanation: 'Como la división es la operación inversa, si 15 x 10 = 150, entonces 150 ÷ 15 = 10. ¡Usando la lógica! 🧠', lessonId: DIVISION_3_3},
        { type: 'input', question: '¿Cuántas semanas completas hay en 75 días? (Una semana tiene 7 días)', answer: '10', hints:['Es una división con resto: 75 ÷ 7.', '7 ÷ 7 = 1.', 'Bajas el 5. ¿Cuántas veces cabe 7 en 5? 0 veces.', 'El cociente (las semanas completas) es 10.', 'Sobran 5 días.'], explanation: 'Dividimos 75 entre 7. El cociente es 10, lo que significa que hay 10 semanas completas. (Y sobran 5 días). 🗓️', lessonId: DIVISION_3_3},
        ...Array.from({ length: 30 }).map((_, i): Question => {
            const divisor = 5;
            const quotient = 100 + i;
            const dividend = divisor * quotient;
            return {
                type: 'input',
                question: `${dividend} ÷ ${divisor} = ?`,
                answer: quotient.toString(),
                hints: [`Es una división larga. Coge las primeras cifras.`, `${Math.floor(dividend/10)} ÷ ${divisor}.`, `El primer número del cociente es ${Math.floor(quotient/10)}.`, `Baja la siguiente cifra y sigue dividiendo.`, `El resultado es ${quotient}.`],
                explanation: `Al realizar la división larga de ${dividend} entre ${divisor}, el resultado exacto es ${quotient}.`,
                lessonId: DIVISION_3_3
            };
        }),
        
        // === Lección: Fracciones complejas (FRACCIONES_INTRO) - 40 preguntas ===
        { type: 'input', question: 'Calcula: 1/5 + 3/5 = ? (Formato X/Y)', answer: '4/5', hints: ['¡Sumar fracciones con el mismo denominador es súper fácil!', 'El denominador (el de abajo) se queda igual. Sigue siendo 5.', 'Solo tienes que sumar los numeradores (los de arriba).', '1 + 3 = 4.', 'La fracción es 4/5.'], explanation: 'Cuando los denominadores son iguales, se mantiene el denominador y solo se suman los numeradores: 1 + 3 = 4. El resultado es 4/5. 👍', lessonId: FRACCIONES_INTRO },
        { type: 'mcq', question: '¿Qué fracción es mayor: 3/5 o 3/8?', options: ['3/5', '3/8', 'Son iguales'], answer: '3/5', hints: ['Aquí los numeradores son iguales. Coges 3 trozos en ambos casos.', 'La pregunta es: ¿qué trozos son más grandes, los quintos o los octavos?', 'Si divides una pizza en 5, los trozos son más grandes que si la divides en 8.', 'Por lo tanto, 3 trozos de "quintos" es más que 3 trozos de "octavos".', 'El que tiene el denominador más pequeño es el mayor.'], explanation: 'Cuando los numeradores son iguales, la fracción mayor es la que tiene el denominador más pequeño (porque los trozos son más grandes). 3/5 es mayor que 3/8. ✅', lessonId: FRACCIONES_INTRO },
        { type: 'input', question: 'Simplifica la fracción 10/15 a su forma más simple.', answer: '2/3', hints: ['Busca un número que pueda dividir al 10 y al 15.', 'Ambos terminan en 0 o 5, así que se pueden dividir entre 5.', '10 ÷ 5 = 2.', '15 ÷ 5 = 3.', 'La fracción simplificada es 2/3.'], explanation: 'Dividimos tanto el numerador como el denominador por su máximo común divisor, que es 5. El resultado es la fracción irreducible 2/3. ✨', lessonId: FRACCIONES_INTRO },
        { type: 'mcq', question: '¿Cuál de estas fracciones es "impropia" (mayor que 1)?', options: ['7/8', '5/5', '9/4'], answer: '9/4', hints: ['Una fracción es impropia si el numerador (arriba) es más grande que el denominador (abajo).', '7/8 es menor que 1.', '5/5 es igual a 1.', 'En 9/4, el 9 es más grande que el 4.', 'Significa que tienes más de una unidad entera.'], explanation: 'Una fracción impropia es aquella donde el numerador es mayor que el denominador, lo que indica que su valor es mayor que 1. 9/4 es más de dos pizzas enteras. 🍕🍕', lessonId: FRACCIONES_INTRO },
        { type: 'input', question: 'Convierte la fracción impropia 5/2 a número mixto.', answer: '2 1/2', hints: ['¿Cuántas veces cabe el 2 en el 5? Cabe 2 veces (2x2=4).', 'Ese 2 es el número entero grande.', '¿Cuánto sobra? 5 - 4 = 1. Ese es el nuevo numerador.', 'El denominador no cambia, sigue siendo 2.', 'Se escribe 2 y al lado 1/2.'], explanation: 'Dividimos 5 entre 2. El cociente (2) es el número entero, el resto (1) es el nuevo numerador, y el denominador (2) se mantiene. El resultado es 2 y 1/2. 🤓', lessonId: FRACCIONES_INTRO },
        { type: 'input', question: 'Calcula: 7/9 - 2/9 = ? (Formato X/Y)', answer: '5/9', hints: ['Restar con el mismo denominador también es fácil.', 'El denominador se queda igual (9).', 'Solo tienes que restar los numeradores.', '7 - 2 = 5.', 'La respuesta es 5/9.'], explanation: 'Al igual que en la suma, si los denominadores son iguales, simplemente restamos los numeradores: 7 - 2 = 5. El resultado es 5/9. 👍', lessonId: FRACCIONES_INTRO },
        { type: 'mcq', question: '¿Cuál es mayor: 2/3 o 3/4?', options: ['2/3', '3/4', 'Son iguales'], answer: '3/4', hints: ['¡Esta es difícil! Hay que buscar un "idioma" común (denominador común).', 'Un múltiplo de 3 y 4 es 12.', 'Convierte 2/3 a doceavos: 2/3 = 8/12.', 'Convierte 3/4 a doceavos: 3/4 = 9/12.', 'Ahora compara 8/12 y 9/12. ¿Cuál es mayor?'], explanation: 'Para compararlas, las convertimos a un denominador común (12). 2/3 se convierte en 8/12, y 3/4 se convierte en 9/12. Como 9/12 es mayor que 8/12, entonces 3/4 es la fracción mayor. ¡Nivel Pro! 🏆', lessonId: FRACCIONES_INTRO },
        { type: 'input', question: 'Convierte el número mixto 3 1/4 a fracción impropia.', answer: '13/4', hints: ['Multiplica el número entero por el denominador: 3 x 4 = 12.', 'A ese resultado, súmale el numerador: 12 + 1 = 13.', 'Ese 13 es el nuevo numerador.', 'El denominador no cambia, sigue siendo 4.', 'La respuesta es 13/4.'], explanation: 'El proceso es: (entero x denominador) + numerador. (3 x 4) + 1 = 13. Mantenemos el mismo denominador. La fracción es 13/4. 🔄', lessonId: FRACCIONES_INTRO },
        { type: 'mcq', question: '¿Qué es la mitad de 1/2?', options: ['1', '1/4', '1/3'], answer: '1/4', hints: ['Imagina media pizza.', 'Si la cortas otra vez por la mitad, ¿qué trozos tienes?', 'Tendrás cuartos de pizza.', 'La mitad de un medio es un cuarto.', 'Es 1/4.'], explanation: 'Si tomas la mitad de algo, y luego la mitad de esa mitad, obtienes una cuarta parte del total. La mitad de 1/2 es 1/4. 🤯', lessonId: FRACCIONES_INTRO },
        { type: 'input', question: 'Calcula 2/7 + 5/7 = ?', answer: '1', hints: ['Suma los numeradores: 2 + 5 = 7.', 'El denominador se queda en 7.', 'La fracción es 7/7.', '¿A qué es igual una fracción donde el numerador y el denominador son iguales?', 'Es igual a 1.'], explanation: 'La suma es 7/7. Cualquier fracción cuyo numerador es igual a su denominador es igual a la unidad entera, o sea, 1. ¡Completaste el círculo! 🔵', lessonId: FRACCIONES_INTRO },
        ...Array.from({ length: 30 }).map((_, i): Question => {
            const den = 10 + Math.floor(i / 3);
            const num1 = (i % 5) + 1;
            const num2 = (i % 4) + 2;
            if (num1 + num2 >= den) return null; // Evitar sumas que den más de 1 por ahora
            return {
                type: 'input',
                question: `Calcula: ${num1}/${den} + ${num2}/${den} = ? (Formato X/Y)`,
                answer: `${num1+num2}/${den}`,
                hints: [`Las fracciones tienen el mismo denominador.`, `El denominador del resultado será el mismo: ${den}.`, `Solo necesitas sumar los numeradores.`, `La suma de los numeradores es ${num1} + ${num2}.`, `La respuesta es ${num1+num2} sobre ${den}.`],
                explanation: `Como los denominadores son iguales, mantenemos el denominador (${den}) y sumamos los numeradores (${num1} + ${num2} = ${num1+num2}). El resultado es ${num1+num2}/${den}.`,
                lessonId: FRACCIONES_INTRO
            };
        }).filter(Boolean) as Question[],
    ]
};
