const request = require('sync-request');

function get_lines_from_url(url) {
    let data = request('GET', url).getBody('utf8');
    return data.split('\n').map(line => line.trim()).filter(line => line.length > 0);
}

module.exports = { get_lines_from_url };
