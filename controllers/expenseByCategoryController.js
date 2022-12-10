const asyncHandler = require('express-async-handler');
const Expense = require('../models/expenseModel');

// @desc    Get Expenses by Category
// @route   GET /api/categoryexpenses/:id
// @access  Private

const getExpensesByCategory = asyncHandler(async (req, res) => {
  const categoryid = req.params.id;
  const expensesByCategory = await Expense.find({ category_id: categoryid });

  res.status(200).json(expensesByCategory);
});

module.exports = { getExpensesByCategory };
