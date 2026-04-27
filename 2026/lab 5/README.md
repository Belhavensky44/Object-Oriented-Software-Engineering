#  Library Management System 

Cерверное приложение для управления библиотекой книг, написанное на Node.js + Express.js.

---

##  Возможности

-  Добавление книг
-  Просмотр всех книг
-  Поиск книги по ISBN
-  Добавление пользователей
-  Выдача книг пользователям
-  Обновление книги
-  Удаление книги

---

##  API таблица запросов

| Метод | URL | Описание | 
|------|-----|----------|
| GET | http://localhost:3000/books | Получить все книги |
| GET | http://localhost:3000/books/:isbn | Получить книгу по ISBN | 
| GET | http://localhost:3000/users | Получить всех пользователей |
| GET | http://localhost:3000/books?title=&author= | Поиск книг по названию или автору |
| POST | http://localhost:3000/books | Добавить книгу |
| POST | http://localhost:3000/users | Добавить пользователя | 
| POST | http://localhost:3000/issue | Выдать книгу пользователю |
| PUT | http://localhost:3000/books/:isbn | Обновить книгу | 
| DELETE | http://localhost:3000/books/:isbn | Удалить книгу | 

---
## ⚙️ Установка и запуск

```bash
npm init -y
npm install express
node 5lab.js
