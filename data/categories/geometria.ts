import type { Question } from '../../types';

// IDs de lecciones para claridad
const GEOMETRIA_P1 = 'geometria_p1';
const GEOMETRIA_P2_1 = 'geometria_p2_1';
const GEOMETRIA_P2_2 = 'geometria_p2_2';
const GEOMETRIA_P3 = 'geometria_p3';

// Helper to create simple shape SVGs
const createLinesSVG = (type: 'parallel-h' | 'parallel-v' | 'perpendicular' | 'secant'): string => {
    let svgContent = '';
    switch (type) {
        case 'parallel-h':
            svgContent = '<line x1="10" y1="30" x2="90" y2="30" stroke="blue" stroke-width="4"/><line x1="10" y1="70" x2="90" y2="70" stroke="blue" stroke-width="4"/>';
            break;
        case 'parallel-v':
            svgContent = '<line x1="30" y1="10" x2="30" y2="90" stroke="green" stroke-width="4"/><line x1="70" y1="10" x2="70" y2="90" stroke="green" stroke-width="4"/>';
            break;
        case 'perpendicular':
            svgContent = '<line x1="10" y1="50" x2="90" y2="50" stroke="red" stroke-width="4"/><line x1="50" y1="10" x2="50" y2="90" stroke="red" stroke-width="4"/><rect x="45" y="45" width="10" height="10" fill="none" stroke="black" stroke-width="1"/>';
            break;
        case 'secant':
            svgContent = '<line x1="10" y1="20" x2="90" y2="80" stroke="purple" stroke-width="4"/><line x1="10" y1="80" x2="90" y2="20" stroke="purple" stroke-width="4"/>';
            break;
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${svgContent}</svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const createShapeSVG = (shape: 'rect' | 'square' | 'triangle' | 'circle' | 'labeled-rect' | 'labeled-square-perimeter' | 'labeled-rect-perimeter' | 'labeled-square-area' | 'labeled-rect-area', args: { w?: number, h?: number, s?: number, label?: string } = {}): string => {
    let svgContent = '';
    const { w = 80, h = 40, s = 50, label } = args;

    switch (shape) {
        case 'rect':
            svgContent = `<rect x="10" y="30" width="${w}" height="${h}" fill="lightblue" stroke="black" stroke-width="2"/>`;
            break;
        case 'square':
            svgContent = `<rect x="${(100 - s) / 2}" y="${(100 - s) / 2}" width="${s}" height="${s}" fill="lightgreen" stroke="black" stroke-width="2"/>`;
            break;
        case 'triangle':
            svgContent = `<polygon points="50,10 90,90 10,90" fill="lightcoral" stroke="black" stroke-width="2"/>`;
            break;
        case 'circle':
            svgContent = `<circle cx="50" cy="50" r="40" fill="gold" stroke="black" stroke-width="2"/>`;
            break;
        case 'labeled-rect-perimeter':
             svgContent = `
                <rect x="10" y="30" width="80" height="40" fill="lightblue" stroke="black" stroke-width="2"/>
                <text x="50" y="25" text-anchor="middle" font-size="12">80 cm</text>
                <text x="6" y="55" text-anchor="end" transform="rotate(-90 6 55)" font-size="12">40 cm</text>
            `;
            break;
        case 'labeled-square-perimeter':
            svgContent = `
                <rect x="25" y="25" width="50" height="50" fill="lightgreen" stroke="black" stroke-width="2"/>
                <text x="50" y="20" text-anchor="middle" font-size="12">50 cm</text>
            `;
            break;
        case 'labeled-rect-area':
             svgContent = `
                <rect x="10" y="30" width="80" height="40" fill="#a7f3d0" stroke="black" stroke-width="2"/>
                <text x="50" y="25" text-anchor="middle" font-size="12">${w} m</text>
                <text x="6" y="55" text-anchor="end" transform="rotate(-90 6 55)" font-size="12">${h} m</text>
                <text x="50" y="55" text-anchor="middle" font-size="14" font-weight="bold">Área = ?</text>
            `;
            break;
        case 'labeled-square-area':
             svgContent = `
                <rect x="25" y="25" width="50" height="50" fill="#a7f3d0" stroke="black" stroke-width="2"/>
                <text x="50" y="20" text-anchor="middle" font-size="12">${s} m</text>
                <text x="50" y="55" text-anchor="middle" font-size="14" font-weight="bold">Área = ?</text>
            `;
            break;
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${svgContent}</svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const create3DShapeSVG = (shape: 'cube' | 'ortoedro' | 'cylinder' | 'labeled-cube-volume', args: { s?: number } = {}): string => {
    let svgContent = '';
    const { s = 4 } = args;
    switch (shape) {
        case 'cube':
            svgContent = `
                <polygon points="20,35 60,35 70,25 30,25" fill="#fde68a" stroke="black" stroke-width="2"/>
                <polygon points="60,35 60,75 70,65 70,25" fill="#fcd34d" stroke="black" stroke-width="2"/>
                <polygon points="20,35 20,75 60,75 60,35" fill="#fbbf24" stroke="black" stroke-width="2"/>
            `;
            break;
        case 'ortoedro':
             svgContent = `
                <polygon points="10,40 80,40 90,30 20,30" fill="#a5b4fc" stroke="black" stroke-width="2"/>
                <polygon points="80,40 80,80 90,70 90,30" fill="#818cf8" stroke="black" stroke-width="2"/>
                <polygon points="10,40 10,80 80,80 80,40" fill="#6366f1" stroke="black" stroke-width="2"/>
            `;
            break;
        case 'cylinder':
             svgContent = `
                <ellipse cx="50" cy="25" rx="30" ry="10" fill="#9ca3af" stroke="black" stroke-width="2"/>
                <rect x="20" y="25" width="60" height="50" fill="#e5e7eb" stroke="none"/>
                <line x1="20" y1="25" x2="20" y2="75" stroke="black" stroke-width="2"/>
                <line x1="80" y1="25" x2="80" y2="75" stroke="black" stroke-width="2"/>
                <ellipse cx="50" cy="75" rx="30" ry="10" fill="#d1d5db" stroke="black" stroke-width="2"/>
            `;
            break;
         case 'labeled-cube-volume':
            svgContent = `
                <polygon points="20,35 60,35 70,25 30,25" fill="#fde68a" stroke="black" stroke-width="2"/>
                <polygon points="60,35 60,75 70,65 70,25" fill="#fcd34d" stroke="black" stroke-width="2"/>
                <polygon points="20,35 20,75 60,75 60,35" fill="#fbbf24" stroke="black" stroke-width="2"/>
                <text x="40" y="85" font-size="10">${s} cm</text>
                <text x="73" y="50" font-size="10">${s} cm</text>
                <text x="50" y="32" font-size="10" transform="skewX(-20)">${s} cm</text>
            `;
            break;
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${svgContent}</svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

const createCircleSVG = (type: 'radius' | 'diameter', r: number): string => {
    const d = r * 2;
    let svgContent = `<circle cx="50" cy="50" r="40" fill="#fecaca" stroke="black" stroke-width="2"/>`;
    if (type === 'radius') {
        svgContent += `
            <line x1="50" y1="50" x2="90" y2="50" stroke="blue" stroke-width="3" stroke-dasharray="4"/>
            <circle cx="50" cy="50" r="3" fill="blue"/>
            <text x="70" y="45" font-size="12" fill="blue">r = ${r}</text>
        `;
    } else {
         svgContent += `
            <line x1="10" y1="50" x2="90" y2="50" stroke="red" stroke-width="3" stroke-dasharray="4"/>
            <circle cx="50" cy="50" r="3" fill="red"/>
            <text x="40" y="45" font-size="12" fill="red">d = ${d}</text>
        `;
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${svgContent}</svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}


export const geometriaQuestions: Record<number, Question[]> = {
    1: [
        // =================================================================================================
        // Nivel 1 - 40 preguntas por lección
        // =================================================================================================

        // --- Lección: Rectas paralelas y perpendiculares (GEOMETRIA_P1) ---
        { type: 'mcq', question: 'Mira la imagen. ¿Qué tipo de rectas son? 🛤️', imageUrl: createLinesSVG('parallel-h'), options: ['Paralelas', 'Perpendiculares', 'Secantes'], answer: 'Paralelas', hints:['Nunca se juntan, por más que se alarguen.', 'Mantienen siempre la misma distancia entre sí.', 'Son como las vías de un tren.', 'No forman una esquina.', 'Son dos líneas que van en la misma dirección.'], explanation: 'Son líneas paralelas. ¡Como las vías de un tren, siempre juntas pero nunca se tocan! ✅', lessonId: GEOMETRIA_P1},
        { type: 'mcq', question: 'Estas rectas se cruzan formando una esquina perfecta. Son...', imageUrl: createLinesSVG('perpendicular'), options: ['Paralelas', 'Perpendiculares', 'Curvas'], answer: 'Perpendiculares', hints:['Forman un ángulo recto (de 90 grados).', 'Se cruzan en un punto exacto.', 'Son como una cruz "+".', 'La esquina de un cuadrado está formada por estas líneas.', 'No son paralelas porque sí se tocan.'], explanation: 'Son rectas perpendiculares. Se cruzan formando una esquina perfecta, ¡como la letra L! 👍', lessonId: GEOMETRIA_P1},
        { type: 'mcq', question: 'Observa estas líneas. ¿Cómo se llaman?', imageUrl: createLinesSVG('secant'), options: ['Paralelas', 'Perpendiculares', 'Secantes'], answer: 'Secantes', hints:['Se cruzan en un punto.', 'No forman una esquina perfecta (de 90 grados).', 'No son paralelas porque se tocan.', 'Son como dos espadas que chocan.', 'Simplemente se cruzan.'], explanation: 'Estas son rectas secantes. Se cruzan, pero sin formar el ángulo recto perfecto de las perpendiculares. ⚔️', lessonId: GEOMETRIA_P1},
        { type: 'mcq', question: 'Las líneas de una libreta de rayas son...', options: ['Paralelas', 'Perpendiculares', 'Secantes'], answer: 'Paralelas', hints:['Sirven para que no te tuerzas al escribir.', 'Nunca se juntan.', 'Mantienen siempre la misma distancia.', 'No se cruzan.', 'Son como las de la imagen de las vías del tren.'], explanation: 'Las líneas horizontales de una libreta son paralelas para guiar la escritura. ¡Qué gran invento! ✍️', lessonId: GEOMETRIA_P1},
        { type: 'mcq', question: 'La esquina de una ventana está formada por líneas... 🖼️', options: ['Curvas', 'Paralelas', 'Perpendiculares'], answer: 'Perpendiculares', hints:['Forman un ángulo de 90 grados.', 'El marco de arriba y el de un lado se cruzan.', 'No son paralelas.', 'Son como el signo de suma "+".', 'La esquina es "recta".'], explanation: 'Los bordes horizontal y vertical de una ventana se encuentran formando un ángulo recto, por lo que son perpendiculares. 💯', lessonId: GEOMETRIA_P1},
        ...Array.from({ length: 35 }).map((_, i): Question => {
            const types: ('parallel-h' | 'parallel-v' | 'perpendicular' | 'secant')[] = ['parallel-h', 'parallel-v', 'perpendicular', 'secant'];
            const type = types[i % types.length];
            const answerMap = {
                'parallel-h': 'Paralelas',
                'parallel-v': 'Paralelas',
                'perpendicular': 'Perpendiculares',
                'secant': 'Secantes'
            };
            return {
                type: 'mcq',
                question: `Identifica el tipo de rectas en la imagen.`,
                imageUrl: createLinesSVG(type),
                options: ['Paralelas', 'Perpendiculares', 'Secantes'],
                answer: answerMap[type],
                hints: [`Fíjate si las líneas se cruzan o no.`, `Si no se cruzan, son paralelas.`, `Si se cruzan, fíjate si forman una esquina perfecta.`, `Si la esquina es perfecta (90 grados), son perpendiculares.`, `Si solo se cruzan sin esquina perfecta, son secantes.` ],
                explanation: `Las rectas son ${answerMap[type]}. ${type.startsWith('parallel') ? 'Nunca se cruzan.' : type === 'perpendicular' ? 'Se cruzan formando un ángulo recto.' : 'Se cruzan sin formar un ángulo recto.'}`,
                lessonId: GEOMETRIA_P1
            };
        }),

        // --- Lección: Rectángulo y cuadrado (GEOMETRIA_P2_1) ---
        { type: 'mcq', question: '¿Cuál de estas figuras es un cuadrado?', imageUrl: createShapeSVG('square'), options: ['La figura', 'Ninguna'], answer: 'La figura', hints:['Un cuadrado tiene 4 lados iguales.', 'Tiene 4 esquinas rectas.', 'Esta figura cumple ambas condiciones.', 'Es como una cara de un dado.', 'La figura es un cuadrado.'], explanation: 'La figura es un cuadrado, con sus 4 lados iguales y sus 4 ángulos rectos. 🔲', lessonId: GEOMETRIA_P2_1},
        { type: 'input', question: '¿Cuántos lados tiene un rectángulo?', imageUrl: createShapeSVG('rect'), answer: '4', hints:['Cuenta los lados de la figura.', 'Tiene dos lados largos y dos cortos.', 'En total son 4 lados.', 'Cuatro.', '4.'], explanation: 'Un rectángulo es un polígono de 4 lados. ¡Ni más, ni menos! ✅', lessonId: GEOMETRIA_P2_1},
        { type: 'input', question: '¿Cuántas esquinas (vértices) tiene esta figura?', imageUrl: createShapeSVG('square'), answer: '4', hints:['Cuenta las puntas de la figura.', 'Tiene 4 esquinas.', 'Todas sus esquinas son ángulos rectos.', 'Como el número de lados.', 'Cuatro.'], explanation: 'Un cuadrado tiene 4 vértices, que corresponden a sus 4 ángulos rectos. ¡Es muy ordenado! 📐', lessonId: GEOMETRIA_P2_1},
        { type: 'mcq', question: 'Un folio de papel tiene forma de...', options:['Cuadrado', 'Rectángulo', 'Círculo'], answer: 'Rectángulo', hints:['Mide sus lados. ¿Son iguales?', 'No, un lado es más largo que el otro.', 'Tiene 4 esquinas rectas.', 'No es redondo.', 'Tiene forma de rectángulo.'], explanation: 'Un folio de papel estándar es un rectángulo. ¡Listo para dibujar! ✍️', lessonId: GEOMETRIA_P2_1},
        { type: 'mcq', question: 'La principal diferencia entre un cuadrado y un rectángulo es que el cuadrado tiene...', options:['Más lados', 'Lados curvos', 'Todos sus lados iguales'], answer: 'Todos sus lados iguales', hints:['Ambos tienen 4 lados.', 'Ninguno tiene lados curvos.', 'El cuadrado es el "equilibrado", con todos sus lados midiendo lo mismo.', 'Un rectángulo puede tener dos lados largos y dos cortos.', 'El cuadrado es un "rectángulo perfecto".'], explanation: 'La característica especial que define a un cuadrado es que sus cuatro lados son de igual longitud. ¡Es un rectángulo VIP! ⭐', lessonId: GEOMETRIA_P2_1},
        ...Array.from({ length: 35 }).map((_, i): Question => {
            const isSquare = i % 2 === 0;
            const shape = isSquare ? 'square' : 'rect';
            return {
                type: 'mcq',
                question: `La figura que ves, ¿es un cuadrado o un rectángulo?`,
                imageUrl: createShapeSVG(shape),
                options: ['Cuadrado', 'Rectángulo'],
                answer: isSquare ? 'Cuadrado' : 'Rectángulo',
                hints: [`Fíjate en los lados. ¿Son todos iguales o no?`, `Si todos los lados parecen iguales, es un cuadrado.`, `Si tiene dos lados largos y dos cortos, es un rectángulo.`, `Ambos tienen 4 esquinas rectas.`, `La clave está en la longitud de los lados.` ],
                explanation: `La figura es un ${isSquare ? 'cuadrado, porque sus cuatro lados son iguales' : 'rectángulo, porque tiene dos lados más largos que los otros dos'}.`,
                lessonId: GEOMETRIA_P2_1
            };
        }),

        // --- Lección: Prisma (ortoedro y cubo) (GEOMETRIA_P2_2) ---
        { type: 'mcq', question: '¿Qué figura 3D es esta? 🎲', imageUrl: create3DShapeSVG('cube'), options: ['Cubo', 'Ortoedro', 'Cilindro'], answer: 'Cubo', hints:['Todas sus caras parecen ser cuadrados.', 'Es como un dado.', 'Es una figura "perfecta" y equilibrada.', 'No está "estirada".', 'Cubo.'], explanation: 'Esta figura es un cubo, caracterizado por tener 6 caras cuadradas idénticas. ✨', lessonId: GEOMETRIA_P2_2},
        { type: 'mcq', question: '¿Y esta figura, que parece una caja de zapatos? 📦', imageUrl: create3DShapeSVG('ortoedro'), options: ['Cubo', 'Ortoedro', 'Esfera'], answer: 'Ortoedro', hints:['Sus caras son rectángulos.', 'Es como un ladrillo o un libro.', 'Está "estirada" en una dirección.', 'No es un cubo perfecto.', 'Ortoedro (o prisma rectangular).'], explanation: 'Esta figura es un ortoedro (o prisma rectangular). Sus caras son rectángulos. ¡Como una caja de tesoro! 💎', lessonId: GEOMETRIA_P2_2},
        { type: 'input', question: '¿Cuántas caras tiene un cubo?', imageUrl: create3DShapeSVG('cube'), answer: '6', hints:['Cuenta las caras que puedes ver.', 'Hay una arriba, una al frente y una a la derecha (3).', 'Pero también hay una abajo, una atrás y una a la izquierda que no se ven.', '3 + 3 = 6.', 'Como un dado.'], explanation: 'Un cubo siempre tiene 6 caras, igual que un dado tiene 6 números. 🎲', lessonId: GEOMETRIA_P2_2},
        { type: 'input', question: '¿Cuántas esquinas (vértices) tiene esta figura?', imageUrl: create3DShapeSVG('ortoedro'), answer: '8', hints:['Cuenta las esquinas de arriba.', 'Tiene 4 esquinas arriba.', 'Ahora cuenta las de abajo.', 'Tiene 4 esquinas abajo.', '4 + 4 = 8.'], explanation: 'Un ortoedro (igual que un cubo) tiene 8 vértices. ¡Son todas sus puntitas! 📌', lessonId: GEOMETRIA_P2_2},
        { type: 'mcq', question: 'Un ladrillo tiene forma de...', options: ['Cubo', 'Cilindro', 'Ortoedro'], answer: 'Ortoedro', hints:['Es una caja rectangular.', 'No es un cubo perfecto.', 'Tiene 6 caras rectangulares.', 'Se usa para construir casas.', 'Ortoedro o prisma rectangular.'], explanation: 'Un ladrillo es un ejemplo clásico de un ortoedro. ¡La base de la construcción! 🧱', lessonId: GEOMETRIA_P2_2},
        ...Array.from({ length: 35 }).map((_, i): Question => {
            const isCube = i % 2 === 0;
            const shape = isCube ? 'cube' : 'ortoedro';
            const part = ['caras', 'vértices', 'aristas'][i % 3];
            const answer = { caras: '6', vértices: '8', aristas: '12' }[part];
            return {
                type: 'input',
                question: `¿Cuántas ${part} tiene la figura?`,
                imageUrl: create3DShapeSVG(shape),
                answer: answer!,
                hints: [`Las ${part} son ${part === 'caras' ? 'los lados planos' : part === 'vértices' ? 'las esquinas' : 'los bordes'}.`, `Tanto los cubos como los ortoedros tienen el mismo número de ${part}.`, `Puedes contar las de arriba, las de abajo y las que unen.`, `La respuesta es un número fijo para estas figuras.`, `La respuesta es ${answer}.` ],
                explanation: `Tanto el cubo como el ortoedro tienen ${answer} ${part}. ¡Es su estructura secreta! 🧬`,
                lessonId: GEOMETRIA_P2_2
            };
        }),
        
        // --- Lección: Circunferencia, círculo y cilindro (GEOMETRIA_P3) ---
        { type: 'mcq', question: '¿Cómo se llama la línea del borde de un círculo?', imageUrl: createCircleSVG('radius', 5), options: ['Circunferencia', 'Círculo', 'Radio'], answer: 'Circunferencia', hints:['Es solo el contorno, no lo de adentro.', 'Es como un anillo o un hula-hoop.', 'La palabra empieza con C.', 'No es "círculo".', 'Circunferencia.'], explanation: 'La línea que forma el borde de un círculo se llama circunferencia. ¡El contorno perfecto! ✨', lessonId: GEOMETRIA_P3},
        { type: 'mcq', question: 'Una moneda es un ejemplo de...', options: ['Circunferencia', 'Círculo', 'Cilindro'], answer: 'Círculo', hints:['No es solo el borde, sino también lo de adentro.', 'Es una figura plana.', 'Es la superficie completa.', 'Círculo.', 'No es una figura 3D.'], explanation: 'Una moneda, que es plana y redonda (incluyendo su interior), es un ejemplo de un círculo. 🪙', lessonId: GEOMETRIA_P3},
        { type: 'mcq', question: '¿Qué figura 3D es esta?', imageUrl: create3DShapeSVG('cylinder'), options: ['Cubo', 'Cilindro', 'Cono'], answer: 'Cilindro', hints:['Tiene dos bases circulares.', 'Puede rodar si la tumbas.', 'Es como una lata de refresco.', 'No tiene esquinas.', 'Cilindro.'], explanation: 'Esta figura es un cilindro. ¡Como una lata de compota o un rollo de papel! 🥫', lessonId: GEOMETRIA_P3},
        { type: 'mcq', question: 'La línea marcada en rojo, que cruza todo el círculo por el centro, se llama...', imageUrl: createCircleSVG('diameter', 10), options: ['Radio', 'Diámetro', 'Cuerda'], answer: 'Diámetro', hints:['Es la distancia más larga dentro del círculo.', 'Es el doble del radio.', 'Pasa justo por el centro.', 'Empieza con D.', 'Diámetro.'], explanation: 'Esa línea es el diámetro. ¡Atraviesa el corazón del círculo de lado a lado! ❤️', lessonId: GEOMETRIA_P3},
        { type: 'mcq', question: 'La línea marcada en azul, que va del centro al borde, se llama...', imageUrl: createCircleSVG('radius', 5), options: ['Radio', 'Diámetro', 'Circunferencia'], answer: 'Radio', hints:['Es la mitad del diámetro.', 'Es como los rayos de una rueda de bicicleta.', 'Todos los radios de un círculo miden lo mismo.', 'Empieza con R.', 'Radio.'], explanation: 'Esa línea es el radio. ¡Es el brazo que mide el tamaño del círculo! 💪', lessonId: GEOMETRIA_P3},
        ...Array.from({ length: 35 }).map((_, i): Question => {
            const isCylinder = i % 2 === 0;
            const shape = isCylinder ? 'cylinder' : 'circle';
            return {
                type: 'mcq',
                question: `¿Qué figura ves en la imagen?`,
                imageUrl: isCylinder ? create3DShapeSVG('cylinder') : createShapeSVG('circle'),
                options: ['Círculo', 'Cilindro'],
                answer: isCylinder ? 'Cilindro' : 'Círculo',
                hints: [`Fíjate si la figura es plana o tiene volumen (3D).`, `Un círculo es plano, como un dibujo.`, `Un cilindro es un objeto 3D, como una lata.`, `Si puede rodar y tiene tapas redondas, es un cilindro.`, `Si es solo un dibujo redondo, es un círculo.` ],
                explanation: `La figura es un ${isCylinder ? 'cilindro, una figura 3D con dos bases circulares' : 'círculo, una figura plana y redonda'}.`,
                lessonId: GEOMETRIA_P3
            };
        }),
    ],
    2: [
        // =================================================================================================
        // Nivel 2 - 40 preguntas por lección
        // =================================================================================================

        // --- Lección: Rectas paralelas y perpendiculares (GEOMETRIA_P1) ---
        { type: 'mcq', question: 'En un cuadrado, los lados opuestos son...', imageUrl: createShapeSVG('square'), options: ['Paralelos', 'Perpendiculares', 'Secantes'], answer: 'Paralelos', hints:['Los lados opuestos son los que están uno frente al otro.', 'Nunca se tocan.', 'Mantienen la misma distancia.', 'No se cruzan.', 'Son paralelos.'], explanation: 'En un cuadrado (y en un rectángulo), los lados opuestos son siempre paralelos. 📏', lessonId: GEOMETRIA_P1},
        { type: 'mcq', question: 'En un rectángulo, los lados que se tocan en una esquina son...', imageUrl: createShapeSVG('rect'), options: ['Paralelos', 'Perpendiculares', 'Oblicuos'], answer: 'Perpendiculares', hints:['Los lados que se tocan forman las esquinas.', 'Las esquinas de un rectángulo son perfectas (90 grados).', 'Las líneas que forman esquinas perfectas se llaman...', 'No son paralelos, porque se tocan.', 'Son perpendiculares.'], explanation: 'Los lados adyacentes (los que se tocan) de un rectángulo son perpendiculares, formando los ángulos rectos. 📐', lessonId: GEOMETRIA_P1},
        { type: 'mcq', question: 'La letra "T" está formada por dos líneas que son...', options: ['Paralelas', 'Perpendiculares', 'Secantes'], answer: 'Perpendiculares', hints:['El palo de arriba y el de abajo se cruzan.', 'Forman una esquina perfecta.', 'El cruce es de 90 grados.', 'No son paralelas.', 'Son perpendiculares.'], explanation: 'La letra "T" es un claro ejemplo de dos segmentos de recta que son perpendiculares entre sí. ➕', lessonId: GEOMETRIA_P1},
        ...Array.from({ length: 37 }).map((_, i): Question => ({
            type: 'mcq',
            question: 'En la letra "F", el palo vertical es ___ a los dos palos horizontales.',
            options: ['Paralelo', 'Perpendicular', 'Ninguna'],
            answer: 'Perpendicular',
            hints: [`Dibuja una "F" grande.`, `Mira cómo se une el palo largo vertical con los cortos horizontales.`, `¿Forman una esquina perfecta?`, `Sí, forman un ángulo recto.`, `Por lo tanto, son perpendiculares.` ],
            explanation: `En la letra F, la línea vertical es perpendicular a las dos líneas horizontales. ¡Geometría en todas partes!`,
            lessonId: GEOMETRIA_P1
        })),

        // --- Lección: Rectángulo y cuadrado (GEOMETRIA_P2_1) ---
        { type: 'input', question: 'Calcula el perímetro de este cuadrado.', imageUrl: createShapeSVG('labeled-square-perimeter'), answer: '200', hints:['El perímetro es la suma de todos los lados.', 'Un cuadrado tiene 4 lados iguales.', 'Si un lado mide 50 cm, todos miden 50 cm.', 'Puedes sumar 50+50+50+50.', 'O multiplicar 50 x 4.'], explanation: 'El perímetro es la suma de los cuatro lados iguales: 50 + 50 + 50 + 50 = 200 cm. ¡Es el contorno de la figura! 🖼️', lessonId: GEOMETRIA_P2_1},
        { type: 'input', question: 'Calcula el perímetro de este rectángulo.', imageUrl: createShapeSVG('labeled-rect-perimeter'), answer: '240', hints:['El perímetro es la suma de los 4 lados.', 'Tiene dos lados de 80 cm y dos lados de 40 cm.', 'Suma todos: 80 + 80 + 40 + 40.', '80+80=160. 40+40=80.', '160 + 80 = 240.'], explanation: 'Sumamos todos sus lados: 80 + 80 + 40 + 40 = 240 cm. ¡Has rodeado todo el rectángulo! 🏃', lessonId: GEOMETRIA_P2_1},
        { type: 'mcq', question: '¿Todos los rectángulos son cuadrados?', options: ['Sí', 'No'], answer: 'No', hints:['Un cuadrado necesita tener todos sus lados iguales.', '¿Un rectángulo siempre tiene todos sus lados iguales?', 'No, puede tener dos largos y dos cortos.', 'Por lo tanto, no todos los rectángulos son cuadrados.', 'Es al revés: todos los cuadrados sí son rectángulos.'], explanation: 'No, solo los rectángulos que tienen sus 4 lados iguales son cuadrados. ¡Ser un cuadrado es muy exclusivo! ✨', lessonId: GEOMETRIA_P2_1},
        ...Array.from({ length: 37 }).map((_, i): Question => {
            const side = 10 + i;
            const perimeter = side * 4;
            return {
                type: 'input',
                question: `Un marco de un cuadro cuadrado tiene un lado que mide ${side} cm. ¿Cuál es su perímetro total? 🖼️✨`,
                imageUrl: createShapeSVG('labeled-square-perimeter', { s: side }),
                answer: perimeter.toString(),
                hints: [`El perímetro es la suma de la longitud de todos los bordes de la figura.`, `Un cuadrado tiene sus 4 lados exactamente iguales.`, `Como cada lado mide ${side} cm, debes sumar ese número 4 veces.`, `La operación rápida es multiplicar: ${side} x 4.`, `El resultado final es ${perimeter}.`],
                explanation: `¡Magnífico! 🎨 Como es un cuadrado, todos sus lados miden lo mismo: **${side} cm**. 
                Para hallar el perímetro, sumamos sus 4 lados: **${side} + ${side} + ${side} + ${side} = ${perimeter} cm**. 
                ¡El borde de tu cuadro mide ${perimeter} centímetros! 📏✨`,
                lessonId: GEOMETRIA_P2_1
            };
        }),

        // --- Lección: Prisma (ortoedro y cubo) (GEOMETRIA_P2_2) ---
        { type: 'input', question: 'Si apilas 3 cubos uno encima del otro, ¿qué figura formas? 🧊🧱', imageUrl: create3DShapeSVG('ortoedro'), answer: 'ortoedro', hints:['La figura resultante será más alta que ancha, como una torre.', 'Ya no será un cubo perfecto con todos sus lados iguales.', 'Tendrá caras rectangulares en los laterales.', 'Este tipo de prisma se llama...', 'Empieza con "O".'], explanation: '¡Exacto! Al apilar cubos, la figura se "estira" y sus caras dejan de ser todas cuadradas para volverse rectangulares. ¡Has creado un **ortoedro**! 🏗️🌆', lessonId: GEOMETRIA_P2_2},
        { type: 'mcq', question: '¿Cuántas aristas se juntan en cada vértice (esquina) de un cubo? 🎲', imageUrl: create3DShapeSVG('cube'), options: ['2', '3', '4'], answer: '3', hints:['Elige una esquina cualquiera del cubo en la imagen.', 'Cuenta cuántas líneas (aristas) llegan a ese punto exacto.', 'Llega una de arriba, una de abajo/lado y otra del frente.', 'Son exactamente 3.', 'La respuesta es tres.'], explanation: '¡Muy bien observado! 🧐 En cada vértice de un cubo o un ortoedro siempre se encuentran **3 aristas**. ¡Es el punto de unión de tres dimensiones! 🧊✨', lessonId: GEOMETRIA_P2_2},
        ...Array.from({ length: 38 }).map((_, i): Question => ({
                type: 'mcq',
                question: `Si miras un ${i % 2 === 0 ? 'cubo' : 'ortoedro'} perfectamente desde arriba, ¿qué forma plana verías? 👁️📦`,
                imageUrl: i % 2 === 0 ? create3DShapeSVG('cube') : create3DShapeSVG('ortoedro'),
                options: ['Cuadrado', 'Rectángulo', 'Círculo'],
                answer: i % 2 === 0 ? 'Cuadrado' : 'Rectángulo',
                hints: [`Imagina que tienes el objeto en el suelo y lo miras desde el cielo.`, `Verás solamente la cara superior del objeto.`, `La cara superior de un cubo es un...`, `La cara superior de un ortoedro suele ser un...`, `Fíjate en las opciones.`],
                explanation: `¡Correcto! 🎯 La "vista de planta" o vista desde arriba de un cubo es un **cuadrado**, mientras que la de un ortoedro es un **rectángulo**. ¡Todo depende de la forma de sus caras! 📐✨`,
                lessonId: GEOMETRIA_P2_2
        })),

        // --- Lección: Circunferencia, círculo y cilindro (GEOMETRIA_P3) ---
        { type: 'input', question: 'El diámetro de un círculo es de 20 cm. ¿Cuánto mide su radio? 📏🔴', imageUrl: createCircleSVG('diameter', 20), answer: '10', hints:['El radio es el segmento que va desde el centro hasta el borde.', 'El diámetro cruza todo el círculo, pasando por el centro.', 'Por eso, el radio mide exactamente la mitad que el diámetro.', 'Divide 20 entre 2.', 'La respuesta es 10.'], explanation: `¡Perfecto! 🌟 El radio es siempre la mitad del diámetro. 
        Si el diámetro es 20 cm, entonces: **20 ÷ 2 = 10 cm**. 
        ¡El radio mide 10 centímetros! 📏✨`, lessonId: GEOMETRIA_P3},
        { type: 'input', question: 'El radio de un círculo es de 8 cm. ¿Cuánto mide su diámetro? 🔴📏', imageUrl: createCircleSVG('radius', 8), answer: '16', hints:['El diámetro es la línea que atraviesa el círculo por el centro.', 'Es equivalente a poner dos radios juntos en línea.', 'Por eso, el diámetro es el doble del radio.', 'Multiplica 8 por 2.', 'La respuesta es 16.'], explanation: `¡Así se hace! 🚀 El diámetro es el doble del radio. 
        Si el radio es 8 cm, entonces: **8 x 2 = 16 cm**. 
        ¡El diámetro mide 16 centímetros! 🔴📏✨`, lessonId: GEOMETRIA_P3},
        { type: 'mcq', question: 'Si haces un corte a una lata de refresco (cilindro) de arriba a abajo, ¿qué figura plana ves en el corte? 🥫✂️', imageUrl: create3DShapeSVG('cylinder'), options: ['Círculo', 'Triángulo', 'Rectángulo'], answer: 'Rectángulo', hints:['Imagina una lata de refresco.', 'Si la partes por la mitad verticalmente...', 'La forma que ves en el interior del corte...', 'Tiene 4 lados y esquinas rectas.', 'Es un rectángulo.'], explanation: '¡Sorprendente pero cierto! 😲 Aunque el cilindro es redondo, si lo cortas verticalmente por el medio, la superficie que ves es un **rectángulo**. ¡La geometría tiene muchos trucos! 🥫📐', lessonId: GEOMETRIA_P3},
        ...Array.from({ length: 37 }).map((_, i): Question => {
            const isDiameterQuestion = i % 2 === 0;
            const value = 10 + i;
            const answer = isDiameterQuestion ? value * 2 : value / 2;
            if(!isDiameterQuestion && value % 2 !== 0) return null; // Make sure division is exact

            return {
                type: 'input',
                question: isDiameterQuestion ? `Si el radio de un disco es de ${value} cm, ¿cuál es su diámetro total? 💿📏` : `El diámetro de un reloj circular es de ${value} cm. ¿Cuál es su radio? 🕰️📏`,
                imageUrl: isDiameterQuestion ? createCircleSVG('radius', value) : createCircleSVG('diameter', value),
                answer: answer.toString(),
                hints: isDiameterQuestion 
                    ? [`Recuerda: Diámetro = Radio x 2.`, `Multiplica ${value} por 2.`, `Es el doble de la medida que tienes.`, `Imagina dos radios juntos.`, `El resultado es ${answer}.`]
                    : [`Recuerda: Radio = Diámetro / 2.`, `Divide ${value} entre 2.`, `Es la mitad de la medida que tienes.`, `Va desde el centro al borde.`, `El resultado es ${answer}.`],
                explanation: isDiameterQuestion 
                    ? `¡Genial! 💿 El diámetro es el doble del radio: **${value} x 2 = ${answer} cm**. ¡Has medido todo el ancho del disco! 🔴✨`
                    : `¡Excelente! 🕰️ El radio es la mitad del diámetro: **${value} ÷ 2 = ${answer} cm**. ¡Esa es la distancia del centro al borde del reloj! 📏✨`,
                lessonId: GEOMETRIA_P3
            };
        }).filter(Boolean) as Question[],
    ],
    3: [
        // =================================================================================================
        // Nivel 3 - 40 preguntas por lección
        // =================================================================================================
        
        // --- Lección: Rectas paralelas y perpendiculares (GEOMETRIA_P1) ---
        { type: 'mcq', question: 'Dos rectas en un mismo plano que no son paralelas, ¿qué son siempre?', options: ['Perpendiculares', 'Secantes', 'Iguales'], answer: 'Secantes', hints:['Si no son paralelas, significa que se tienen que cruzar en algún punto.', 'Las rectas que se cruzan se llaman secantes.', 'Perpendiculares es un caso especial de secantes.', 'La pregunta es qué son "siempre".', 'Siempre se cortarán.'], explanation: 'Si dos rectas en un plano no son paralelas, inevitablemente se cortarán en algún punto, por lo que son secantes. 💥', lessonId: GEOMETRIA_P1},
        ...Array.from({ length: 39 }).map((_, i): Question => ({
            type: 'mcq',
            question: 'En un mapa, la Calle A va de Norte a Sur. La Calle B va de Este a Oeste y la cruza. ¿Cómo son las calles entre sí?',
            options: ['Paralelas', 'Perpendiculares', 'Secantes no perpendiculares'],
            answer: 'Perpendiculares',
            hints: [`Imagina una brújula o una rosa de los vientos.`, `Norte-Sur es una línea vertical.`, `Este-Oeste es una línea horizontal.`, `Una línea vertical y una horizontal se cruzan formando...`, `Un ángulo recto perfecto.`],
            explanation: `Una calle Norte-Sur y una Este-Oeste se cruzan formando un ángulo de 90 grados, por lo que son perpendiculares. ¡Como en el Vedado! 🗺️`,
            lessonId: GEOMETRIA_P1
        })),

        // --- Lección: Rectángulo y cuadrado (GEOMETRIA_P2_1) ---
        { type: 'input', question: 'Calcula el área de un jardín rectangular que mide 10 m de largo y 5 m de ancho.', answer: '50', hints:['El área es el espacio interior.', 'Para un rectángulo, Área = largo x ancho.', 'Multiplica 10 x 5.', 'Cincuenta.', 'La respuesta se da en metros cuadrados.'], explanation: 'El área se calcula multiplicando largo por ancho: 10 m x 5 m = 50 metros cuadrados. ¡Espacio para muchas plantas! 🌻', lessonId: GEOMETRIA_P2_1},
        { type: 'input', question: 'El perímetro de un cuadrado es 40 cm. ¿Cuánto mide cada lado?', answer: '10', hints:['El perímetro es la suma de los 4 lados iguales.', 'Si los 4 lados juntos miden 40, ¿cuánto mide uno solo?', 'Es una división.', '40 ÷ 4 = ?', 'Diez.'], explanation: 'Dividimos el perímetro total entre los 4 lados iguales del cuadrado: 40 cm ÷ 4 = 10 cm por lado. ¡Detective de medidas! 🕵️', lessonId: GEOMETRIA_P2_1},
        ...Array.from({ length: 38 }).map((_, i): Question => {
            const w = 3 + i;
            const l = 8 + i;
            const area = w * l;
            return {
                type: 'input',
                question: `¿Cuál es el área de un rectángulo de ${l} cm de largo y ${w} cm de ancho?`,
                answer: area.toString(),
                hints: [`El área de un rectángulo se calcula multiplicando su largo por su ancho.`, `La fórmula es Área = largo × ancho.`, `Debes calcular ${l} × ${w}.`, `El resultado es el área en centímetros cuadrados.`, `La respuesta es ${area}.`],
                explanation: `Multiplicamos el largo por el ancho para encontrar el área: ${l} cm × ${w} cm = ${area} cm².`,
                lessonId: GEOMETRIA_P2_1
            };
        }),

        // --- Lección: Prisma (ortoedro y cubo) (GEOMETRIA_P2_2) ---
        { type: 'input', question: 'Calcula el volumen de un cubo cuya arista (lado) mide 2 cm.', answer: '8', hints:['El volumen de un cubo es lado x lado x lado.', 'Multiplica 2 x 2 x 2.', '2 x 2 = 4.', 'Ahora, 4 x 2 = 8.', 'La respuesta se da en centímetros cúbicos.'], explanation: 'El volumen es lado x lado x lado. 2 x 2 x 2 = 8 centímetros cúbicos. ¡El espacio que ocupa el cubo! 🧊', lessonId: GEOMETRIA_P2_2},
        { type: 'input', question: 'Una piscina es un ortoedro que mide 10m de largo, 5m de ancho y 2m de profundidad. ¿Cuál es su volumen?', answer: '100', hints:['El volumen de un ortoedro es largo x ancho x alto.', 'Multiplica 10 x 5 x 2.', '10 x 5 = 50.', 'Ahora, 50 x 2 = 100.', 'La respuesta se da en metros cúbicos.'], explanation: 'El volumen se calcula multiplicando las tres dimensiones: 10m x 5m x 2m = 100 metros cúbicos. ¡Una gran piscina! 🏊', lessonId: GEOMETRIA_P2_2},
        ...Array.from({ length: 38 }).map((_, i): Question => {
            const side = 3 + Math.floor(i / 10); // Lado 3, 4, 5, 6
            const volume = side * side * side;
            return {
                type: 'input',
                question: `Si un dado tiene una arista de ${side} cm, ¿cuál es su volumen?`,
                answer: volume.toString(),
                hints: [`El volumen de un cubo se calcula como lado × lado × lado.`, `Debes multiplicar ${side} tres veces.`, `${side} × ${side} = ${side * side}.`, `Ahora, ${side * side} × ${side} = ?`, `La respuesta es ${volume} en centímetros cúbicos.` ],
                explanation: `Calculamos el volumen elevando el lado al cubo: ${side} × ${side} × ${side} = ${volume} cm³.`,
                lessonId: GEOMETRIA_P2_2
            };
        }),

        // --- Lección: Circunferencia, círculo y cilindro (GEOMETRIA_P3) ---
        { type: 'mcq', question: 'Si el diámetro de un círculo es 0, ¿qué es el círculo?', options: ['Un círculo muy grande', 'Un punto', 'Una línea'], answer: 'Un punto', hints:['Un diámetro de 0 significa que no tiene ancho.', 'Una figura sin ancho ni largo es...', 'Un punto.', 'No tiene tamaño.', 'Es la mínima expresión.'], explanation: 'Un círculo con un diámetro de 0 no tiene dimensiones, es simplemente un punto en el espacio. 📍', lessonId: GEOMETRIA_P3},
        { type: 'mcq', question: 'La línea que une dos puntos cualquiera de la circunferencia se llama...', options: ['Radio', 'Diámetro', 'Cuerda'], answer: 'Cuerda', hints:['No tiene por qué pasar por el centro.', 'El diámetro es un tipo especial de esta línea.', 'Une dos puntos del borde.', 'Cuerda.', 'Como la cuerda de un arco.'], explanation: 'Una cuerda es cualquier segmento de línea que une dos puntos en la circunferencia. ¡El diámetro es la cuerda más larga posible! 🏹', lessonId: GEOMETRIA_P3},
        ...Array.from({ length: 38 }).map((_, i): Question => ({
            type: 'mcq',
            question: `Si dibujo varios radios en un círculo, ¿miden todos lo mismo?`,
            options: ['Sí, siempre', 'No, son diferentes', 'Solo a veces'],
            answer: 'Sí, siempre',
            hints: [`El radio es la distancia del centro al borde.`, `La definición de círculo es que todos los puntos del borde están a la misma distancia del centro.`, `Esa distancia es el radio.`, `Por lo tanto, todos los radios de un mismo círculo son iguales.`, `Es una de sus propiedades fundamentales.` ],
            explanation: `Sí, por definición, todos los puntos de una circunferencia están a la misma distancia del centro. Esa distancia es el radio, por lo que todos los radios de un círculo son idénticos.`,
            lessonId: GEOMETRIA_P3
        })),
    ]
};
