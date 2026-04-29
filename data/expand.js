const fs = require('fs');

function processFile(path) {
    let content = fs.readFileSync(path, 'utf8');
    // For each block like `...(() => { ... })()` we want to replace it.
    // It's too complex to evaluate.
    console.log("Read " + path);
}
processFile('data/categories/fracciones.ts');
