// src/tests/validate.middleware.test.js
const validate = require('../middlewares/validate.middleware');

describe('Validate Middleware Unit Tests', () => {
    let req, res, next;
    let mockSchema;

    beforeEach(() => {
        req = {
            body: { name: 'Test Body' },
            query: { id: '123' }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();

        mockSchema = {
            validate: jest.fn()
        };
        jest.clearAllMocks();
    });

    test('Має пропускати далі (next), якщо валідація успішна (default source: body)', () => {

        mockSchema.validate.mockReturnValue({ error: undefined });

        const middleware = validate(mockSchema);
        middleware(req, res, next);

        expect(mockSchema.validate).toHaveBeenCalledWith(req.body, { abortEarly: false });
        expect(next).toHaveBeenCalledTimes(1);
    });

    test('Має пропускати далі (next), якщо валідація успішна для кастомного source (наприклад, query)', () => {
        mockSchema.validate.mockReturnValue({ error: undefined });

        const middleware = validate(mockSchema, 'query');
        middleware(req, res, next);

        expect(mockSchema.validate).toHaveBeenCalledWith(req.query, { abortEarly: false });
        expect(next).toHaveBeenCalledTimes(1);
    });

    test('Має повертати статус 400 і обʼєднані помилки, якщо валідація провалилася', () => {
        const mockError = {
            details: [
                { message: '"amount" є обовʼязковим' },
                { message: '"type" має бути рядком' }
            ]
        };
        mockSchema.validate.mockReturnValue({ error: mockError });

        const middleware = validate(mockSchema);
        middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Помилка валідації даних',
            details: '"amount" є обовʼязковим; "type" має бути рядком'
        });
        expect(next).not.toHaveBeenCalled();
    });
});