// src/tests/auth.controller.test.js
const { login } = require('../controllers/auth.controller');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('Auth Controller Unit Tests', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        jest.clearAllMocks();
    });

    test('Має повертати статус 200 та згенерований токен при правильних даних', async() => {
        req.body = { username: 'team_lead', password: 'admin123' };
        const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

        jwt.sign.mockReturnValue(mockToken);

        await login(req, res);

        expect(jwt.sign).toHaveBeenCalledWith({ id: 1, username: 'team_lead' },
            expect.any(String), { expiresIn: '2h' }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(mockToken);
    });

    test('Має блокувати вхід (статус 401), якщо пароль неправильний', async() => {
        req.body = { username: 'team_lead', password: 'wrong_password' };

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith('Невірний логін або пароль.');
        expect(jwt.sign).not.toHaveBeenCalled();
    });

    test('Має блокувати вхід (статус 401), якщо користувач неправильний', async() => {
        req.body = { username: 'hacker', password: 'admin123' };

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith('Невірний логін або пароль.');
        expect(jwt.sign).not.toHaveBeenCalled();
    });
});