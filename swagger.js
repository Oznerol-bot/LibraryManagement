const swaggerUIExpress = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");


const SWAGGER_VERSION = '4.1.3'; 

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library Management API",
      version: "1.0.0",
      description: "API SWAGGER for the LibMan API",
    },
    servers: [
      {
        url: "https://library-management-swart-one.vercel.app",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },

  apis: ["./swagger-docs.js", "./LibMan.js"],
};

const swaggerSpec = swaggerJsDoc(options);

const swaggerOptions = {
    customCssUrl: `https://cdn.jsdelivr.net/npm/swagger-ui-dist@latest/swagger-ui.css`,
    customJs: `https://cdn.jsdelivr.net/npm/swagger-ui-dist@latest/swagger-ui.js`
};

function setupSwagger(app) {

  app.use(
    "/api-docs",
    swaggerUIExpress.serve,
    swaggerUIExpress.setup(swaggerSpec, swaggerOptions)
  );
  console.log("✅ Swagger UI available at /api-docs");
}

module.exports = setupSwagger;
