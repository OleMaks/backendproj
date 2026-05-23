const Joi = require('joi');

// Правила для створення транзакції
const createTransactionSchema = Joi.object({
    amount: Joi.number().positive().required().messages({
        'number.base': 'Сума має бути числом',
        'number.positive': 'Сума має бути більшою за нуль',
        'any.required': 'Поле "amount" є обовʼязковим'
    }),
    type: Joi.string().valid('income', 'expense').required().messages({
        'any.only': 'Тип має бути або "income", або "expense"',
        'any.required': 'Поле "type" є обовʼязковим'
    }),
    category: Joi.string().min(2).required().messages({
        'string.empty': 'Категорія не може бути порожньою',
        'string.min': 'Назва категорії має містити мінімум 2 символи',
        'any.required': 'Поле "category" є обовʼязковим'
    }),
    date: Joi.date().iso().optional().messages({
        'date.format': 'Дата має бути у форматі YYYY-MM-DD'
    })
});

// Правила для генерації звіту
const reportQuerySchema = Joi.object({
    from: Joi.date().iso().required().messages({
        'any.required': 'Параметр "from" є обовʼязковим',
        'date.format': 'Дата "from" має бути у форматі YYYY-MM-DD'
    }),
    to: Joi.date().iso().min(Joi.ref('from')).required().messages({
        'any.required': 'Параметр "to" є обовʼязковим',
        'date.min': 'Кінцева дата "to" не може бути раніше початкової "from"'
    })
});

module.exports = {
    createTransactionSchema,
    reportQuerySchema
};