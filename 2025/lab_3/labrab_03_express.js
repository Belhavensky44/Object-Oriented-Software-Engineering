const express = require('express'); 
const { get_lines_from_url } = require('./utils');
const [ HOST, PORT ] = [ 'localhost', 5432];

const urls = [
    'http://pcoding-ru.1gb.ru/txt/labrab04-1.txt',
    'http://pcoding-ru.1gb.ru/txt/labrab04-2.txt',
    'http://pcoding-ru.1gb.ru/txt/labrab04-3.txt',
    'http://pcoding-ru.1gb.ru/txt/labrab04-666.txt'
];

const task1 = require('./assignments/assignment_1');
const task2 = require('./assignments/assignment_2');
const task3 = require('./assignments/assignment_3');
const task4 = require('./assignments/assignment_4');
const task5 = require('./assignments/assignment_5');
const task6 = require('./assignments/assignment_6');


const app = express();
app.use(express.static('public'));

app.get('/:index', (req, res) => {
    res.set('Content-Type', 'text/plain; charset=utf-8');
    try {
        const index = parseInt(req.params.index);
        let result;

        switch (index) {
            case 1: result = task1(urls[0]); break;
            case 2: result = task2(urls[1]); break;
            case 3: result = task3(urls[1]); break;
            case 4: result = task4(urls[2]); break;
            case 5: result = task5(urls[2]); break;
            case 6: result = task6('http://pcoding-ru.1gb.ru/json/abiturs.json'); break;

            
            default: result = 'Нет такого задания';
        }

        res.status(200).send(result);
    } catch (error) {
        res.status(500).send('Ошибка обработки файла');
    }
});

app.get('/', (req, res) => res.send('app'));

app.listen(PORT, () => console.log(`http://${HOST}:${PORT}/`));
