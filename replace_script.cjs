const fs = require('fs');
const path = require('path');

const dir = 'data/grades/grado-3/matematicas/categories';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

files.forEach(f => {
    const file = path.join(dir, f);
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/for \(let i = 0; i < (3[0-9]|4[0-9]|2[0-9]); i\+\+\)/g, 'for (let i = 0; i < 3; i++)');
    fs.writeFileSync(file, content);
});
console.log('Done!');

