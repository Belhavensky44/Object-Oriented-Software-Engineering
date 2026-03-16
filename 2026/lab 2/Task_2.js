const fs = require("fs");

const data = fs.readFileSync("sem_02_labrab_01.csv", "utf8").trim();
const lines = data.split("\n");

lines.forEach((line, i) => {

    const nums = line.split(" ").map(Number);

    const count = {};

    for(const n of nums){
        count[n] = (count[n] || 0) + 1;
    }

    let triple = null;
    let others = [];

    for(const key in count){

        if(count[key] === 3){
            triple = Number(key);
        }

        if(count[key] === 1){
            others.push(Number(key));
        }

    }

    if(triple !== null && others.length === 3){

        const avg = others.reduce((a,b)=>a+b,0)/3;

        if(triple > avg){
            console.log(i+1, line);
        }

    }

});