// src/controllers/category.controller.js
const CategoryService = require('../services/category.service');

const getCategories = async (req, res) => {
    try {
        const categories = await CategoryService.getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error in getCategories:', error);
        res.status(500).json({ message: 'Внутрішня помилка сервера' });
    }
};

module.exports = {
    getCategories
};