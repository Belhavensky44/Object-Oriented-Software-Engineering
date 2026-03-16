const fs = require("fs");

const data = fs.readFileSync("sem_02_labrab_01.csv", "utf8").trim();
const lines = data.split("\n");

lines.forEach((line, i) => {

    const nums = line.trim().split(/\s+/).map(Number);

    const map = new Map();

    nums.forEach(n => map.set(n, (map.get(n) || 0) + 1));

    const repeated = [];
    const single = [];

    for (const [num, count] of map) {
        if (count === 2) repeated.push(num);
        if (count === 1) single.push(num);
    }

    if (repeated.length === 2 && single.length === 2) {

        const sumRepeated = repeated[0] + repeated[1];
        const sumSingle = single[0] + single[1];

        if (sumRepeated < sumSingle) {
            console.log(i + 1, line);
        }

    }

});