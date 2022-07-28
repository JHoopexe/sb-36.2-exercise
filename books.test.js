process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("./app");
const Book = require("./models/book");

const book = {
    "isbn": "0691161518",
    "amazon_url": "http://a.co/eobPtX2",
    "author": "Matthew Lane",
    "language": "english",
    "pages": 264,
    "publisher": "Princeton University Press",
    "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
    "year": 2017
}

beforeEach(async () => {
    await Book.create(book);
});

afterEach(async () => {
    await Book.remove(book["isbn"]);
});

describe("GET /", () => {
    test("Gets a list of books", async () => {
        const resp = await request(app).get('/books');
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({"books": [book]});
    });
});

describe("GET /:id", () => {
    test("Gets a single book", async () => {
        const resp = await request(app).get(`/books/${book["isbn"]}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({book});
    });

    test("Responds with 404 if book not found", async () => {
        const resp = await request(app).get(`/books/abc`);
        expect(resp.statusCode).toBe(404);
    });
});

describe("POST /", () => {
    test("Creates a book", async () => {
        const resp = await request(app)
        .post("/books")
        .send({
            "isbn": "Test",
            "amazon_url": "http://google.com",
            "author": "John Doe",
            "language": "English",
            "pages": 100,
            "publisher": "JohnDoePub",
            "title": "Testing DB",
            "year": 2022
        });
        expect(resp.statusCode).toEqual(201);
    });

    test("Responds with 400 if incomplete data is sent", async () => {
        const resp = await request(app)
        .post("/books")
        .send({
            "isbn": "Test",
            "amazon_url": "http://google.com",
            "author": "John Doe",
            "language": "English",
        });
        expect(resp.statusCode).toEqual(400);
    });
});

describe("PUT /:isbn", () => {
    test("Updates a book", async () => {
        const resp = await request(app)
        .put('/books/Test')
        .send({
			"isbn": "Test",
			"amazon_url": "http://google.com",
			"author": "Jane Doe",
			"language": "English",
			"pages": 100,
			"publisher": "JohnDoePub",
			"title": "Testing DB",
			"year": 2022
		});
        expect(resp.statusCode).toBe(200);
    });

    test("Responds with 400 if incomplete data is sent", async () => {
        const resp = await request(app)
        .put("/books/Test")
        .send({
            "isbn": "Test",
            "amazon_url": "http://google.com",
            "author": "John Doe",
            "language": "English",
        });
        expect(resp.statusCode).toEqual(400);
    });
});

describe("DELETE /:isbn", () => {
    test("Deletes a single book", async () => {
        const resp = await request(app).delete(`/books/Test`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({message: "Book Deleted"});
    });

    test("Responds with 404 if book not found", async () => {
        const resp = await request(app).delete(`/books/abc`);
        expect(resp.statusCode).toBe(404);
    });
});
