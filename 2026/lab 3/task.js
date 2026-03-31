const fs = require("fs");

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

class Admin extends User {
    constructor(last, first, card) {
        super(last, first, card);
        this.role = "admin";
    }
}

class Library {
    #books = [];
    #users = [];

    constructor() {
        this.load();
    }

    load() {
        try {
            if (fs.existsSync("storage_books.json")) {
                const data = JSON.parse(fs.readFileSync("storage_books.json"));
                this.#books = data.map(Book.from);
            }

            if (fs.existsSync("storage_users.json")) {
                const data = JSON.parse(fs.readFileSync("storage_users.json"));
                this.#users = data.map(User.from);
            }
        } catch {
            throw new Error("Ошибка загрузки данных");
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
            return "Экземпляры книги увеличены";
        }

        const newBook = new Book(Date.now(), title, author, isbn, count);
        this.#books.push(newBook);

        this.save();
        return "Книга добавлена";
    }

    findBook(isbn) {
        const b = this.#books.find(x => x.isbn === isbn);
        if (!b) return "Книга не найдена";
        return b.info;
    }

    getAllBooks() {
        return this.#books.map(b => b.info);
    }

    removeBook(isbn) {
        this.#books = this.#books.filter(b => b.isbn !== isbn);
        this.save();
        return "Книга удалена";
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
        return "Пользователь удалён";
    }

    issueBook(isbn, card) {
        const book = this.#books.find(b => b.isbn === isbn);
        const user = this.#users.find(u => u.card === card);

        if (!book || !user) throw new Error("Нет книги или пользователя");

        book.give();
        user.borrow(book.info.id);

        this.save();
        return "Книга выдана";
    }

    returnBook(isbn, card) {
        const book = this.#books.find(b => b.isbn === isbn);
        const user = this.#users.find(u => u.card === card);

        if (!book || !user) throw new Error("Нет книги или пользователя");

        book.takeBack();
        user.giveBack(book.info.id);

        this.save();
        return "Книга возвращена";
    }
}

const lib = new Library();
const [, , cmd, ...args] = process.argv;

try {
    let result;

    switch (cmd) {
        case "addBook":
            result = lib.addBook(args[0], args[1], args[2], Number(args[3]));
            break;

        case "findBook":
            result = lib.findBook(args[0]);
            break;

        case "listBooks":
            result = lib.getAllBooks();
            break;

        case "addUser":
            result = lib.addUser(args[0], args[1], args[2]);
            break;

        case "listUsers":
            result = lib.getUsers();
            break;

        case "issue":
            result = lib.issueBook(args[0], args[1]);
            break;

        case "return":
            result = lib.returnBook(args[0], args[1]);
            break;

        case "deleteBook":
            result = lib.removeBook(args[0]);
            break;

        default:
            result = "Команды: addBook, findBook, listBooks, addUser, listUsers, issue, return";
    }

    console.log(result);

} catch (e) {
    console.log("Ошибка:", e.message);
}