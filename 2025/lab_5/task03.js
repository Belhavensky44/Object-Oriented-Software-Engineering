const colors = require('./json/colors.json');

const result = colors
  .map(obj => Object.keys(obj)[0])
  .filter(name => name.length < 6)
  .sort();

console.log(result);
