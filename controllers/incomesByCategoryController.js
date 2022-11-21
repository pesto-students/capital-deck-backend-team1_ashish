const asyncHandler = require('express-async-handler');
const Income = require('../models/incomeModel');

// @desc    Get Incomes by Category
// @route   GET /api/incomesbycategory/:id
// @access  Private

const getIncomesByCategory = asyncHandler(async (req, res) => {
  const categoryid = req.params.id;
  const incomesByCategory = await Income.find({ category_id: categoryid });

  res.status(200).json(incomesByCategory);
});

module.exports = { getIncomesByCategory };
