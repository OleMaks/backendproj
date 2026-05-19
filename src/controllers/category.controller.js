const db = require('../config/db'); // Adjust path if your db.js is located elsewhere

const getAllCategories = async (req, res) => {
    try {
        // Fetch all categories from the database
        const [rows] = await db.execute('SELECT id, name FROM categories');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getAllCategories,
};