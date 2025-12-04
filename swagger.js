const swaggerUIExpress = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library Management API",
      version: "1.0.0",
      description: "API documentation for your Library Management system",
    },
    servers: [
      {
        url: "https://library-management-swart-one.vercel.app",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { 
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [], 
      },
    ],
  },
  apis: ["./swagger-docs.js", "./LibMan.js"], 
};

const swaggerSpec = swaggerJsDoc(options);

function setupSwagger(app) {
  app.use("/api-docs", swaggerUIExpress.serve, swaggerUIExpress.setup(swaggerSpec));
  console.log("✅ Swagger UI available at /api-docs");
}

module.exports = setupSwagger;