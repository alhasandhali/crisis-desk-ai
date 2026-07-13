const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const reportController = require('../controllers/reportController');

router.post(
    '/',
    [
        body('description').notEmpty().withMessage('Description is required'),
        body('location').notEmpty().withMessage('Location is required'),
        body('language')
            .optional()
            .isIn(['bn', 'en', 'unknown'])
            .withMessage('Language must be bn, en, or unknown')
    ],
    reportController.createReport
);
router.get('/stats/summary', reportController.getStatsSummary);
router.get('/', reportController.getReports);
router.get('/:id', reportController.getReportById);
router.patch('/:id/status', reportController.updateReportStatus);
router.delete('/:id', reportController.deleteReport);

module.exports = router;
