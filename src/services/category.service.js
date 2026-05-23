// src/services/category.service.js
const db = require('../config/db');

const getAllCategories = async () => {
    const [rows] = await db.execute('SELECT * FROM categories');
    return rows;
};

module.exports = {
    getAllCategories
};