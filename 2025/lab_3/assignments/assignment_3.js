const request = require('sync-request');

function task3(url) {
    let data = request('GET', url).getBody('utf8');
    let lines = data.trim().split('\n');

    let maxSum = -Infinity;
    let maxIndex = -1;

    lines.forEach((line, i) => {
        let nums = line.trim().split(/\s+/).map(Number);
        let sumOdd = nums.filter(n => n % 2 !== 0).reduce((a, b) => a + b, 0);
        if (sumOdd > maxSum) {
            maxSum = sumOdd;
            maxIndex = i;
        }
    });

    return `Индекс строки с наибольшей суммой нечётных чисел: ${maxIndex}`;
}

module.exports = task3;
