const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json()); // для req.body


class Book {
    #id;
    #title;
    #author;
    #isbn;
    #total;
    #issued;

    constructor(id, title, author, isbn, count = 1) {
        if (!Book.checkISBN(isbn)) {
            throw new Error("Некорректный ISBN");
        }

        this.#id = id;
        this.#title = title;
        this.#author = author;
        this.#isbn = isbn;
        this.#total = count;
        this.#issued = 0;
    }

    static checkISBN(isbn) {
        return typeof isbn === "string" && isbn.length >= 5;
    }

    get isbn() { return this.#isbn; }
    get title() { return this.#title; }
    get author() { return this.#author; }

    get info() {
        return {
            id: this.#id,
            title: this.#title,
            author: this.#author,
            isbn: this.#isbn,
            total: this.#total,
            issued: this.#issued,
            available: this.#total - this.#issued
        };
    }

    add(count) {
        if (count <= 0) throw new Error("Количество должно быть > 0");
        this.#total += count;
    }

    give() {
        if (this.#total - this.#issued <= 0) {
            throw new Error("Нет доступных экземпляров");
        }
        this.#issued++;
    }

    takeBack() {
        if (this.#issued <= 0) {
            throw new Error("Нет выданных книг");
        }
        this.#issued--;
    }

    toJSON() {
        return {
            id: this.#id,
            title: this.#title,
            author: this.#author,
            isbn: this.#isbn,
            total: this.#total,
            issued: this.#issued
        };
    }

    static from(obj) {
        const b = new Book(obj.id, obj.title, obj.author, obj.isbn, obj.total);
        b.#issued = obj.issued;
        return b;
    }
}

class User {
    constructor(last, first, card) {
        this.last = last;
        this.first = first;
        this.card = card;
        this.taken = [];
    }

    get fullName() {
        return `${this.last} ${this.first}`;
    }

    borrow(bookId) {
        this.taken.push(bookId);
    }

    giveBack(bookId) {
        this.taken = this.taken.filter(id => id !== bookId);
    }

    toJSON() {
        return {
            last: this.last,
            first: this.first,
            card: this.card,
            taken: this.taken
        };
    }

    static from(obj) {
        const u = new User(obj.last, obj.first, obj.card);
        u.taken = obj.taken;
        return u;
    }
}

class Library {
    #books = [];
    #users = [];

    constructor() {
        this.load();
    }

    load() {
        if (fs.existsSync("storage_books.json")) {
            const data = JSON.parse(fs.readFileSync("storage_books.json"));
            this.#books = data.map(Book.from);
        }

        if (fs.existsSync("storage_users.json")) {
            const data = JSON.parse(fs.readFileSync("storage_users.json"));
            this.#users = data.map(User.from);
        }
    }

    save() {
        fs.writeFileSync("storage_books.json", JSON.stringify(this.#books.map(b => b.toJSON()), null, 2));
        fs.writeFileSync("storage_users.json", JSON.stringify(this.#users.map(u => u.toJSON()), null, 2));
    }

    addBook(title, author, isbn, count) {
        let book = this.#books.find(b => b.isbn === isbn);

        if (book) {
            book.add(count);
            this.save();
            return "Экземпляры увеличены";
        }

        const newBook = new Book(Date.now(), title, author, isbn, count);
        this.#books.push(newBook);

        this.save();
        return "Книга добавлена";
    }

    getAllBooks() {
        return this.#books.map(b => b.info);
    }

    findBook(isbn) {
        return this.#books.find(b => b.isbn === isbn)?.info || "Не найдена";
    }

    removeBook(isbn) {
        this.#books = this.#books.filter(b => b.isbn !== isbn);
        this.save();
        return "Удалена";
    }

    addUser(last, first, card) {
        this.#users.push(new User(last, first, card));
        this.save();
        return "Пользователь добавлен";
    }

    getUsers() {
        return this.#users.map(u => ({
            name: u.fullName,
            card: u.card,
            books: u.taken
        }));
    }

    removeUser(card) {
        this.#users = this.#users.filter(u => u.card !== card);
        this.save();
        return "Удалён";
    }

    issueBook(isbn, card) {
        const book = this.#books.find(b => b.isbn === isbn);
        const user = this.#users.find(u => u.card === card);

        if (!book || !user) throw new Error("Нет книги или пользователя");

        book.give();
        user.borrow(book.info.id);

        this.save();
        return "Выдана";
    }

    returnBook(isbn, card) {
        const book = this.#books.find(b => b.isbn === isbn);
        const user = this.#users.find(u => u.card === card);

        if (!book || !user) throw new Error("Нет книги или пользователя");

        book.takeBack();
        user.giveBack(book.info.id);

        this.save();
        return "Возвращена";
    }
}

const lib = new Library();


app.get("/books", (req, res) => {
    res.json(lib.getAllBooks());
});

app.get("/book", (req, res) => {
    res.json(lib.findBook(req.query.isbn));
});

app.get("/users", (req, res) => {
    res.json(lib.getUsers());
});


app.post("/book", (req, res) => {
    const { title, author, isbn, count } = req.body;
    res.json(lib.addBook(title, author, isbn, count));
});

app.post("/user", (req, res) => {
    const { last, first, card } = req.body;
    res.json(lib.addUser(last, first, card));
});


app.put("/issue", (req, res) => {
    const { isbn, card } = req.body;
    res.json(lib.issueBook(isbn, card));
});

app.put("/return", (req, res) => {
    const { isbn, card } = req.body;
    res.json(lib.returnBook(isbn, card));
});


app.delete("/book/:isbn", (req, res) => {
    res.json(lib.removeBook(req.params.isbn));
});

app.delete("/user/:card", (req, res) => {
    res.json(lib.removeUser(req.params.card));
});


app.listen(3000, () => {
    console.log("Сервер запущен: http://localhost:3000");
});