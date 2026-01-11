import type { Question } from '../../types';

export const numerosQuestions: Record<number, Question[]> = {
    1: [
        // === NIVEL 1 ===
        // lessonId: 'numeros_1_1' (Consolidación hasta 100) - 40 questions
        { type: 'mcq', question: '¿Qué número es "ochenta y siete"? 🧐', options: ['78', '87', '807'], answer: '87', hints: ['"Ochenta" te da la pista de las decenas. Empieza con 8.', 'Luego viene "y siete", que son las unidades.', 'Junta un 8 y un 7.', 'No es 78, ¡cuidado con el orden de los números!', 'Piensa en 8 billetes de 10 pesos y 7 pesos sueltos.'], explanation: '¡Correcto! "Ochenta" son 8 decenas y "siete" son 7 unidades, lo que forma el número 87. 👍', lessonId: 'numeros_1_1' },
        { type: 'input', question: 'Escribe el número que va justo después del 99. 🚀', answer: '100', hints: ['Es uno más que 99.', 'Después del 99, llegamos a un número muy especial de tres cifras.', 'Es el famoso "cien".', 'Si cuentas, después de "noventa y nueve" viene...', 'Es el jefe de los números de dos cifras.'], explanation: '¡Genial! Después de 99, el siguiente número es el 100. ¡Cambiamos de liga, ahora con 3 cifras! 🔄', lessonId: 'numeros_1_1' },
        { type: 'mcq', question: '¿Cuál es mayor, 49 o 94? 🤔', options: ['49', '94'], answer: '94', hints: ['Para saber cuál es mayor, mira el primer número de cada uno (la decena). 👀', 'El que tenga la decena más grande, gana la carrera. 🏁', '¿Qué es más, 9 decenas o 4 decenas?', 'El 9 es más grande que el 4.', '94 es "noventa y cuatro", 49 es "cuarenta y nueve". ¿Cuál suena más grande?'], explanation: '¡Muy bien! Para comparar, miramos la cifra de las decenas. Como 9 es mayor que 4, ¡94 es el ganador! 🏆', lessonId: 'numeros_1_1' },
        { type: 'input', question: 'Escribe con cifras: "cincuenta y dos"', answer: '52', hints: ['"Cincuenta" te dice cómo empieza el número. 5️⃣', 'Luego le pones el "dos". 2️⃣', 'Un 5 y un 2.', 'No es 25, ¡el orden importa!', 'Cinco decenas y dos unidades.'], explanation: '¡Perfecto! "Cincuenta" (50) y "dos" (2) juntos forman el número 52. 💪', lessonId: 'numeros_1_1' },
        { type: 'mcq', question: '¿Qué número está entre 78 y 80? (¡El jamón del pan! 🥪)', options: ['77', '81', '79'], answer: '79', hints: ['Es el vecino que vive justo en medio de esos dos números. 🏠', 'Si cuentas desde 78, ¿cuál dices justo antes de 80?', 'Es uno más que 78.', 'También es uno menos que 80.', 'Setenta y nueve.'], explanation: '¡Genial! Al contar, el número que está justo en medio de 78 y 80 es el 79. ¡El vecino de en medio! 👋', lessonId: 'numeros_1_1' },
        { type: 'input', question: 'Escribe con cifras: "treinta y uno"', answer: '31', hints: ['"Treinta" es 30.', 'Luego le sumas el uno.', 'Un 3 y un 1.', 'No es 13.', 'Tres decenas y una unidad.'], explanation: '¡Correcto! "Treinta" (30) y "uno" (1) se juntan para formar el 31. ✨', lessonId: 'numeros_1_1' },
        { type: 'mcq', question: '¿Qué número es más pequeño, 61 o 16? 🤏', options: ['61', '16'], answer: '16', hints: ['Fíjate en las decenas. ¿Cuál es más pequeña, 6 o 1?', 'El que empieza con 1 es el más chiquitín.', 'Dieciséis es más pequeño que sesenta y uno.', 'Compara 6 decenas contra 1 decena.', 'El 16 tiene solo 1 decena.'], explanation: '¡Eso es! El 16 es más pequeño porque su decena (1) es menor que la decena del 61 (6). 🤏', lessonId: 'numeros_1_1' },
        { type: 'input', question: 'Si tienes 7 decenas y 4 unidades, ¿qué número eres? 🧐', answer: '74', hints: ['7 decenas es 70.', '4 unidades es 4.', 'Suma 70 + 4.', 'El número empieza con 7 y termina con 4.', 'Setenta y cuatro.'], explanation: '¡Muy bien! 7 decenas (70) y 4 unidades (4) juntas forman el número 74.', lessonId: 'numeros_1_1' },
        { type: 'input', question: 'Completa la serie: 20, 30, 40, ___', answer: '50', hints: ['La serie está contando de 10 en 10.', '¿Qué número va después de cuarenta?', '40 + 10 = ?', 'Es cinco decenas.', 'El siguiente número redondo después de 40.'], explanation: '¡Muy bien! La serie avanza de diez en diez. Después de 40, ¡el siguiente es 50!', lessonId: 'numeros_1_1' },
        { type: 'mcq', question: '¿Qué número es 10 menos que 60?', options: ['50', '70', '59'], answer: '50', hints: ['Quitar 10 es como dar un paso atrás en las decenas.', '6 decenas menos 1 decena.', 'La respuesta es 5 decenas.', 'Es una resta: 60 - 10.', 'Cincuenta.'], explanation: '¡Genial! Si a 60 le quitas 10, te quedan 50. ¡Es como contar hacia atrás de 10 en 10!', lessonId: 'numeros_1_1' },
        { type: 'input', question: '¿Qué número va antes del 80?', answer: '79', hints: ['Es uno menos que 80.', '80 - 1 = ?', 'Setenta y nueve.', 'El número que dices justo antes de 80.', 'Termina en 9.'], explanation: 'El número que va justo antes del 80 es el 79.', lessonId: 'numeros_1_1' },
        { type: 'mcq', question: 'Usa el signo correcto: 45 ___ 54', options: ['>', '<', '='], answer: '<', hints: ['El signo < significa "menor que" (la punta señala al menor).', 'Compara las decenas. 4 es menor que 5.', '45 es menor que 54.', 'La boca grande del signo siempre se come al número mayor.', 'El 54 es el ganador.'], explanation: '45 es menor que 54, por lo que usamos el signo <.', lessonId: 'numeros_1_1' },
        { type: 'input', question: 'Tengo 9 decenas y 0 unidades. ¿Qué número soy?', answer: '90', hints: ['9 decenas son 90.', '0 unidades no añade nada.', 'Noventa.', 'Un 9 con un 0.', 'Es un número redondo.'], explanation: '9 decenas y 0 unidades forman el número 90.', lessonId: 'numeros_1_1' },
        { type: 'input', question: 'Completa la serie: 55, 60, 65, ___', answer: '70', hints: ['La serie va de 5 en 5.', '65 + 5 = ?', 'Setenta.', 'Es un número redondo.', 'Termina en 0.'], explanation: 'La serie avanza de cinco en cinco. Después del 65 viene el 70.', lessonId: 'numeros_1_1' },
        { type: 'mcq', question: '¿Cuántas decenas hay en 40?', options: ['0', '4', '40'], answer: '4', hints: ['Una decena es un grupo de 10.', '¿Cuántos grupos de 10 puedes hacer con 40?', '4 grupos.', 'Es como quitarle el cero.', 'Son 4 billetes de 10 pesos.'], explanation: 'El número 40 está formado por 4 decenas.', lessonId: 'numeros_1_1' },
        ...Array.from({ length: 25 }).map((_, i): Question => {
            const num = 11 + i*3;
            return {
                type: 'input',
                question: `Escribe con cifras: "${['once', 'catorce', 'diecisiete', 'veinte', 'veintitrés', 'veintiséis', 'veintinueve', 'treinta y dos', 'treinta y cinco', 'treinta y ocho', 'cuarenta y uno', 'cuarenta y cuatro', 'cuarenta y siete', 'cincuenta', 'cincuenta y tres', 'cincuenta y seis', 'cincuenta y nueve', 'sesenta y dos', 'sesenta y cinco', 'sesenta y ocho', 'setenta y uno', 'setenta y cuatro', 'setenta y siete', 'ochenta', 'ochenta y tres'][i]}"`,
                answer: num.toString(),
                hints: [`Escucha bien el nombre de la decena.`, `Luego escucha el nombre de la unidad.`, `Junta los dos números que escuchaste.`, `Asegúrate de ponerlos en el orden correcto.`, `El número es ${num}.`],
                explanation: `¡Exacto! El nombre del número nos da las pistas para escribirlo con cifras. Es ${num}.`,
                lessonId: 'numeros_1_1'
            }
        }),

        // lessonId: 'numeros_1_2' (Números hasta 10 000) - 40 questions
        { type: 'input', question: 'Escribe con cifras: "quinientos sesenta y dos"', answer: '562', hints:['"Quinientos" es 500.', '"Sesenta y dos" es 62.', 'Junta 500 y 62.', 'El número empieza por 5.', 'Son 5 centenas, 6 decenas y 2 unidades.'], explanation: '"Quinientos" (5), "sesenta" (6) y "dos" (2) se juntan para formar el número 562.', lessonId: 'numeros_1_2'},
        { type: 'mcq', question: '¿Qué número es "dos mil trescientos"?', options: ['230', '2030', '2300'], answer: '2300', hints:['"Dos mil" es 2000.', '"Trescientos" es 300.', '2000 + 300 = ?', 'Es un 2, un 3 y dos ceros.', 'No hay decenas ni unidades sueltas.'], explanation: '"Dos mil" (2000) y "trescientos" (300) juntos forman el 2300.', lessonId: 'numeros_1_2'},
        { type: 'input', question: '¿Cuántas centenas hay en el número 700?', answer: '7', hints:['Una centena es 100.', '¿Cuántas veces cabe 100 en 700?', 'Es como quitar los dos ceros.', 'El primer número te lo dice.', 'Son 7 billetes de 100 pesos.'], explanation: 'El número 700 está formado por 7 grupos de 100, es decir, 7 centenas.', lessonId: 'numeros_1_2'},
        { type: 'mcq', question: '¿Cómo se lee el número 5001?', options: ['Cinco mil uno', 'Quinientos uno', 'Cinco mil diez'], answer: 'Cinco mil uno', hints:['El 5 al principio es "cinco mil".', 'Los ceros en el medio no se leen, pero guardan su lugar.', 'El 1 al final se lee "uno".', 'Júntalo todo.', 'No hay decenas ni centenas para leer.'], explanation: 'Leemos los miles (cinco mil) y luego el resto del número (uno). ¡Cinco mil uno!', lessonId: 'numeros_1_2'},
        { type: 'input', question: 'Escribe el número que se forma con 4 millares, 8 centenas y 3 unidades.', answer: '4803', hints:['4 millares es 4000.', '8 centenas es 800.', '3 unidades es 3.', 'No hay decenas, así que ponemos un 0 en su lugar.', '4000 + 800 + 3 = 4803.'], explanation: 'Colocamos cada cifra en su lugar: 4 en los millares, 8 en las centenas, un 0 para guardar el sitio de las decenas, y 3 en las unidades. ¡4803!', lessonId: 'numeros_1_2'},
        { type: 'input', question: 'Escribe con cifras: "novecientos"', answer: '900', hints:['"Nueve" y "cientos".', 'Es un 9 seguido de dos ceros.', 'Es 9 x 100.', 'Son 9 centenas.', 'Es 100 menos que mil.'], explanation: '"Novecientos" significa 9 centenas, que se escribe 900.', lessonId: 'numeros_1_2'},
        { type: 'mcq', question: '¿Qué número es 3000 + 8?', options: ['3008', '3080', '3800'], answer: '3008', hints:['Es tres mil más ocho.', 'Es el número que va 8 puestos después de 3000.', 'Se lee "tres mil ocho".', 'Tiene ceros en las centenas y decenas.', 'El 8 ocupa el lugar de las unidades.'], explanation: 'Si a 3000 le sumas 8, obtienes 3008.', lessonId: 'numeros_1_2'},
        { type: 'input', question: '¿Cuántas unidades hay en un millar?', answer: '1000', hints:['La palabra "millar" viene de "mil".', '¿Cuántos pesos de 1 CUP necesitas para tener un billete de 1000?', 'Es el mismo número.', 'Son 100 decenas.', 'Es 10 x 100.'], explanation: 'Un millar equivale a 1000 unidades.', lessonId: 'numeros_1_2'},
        { type: 'mcq', question: 'El número 9154 tiene...', options: ['3 cifras', '4 cifras', '5 cifras'], answer: '4 cifras', hints:['Una cifra es cada uno de los números que lo forman.', 'Cuenta los números: 9, 1, 5, 4.', 'Hay cuatro números.', 'No son 9154 cifras.', 'Un número entre 1000 y 9999 tiene 4 cifras.'], explanation: 'El número 9154 está compuesto por cuatro dígitos o cifras: el 9, el 1, el 5 y el 4.', lessonId: 'numeros_1_2'},
        { type: 'input', question: 'Escribe con cifras: "siete mil doscientos"', answer: '7200', hints:['"Siete mil" es 7000.', '"Doscientos" es 200.', '7000 + 200 = ?', 'Es un 7, un 2 y dos ceros.', 'No hay decenas ni unidades sueltas.'], explanation: '"Siete mil" (7000) y "doscientos" (200) se combinan para formar el número 7200.', lessonId: 'numeros_1_2'},
        { type: 'mcq', question: '¿Qué valor tiene el 6 en el número 619?', options: ['6', '60', '600'], answer: '600', hints:['El 6 está en la posición de las centenas.', 'Vale 6 grupos de 100.', 'Seiscientos.', 'Es la cifra más a la izquierda.', 'Su valor es el más grande.'], explanation: 'En el número 619, el 6 ocupa el lugar de las centenas, por lo que su valor es 600.', lessonId: 'numeros_1_2'},
        { type: 'input', question: 'Escribe el número formado por 5 millares y 2 decenas.', answer: '5020', hints:['5 millares es 5000.', '2 decenas es 20.', 'No hay centenas ni unidades, así que ponemos ceros.', '5000 + 20 = ?', '5, 0, 2, 0.'], explanation: 'El número es 5020. Se lee "cinco mil veinte".', lessonId: 'numeros_1_2'},
        { type: 'mcq', question: '¿Cómo se lee 8800?', options: ['Ocho mil ochocientos', 'Ochenta y ocho mil', 'Ochocientos ochenta'], answer: 'Ocho mil ochocientos', hints:['El 8 está en los millares.', 'El otro 8 está en las centenas.', 'Ocho mil... ochocientos.', 'No hay decenas ni unidades para leer.', 'Es como juntar "8000" y "800".'], explanation: 'El número 8800 se lee "ocho mil ochocientos".', lessonId: 'numeros_1_2'},
        { type: 'input', question: '¿Qué número es 100 más que 900?', answer: '1000', hints:['900 + 100 = ?', '9 centenas + 1 centena = 10 centenas.', 'Diez centenas es un millar.', 'Mil.', '1000.'], explanation: '100 más que 900 es 1000.', lessonId: 'numeros_1_2'},
        { type: 'input', question: '¿Qué número es 4000 + 500 + 30 + 1?', answer: '4531', hints:['Es una descomposición.', 'Solo tienes que juntar las cifras en orden.', '4, 5, 3, 1.', 'Cuatro mil quinientos treinta y uno.', 'Cada número ocupa una posición.'], explanation: 'Al componer el número, juntamos cada valor en su posición: 4531.', lessonId: 'numeros_1_2'},
        ...Array.from({ length: 25 }).map((_, i): Question => {
            const num = 1000 + i * 150 + i;
            const um = Math.floor(num / 1000);
            const c = Math.floor((num % 1000) / 100);
            const d = Math.floor((num % 100) / 10);
            const u = num % 10;
            return {
                type: 'input',
                question: `Escribe el número formado por ${um} millar(es), ${c} centena(s), ${d} decena(s) y ${u} unidad(es).`,
                answer: num.toString(),
                hints: [`El millar te dice la primera cifra.`, `La centena, la segunda.`, `La decena, la tercera.`, `La unidad, la última.`, `Junta las cifras en orden: ${um}, ${c}, ${d}, ${u}.`],
                explanation: `Colocando cada cifra en su posición correcta, formamos el número ${num}.`,
                lessonId: 'numeros_1_2'
            }
        }),

        // lessonId: 'numeros_1_3' (Orden y comparación) - 40 questions
        { type: 'mcq', question: '¿Cuál es mayor, 1899 o 1901?', options: ['1899', '1901'], answer: '1901', hints: ['Compara cifra por cifra de izquierda a derecha.', 'Los millares (1) son iguales.', 'Compara las centenas: 8 y 9.', '9 es mayor que 8.', 'El número con la centena 9 gana.'], explanation: 'El número 1901 es mayor porque su centena (9) es mayor que la centena de 1899 (8).', lessonId: 'numeros_1_3' },
        { type: 'input', question: 'Escribe el número que va justo antes de 2500.', answer: '2499', hints: ['Es 2500 - 1.', 'Dos mil cuatrocientos noventa y nueve.', 'Antes de un número redondo con ceros, suele haber uno con nueves.', 'El antecesor de 2500.', 'Es el número más grande de la familia de los 2400.'], explanation: 'El antecesor de 2500 es 2499.', lessonId: 'numeros_1_3' },
        { type: 'mcq', question: 'Usa el signo correcto: 3234 ___ 3243', options: ['>', '<', '='], answer: '<', hints: ['Compara cifra por cifra de izquierda a derecha.', 'Los millares (3) y las centenas (2) son iguales.', 'Compara las decenas: 3 y 4.', '3 es menor que 4.', 'La boca grande del signo se come al número mayor.'], explanation: 'Aunque empiezan igual, al llegar a las decenas, vemos que 3 es menor que 4, por lo tanto 3234 < 3243.', lessonId: 'numeros_1_3' },
        { type: 'input', question: 'Ordena de menor a mayor: 850, 580, 805', answer: '580, 805, 850', hints: ['Busca el más pequeño primero. Es el que empieza con 5.', 'Ahora compara los que empiezan con 8.', '805 es menor que 850 porque 0 es menor que 5 en las decenas.', 'El más pequeño es 580.', 'El orden es 580, 805, 850.'], explanation: 'El orden correcto es 580, 805, 850.', lessonId: 'numeros_1_3' },
        { type: 'input', question: 'Escribe el sucesor de 4999.', answer: '5000', hints: ['Es el número que va después.', '4999 + 1 = ?', 'Cinco mil.', 'Después de muchos nueves, viene un cambio de millar.', 'Es un número redondo.'], explanation: 'El sucesor de 4999 es 5000.', lessonId: 'numeros_1_3' },
        { type: 'mcq', question: '¿Cuál es menor, 6090 o 6900?', options: ['6090', '6900'], answer: '6090', hints: ['Ambos empiezan con 6. Compara la segunda cifra.', 'La centena de 6090 es 0.', 'La centena de 6900 es 9.', '0 es menor que 9.', '6090 es "seis mil noventa", el otro es "seis mil novecientos".'], explanation: 'El número 6090 es menor porque su centena (0) es más pequeña que la de 6900 (9).', lessonId: 'numeros_1_3' },
        { type: 'input', question: 'Escribe un número mayor que 8500 pero menor que 8502.', answer: '8501', hints: ['Tiene que estar entre esos dos números.', 'Solo hay una opción.', 'Ocho mil quinientos uno.', 'El que va después de 8500.', 'El que va antes de 8502.'], explanation: 'El único número entero entre 8500 y 8502 es 8501.', lessonId: 'numeros_1_3' },
        { type: 'mcq', question: 'Usa el signo correcto: 9999 ___ 10000', options: ['>', '<', '='], answer: '<', hints: ['Un número de 4 cifras contra uno de 5.', 'El que tiene más cifras siempre es mayor.', '9999 es menor que 10000.', 'El 10000 es el sucesor del 9999.', 'La punta del signo señala al 9999.'], explanation: 'Un número de 5 cifras siempre es mayor que uno de 4 cifras, así que 9999 < 10000.', lessonId: 'numeros_1_3' },
        { type: 'input', question: 'Ordena de mayor a menor: 1879, 1978, 1789', answer: '1978, 1879, 1789', hints: ['Busca el que tiene la centena más grande para empezar (todos tienen 1 millar).', '1978 es el mayor.', 'Luego compara los otros dos. El de 8 centenas es el siguiente.', 'El más pequeño es el que empieza con 1700.', 'El orden es 1978, 1879, 1789.'], explanation: 'El orden correcto de mayor a menor es 1978, 1879, 1789.', lessonId: 'numeros_1_3' },
        { type: 'input', question: 'Escribe el antecesor de 6000.', answer: '5999', hints: ['Es 6000 - 1.', 'Cinco mil novecientos noventa y nueve.', 'Antes de un número con muchos ceros va uno con muchos nueves.', 'Empieza con 5.', 'Termina con 9.'], explanation: 'El número que va justo antes de 6000 es 5999.', lessonId: 'numeros_1_3' },
        { type: 'mcq', question: '¿Cuál es el número más grande que puedes formar con las cifras 4, 2, 8?', options: ['248', '482', '842'], answer: '842', hints:['Para formar el número más grande, pon la cifra más grande primero.', 'Luego la siguiente más grande, y así sucesivamente.', 'El 8 debe ir en la posición de las centenas.', 'El orden es 8, 4, 2.', 'Ochocientos cuarenta y dos.'], explanation: 'Para obtener el mayor número, ordenamos las cifras de mayor a menor: 842.', lessonId: 'numeros_1_3' },
        { type: 'input', question: 'Escribe el número más pequeño que puedes formar con las cifras 7, 0, 2.', answer: '207', hints:['Para el más pequeño, pon la cifra más pequeña primero.', '¡Pero no puedes empezar con 0!', 'Empieza con la siguiente más pequeña (2), y luego pon el 0.', 'El 7 va al final.', 'Doscientos siete.'], explanation: 'No podemos empezar con 0, así que usamos la siguiente cifra más pequeña (2) y luego colocamos el resto en orden: 207.', lessonId: 'numeros_1_3' },
        { type: 'input', question: '¿Qué número va antes de 8010?', answer: '8009', hints:['8010 - 1 = ?', 'Ocho mil nueve.', 'Es el antecesor.', 'El número anterior.', 'Termina en 9.'], explanation: 'El antecesor de 8010 es 8009.', lessonId: 'numeros_1_3' },
        { type: 'input', question: 'Ordena de menor a mayor: 9000, 909, 9900', answer: '909, 9000, 9900', hints:['El que tiene menos cifras es el más pequeño.', '909 tiene 3 cifras.', 'Luego compara los de 4 cifras.', '9000 es menor que 9900.', 'El orden es 909, 9000, 9900.'], explanation: 'El orden por cantidad de cifras y luego por valor es 909, 9000, 9900.', lessonId: 'numeros_1_3' },
        { type: 'input', question: 'Escribe el antecesor del antecesor de 2000.', answer: '1998', hints:['El antecesor de 2000 es 1999.', 'El antecesor de 1999 es...', 'Son dos pasos hacia atrás desde 2000.', 'Es 2000 - 2.', 'Mil novecientos noventa y ocho.'], explanation: 'Dos pasos antes de 2000 está el 1998.', lessonId: 'numeros_1_3' },
        ...Array.from({ length: 25 }).map((_, i): Question => {
            const num = 1000 + i * 200 + i * 10;
            return {
                type: 'mcq',
                question: `¿Cuál es mayor, ${num} o ${num + 50}?`,
                options: [num.toString(), (num + 50).toString()],
                answer: (num + 50).toString(),
                hints: [`Ambos números son muy parecidos.`, `Compara cifra por cifra de izquierda a derecha.`, `La diferencia está en las decenas.`, `¿Qué número tiene más decenas?`, `El que tiene más decenas es el mayor.`],
                explanation: `Al comparar los números, vemos que ${num + 50} es mayor porque tiene 5 decenas más que ${num}.`,
                lessonId: 'numeros_1_3'
            }
        }),
    ],
    2: [
        // === NIVEL 2 ===
        // lessonId: 'numeros_1_1' (Consolidación hasta 100 - Harder) - 40 questions
        { type: 'input', question: '¿A qué decena se parece más el 45? (Redondeo)', answer: '50', hints: ['¿45 está más cerca de 40 o de 50 en la recta numérica?', 'Está justo en el medio.', 'La regla dice que si acaba en 5 o más, va a la siguiente decena.', 'Sube a la siguiente. 📈', 'La decena más cercana es 50.'], explanation: '¡Correcto! Cuando un número termina en 5, está justo en medio. La regla de los matemáticos es redondear hacia arriba, ¡así que va al 50!', lessonId: 'numeros_1_1' },
        { type: 'input', question: 'Descompón el número 92 en decenas y unidades (ej: 23 = 20 + 3)', answer: '90 + 2', hints: ['El 9 está en el lugar de las decenas, ¿cuánto vale?', 'Vale 90.', 'El 2 está en el lugar de las unidades.', 'Júntalos con un signo de más.', 'Noventa más dos.'], explanation: 'El número 92 se descompone en 9 decenas (90) y 2 unidades (2).', lessonId: 'numeros_1_1' },
        { type: 'input', question: 'Ordena de menor a mayor: 81, 18, 108', answer: '18, 81, 108', hints: ['Primero busca el que tiene menos cifras, o la decena más pequeña.', '18 es el más pequeño.', 'Luego compara 81 y 108.', 'Un número de 3 cifras siempre es mayor que uno de 2.', 'El más grande de todos es 108.'], explanation: 'El orden correcto es 18, 81 y 108. El 108 es el más grande por tener 3 cifras.', lessonId: 'numeros_1_1' },
        { type: 'mcq', question: '¿Qué número es 100 - 1?', options: ['90', '99', '101'], answer: '99', hints: ['Es el número que va justo antes de 100.', 'Es el número más grande de dos cifras.', 'Noventa y nueve.', 'Tiene dos nueves.', '99.'], explanation: '¡Muy bien! Si a 100 le quitas 1, te da el número anterior, que es 99.', lessonId: 'numeros_1_1' },
        { type: 'input', question: 'Tengo 6 decenas y 14 unidades. ¿Qué número soy? 🤔', answer: '74', hints: ['¡Cuidado, es una trampa! 🧐', '6 decenas son 60.', '14 unidades es en realidad 1 decena más 4 unidades.', 'Suma las decenas: 6 + 1 = 7 decenas.', 'El número es setenta y cuatro.'], explanation: '¡Excelente! 6 decenas son 60. Las 14 unidades son 10+4. Sumando todo (60+10+4) obtenemos 74.', lessonId: 'numeros_1_1' },
        { type: 'input', question: 'Escribe el sucesor del sucesor de 48.', answer: '50', hints: ['Es dar dos pasos hacia adelante desde 48.', 'El sucesor de 48 es 49.', 'Ahora busca el sucesor de 49.', 'Es 50.', '48 + 2 = ?'], explanation: 'El sucesor de 48 es 49, y el sucesor de 49 es 50. ¡Dos saltos! 🤸', lessonId: 'numeros_1_1' },
        { type: 'mcq', question: '¿Cuál es el número más cercano a 70?', options: ['68', '73', '66'], answer: '68', hints: ['Calcula la distancia de cada número a 70.', 'De 68 a 70 hay 2 pasitos.', 'De 73 a 70 hay 3 pasitos.', 'De 66 a 70 hay 4 pasitos.', 'El que tiene la distancia más pequeña es el más cercano.'], explanation: 'Calculando la distancia de cada número a 70, vemos que 68 es el más cercano (solo a 2 de distancia).', lessonId: 'numeros_1_1' },
        { type: 'input', question: 'Completa la serie: 88, 86, 84, ___', answer: '82', hints: ['La serie va hacia atrás.', 'Está restando 2 cada vez.', '84 - 2 = ?', 'Es un número par.', 'Ochenta y dos.'], explanation: 'La serie va disminuyendo de 2 en 2. El siguiente número es 82.', lessonId: 'numeros_1_1' },
        { type: 'mcq', question: 'Si redondeo un número a la decena más cercana y me da 80, ¿qué número podría ser?', options: ['74', '86', '78'], answer: '78', hints: ['74 se redondea a 70.', '86 se redondea a 90.', '78 está más cerca de 80 que de 70.', 'El número debe estar entre 75 y 84.', 'La respuesta es 78.'], explanation: 'De las opciones, 78 es el único número que se redondea a 80.', lessonId: 'numeros_1_1' },
        { type: 'mcq', question: '¿Cuál es el número más grande de 2 cifras diferentes?', options: ['99', '98', '10'], answer: '98', hints: ['No puede ser 99 porque las cifras deben ser diferentes.', 'Usa las dos cifras más altas que existen (9 y 8).', 'Para que sea el más grande, pon la cifra mayor primero.', 'El orden es 9 y 8.', 'Noventa y ocho.'], explanation: 'El número más grande de 2 cifras es 99, pero como deben ser diferentes, usamos las dos cifras más altas, 9 y 8, para formar el 98.', lessonId: 'numeros_1_1' },
        ...Array.from({ length: 30 }).map((_, i): Question => {
            const num = 10 + i;
            return {
                type: 'input',
                question: `¿A qué decena se redondea el número ${num}?`,
                answer: (Math.round(num / 10) * 10).toString(),
                hints: [`¿Está más cerca de ${Math.floor(num / 10) * 10} o de ${Math.ceil(num / 10) * 10}?`, `La regla es mirar la unidad.`, `Si la unidad es 5 o más, sube a la siguiente decena.`, `Si es 4 o menos, se queda en la decena actual.`, `La respuesta siempre terminará en 0.` ],
                explanation: `Para redondear ${num}, miramos su unidad. Como es ${num % 10}, la decena más cercana es ${Math.round(num / 10) * 10}.`,
                lessonId: 'numeros_1_1'
            }
        }),
        
        // lessonId: 'numeros_1_2' (Números hasta 10 000 - Harder) - 40 questions
        { type: 'input', question: 'Escribe con cifras: "Ocho mil catorce"', answer: '8014', hints: ['"Ocho mil" es 8000.', '"Catorce" es 14.', '¡Cuidado! No hay centenas, así que debemos poner un guardián en su lugar. 💂‍♂️', 'El guardián de la posición es el cero.', 'El número es 8, 0, 1, 4.'], explanation: '¡Excelente! El número "ocho mil catorce" necesita un 0 en las centenas para que cada cifra esté en su sitio correcto. ¡8014! ✅', lessonId: 'numeros_1_2' },
        { type: 'mcq', question: 'En 5 555, ¿qué valor tiene el segundo 5 empezando por la izquierda?', options: ['50', '500', '5 000'], answer: '500', hints: ['El primer 5 vale 5000 (millares).', 'El segundo 5 vive en la casa de las centenas. 🏠', 'Por lo tanto, su valor es quinientos.', 'No es 50, ese es el tercer 5.', 'El segundo 5 vale 500.'], explanation: 'El segundo 5 de izquierda a derecha está en la posición de las centenas, por lo que su valor es 500.', lessonId: 'numeros_1_2' },
        { type: 'input', question: '¿Cuántas decenas hay en total en el número 1200?', answer: '120', hints: ['No te pregunto por la cifra de las decenas (que es 0). 🤔', 'Te pregunto cuántos grupos de 10 puedes hacer con 1200.', 'Es como dividir 1200 entre 10.', 'Un truco es quitar el último cero del número.', 'Son 120 billetes de 10 pesos.'], explanation: 'Para saber el número total de decenas, dividimos el número por 10. 1200 ÷ 10 = 120 decenas en total.', lessonId: 'numeros_1_2' },
        { type: 'input', question: 'Tengo 2 millares y 15 centenas. ¿Qué número soy? 🤯', answer: '3500', hints: ['¡Cuidado, es una descomposición con truco! 😈', '2 millares son 2000.', '15 centenas son 15 x 100, es decir, 1500.', 'Ahora suma los dos resultados: 2000 + 1500 = ?', 'Tres mil quinientos.'], explanation: '¡Muy astuto! 15 centenas son 1 millar y 5 centenas (1500). Si le sumamos los otros 2 millares, tenemos un total de 3 millares y 5 centenas: 3500.', lessonId: 'numeros_1_2' },
        { type: 'input', question: 'Completa la serie: 1250, 1500, 1750, ___', answer: '2000', hints: ['La serie va aumentando de 250 en 250.', 'Es como contar monedas de 250.', '1750 + 250 = ?', 'Un truco: 1750+50=1800. 1800+200=2000.', 'Dos mil.'], explanation: 'La serie avanza sumando 250 cada vez. El siguiente número es 2000.', lessonId: 'numeros_1_2' },
        { type: 'mcq', question: '¿Cuántas centenas completas hay en el número 5890?', options: ['5', '8', '58'], answer: '58', hints: ['No es la cifra de las centenas (que es 8).', 'Es cuántos grupos de 100 caben en el número completo.', 'Es como dividir 5890 entre 100 e ignorar lo que sobra.', 'Un truco es tapar las dos últimas cifras.', 'Queda el número 58.'], explanation: 'Para saber el número de centenas completas, dividimos por 100 e ignoramos el resto. 5890 ÷ 100 = 58 con resto 90. Hay 58 centenas completas.', lessonId: 'numeros_1_2' },
        { type: 'input', question: 'Escribe el número más grande de 4 cifras que solo usa las cifras 2 y 8.', answer: '8888', hints:['Para que sea el más grande, usa la cifra más grande (8) en todas las posiciones.', 'La posición de los millares debe ser un 8.', 'La de las centenas también.', 'Y las demás.', 'Ocho mil ochocientos ochenta y ocho.'], explanation: 'Para formar el número más grande posible, debemos usar la cifra de mayor valor (8) en todas las posiciones.', lessonId: 'numeros_1_2' },
        { type: 'mcq', question: 'Un número tiene 300 decenas. ¿Qué número es?', options: ['300', '3000', '30'], answer: '3000', hints: ['300 decenas es 300 veces el número 10.', 'La operación es 300 x 10.', 'Un truco es añadir un cero al 300.', 'Tres mil.', '3000.'], explanation: 'Si cada decena es 10, 300 decenas son 300 x 10 = 3000.', lessonId: 'numeros_1_2' },
        ...Array.from({ length: 32 }).map((_, i): Question => {
            const num = 1000 + i * 250;
            return {
                type: 'input',
                question: `¿Cuántas centenas completas hay en el número ${num}?`,
                answer: Math.floor(num/100).toString(),
                hints: [`Una centena es un grupo de 100.`, `Tienes que ver cuántos grupos de 100 caben en ${num}.`, `Es como dividir ${num} por 100 y tomar solo la parte entera.`, `Un truco es "tapar" las dos últimas cifras.`, `La respuesta es ${Math.floor(num/100)}.` ],
                explanation: `Para encontrar las centenas completas, dividimos el número por 100 y nos quedamos con la parte entera: ${num} ÷ 100 da como cociente ${Math.floor(num/100)}.`,
                lessonId: 'numeros_1_2'
            }
        }),

        // lessonId: 'numeros_1_3' (Orden y comparación - Harder) - 40 questions
        { type: 'mcq', question: '¿Cuál es mayor, 7654 o 7645?', options: ['7654', '7645'], answer: '7654', hints:['Los dos primeros dígitos (7 y 6) son iguales.', 'Compara el tercer dígito (la decena).', '5 es mayor que 4.', 'El número con la decena 5 es el ganador.', '7654 está después de 7645 en la recta numérica.'], explanation: 'Al comparar las decenas, vemos que 5 es mayor que 4, por lo tanto 7654 es el número más grande.', lessonId: 'numeros_1_3' },
        { type: 'input', question: 'Escribe el sucesor de 4899.', answer: '4900', hints:['4899 + 1 = ?', 'Cuatro mil novecientos.', 'Es un número redondo de tres cifras, pero en los miles.', 'Cambia la centena.', 'Después del 8 viene el 9 en la centena.'], explanation: 'El número que sigue al 4899 es el 4900.', lessonId: 'numeros_1_3' },
        { type: 'input', question: 'Redondea 1450 a la centena más cercana', answer: '1500', hints: ['¿Está más cerca de 1400 o 1500?', 'La regla dice que si acaba en 50 o más, sube al siguiente.', 'Sube a la siguiente centena.', 'La siguiente centena es 1500.', 'Está justo en el medio, así que sube.'], explanation: '¡Exacto! Cuando un número está justo en la mitad (como 1450 entre 1400 y 1500), la regla es redondear hacia arriba, a 1500.', lessonId: 'numeros_1_3' },
        { type: 'input', question: 'Escribe el antecesor de 8000.', answer: '7999', hints: ['Es 8000 - 1.', 'Antes de un número con muchos ceros, va uno con muchos nueves.', 'Siete mil novecientos noventa y nueve.', '7999.', 'Empieza con 7.'], explanation: '¡Muy bien! El número justo anterior a 8000 es 7999.', lessonId: 'numeros_1_3' },
        { type: 'input', question: 'Escribe el número más grande que puedes formar con 5, 0, 9, 2', answer: '9520', hints: ['Para el más grande, usa la cifra más grande primero.', 'La más grande es 9.', 'Luego la siguiente: 5.', 'Luego 2 y al final 0.', '9, 5, 2, 0.'], explanation: '¡Perfecto! Para formar el número más grande, ordenamos las cifras de mayor a menor: 9520.', lessonId: 'numeros_1_3' },
        { type: 'mcq', question: 'El antecesor del antecesor de 5100 es...', options: ['5098', '5099', '5102'], answer: '5098', hints: ['Son dos pasos hacia atrás.', 'El antecesor de 5100 es 5099.', 'Ahora busca el antecesor de 5099.', '5099 - 1 = ?', 'Es 5098.'], explanation: '¡Perfecto! Vamos dos pasos para atrás: el antecesor de 5100 es 5099, y el antecesor de 5099 es 5098.', lessonId: 'numeros_1_3' },
        { type: 'input', question: 'Redondea 8500 a la unidad de millar más cercana.', answer: '9000', hints:['¿Está más cerca de 8000 o 9000?', 'Está justo en el medio.', 'La regla dice que si está en el medio (500), subimos.', 'Subimos al siguiente millar.', '9000.'], explanation: 'Como está justo en la mitad entre 8000 y 9000, la regla matemática dice que redondeemos hacia arriba, a 9000.', lessonId: 'numeros_1_3' },
        { type: 'mcq', question: '¿Cuál es el número más pequeño que puedes formar con las cifras 7, 0, 8, 1?', options: ['0178', '1078', '1780'], answer: '1078', hints: ['Para el número más pequeño, quieres la cifra más pequeña al principio.', '¡Pero un número de 4 cifras no puede empezar con 0!', 'Usa la siguiente cifra más pequeña (el 1) para empezar.', 'Después del 1, pon el 0, y luego ordena las que quedan de menor a mayor.', 'El orden es 1, 0, 7, 8.'], explanation: 'Para formar el número más pequeño, no podemos empezar con 0. Usamos la siguiente cifra más pequeña (1) y luego colocamos el resto en orden ascendente, incluyendo el 0. El resultado es 1078.', lessonId: 'numeros_1_3' },
        ...Array.from({ length: 32 }).map((_, i): Question => {
            const num1 = 1000 + i*111;
            const num2 = 1000 + i*111 + 10;
            return {
                type: 'mcq',
                question: `¿Cuál es menor, ${num1} o ${num2}?`,
                options: [num1.toString(), num2.toString()],
                answer: num1.toString(),
                hints: [`Compara los números cifra por cifra.`, `Las dos primeras cifras son iguales.`, `Compara la cifra de las decenas.`, `Un número tiene una decena menor que el otro.`, `El que tiene la decena más pequeña es el menor.`],
                explanation: `Al comparar ${num1} y ${num2}, vemos que aunque sus millares y centenas son iguales, el primer número tiene menos decenas, por lo que es el menor.`,
                lessonId: 'numeros_1_3'
            }
        }),
    ],
    3: [
        // === NIVEL 3 ===
        // lessonId: 'numeros_1_1' (Consolidación hasta 100 - Complex) - 40 questions
        { type: 'input', question: 'Soy un número entre 50 y 60. La suma de mis dos cifras es 12. ¿Qué número soy?', answer: '57', hints: ['Si estoy entre 50 y 60, mi primera cifra es 5.', 'La suma de las cifras es 12. Si la primera es 5, ¿cuál es la segunda?', '5 + ? = 12.', 'La segunda cifra es 7.', 'El número es cincuenta y siete.'], explanation: 'El número debe empezar por 5. Para que la suma de cifras sea 12, la segunda cifra debe ser 7 (5+7=12). ¡El número es 57!', lessonId: 'numeros_1_1' },
        { type: 'mcq', question: '¿Cuál es el número más grande de 2 cifras que puedes formar con cifras pares y diferentes?', options: ['98', '88', '86'], answer: '86', hints: ['Las cifras pares son 0, 2, 4, 6, 8.', 'Para el número más grande, la primera cifra debe ser la más grande posible (8).', 'Las cifras deben ser diferentes, así que no puedes usar el 8 otra vez.', 'La siguiente cifra par más grande es el 6.', 'El número es 86.'], explanation: 'Usamos la cifra par más alta (8) para las decenas. Como no podemos repetirla, usamos la siguiente más alta (6) para las unidades. ¡El número es 86!', lessonId: 'numeros_1_1' },
        { type: 'input', question: 'Tengo 8 decenas. Si me quitas 3 unidades, ¿en qué número me convierto?', answer: '77', hints: ['8 decenas es el número 80.', 'Ahora tienes que restar 3 unidades.', '80 - 3 = ?', 'Setenta y siete.', '77.'], explanation: 'El número inicial es 80. Al restarle 3 unidades, el resultado es 77.', lessonId: 'numeros_1_1' },
        ...Array.from({ length: 37 }).map((_, i): Question => {
            const digit1 = Math.floor(i / 10) + 1;
            const digit2 = i % 10;
            const sum = digit1 + digit2;
            const num = digit1 * 10 + digit2;
            return {
                type: 'input',
                question: `Soy un número de dos cifras. Mi primera cifra es ${digit1} y la suma de mis cifras es ${sum}. ¿Qué número soy?`,
                answer: num.toString(),
                hints: [`La primera cifra ya te la he dado: ${digit1}.`, `Si la suma total es ${sum} y una parte es ${digit1}, ¿cuál es la otra?`, `La operación es ${sum} - ${digit1} = ?`, `La segunda cifra es ${digit2}.`, `Junta las dos cifras.` ],
                explanation: `Si la primera cifra es ${digit1} y la suma es ${sum}, la segunda cifra es ${sum} - ${digit1} = ${digit2}. El número es ${num}.`,
                lessonId: 'numeros_1_1'
            }
        }),

        // lessonId: 'numeros_1_2' (Números hasta 10 000 - Complex) - 40 questions
        { type: 'input', question: 'En el número 7531, multiplica la cifra de las centenas por la cifra de las unidades.', answer: '5', hints: ['La cifra de las centenas es 5.', 'La cifra de las unidades es 1.', 'La operación es 5 x 1.', 'El resultado es 5.', 'Cinco.'], explanation: 'La centena es 5 y la unidad es 1. Su multiplicación es 5 x 1 = 5.', lessonId: 'numeros_1_2' },
        { type: 'mcq', question: '¿Qué número es 100 menos que 5000?', options: ['4990', '4900', '4000'], answer: '4900', hints: ['5000 - 100 = ?', 'Piensa en 500 decenas menos 10 decenas. Son 490 decenas.', '490 decenas es 4900.', 'Cuatro mil novecientos.', 'No es 4990.'], explanation: 'Restar 100 a 5000 nos da 4900. Es como quitar una centena a 50 centenas.', lessonId: 'numeros_1_2' },
        { type: 'input', question: '¿Cuántas unidades hay en 3 millares y 20 decenas?', answer: '3200', hints: ['3 millares son 3000 unidades.', '20 decenas son 20 x 10 = 200 unidades.', 'Suma todo: 3000 + 200.', 'Tres mil doscientos.', '3200.'], explanation: 'Convertimos todo a unidades y sumamos: 3000 + 200 = 3200 unidades.', lessonId: 'numeros_1_2' },
        ...Array.from({ length: 37 }).map((_, i): Question => {
            const num = 1000 + i * 135;
            const hundredsDigit = Math.floor((num % 1000) / 100);
            const unitsDigit = num % 10;
            const answer = hundredsDigit + unitsDigit;
            return {
                type: 'input',
                question: `En el número ${num}, suma la cifra de las centenas con la cifra de las unidades.`,
                answer: answer.toString(),
                hints: [`Primero, identifica la cifra de las centenas.`, `Es ${hundredsDigit}.`, `Ahora, identifica la cifra de las unidades.`, `Es ${unitsDigit}.`, `Suma los dos números que encontraste.` ],
                explanation: `La cifra de las centenas en ${num} es ${hundredsDigit} y la de las unidades es ${unitsDigit}. La suma es ${hundredsDigit} + ${unitsDigit} = ${answer}.`,
                lessonId: 'numeros_1_2'
            }
        }),

        // lessonId: 'numeros_1_3' (Orden y comparación - Complex) - 40 questions
        { type: 'input', question: 'Soy un número par entre 6230 y 6240. La suma de mis cifras es 15. ¿Quién soy?', answer: '6234', hints: ['Los números pares posibles en ese rango son 6232, 6234, 6236 y 6238.', 'Ahora, suma las cifras de cada uno de esos números para ver cuál da 15.', 'Probemos con 6232: 6+2+3+2 = 13. No es.', 'Probemos con 6234: 6+2+3+4 = 15. ¡Bingo!', 'Asegúrate de que no haya otro que también cumpla la condición.'], explanation: 'Los números pares en el rango son 6232, 6234, 6236 y 6238. Al sumar sus cifras, el único que da como resultado 15 es 6234. ¡Misterio resuelto! 🧐' , lessonId: 'numeros_1_3' },
        { type: 'mcq', question: 'Ordena de mayor a menor: 9009, 9090, 9900.', options: ['9900, 9090, 9009', '9009, 9090, 9900', '9900, 9009, 9090'], answer: '9900, 9090, 9009', hints: ['Todos empiezan con 9. Compara las centenas.', 'El más grande es el que tiene 9 en las centenas (9900).', 'Ahora compara los otros dos, que tienen 0 en las centenas.', 'Compara sus decenas: 9 es mayor que 0.', 'El orden es 9900, 9090, 9009.'], explanation: 'Comparando por posición, 9900 es el mayor. Luego, entre 9090 y 9009, el primero es mayor por tener más decenas. El orden es 9900, 9090, 9009.', lessonId: 'numeros_1_3' },
        { type: 'input', question: 'Redondea 5980 a la centena más cercana.', answer: '6000', hints: ['Las centenas son 5900 y 6000.', '¿Está más cerca de 5900 o de 6000?', 'Mira el número que sigue a las centenas: 80.', 'Como es 50 o más, sube a la siguiente.', 'La siguiente centena es 6000.'], explanation: 'Para redondear a la centena, miramos las decenas. Como 80 es mayor que 50, redondeamos hacia arriba, a la siguiente centena, que es 6000.', lessonId: 'numeros_1_3' },
        ...Array.from({ length: 37 }).map((_, i): Question => {
            const num1 = 5000 + i*10;
            const num2 = num1 - 1;
            const num3 = num1 + 1;
            const arr = [num1, num2, num3].sort(() => Math.random() - 0.5);
            const sorted = [...arr].sort((a,b) => a-b);
            return {
                type: 'input',
                question: `Ordena de menor a mayor: ${arr.join(', ')}`,
                answer: sorted.join(', '),
                hints: [`Son tres números casi iguales.`, `Busca el que es diferente en la unidad.`, `Dos de ellos son consecutivos.`, `El orden correcto empieza por el más pequeño.`, `Escribe los números separados por coma y espacio.` ],
                explanation: `Al ser números muy cercanos, solo debemos fijarnos en las unidades para ordenarlos correctamente: ${sorted.join(', ')}.`,
                lessonId: 'numeros_1_3'
            }
        }),
    ]
};