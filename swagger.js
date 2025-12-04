const swaggerUIExpress = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const swaggerSpec = swaggerJsDoc({
  definition: {
    openapi: "3.0.0",
    info: { title: "Library API", version: "1.0.0" },
    servers: [{ url: "https://library-management-swart-one.vercel.app" }],
  },
  apis: ["./swagger-docs.js", "./LibMan.js"],
});

app.use("/api-docs", swaggerUIExpress.serve, swaggerUIExpress.setup(swaggerSpec));
