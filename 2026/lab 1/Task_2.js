let json = `
{ 
    "a": 1, 
    "b":   { "c": 2, "d": 3 }, 
    "e": 4, 
    "fff":{ "v": 10 } 
};
`;

const re = /"(\w+)"\s*:\s*({[^{}]*})/g;

const objectValues = [...json.matchAll(re)].map(m => m[2]);

const objectFields = [...json.matchAll(re)].map(m => m[1]);

const fieldObjectPairs = [...json.matchAll(re)].map(m => [m[1], m[2]]);

console.log(objectValues);
console.log(objectFields);
console.log(fieldObjectPairs);