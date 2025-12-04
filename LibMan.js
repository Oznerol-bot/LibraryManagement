require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// ====== Middleware ======
app.use(cors());
app.use(express.json());

// ====== Mongoose Schema & Model ======
const bookSchema = new mongoose.Schema({
  bookName: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "Author", required: true },
  genre: String,
  year: Number,
  isBorrowed: { type: Boolean, default: false }
}, { timestamps: true });

const authorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
}, { timestamps: true });

const readerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contactNumber: String,
  borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);
const Author = mongoose.model('Author', authorSchema);
const Reader = mongoose.model('Reader', readerSchema);

// AUTHORIZATION MIDDLEWARE
function authReader(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "Authorization header required" });

    const token = authHeader.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "Token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "reader")
      return res.status(403).json({ message: "Access denied: Readers only" });

    req.reader = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}


app.get('/', (req, res) => {
  res.send('✅ Library Management is fully functional!');
});

//BOOKS
app.post('/api/v1/books', async (req, res) => {
  try {
    const { authorFirstName, authorLastName, ...bookData } = req.body;

    let author = await Author.findOne({ firstName: authorFirstName, lastName: authorLastName });

    if (!author) {
      author = new Author({ firstName: authorFirstName, lastName: authorLastName, books: [] });
      await author.save();
    }

    const book = new Book({ ...bookData, authorId: author._id });
    await book.save();
    author.books.push(book._id);
    await author.save();
    res.status(201).json({ message: "Book created successfully", book });
  } catch (err) {
    res.status(500).json({ message: "Server error while creating book" });
  }
});

app.get('/api/v1/books', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Books retrieved successfully", books });
  } catch (err) {
    res.status(500).json({ message: "Server error while retrieving books" });
  }
});

app.get('/api/v1/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book is not registered in library' });
    res.status(200).json({ message: "Book retrieved successfully", book });
  } catch (err) {
    res.status(500).json({ message: "Server error while retrieving book" });
  }
});

app.put('/api/v1/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ message: 'Book is not registered' });
    res.status(200).json({ message: "Book updated successfully", book });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/v1/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book is not registered' });
    res.status(200).json({ message: 'Book registration deleted' });
  } catch (err) {
    res.status(500).json({ message: "Server error while deleting book" });
  }
});

//AUTHORS
app.post("/api/v1/authors", async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    const regAuthor = await Author.findOne({ firstName, lastName });
    if (regAuthor) return res.status(400).json({ message: "Author already registered" });

    const author = new Author({ firstName, lastName, books: [] });
    await author.save();
    res.status(201).json({ message: "Author created successfully", author });
  } catch (err) {
    res.status(500).json({ message: "Server error while creating author" });
  }
});

app.get('/api/v1/authors', async (req, res) => {
  try {
    const authors = await Author.find().sort({ createdAt: -1 }); 
    res.status(200).json({ message: "Authors retrieved successfully", authors });
  } catch (err) {
    res.status(500).json({ message: "Server error while retrieving authors" });
  }
});

app.get('/api/v1/authors/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) return res.status(404).json({ message: 'Author not found' });
    res.status(200).json({ message: "Author retrieved successfully", author });
  } catch (err) {
    res.status(500).json({ message: "Server error while retrieving author" });
  }
});

app.put('/api/v1/authors/:id', async (req, res) => {
  try {
    const author = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!author) return res.status(404).json({ message: 'Author not found' });
    res.status(200).json({ message: "Author updated successfully", author });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/v1/authors/:id', async (req, res) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);
    if (!author) return res.status(404).json({ message: 'Author not found' });
    res.status(200).json({ message: 'Author deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: "Server error while deleting author" });
  }
});

//READERS
app.post('/api/v1/readers/signup', async (req, res) => {
  try {
    const { fullName, email, password, contactNumber } = req.body;
    const exists = await Reader.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const reader = new Reader({ fullName, email, password: hashedPassword, contactNumber, borrowedBooks: [] });
    await reader.save();

    const token = jwt.sign({ id: reader._id, role: "reader" }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ message: "Reader registered successfully", reader, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/v1/readers/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const reader = await Reader.findOne({ email });
    if (!reader) return res.status(404).json({ message: "Reader not found" });

    const valid = await bcrypt.compare(password, reader.password);
    if (!valid) return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: reader._id, role: "reader" }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({ message: "Login successful", reader, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/v1/readers', async (req, res) => {
  try {
    const readers = await Reader.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Readers retrieved successfully", readers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/v1/readers/:readerId/borrow/:bookId', authReader, async (req, res) => {
  try {
    const { readerId, bookId } = req.params;
    if (req.reader.id !== readerId) return res.status(403).json({ message: 'You are not allowed to perform this action' });

    const reader = await Reader.findById(readerId);
    if (!reader) return res.status(404).json({ message: 'Reader not found' });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.isBorrowed) return res.status(400).json({ message: 'Book is already borrowed' });

    book.isBorrowed = true;
    await book.save();
    reader.borrowedBooks.push(book._id);
    await reader.save();
    res.status(200).json({ message: 'Book borrowed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch('/api/v1/readers/:readerId/return/:bookId', authReader, async (req, res) => {
  try {
    const { readerId, bookId } = req.params;
    if (req.reader.id !== readerId) return res.status(403).json({ message: 'You cannot return a book for another reader' });

    const reader = await Reader.findById(readerId);
    if (!reader) return res.status(404).json({ message: 'Reader not found' });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (!book.isBorrowed) return res.status(400).json({ message: 'Book is not currently borrowed' });

    if (!reader.borrowedBooks.includes(bookId)) return res.status(400).json({ message: 'Reader did not borrow this book' });

    reader.borrowedBooks = reader.borrowedBooks.filter(bId => bId.toString() !== bookId);
    await reader.save();

    book.isBorrowed = false;
    await book.save();
    res.status(200).json({ message: 'Book returned successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ====== Start Server ======

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atglas');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('❌ Failed to connect:', err.message);
  }
}

startServer();
