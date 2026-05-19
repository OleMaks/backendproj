// src/controllers/transaction.controller.js

// Тимчасовий масив
const mockTransactions = [
    { id: 1, amount: 15000, type: 'income', category: 'Зарплата', date: '2026-05-18' },
    { id: 2, amount: 250, type: 'expense', category: 'Транспорт', date: '2026-05-19' }
];


const getTransactions = (req, res) => {
    res.status(200).json(mockTransactions);
};

const createTransaction = (req, res) => {
    const { amount, type, category, date } = req.body;

    if (!amount || !type || !category) {
        return res.status(400).json({ message: 'Будь ласка, заповніть усі обовʼязкові поля' });
    }

    const newTransaction = {
        id: mockTransactions.length + 1,
        amount,
        type, // 'income' 'expense'
        category,
        date: date || new Date().toISOString().split('T')[0]
    };

    mockTransactions.push(newTransaction);
    res.status(201).json(newTransaction);
};

module.exports = {
    getTransactions,
    createTransaction
};