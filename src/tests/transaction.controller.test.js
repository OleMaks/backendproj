// src/tests/transaction.controller.test.js
const { getTransactions, createTransaction } = require('../controllers/transaction.controller');
const TransactionService = require('../services/transaction.service');


jest.mock('../services/transaction.service');

describe('Transaction Controller Unit Tests', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();

        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('getTransactions', () => {
        test('Має повертати статус 200 та список транзакцій', async() => {
            const mockTransactions = [{ id: 1, amount: 100 }, { id: 2, amount: -50 }];
            TransactionService.getAllTransactions.mockResolvedValue(mockTransactions);

            await getTransactions(req, res);

            expect(TransactionService.getAllTransactions).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockTransactions);
        });

        test('Має повертати статус 500, якщо сталася помилка', async() => {
            TransactionService.getAllTransactions.mockRejectedValue(new Error('Помилка БД'));

            await getTransactions(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
        });
    });

    describe('createTransaction', () => {
        test('Має повертати статус 201 при успішному створенні', async() => {
            req.body = { amount: 500, type: 'income' };
            const mockCreatedTx = { id: 3, amount: 500, type: 'income' };

            TransactionService.createTransaction.mockResolvedValue(mockCreatedTx);

            await createTransaction(req, res);

            expect(TransactionService.createTransaction).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockCreatedTx);
        });

        test('Має повертати статус 400, якщо помилка повʼязана з категорією', async() => {
            req.body = { amount: 500, category: 'Невідома' };

            TransactionService.createTransaction.mockRejectedValue(new Error('Category not found in database'));

            await createTransaction(req, res);


            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Category not found in database' });
        });

        test('Має повертати статус 500 для всіх інших помилок', async() => {
            req.body = { amount: 500 };

            TransactionService.createTransaction.mockRejectedValue(new Error('Збій підключення'));

            await createTransaction(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
        });
    });
});