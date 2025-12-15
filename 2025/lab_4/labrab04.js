const express = require('express');
const { HOST, PORT } = { HOST: 'localhost', PORT: 3000 };

const app = express();
app.use(express.static('css'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const head = `
<head>
    <meta charset="UTF-8">
    <title>Конвертер СС</title>
    <link rel="stylesheet" type="text/css" href="style.css" />
</head>`;

const formConverter = `
<form method="POST" action="/">
    <label>
        Число (10):
        <input type="text" name="inputNumber" required />
    </label>
    <br><br>
    <label>
        Основание СС (2–16):
        <input type="number" name="base" min="2" max="16" required />
    </label>
    <br><br>
    <button type="submit" class="btn-style">Перевести</button>
</form>`;

const getHtml = (result = '') => {
    return `
    <!DOCTYPE html>
    <html lang="ru">
        ${head}
        <body>
            ${formConverter}
            <br>
            <div id="output">${result}</div>
        </body>
    </html>`;
};

// POST
app.post('/', (req, res) => {
    const num = Number(req.body.inputNumber.trim());
    const base = Number(req.body.base);

    if (
        Number.isNaN(num) ||
        !Number.isInteger(num) ||
        num < 0 ||
        Number.isNaN(base) ||
        base < 2 ||
        base > 16
    ) {
        res.send(getHtml('Некорректные данные'));
        return;
    }

    const converted = num.toString(base).toUpperCase();
    const resultText = `${num}(10) → ${converted}(${base})`;

    res.send(getHtml(resultText));
});

// GET
app.get('/', (req, res) => {
    res.send(getHtml());
});

app.listen(PORT, HOST, () =>
    console.log(`http://${HOST}:${PORT}/`)
);
