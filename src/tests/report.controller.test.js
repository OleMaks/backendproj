// src/tests/report.controller.test.js
const { getPeriodReport } = require('../controllers/report.controller');
const ReportService = require('../services/report.service');


jest.mock('../services/report.service');

describe('Report Controller Unit Tests', () => {
    let req, res;

    beforeEach(() => {
        req = {
            query: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();


        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('Має повертати статус 200 та згенерований звіт', async() => {

        req.query = { from: '2026-05-01', to: '2026-05-31' };

        const mockReport = {
            period: { from: '2026-05-01', to: '2026-05-31' },
            totalIncome: 5000,
            totalExpense: 2000,
            balance: 3000
        };

        ReportService.generatePeriodReport.mockResolvedValue(mockReport);

        await getPeriodReport(req, res);

        expect(ReportService.generatePeriodReport).toHaveBeenCalledWith('2026-05-01', '2026-05-31');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockReport);
    });

    test('Має повертати статус 500, якщо сталася помилка', async() => {
        req.query = { from: '2026-05-01', to: '2026-05-31' };

        ReportService.generatePeriodReport.mockRejectedValue(new Error('Збій генерації звіту'));

        await getPeriodReport(req, res);

        expect(console.error).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Внутрішня помилка сервера' });
    });
});