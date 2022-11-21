const express = require('express');

const router = express.Router();

const { getIncomesByCategory } = require('../controllers/incomesByCategoryController');

const protect = require('../middleware/authMiddleware');

router.route('/:id').get(protect, getIncomesByCategory);

module.exports = router;
