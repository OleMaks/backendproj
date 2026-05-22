const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

/**
 * @swagger
 * /api/auth/login:
 *  post:
 *   summary: Отримати токен
 *   tags: [Auth]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       example: { "username": "team_lead", "password": "admin123" }
 *   responses:
 *    200:
 *     description: Ваш токен
 *     content:
 *      text/plain:
 *       schema:
 *        type: string
 */
router.post('/login', authController.login);

module.exports = router;