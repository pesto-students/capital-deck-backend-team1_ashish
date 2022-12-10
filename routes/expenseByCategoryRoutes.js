const express = require('express');

const router = express.Router();

const { getExpensesByCategory } = require('../controllers/expenseByCategoryController');

const protect = require('../middleware/authMiddleware');

router.route('/:id').get(protect, getExpensesByCategory);

module.exports = router;
