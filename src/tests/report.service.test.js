// src/tests/report.service.test.js
const ReportService = require('../services/report.service');
const db = require('../config/db');

jest.mock('../config/db', () => ({
    execute: jest.fn()
}));

describe('Report Service Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Має успішно генерувати фінансовий звіт за період', async() => {
        const mockTotals = [{ totalIncome: '5000.00', totalExpenses: '2000.00' }];
        db.execute.mockResolvedValueOnce([mockTotals]);


        const mockCategories = [
            { category: 'Продукти', amount: '1500.00' },
            { category: 'Транспорт', amount: '500.00' }
        ];
        db.execute.mockResolvedValueOnce([mockCategories]);

        const from = '2026-05-01';
        const to = '2026-05-31';

        const result = await ReportService.generatePeriodReport(from, to);

        expect(db.execute).toHaveBeenCalledTimes(2);

        expect(result).toEqual({
            period: { from: '2026-05-01', to: '2026-05-31' },
            totalIncome: 5000,
            totalExpenses: 2000,
            netSavings: 3000,
            byCategories: [
                { category: 'Продукти', amount: 1500 },
                { category: 'Транспорт', amount: 500 }
            ]
        });
    });

    test('Має прокидати помилку, якщо БД впала на першому запиті', async() => {
        db.execute.mockRejectedValueOnce(new Error('Збій БД при підрахунку тоталів'));


        await expect(ReportService.generatePeriodReport('2026-05-01', '2026-05-31'))
            .rejects.toThrow('Збій БД при підрахунку тоталів');

        expect(db.execute).toHaveBeenCalledTimes(1);
    });
});