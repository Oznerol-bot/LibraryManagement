/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - bookName
 *         - authorId
 *       properties:
 *         _id:
 *           type: string
 *           example: "64a1b2c3d4e5f67890123456"
 *         bookName:
 *           type: string
 *           example: "Harry Potter"
 *         authorId:
 *           type: string
 *           example: "64a1b2c3d4e5f67890123456"
 *         genre:
 *           type: string
 *           example: "Fantasy"
 *         year:
 *           type: integer
 *           example: 1997
 *         isBorrowed:
 *           type: boolean
 *           example: false
 *     Author:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *       properties:
 *         _id:
 *           type: string
 *           example: "64a1b2c3d4e5f67890123456"
 *         firstName:
 *           type: string
 *           example: "J.K."
 *         lastName:
 *           type: string
 *           example: "Rowling"
 *         books:
 *           type: array
 *           items:
 *             type: string
 *             example: "64a1b2c3d4e5f67890123456"
 *     Reader:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           example: "64a1b2c3d4e5f67890123456"
 *         fullName:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           example: "john@example.com"
 *         contactNumber:
 *           type: string
 *           example: "+1234567890"
 *         borrowedBooks:
 *           type: array
 *           items:
 *             type: string
 *             example: "64a1b2c3d4e5f67890123456"
 *
 * /api/v1/books:
 *   get:
 *     summary: Get all books
 *     responses:
 *       200:
 *         description: Books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 books:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *       500:
 *         description: Server error while retrieving books
 *
 *   post:
 *     summary: Create a new book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookName:
 *                 type: string
 *               authorFirstName:
 *                 type: string
 *               authorLastName:
 *                 type: string
 *               genre:
 *                 type: string
 *               year:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 book:
 *                   $ref: '#/components/schemas/Book'
 *       500:
 *         description: Server error while creating book
 *
 * /api/v1/books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 book:
 *                   $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error while retrieving book
 *
 *   put:
 *     summary: Update a book by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookName:
 *                 type: string
 *               genre:
 *                 type: string
 *               year:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error while updating book
 *
 *   delete:
 *     summary: Delete a book by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error while deleting book
 *
 * /api/v1/authors:
 *   get:
 *     summary: Get all authors
 *     responses:
 *       200:
 *         description: Authors retrieved successfully
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Create a new author
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Author created successfully
 *       400:
 *         description: Author already exists
 *       500:
 *         description: Server error
 *
 * /api/v1/authors/{id}:
 *   get:
 *     summary: Get author by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Author retrieved successfully
 *       404:
 *         description: Author not found
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update author by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Author updated successfully
 *       404:
 *         description: Author not found
 *       500:
 *         description: Server error
 *
 *   delete:
 *     summary: Delete author by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Author deleted successfully
 *       404:
 *         description: Author not found
 *       500:
 *         description: Server error
 *
 * /api/v1/readers/signup:
 *   post:
 *     summary: Reader signup
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               contactNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reader registered successfully
 *       400:
 *         description: Email already registered
 *       500:
 *         description: Server error
 *
 * /api/v1/readers/login:
 *   post:
 *     summary: Reader login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Incorrect password
 *       404:
 *         description: Reader not found
 *       500:
 *         description: Server error
 *
 * /api/v1/readers/{readerId}/borrow/{bookId}:
 *   post:
 *     summary: Borrow a book (Readers only)
 *     description: Borrow a book by providing readerId and bookId. JWT auth required.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: readerId
 *         schema:
 *           type: string
 *         required: true
 *         description: Reader ID
 *       - in: path
 *         name: bookId
 *         schema:
 *           type: string
 *         required: true
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book borrowed successfully
 *       400:
 *         description: Book is already borrowed or invalid request
 *       401:
 *         description: Authorization header missing or invalid token
 *       403:
 *         description: Access denied: Readers only
 *       404:
 *         description: Reader or Book not found
 *       500:
 *         description: Server error
 *
 * /api/v1/readers/{readerId}/return/{bookId}:
 *   patch:
 *     summary: Return a book (Readers only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: readerId
 *         schema:
 *           type: string
 *         required: true
 *         description: Reader ID
 *       - in: path
 *         name: bookId
 *         schema:
 *           type: string
 *         required: true
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book returned successfully
 *       400:
 *         description: Book is not currently borrowed or reader did not borrow this book
 *       401:
 *         description: Authorization header missing or invalid token
 *       403:
 *         description: You cannot return a book for another reader
 *       404:
 *         description: Reader or Book not found
 *       500:
 *         description: Server error
 */
