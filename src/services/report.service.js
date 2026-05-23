const db = require('../config/db');

/**
 * Сервіс для генерації фінансового звіту за період
 * @param {string} from - Початкова дата (YYYY-MM-DD)
 * @param {string} to - Кінцева дата (YYYY-MM-DD)
 * @returns {Promise<Object>} Обʼєкт готового звіту
 */
const generatePeriodReport = async (from, to) => {
    const totalsQuery = `
        SELECT 
            COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS totalIncome,
            COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS totalExpenses
        FROM transactions
        WHERE date >= ? AND date <= ?
    `;
    const [totalsResult] = await db.execute(totalsQuery, [from, to]);
    
    const totalIncome = Number(totalsResult[0].totalIncome);
    const totalExpenses = Number(totalsResult[0].totalExpenses);
    const netSavings = totalIncome - totalExpenses;

    const categoriesQuery = `
        SELECT 
            c.name AS category, 
            SUM(t.amount) AS amount
        FROM transactions t
        JOIN categories c ON t.category_id = c.id
        WHERE t.type = 'expense' AND t.date >= ? AND t.date <= ?
        GROUP BY c.name
    `;
    const [categoriesResult] = await db.execute(categoriesQuery, [from, to]);

    const byCategories = categoriesResult.map(row => ({
        category: row.category,
        amount: Number(row.amount)
    }));

    return {
        period: { from, to },
        totalIncome,
        totalExpenses,
        netSavings,
        byCategories
    };
};

module.exports = {
    generatePeriodReport
};