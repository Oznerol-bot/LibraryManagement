const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUIExpress = require("swagger-ui-express"); 

const swaggerSpec = swaggerJsDoc({
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Library Management API",
      version: "1.0.0",
      description: "API documentation for Library Management System",
    },
    servers: [
      {
        url: "https://library-management-swart-one.vercel.app/",
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
  apis: ["./swagger-docs.js"], // your endpoints definitions
});

function setupSwagger(app) {
  app.use("/api-docs", swaggerUIExpress.serve, swaggerUIExpress.setup(swaggerSpec));
  console.log("✅ Swagger UI is available at /api-docs");
}

module.exports = setupSwagger;
