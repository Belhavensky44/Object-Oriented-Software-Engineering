const http = require('http');
const url = require('url');
const { getDistribution, toPercentage } = require('./Lab_1_module');

const HOST = 'localhost';
const PORT = 3000;

const defaultData = [100, 1000, 5000, 10000, 20000];

const onEvent = (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.write('=== Отчёт по испытаниям RANDOM ===\n');

    const parsedUrl = url.parse(req.url, true);
    const filename = parsedUrl.pathname.slice(1); 

    const checkValues = defaultData;
    const results = Array.from({ length: 10 }, () => new Array(checkValues.length));

    checkValues.forEach((amount, i) => {
        const numbers = getDistribution(amount);
        Object.keys(numbers).forEach(key => {
            let per = toPercentage(numbers[key], amount / 10);
            results[key][i] = per.toFixed(2);
        });
    });

    res.write('\nТаблица генерации случайных чисел\n');
    res.write('i\t' + checkValues.map(v => `N=${v}`).join('\t') + '\n');
    res.write('-'.repeat(60) + '\n');

    results.forEach((row, ind) => {
        const line = `${ind}\t` + row.map(val => val ?? '').join('\t');
        res.write(line + '\n');
    });

    res.end('\n=== Конец отчёта ===\n');
};

const server = http.createServer(onEvent);
server.listen(PORT, () => console.log(`Сервер запущен: http://${HOST}:${PORT}/`));
