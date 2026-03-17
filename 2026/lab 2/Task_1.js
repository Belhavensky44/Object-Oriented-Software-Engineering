const fs = require("fs");

const data = fs.readFileSync("sem_02_labrab_01.csv", "utf8").trim();
const lines = data.split("\n");

lines.forEach((line, i) => {

    const nums = line.split(" ").map(Number);

    const allOdd = nums.every(n => n % 2 !== 0);

    const unique = new Set(nums).size === nums.length;

    const sorted = nums.toSorted((a,b)=>a-b);
    const ascending = nums.every((v,idx)=>v === sorted[idx]);

    if(allOdd && unique && ascending){
        console.log(i+1);
    }

});