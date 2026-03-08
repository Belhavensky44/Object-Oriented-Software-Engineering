const fs = require("fs");
const text = fs.readFileSync("Task_3.txt", "utf8");
const re = /[1-9A-F][0-9A-F]*/g;
const matches = text.match(re) || [];

let evenHex = [];

for (let m of matches) {
    
    let last = m[m.length - 1];
    
    if ("02468ACE".includes(last)) {
        evenHex.push(m);
    }
}

let maxLen = Math.max(...evenHex.map(x => x.length));

let longest = evenHex.filter(x => x.length === maxLen);

let maxNumber = longest.reduce((max, cur) => {
    return BigInt("0x" + cur) > BigInt("0x" + max) ? cur : max;
});

console.log(maxNumber);