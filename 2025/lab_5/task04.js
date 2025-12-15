const colors = require('./json/colors.json');

const result = colors
  .map(obj => {
    const color = Object.keys(obj)[0];
    const rgb = obj[color].slice(0, 3);
    return { color, rgb };
  })
  .sort((a, b) => a.color.localeCompare(b.color));

console.log(result);
