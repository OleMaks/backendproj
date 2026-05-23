// src/routes/transaction.routes.js
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const validate = require('../middlewares/validate.middleware');
const { createTransactionSchema } = require('../validators/finance.validator');

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Отримати список усіх доходів та витрат
 *     responses:
 *       200:
 *         description: Успішно отримано список транзакцій.
 *   post:
 *     summary: Додати нову фінансову операцію
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 500
 *               type:
 *                 type: string
 *                 example: expense
 *               category:
 *                 type: string
 *                 example: Продукти
 *               date:
 *                 type: string
 *                 example: 2026-05-17
 *     responses:
 *       201:
 *         description: Операцію успішно створено.
 *       400:
 *         description: Некоректні вхідні дані.
 */
router.get('/', transactionController.getTransactions);
router.post('/', validate(createTransactionSchema), transactionController.createTransaction);

module.exports = router;