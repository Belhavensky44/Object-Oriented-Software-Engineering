const fs = require("fs");

const html = fs.readFileSync("PogodaPerm.html", "utf8");

function extractDates(htmlText) {

    const result = [];

    const pattern = /(\d{2}\s+(?:января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря))[^А-Яа-я]*(Пн|Вт|Ср|Чт|Пт|Сб|Вс)/g;

    const matches = htmlText.matchAll(pattern);

    for (const item of matches) {
        result.push({
            date: item[1],
            weekday: item[2]
        });

        if (result.length === 7) break;
    }

    return result;
}

function extractSunTimes(htmlText) {

    const times = [];

    const sunrisePattern = /Восход[^0-9]*(\d{2}:\d{2})/g;
    const sunsetPattern = /Закат[^0-9]*(\d{2}:\d{2})/g;

    const sunriseMatches = [...htmlText.matchAll(sunrisePattern)];
    const sunsetMatches = [...htmlText.matchAll(sunsetPattern)];

    const count = Math.min(sunriseMatches.length, sunsetMatches.length, 7);

    for (let i = 0; i < count; i++) {
        times.push({
            sunrise: sunriseMatches[i][1],
            sunset: sunsetMatches[i][1]
        });
    }

    return times;
}

const dates = extractDates(html);
const sunTimes = extractSunTimes(html);

for (let i = 0; i < dates.length; i++) {

    console.log(
        dates[i].date + "  " +
        dates[i].weekday + "  " +
        "Восход: " + sunTimes[i].sunrise + "  " +
        "Закат: " + sunTimes[i].sunset
    );

}