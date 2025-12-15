import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const URL = "https://ru.wikipedia.org/wiki/Премьер-лига_(Англия)";

async function parseTable() {
    try {
        const { data: html } = await axios.get(URL, {
            headers: { "User-Agent": "Mozilla/5.0" }
        });

        const $ = cheerio.load(html);
        const tableData = [];

        $("table.wikitable tbody tr").each((index, row) => {
            const cells = $(row).find("td");

            if (cells.length >= 8) {
                tableData.push({
                    place: $(cells[0]).text().trim(),
                    team: $(cells[1]).text().trim(),
                    matches: $(cells[2]).text().trim(),
                    wins: $(cells[3]).text().trim(),
                    points: $(cells[7]).text().trim()
                });
            }
        });

        return tableData;

    } catch (err) {
        console.error("Ошибка:", err.message);
        return [];
    }
}

function saveJSON(data) {
    fs.writeFileSync("table.json", JSON.stringify(data, null, 2), "utf-8");
    console.log("JSON сохранён");
}

function saveCSV(data) {
    const header = "Место,Команда,Матчи,Победы,Очки\n";
    const rows = data.map(r =>
        `${r.place},"${r.team}",${r.matches},${r.wins},${r.points}`
    ).join("\n");

    fs.writeFileSync("table.csv", header + rows, "utf-8");
    console.log("CSV сохранён");
}

async function main() {
    const data = await parseTable();
    console.log("Найдено команд:", data.length);

    saveJSON(data);
    saveCSV(data);
}

main();
