const asyncHandler = require('express-async-handler');
const { checkUserDataAuthorization } = require('../services/commonServices');
const {
  getExpenseServices,
  setExpenseServices,
  getExpenseByIdService,
  updateExpenseByIdService,
  deleteExpenseService,
  getExpenseSummaryServices
} = require('../services/expenseServices');
const { getCategoryByIdService } = require('../services/categoryServices');

// @desc    Get Expense
// @route   GET /api/expense
// @access  Private
const getExpense = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { search } = req.query;
  const searchData = JSON.parse(search);

  const query = { user: id };
  if (searchData.categoryid !== 0) {
    query.category_id = searchData.categoryid;
  }
  if (searchData.fromdate !== '' && searchData.todate !== '') {
    const startdate = new Date(searchData.fromdate);
    const enddate = new Date(searchData.todate);
    query.expense_date = {
      $gte: new Date(startdate).toISOString(),
      $lt: new Date(enddate).toISOString()
    };
  }

  try {
    const expense = await getExpenseServices(query, null, null);
    res.status(200).json(expense);
  } catch (e) {
    throw new Error(e.message);
  }
});

// @desc    Set Expense
// @route   POST /api/expense
// @access  Private
const setExpense = asyncHandler(async (req, res) => {
  const { expensedate, expensetitle, expenseamount, categoryid } = req.body;
  const { id } = req.user;
  let filename = '';
  let filepath = '';
  if (req.file !== undefined) {
    filename = req.file.originalname;
    filepath = req.file.path;
  }

  if (!expensetitle && !expenseamount) {
    res.status(400);
    throw new Error('Please fill all fields');
  }

  try {
    const expense = await setExpenseServices(
      expensedate,
      expensetitle,
      expenseamount,
      categoryid,
      filename,
      filepath,
      id
    );

    const category = await getCategoryByIdService(categoryid);
    expense.category_id = category;

    res.status(200).json(expense);
  } catch (e) {
    throw new Error(e.message);
  }
});

// @desc    Update Expense
// @route   PUT /api/expense/:id
// @access  Private
const updateExpense = asyncHandler(async (req, res) => {
  const paramid = req.params.id;
  const { user } = req;
  const { expensedate, expensetitle, expenseamount, categoryid } = req.body;
  let filename = '';
  let filepath = '';
  if (req.file !== undefined) {
    filename = req.file.originalname;
    filepath = req.file.path;
  }

  try {
    const expense = await getExpenseByIdService(paramid);
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

    // Check user and make sure the logged in user matches the category user
    const Authorized = await checkUserDataAuthorization(expense, user);
    if (!Authorized) {
      res.status(401);
      throw new Error('User not authorized');
    }

    // Update expense by Id
    const updatedExpense = await updateExpenseByIdService(
      paramid,
      expensedate,
      expensetitle,
      expenseamount,
      categoryid,
      filename,
      filepath
    );

    const category = await getCategoryByIdService(categoryid);
    updatedExpense.category_id = category;

    res.status(200).json(updatedExpense);
  } catch (e) {
    throw new Error(e.message);
  }
});

// @desc    Delete Expense
// @route   DELETE /api/expense/:id
// @access  Private
const deleteExpense = asyncHandler(async (req, res) => {
  const paramid = req.params.id;
  const { user } = req;

  try {
    const expense = await getExpenseByIdService(paramid);

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

    // Check user and make sure the logged in user matches the category user
    const Authorized = await checkUserDataAuthorization(expense, user);
    if (!Authorized) {
      res.status(401);
      throw new Error('User not authorized');
    }

    await deleteExpenseService(expense);

    res.status(200).json({ id: paramid });
  } catch (e) {
    throw new Error(e.message);
  }
});

// @desc    Get Expense Summary
// @route   GET /api/expense
// @access  Private
const getExpenseSummary = asyncHandler(async (req, res) => {
  const { id } = req.user;

  try {
    const expense = await getExpenseSummaryServices(id, null, null);
    res.status(200).json(expense);
  } catch (e) {
    throw new Error(e.message);
  }
});

module.exports = {
  getExpense,
  setExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary
};
