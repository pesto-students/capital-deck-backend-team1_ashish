const asyncHandler = require('express-async-handler');
const Expense = require('../models/expenseModel');

// @desc    Get Expense
// @route   GET /api/expense
// @access  Private
const getExpense = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const expense = await Expense.find({ user: id });

  res.status(200).json(expense);
});

// @desc    Set Expense
// @route   POST /api/expense
// @access  Private
const setExpense = asyncHandler(async (req, res) => {
  const { expensedate, expensetitle, expenseamount, categoryid } = req.body;
  const { id } = req.user;

  if (!expensetitle && !expenseamount) {
    res.status(400);
    throw new Error('Please fill all fields');
  }

  const expense = await Expense.create({
    expense_date: expensedate,
    expense_title: expensetitle,
    expense_amount: expenseamount,
    category_id: categoryid,
    user: id
  });
  res.status(200).json(expense);
});

// @desc    Update Expense
// @route   PUT /api/expense/:id
// @access  Private
const updateExpense = asyncHandler(async (req, res) => {
  const paramid = req.params.id;
  const expense = await Expense.findById(paramid);
  const { user } = req;
  const { expensedate, expensetitle, expenseamount, categoryid } = req.body;

  // Check for Expense
  if (!expense) {
    res.status(400);
    throw new Error('Expense not found');
  }

  // Check for user
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  // Make sure the logged in user matches the expense user
  if (expense.user.toString() !== user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedExpense = await Expense.findByIdAndUpdate(
    paramid,
    {
      expense_date: expensedate,
      expense_title: expensetitle,
      expense_amount: expenseamount,
      category_id: categoryid
    },
    {
      new: true
    }
  );

  res.status(200).json(updatedExpense);
});

// @desc    Delete Expense
// @route   DELETE /api/expense/:id
// @access  Private
const deleteExpense = asyncHandler(async (req, res) => {
  const paramid = req.params.id;
  const expense = await Expense.findById(paramid);
  const { user } = req;

  if (!expense) {
    res.status(400);
    throw new Error('Expense not found');
  }

  // Check for user
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  // Make sure the logged in user matches the income user
  if (expense.user.toString() !== user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await expense.remove();

  res.status(200).json({ id: paramid });
});

module.exports = { getExpense, setExpense, updateExpense, deleteExpense };
