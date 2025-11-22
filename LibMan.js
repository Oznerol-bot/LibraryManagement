
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

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
  year: Number
}, { timestamps: true });

const authorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
}, { timestamps: true });

const borrowerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contactNumber: String,
  borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);
const Author = mongoose.model('Author', authorSchema);
const Borrower = mongoose.model('Borrower', borrowerSchema);


// ====== Routes ======


app.get('/', (req, res) => {
  res.send('✅ Library Management is fully functional!');
});

//BOOKS
app.post('/api/v1/books', async (req, res) => {
  try {
    const { authorFirstName, authorLastName, ...bookData } = req.body;

    let author = await Author.findOne({
      firstName: authorFirstName,
      lastName: authorLastName
    });

    if (!author) {
      author = new Author({firstName: authorFirstName, lastName: authorLastName, books: []
      });
      await author.save();
    }

    const book = new Book({
      ...bookData,
      authorId: author._id
    });
    await book.save();
    author.books.push(book._id);
    await author.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/v1/books', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.get('/api/v1/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book is not registered in library' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.put('/api/v1/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ message: 'Book is not registered' });
    res.json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


app.delete('/api/v1/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book is not registered' });
    res.json({ message: 'Book registration deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    res.status(201).json(author);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/v1/authors', async (req, res) => {
  try {
    const authors = await Author.find().sort({ createdAt: -1 }); 
    res.json(authors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/v1/authors/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) return res.status(404).json({ message: 'Author not found' });
    res.json(author);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/v1/authors/:id', async (req, res) => {
  try {
    const author = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!author) return res.status(404).json({ message: 'Author not found' });
    res.json(author);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/v1/authors/:id', async (req, res) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);
    if (!author) return res.status(404).json({ message: 'Author not found' });
    res.json({ message: 'Author deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//BORROWERS

app.get('/api/v1/borrowers', async (req, res) => {
  try {
    const borrowers = await Borrower.find().sort({ createdAt: -1 });
    res.json(borrowers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/v1/borrowers', async (req, res) => {
  try {
    const borrower = new Borrower(req.body);
    await borrower.save();
    res.status(201).json(borrower);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post('/api/v1/borrowers/:borrowerId/borrow/:bookId', async (req, res) => {
  try {
    const { borrowerId, bookId } = req.params;

    const borrower = await Borrower.findById(borrowerId);
    if (!borrower) return res.status(404).json({ message: 'Borrower not registered' });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.isBorrowed) return res.status(400).json({ message: 'Book is already borrowed' });


    book.isBorrowed = true;
    await book.save();

    
    borrower.borrowedBooks.push(book._id);
    await borrower.save();

    res.json({ message: 'Book borrowed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch('/api/v1/borrowers/:borrowerId/return/:bookId', async (req, res) => {
  try {
    const { borrowerId, bookId } = req.params;

    const borrower = await Borrower.findById(borrowerId);
    if (!borrower) return res.status(404).json({ message: 'Borrower not found' });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (!book.isBorrowed) return res.status(400).json({ message: 'Book is not currently borrowed' });

 
    borrower.borrowedBooks = borrower.borrowedBooks.filter(
      bId => bId.toString() !== bookId
    );
    await borrower.save();


    book.isBorrowed = false;
    await book.save();

    res.json({ message: 'Book returned successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ====== Connect to MongoDB Atlas ======
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