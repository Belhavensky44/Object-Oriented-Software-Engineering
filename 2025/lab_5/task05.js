const fs = require('fs');
const { colors, argb } = require('./json/data.js');

const result = colors
  .map((color, i) => {
    const [r, g, b] = argb[i];
    const toHex = x => x.toString(16).padStart(2, '0');

    return {
      color,
      hex_name: `#${toHex(r)}${toHex(g)}${toHex(b)}`
    };
  })
  .sort((a, b) => a.color.localeCompare(b.color));

fs.writeFileSync(
  './hexColors.json',
  JSON.stringify(result, null, 4)
);

console.log('Файл hexColors.json создан');
