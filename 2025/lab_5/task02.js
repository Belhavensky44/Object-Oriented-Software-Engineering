const data = require('./json/clients.json');

const result = data.clients
  .filter(c => c.address.city === 'Кунгур')
  .sort((a, b) =>
    a.gender.localeCompare(b.gender) ||
    b.age - a.age ||
    a.name.localeCompare(b.name)
  );

console.log(result);
