
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
    res.status(200).json({ message: "Book updated successfully", updatedBook });
  } catch (err) {
    res.status(500).json({ message: "Server error while updating book" });
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
    res.status(200).json({ message: "Author updated successfully", updatedAuthor });
  } catch (err) {
     res.status(500).json({ message: "Server error while updating author" });
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

//BORROWERS

app.get('/api/v1/borrowers', async (req, res) => {
  try {
    const borrowers = await Borrower.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Borrowers retrieved successfully", borrowers });
  } catch (err) {
    res.status(500).json({ message: "Server error while retrieving borrowers" });
  }
});

app.post('/api/v1/borrowers', async (req, res) => {
  try {
    const { fullName, email } = req.body;
    if (!fullName || !email) {return res.status(400).json({ message: "Full name and email are required" });}
    const borrower = new Borrower(req.body);
    await borrower.save();
    res.status(201).json({ message: "Borrower created successfully", borrower });
  } catch (err) {
    res.status(500).json({ message: "Server error while creating borrower" });
  }
});

app.patch('/api/v1/borrowers/:borrowerId/borrow/:bookId', async (req, res) => {
  try {
    const { borrowerId, bookId } = req.params;

    const borrower = await Borrower.findById(borrowerId);
    if (!borrower) {
      return res.status(404).json({ message: "Borrower not registered" });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.isBorrowed) {
      return res.status(400).json({ message: "Book is already borrowed" });
    }


    book.isBorrowed = true;
    await book.save();


    borrower.borrowedBooks.push(book._id);
    await borrower.save();

    res.status(200).json({ message: "Book borrowed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error while borrowing book" });
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