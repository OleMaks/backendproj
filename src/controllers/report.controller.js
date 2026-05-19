const db = require('../config/db');

const getPeriodReport = async (req, res) => {
    const { from, to } = req.query;

    if (!from || !to) {
        return res.status(400).json({ message: 'Будь ласка, вкажіть параметри з якого по яке число потрібен звіт (from та to)' });
    }

    try {
        // 1. Calculate total income and total expenses for the given period
        const totalsQuery = `
            SELECT 
                COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS totalIncome,
                COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS totalExpenses
            FROM transactions
            WHERE date >= ? AND date <= ?
        `;
        const [totalsResult] = await db.execute(totalsQuery, [from, to]);
        
        // MySQL DECIMAL type might be returned as string, so we cast it to Number
        const totalIncome = Number(totalsResult[0].totalIncome);
        const totalExpenses = Number(totalsResult[0].totalExpenses);
        const netSavings = totalIncome - totalExpenses;

        // 2. Calculate expenses grouped by category
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

        // Format the result to match the expected Swagger schema
        const byCategories = categoriesResult.map(row => ({
            category: row.category,
            amount: Number(row.amount)
        }));

        // 3. Construct and send the final report object
        const report = {
            period: { from, to },
            totalIncome,
            totalExpenses,
            netSavings,
            byCategories
        };

        res.status(200).json(report);
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getPeriodReport
};