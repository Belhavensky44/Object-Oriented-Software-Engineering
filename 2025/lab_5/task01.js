const users = require('./json/users.json');

const result = users
  .filter(u => Number(u.address.geo.lat) < 0)
  .map(u => ({
    username: u.username,
    city: u.address.city
  }))
  .sort((a, b) => b.city.localeCompare(a.city));

console.log(JSON.stringify(result, null, 4));
