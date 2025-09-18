const { getDistribution, toPercentage } = require('./module.js');

const checkValues = [10**2, 10**4, 10**6, 10**8];

const results = Array.from(
    { length: 10 },
    () => new Array(checkValues.length)
);

console.log('i\t\t10**2\t\t10**4\t\t10**6\t\t10**8');

checkValues.forEach((amount, i) => {
    const numbers = getDistribution(amount);
    Object.keys(numbers).forEach(key => {
        let per = toPercentage(numbers[key], amount/10);
        results[key][i] = per.toFixed(2);
    });
});

results.forEach((elm, ind) => {
    console.log(`${ind}\t\t${elm.join('\t\t')}`);
});
