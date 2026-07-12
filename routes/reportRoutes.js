const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const reportController = require('../controllers/reportController');

router.post(
    '/',
    [
        body('description').notEmpty().withMessage('Description is required'),
        body('location').notEmpty().withMessage('Location is required')
    ],
    reportController.createReport
);

module.exports = router;
