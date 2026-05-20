const db = require('../config/db'); // Adjust path if your db.js is located elsewhere

const getTransactions = async (req, res) => {
  try {
    // Retrieve transactions with their corresponding category names using a JOIN
    const query = `
            SELECT 
                t.id, 
                t.amount, 
                t.type, 
                c.name AS category, 
                DATE_FORMAT(t.date, '%Y-%m-%d') AS date 
            FROM transactions t
            JOIN categories c ON t.category_id = c.id
        `;
    const [rows] = await db.execute(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createTransaction = async (req, res) => {
  const { amount, type, category, date } = req.body;

  if (!amount || !type || !category) {
    return res.status(400).json({ message: 'Please fill in all required fields' });
  }

  try {
    // 1. Find category ID by its name to maintain relational integrity
    const [categoryRows] = await db.execute('SELECT id FROM categories WHERE name = ?', [category]);
        
    if (categoryRows.length === 0) {
      return res.status(400).json({ message: `Category '${category}' not found in the database` });
    }

    const categoryId = categoryRows[0].id;
    const transactionDate = date || new Date().toISOString().split('T')[0];

    // 2. Insert the new transaction into the database
    const insertQuery = `
            INSERT INTO transactions (amount, type, category_id, date) 
            VALUES (?, ?, ?, ?)
        `;
    const [result] = await db.execute(insertQuery, [amount, type, categoryId, transactionDate]);

    // 3. Construct the response object matching the Swagger schema
    const newTransaction = {
      id: result.insertId,
      amount,
      type,
      category,
      date: transactionDate
    };

    res.status(201).json(newTransaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getTransactions,
  createTransaction
};