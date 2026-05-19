// src/controllers/category.controller.js

const mockCategories = [
    { id: 1, name: 'Продукти' },
    { id: 2, name: 'Комунальні послуги' },
    { id: 3, name: 'Транспорт' },
    { id: 4, name: 'Зарплата' }
];

const getAllCategories = (req, res) => {
    // после бд подключить
    // const categories = await CategoryService.getAll();

    res.status(200).json(mockCategories);
};

module.exports = {
    getAllCategories,
};