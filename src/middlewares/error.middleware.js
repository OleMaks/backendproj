// src/middlewares/error.middleware.js

const errorHandler = (err, req, res, next) => {
    console.error(`[SERVER ERROR]: ${err.message}`);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Внутрішня помилка сервера';

    res.status(statusCode).json({
        status: 'error',
        statusCode: statusCode,
        message: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = errorHandler;