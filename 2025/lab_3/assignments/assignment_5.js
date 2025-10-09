const request = require('sync-request');

function task5(url) {
    let data = request('GET', url).getBody('utf8');
    let lines = data.trim().split('\n');

    let pairs = lines.map(line => {
        let [ratingStr, lang] = line.split(';').map(x => x.trim());
        let rating = parseFloat(ratingStr.replace(',', '.').replace('%', ''));
        return { rating, lang };
    });

    pairs.sort((a, b) => b.rating - a.rating);

    return pairs.map(p => `${p.rating}\t${p.lang}`).join('\n');
}

module.exports = task5;
