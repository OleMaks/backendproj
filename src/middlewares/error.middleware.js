// src/middlewares/error.middleware.js

const errorHandler = (err, req, res, next) => {

    console.error('[SERVER ERROR]:', err.message);


    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        status: 'error',
        statusCode: statusCode,
        message: err.message || 'Внутрішня помилка сервера'
    });
};

module.exports = errorHandler;