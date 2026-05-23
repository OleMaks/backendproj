const db = require('../config/db');

const getAllTransactions = async () => {
    const query = `
        SELECT 
            t.id, t.amount, t.type, c.name AS category, 
            DATE_FORMAT(t.date, '%Y-%m-%d') AS date 
        FROM transactions t
        JOIN categories c ON t.category_id = c.id
    `;
    const [rows] = await db.execute(query);
    return rows;
};

const createTransaction = async (data) => {
    const { amount, type, category, date } = data;

    const [categoryRows] = await db.execute('SELECT id FROM categories WHERE name = ?', [category]);
    
    if (categoryRows.length === 0) {
        throw new Error(`Category '${category}' not found`);
    }

    const categoryId = categoryRows[0].id;
    const transactionDate = date || new Date().toISOString().split('T')[0];

    const insertQuery = `
        INSERT INTO transactions (amount, type, category_id, date) 
        VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.execute(insertQuery, [amount, type, categoryId, transactionDate]);

    return {
        id: result.insertId,
        amount,
        type,
        category,
        date: transactionDate
    };
};

module.exports = {
    getAllTransactions,
    createTransaction
};