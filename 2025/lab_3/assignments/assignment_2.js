const request = require('sync-request');

function task2(url) {
    let data = request('GET', url).getBody('utf8');
    let lines = data.trim().split('\n');
    let count = 0;

    lines.forEach(line => {
        let nums = line.trim().split(/\s+/).map(Number);
        if (nums.every(n => n % 2 !== 0)) count++;
    });

    return `Количество строк, в которых все числа нечётные: ${count}`;
}

module.exports = task2;
