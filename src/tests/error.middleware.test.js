// src/tests/error.middleware.test.js
const errorHandler = require('../middlewares/error.middleware');

describe('Error Middleware Unit Tests', () => {
    let req, res, next;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();

        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('Має обробляти кастомні помилки з переданим статусом 404', () => {
        const customError = new Error('Користувача не знайдено');
        customError.statusCode = 404;

        errorHandler(customError, req, res, next);

        expect(console.error).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            status: 'error',
            statusCode: 404,
            message: 'Користувача не знайдено'
        }));
    });

    test('Має повертати статус 500 за замовчуванням для невідомих помилок', () => {
        const unknownError = new Error();

        errorHandler(unknownError, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            statusCode: 500,
            message: 'Внутрішня помилка сервера'
        }));
    });

    test('Має показувати stack trace у режимі development', () => {
        process.env.NODE_ENV = 'development';
        const error = new Error('Тестова помилка');
        error.stack = 'Довгий текст стеку викликів...';

        errorHandler(error, req, res, next);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            stack: 'Довгий текст стеку викликів...'
        }));
    });

    test('НЕ має показувати stack trace у режимі production', () => {
        process.env.NODE_ENV = 'production';
        const error = new Error('Тестова помилка');
        error.stack = 'Довгий текст стеку викликів...';

        errorHandler(error, req, res, next);

        const jsonResponse = res.json.mock.calls[0][0];
        expect(jsonResponse.stack).toBeUndefined();
    });
});