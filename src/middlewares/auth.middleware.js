// src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Доступ заборонено. Токен відсутній.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_key');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Недійсний або прострочений токен.' });
    }
};

module.exports = verifyToken;