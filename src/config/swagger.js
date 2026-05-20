// src/config/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Система управління фінансами API',
    version: '1.0.0',
    description: 'Документація API для ведення обліку доходів та витрат',
  },
  servers: [{
    url: 'http://localhost:3000',
    description: 'Локальний сервер розробки',
  }, ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;