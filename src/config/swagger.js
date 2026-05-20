// src/config/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Система управління фінансами API',
      version: '1.0.0',
      description: 'API для ведення обліку доходів та витрат з вбудованою авторизацією JWT',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Локальний сервер розробки'
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Введіть ваш JWT токен у форматі: eyJhbGciOi...',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/app.js'], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;