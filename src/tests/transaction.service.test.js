// src/tests/transaction.service.test.js
const TransactionService = require('../services/transaction.service');
const db = require('../config/db');


jest.mock('../config/db', () => ({
    execute: jest.fn()
}));

describe('Transaction Service Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllTransactions', () => {
        test('Має повертати список транзакцій з БД', async() => {
            const mockRows = [
                { id: 1, amount: 1500, type: 'income', category: 'Фріланс', date: '2026-05-25' }
            ];
            db.execute.mockResolvedValueOnce([mockRows]);

            const result = await TransactionService.getAllTransactions();

            expect(db.execute).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockRows);
        });
    });

    describe('createTransaction', () => {
        test('Має успішно створювати транзакцію, якщо категорія існує', async() => {
            const mockData = { amount: 500, type: 'expense', category: 'Продукти', date: '2026-05-24' };

            db.execute.mockResolvedValueOnce([
                [{ id: 3 }]
            ]);

            db.execute.mockResolvedValueOnce([{ insertId: 10 }]);

            const result = await TransactionService.createTransaction(mockData);

            expect(db.execute).toHaveBeenCalledTimes(2);
            expect(result).toEqual({
                id: 10,
                amount: 500,
                type: 'expense',
                category: 'Продукти',
                date: '2026-05-24'
            });
        });

        test('Має автоматично підставляти поточну дату, якщо вона не передана', async() => {
            const mockData = { amount: 200, type: 'expense', category: 'Кава' };

            db.execute.mockResolvedValueOnce([
                [{ id: 2 }]
            ]);
            db.execute.mockResolvedValueOnce([{ insertId: 11 }]);

            const result = await TransactionService.createTransaction(mockData);

            const todayDate = new Date().toISOString().split('T')[0];
            expect(result.date).toBe(todayDate);
        });

        test('Має викидати помилку і блокувати створення, якщо категорія не знайдена', async() => {
            const mockData = { amount: 100, type: 'expense', category: 'НевідомаКатегорія' };

            db.execute.mockResolvedValueOnce([
                []
            ]);

            await expect(TransactionService.createTransaction(mockData))
                .rejects.toThrow("Category 'НевідомаКатегорія' not found");

            expect(db.execute).toHaveBeenCalledTimes(1);
        });
    });
});