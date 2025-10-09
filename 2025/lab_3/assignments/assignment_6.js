const request = require('sync-request');

function task6(url) {
    let data = request('GET', url).getBody('utf8');
    let students = JSON.parse(data);

    students.sort((a, b) => {
        if (a.city === b.city) {
            return parseInt(b.rating) - parseInt(a.rating);
        }
        return a.city.localeCompare(b.city);
    });

    let maxCityLen = Math.max(...students.map(s => s.city.length));
    let maxNameLen = Math.max(...students.map(s => s.lastName.length));

    return students.map(s => 
        s.city.padEnd(maxCityLen + 2) + 
        s.lastName.padEnd(maxNameLen + 2) + 
        s.rating.toString().padStart(3)
    ).join('\n');
}
