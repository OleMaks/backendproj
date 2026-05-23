const TransactionService = require('../services/transaction.service');

const getTransactions = async (req, res) => {
    try {
        const transactions = await TransactionService.getAllTransactions();
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error in getTransactions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const createTransaction = async (req, res) => {
    try {
        const newTransaction = await TransactionService.createTransaction(req.body);
        res.status(201).json(newTransaction);
    } catch (error) {
        console.error('Error in createTransaction:', error);
        
        if (error.message.includes('Category')) {
            return res.status(400).json({ message: error.message });
        }
        
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getTransactions,
    createTransaction
};