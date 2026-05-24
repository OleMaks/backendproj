const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Отримати список усіх категорій
 *     description: Повертає масив доступних категорій для доходів та витрат.
 *     responses:
 *       200:
 *         description: Успішне отримання списку категорій.
 */
router.get('/', categoryController.getCategories);

module.exports = router;