// src/routes/report.routes.js
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const verifyToken = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { reportQuerySchema } = require('../validators/finance.validator');

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Отримати фінансовий звіт за певний період
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *         required: true
 *         description: Початкова дата (2026-01-01)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *         required: true
 *         description: Кінцева дата (2026-05-31)
 *     responses:
 *       '200':
 *         description: Успішно згенеровано звіт.
 *       '400':
 *         description: Відсутні обовʼязкові параметри дат.
 */
router.get('/', validate(reportQuerySchema, 'query'), verifyToken, reportController.getPeriodReport);

module.exports = router;