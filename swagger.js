const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library Management API",
      version: "1.0.0",
      description: "API Swagger Docu is here for the Library Management Api",
    },
    servers: [
      { url: "https://library-management-swart-one.vercel.app" } 
    ],
  components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token in format **Bearer &lt;token&gt;**",
        },
      },
    },
  },
  apis: ["./swagger-docs.js"], 
};

const swaggerSpec = swaggerJsDoc(options);
module.exports = swaggerSpec;