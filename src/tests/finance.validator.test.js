// src/tests/finance.validator.test.js
const { createTransactionSchema, reportQuerySchema } = require('../validators/finance.validator');

describe('Finance Validator Unit Tests', () => {

    describe('createTransactionSchema', () => {

        test('Має успішно пропускати ідеальні дані', () => {
            const validData = {
                amount: 1500.50,
                type: 'income',
                category: 'Фріланс',
                date: '2026-05-25'
            };
            const { error } = createTransactionSchema.validate(validData);
            expect(error).toBeUndefined();
        });

        test('Має успішно пропускати дані без необовʼязкової дати', () => {
            const validData = { amount: 100, type: 'expense', category: 'Кава' };
            const { error } = createTransactionSchema.validate(validData);
            expect(error).toBeUndefined();
        });

        test('Має блокувати відʼємну суму', () => {
            const invalidData = { amount: -500, type: 'expense', category: 'Оренда' };
            const { error } = createTransactionSchema.validate(invalidData);

            expect(error).toBeDefined();
            expect(error.details[0].message).toBe('Сума має бути більшою за нуль');
        });

        test('Має блокувати неправильний тип транзакції', () => {
            const invalidData = { amount: 1000, type: 'transfer', category: 'Переказ' };
            const { error } = createTransactionSchema.validate(invalidData);

            expect(error).toBeDefined();
            expect(error.details[0].message).toBe('Тип має бути або "income", або "expense"');
        });

        test('Має блокувати занадто коротку назву категорії', () => {
            const invalidData = { amount: 50, type: 'expense', category: 'А' };
            const { error } = createTransactionSchema.validate(invalidData);

            expect(error).toBeDefined();
            expect(error.details[0].message).toBe('Назва категорії має містити мінімум 2 символи');
        });
    });

    describe('reportQuerySchema', () => {

        test('Має успішно пропускати правильний діапазон дат', () => {
            const validData = { from: '2026-05-01', to: '2026-05-31' };
            const { error } = reportQuerySchema.validate(validData);
            expect(error).toBeUndefined();
        });

        test('Має блокувати запит, де кінцева дата раніше за початкову', () => {
            const invalidData = { from: '2026-05-31', to: '2026-05-01' };
            const { error } = reportQuerySchema.validate(invalidData);

            expect(error).toBeDefined();
            expect(error.details[0].message).toBe('Кінцева дата "to" не може бути раніше початкової "from"');
        });

        test('Має блокувати запит без обовʼязкових полів', () => {
            const invalidData = { from: '2026-05-01' }; // Забули передати "to"
            const { error } = reportQuerySchema.validate(invalidData);

            expect(error).toBeDefined();
            expect(error.details[0].message).toBe('Параметр "to" є обовʼязковим');
        });
    });
});