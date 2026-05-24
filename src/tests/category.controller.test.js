// src/tests/category.controller.test.js
const { getCategories } = require('../controllers/category.controller');
const CategoryService = require('../services/category.service');

jest.mock('../services/category.service');

describe('Category Controller Unit Tests', () => {
    let req, res;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    test('getCategories має повертати статус 200 та масив категорій', async() => {
        const mockCategories = [{ id: 1, name: 'Продукти' }, { id: 2, name: 'Транспорт' }];
        CategoryService.getAllCategories.mockResolvedValue(mockCategories);

        await getCategories(req, res);

        expect(CategoryService.getAllCategories).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockCategories);
    });

    test('getCategories має повертати статус 500, якщо сервіс впав', async() => {
        CategoryService.getAllCategories.mockRejectedValue(new Error('Помилка БД'));

        await getCategories(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Внутрішня помилка сервера' });
    });
});