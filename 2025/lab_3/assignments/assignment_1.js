const request = require('sync-request');

function task1(url) {
    let data = request('GET', url).getBody('utf8');
    let numbers = data.split(/\s+/).map(Number).filter(n => !isNaN(n));
    let twoDigit = numbers.filter(n => n >= 10 && n <= 99);
    let maxTwoDigit = Math.max(...twoDigit);
    return `Самое большое двузначное число: ${maxTwoDigit}`;
}

module.exports = task1;
