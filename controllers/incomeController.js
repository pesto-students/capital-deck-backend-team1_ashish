const asyncHandler = require('express-async-handler');
const Income = require('../models/incomeModel');

// @desc    Get Income
// @route   GET /api/income
// @access  Private
const getIncome = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const income = await Income.find({ user: id });

  res.status(200).json(income);
});

// @desc    Set Income
// @route   POST /api/income
// @access  Private
const setIncome = asyncHandler(async (req, res) => {
  const { incomedate, incometitle, incomeamount, incomereceipt, categoryid } = req.body;
  const { id } = req.user;

  if (!incometitle && !incomeamount) {
    res.status(400);
    throw new Error('Please fill these fields');
  }

  const income = await Income.create({
    income_date: incomedate,
    income_title: incometitle,
    income_amount: incomeamount,
    income_receipt: incomereceipt,
    category_id: categoryid,
    user: id
  });

  res.status(200).json(income);
});

// @desc    Update Income
// @route   PUT /api/income/:id
// @access  Private
const updateIncome = asyncHandler(async (req, res) => {
  const paramid = req.params.id;
  const income = await Income.findById(paramid);
  const { user } = req;
  const { incomedate, incometitle, incomeamount, categoryid } = req.body;

  if (!income) {
    res.status(400);
    throw new Error('Income not found');
  }

  // Check for user
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  // Make sure the logged in user matches the income user
  if (income.user.toString() !== user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedIncome = await Income.findByIdAndUpdate(
    paramid,
    {
      income_date: incomedate,
      income_title: incometitle,
      income_amount: incomeamount,
      category_id: categoryid
    },
    {
      new: true
    }
  );

  res.status(200).json(updatedIncome);
});

// @desc    Delete Income
// @route   DELETE /api/income/:id
// @access  Private
const deleteIncome = asyncHandler(async (req, res) => {
  const paramid = req.params.id;
  const income = await Income.findById(paramid);
  const { user } = req;

  if (!income) {
    res.status(400);
    throw new Error('Income not found');
  }

  // Check for user
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  // Make sure the logged in user matches the income user
  if (income.user.toString() !== user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await income.remove();

  res.status(200).json({ id: paramid });
});

module.exports = {
  getIncome,
  setIncome,
  updateIncome,
  deleteIncome
};
