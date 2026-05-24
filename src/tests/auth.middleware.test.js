// src/tests/auth.middleware.test.js
const verifyToken = require('../middlewares/auth.middleware');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('Auth Middleware Unit Tests', () => {
    let req, res, next;

    beforeEach(() => {

        req = {
            headers: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    test('Має пропускати далі (викликати next), якщо токен валідний', () => {
        req.headers['authorization'] = 'Bearer valid_test_token';

        const mockUser = { id: 1, email: 'test@wireflow.com' };
        jwt.verify.mockReturnValue(mockUser);

        verifyToken(req, res, next);

        expect(req.user).toEqual(mockUser);
        expect(next).toHaveBeenCalledTimes(1);
    });

    test('Має блокувати доступ (статус 401), якщо токен відсутній', () => {
        req.headers['authorization'] = undefined;

        verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Доступ заборонено. Токен відсутній.' });
        expect(next).not.toHaveBeenCalled();
    });

    test('Має блокувати доступ (статус 403), якщо токен недійсний', () => {
        req.headers['authorization'] = 'Bearer invalid_token';

        jwt.verify.mockImplementation(() => {
            throw new Error('jwt expired');
        });

        verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Недійсний або прострочений токен.' });
        expect(next).not.toHaveBeenCalled();
    });
});