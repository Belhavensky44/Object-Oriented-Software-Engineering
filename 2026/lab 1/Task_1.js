const user = "Иванов Иван Иванович";

// Нумерованные группы
const result1 = user.replace(/^([А-ЯЁ][а-яё-]+)\s+([А-ЯЁ][а-яё-]+)\s+[А-ЯЁ][а-яё-]+$/, "$2 $1");
console.log(result1);

// Именованные группы
const result2 = user.replace(
  /^(?<last>[А-ЯЁ][а-яё-]+)\s+(?<first>[А-ЯЁ][а-яё-]+)\s+[А-ЯЁ][а-яё-]+$/,
  "$<first> $<last>"
);
console.log(result2);