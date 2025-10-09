const request = require('sync-request');

function task4(url) {
    let data = request('GET', url).getBody('utf8');
    let lines = data.trim().split('\n');

    let langs = lines.map(line => line.split(';')[1].trim());

    langs.sort((a, b) => a.localeCompare(b, 'en'));

    return langs.join('\n');
}

module.exports = task4;
