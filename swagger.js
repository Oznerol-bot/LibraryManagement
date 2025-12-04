const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Library Management API",
    version: "1.0.0",
    description: "API SWAGGER documentation for Library Management API",
  },
  servers: [
    {
      url: "https://library-management-swart-one.vercel.app",
      description: "Production Server",
    },
    {
      url: "http://localhost:3000",
      description: "Local Development",
    }
  ],

  // 🔐 SECURITY SECTION
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT token in the format: Bearer <token>",
      }
    },

    schemas: {
      Book: {
        type: "object",
        properties: {
          bookName: { type: "string" },
          genre: { type: "string" },
          year: { type: "number" },
          authorFirstName: { type: "string" },
          authorLastName: { type: "string" }
        }
      },

      Author: {
        type: "object",
        properties: {
          firstName: { type: "string" },
          lastName: { type: "string" }
        }
      },

      Reader: {
        type: "object",
        properties: {
          fullName: { type: "string" },
          email: { type: "string" },
          password: { type: "string" },
          contactNumber: { type: "string" }
        }
      },

      AuthResponse: {
        type: "object",
        properties: {
          token: { type: "string" }
        }
      }
    }
  },

  tags: [
    { name: "Books" },
    { name: "Authors" },
    { name: "Readers" },
    { name: "Borrow" }
  ],

  paths: {
    // BOOK ROUTES ----------
    "/api/v1/books": {
      post: {
        tags: ["Books"],
        summary: "Create a new book",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/Book" } }
          }
        },
        responses: { 201: { description: "Book created successfully" } }
      },
      get: {
        tags: ["Books"],
        summary: "Get all books",
        responses: { 200: { description: "List of books" } }
      }
    },

    "/api/v1/books/{id}": {
      get: {
        tags: ["Books"],
        summary: "Get a single book",
        parameters: [{ name: "id", in: "path", required: true }],
        responses: { 200: { description: "Book found" } }
      },
      put: {
        tags: ["Books"],
        summary: "Update a book",
        parameters: [{ name: "id", in: "path", required: true }],
        requestBody: {
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/Book" } }
          }
        },
        responses: { 200: { description: "Book updated" } }
      },
      delete: {
        tags: ["Books"],
        summary: "Delete a book",
        parameters: [{ name: "id", in: "path", required: true }],
        responses: { 200: { description: "Book deleted" } }
      }
    },

    // AUTHOR ROUTES ----------
    "/api/v1/authors": {
      post: {
        tags: ["Authors"],
        summary: "Create an author",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/Author" } }
          }
        },
        responses: { 201: { description: "Author created" } }
      },
      get: {
        tags: ["Authors"],
        summary: "Get all authors",
        responses: { 200: { description: "List of authors" } }
      }
    },

    "/api/v1/authors/{id}": {
      get: {
        tags: ["Authors"],
        summary: "Get a single author",
        parameters: [{ name: "id", in: "path", required: true }],
        responses: { 200: { description: "Author found" } }
      },
      put: {
        tags: ["Authors"],
        summary: "Update an author",
        parameters: [{ name: "id", in: "path", required: true }],
        requestBody: {
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/Author" } }
          }
        },
        responses: { 200: { description: "Author updated" } }
      },
      delete: {
        tags: ["Authors"],
        summary: "Delete an author",
        parameters: [{ name: "id", in: "path", required: true }],
        responses: { 200: { description: "Author deleted" } }
      }
    },

    // READER AUTH ----------
    "/api/v1/readers/signup": {
      post: {
        tags: ["Readers"],
        summary: "Signup a new reader",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/Reader" } }
          }
        },
        responses: { 201: { description: "Reader registered" } }
      }
    },

    "/api/v1/readers/login": {
      post: {
        tags: ["Readers"],
        summary: "Login a reader",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  password: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Login successful",
            schema: { $ref: "#/components/schemas/AuthResponse" }
          }
        }
      }
    },

    "/api/v1/readers": {
      get: {
        tags: ["Readers"],
        summary: "Get all readers",
        responses: { 200: { description: "List of readers" } }
      }
    },

    // BORROW ----------
    "/api/v1/readers/{readerId}/borrow/{bookId}": {
      post: {
        tags: ["Borrow"],
        summary: "Borrow a book (requires JWT)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "readerId", in: "path", required: true },
          { name: "bookId", in: "path", required: true }
        ],
        responses: { 200: { description: "Book borrowed" } }
      }
    },

    // RETURN ----------
    "/api/v1/readers/{readerId}/return/{bookId}": {
      patch: {
        tags: ["Borrow"],
        summary: "Return a book (requires JWT)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "readerId", in: "path", required: true },
          { name: "bookId", in: "path", required: true }
        ],
        responses: { 200: { description: "Book returned" } }
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: []
};

const swaggerSpec = swaggerJsDoc(options);

function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
