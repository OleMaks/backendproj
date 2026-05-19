// src/controllers/report.controller.js

const getPeriodReport = (req, res) => {
    const { from, to } = req.query;

    if (!from || !to) {
        return res.status(400).json({ message: 'Будь ласка, вкажіть параметри з якого по яке число потрібен звіт (from та to)' });
    }

    // заменить на SQL-агрегацію (GROUP BY)
    const mockReport = {
        period: { from, to },
        totalIncome: 45000,
        totalExpenses: 12800,
        netSavings: 32200,
        byCategories: [
            { category: 'Продукти', amount: 6500 },
            { category: 'Комунальні послуги', amount: 3800 },
            { category: 'Транспорт', amount: 2500 }
        ]
    };

    res.status(200).json(mockReport);
};

module.exports = {
    getPeriodReport
};