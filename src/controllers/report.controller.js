const ReportService = require('../services/report.service');

const getPeriodReport = async (req, res) => {
    const { from, to } = req.query;

    try {
        const report = await ReportService.generatePeriodReport(from, to);
        
        res.status(200).json(report);
    } catch (error) {
        console.error('Помилка в getPeriodReport controller:', error);
        res.status(500).json({ message: 'Внутрішня помилка сервера' });
    }
};

module.exports = {
    getPeriodReport
};