const asyncHandler = require('express-async-handler');
const { checkUserDataAuthorization } = require('../services/commonServices');
const {
  getIncomeServices,
  setIncomeServices,
  getIncomeByIdService,
  updateIncomeByIdService,
  deleteIncomeService,
  getIncomeSummaryServices
} = require('../services/incomeServices');
const { sendMailForExeed } = require('../services/sendMailServices');
const { getAlertExceedService } = require('../services/checkAlertServices');
const { getCategoryByIdService } = require('../services/categoryServices');

// @desc    Get Income
// @route   GET /api/income
// @access  Private
const getIncome = asyncHandler(async (req, res) => {
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
    const incomes = await getIncomeServices(query, null, null);
    res.status(200).json(incomes);
  } catch (e) {
    throw new Error(e.message);
  }
});

// @desc    Set Income
// @route   POST /api/income
// @access  Private
const setIncome = asyncHandler(async (req, res) => {
  const { incomedate, incometitle, incomeamount, categoryid } = req.body;
  const { id } = req.user;
  let filename = '';
  let filepath = '';
  if (req.file !== undefined) {
    filename = req.file.originalname;
    filepath = req.file.path;
  }

  if (!incometitle && !incomeamount) {
    res.status(400);
    throw new Error('Please fill these fields');
  }

  try {
    const income = await setIncomeServices(
      incomedate,
      incometitle,
      incomeamount,
      categoryid,
      filename,
      filepath,
      id
    );

    const category = await getCategoryByIdService(categoryid);
    income.category_id = category;

    res.status(200).json(income);
  } catch (e) {
    throw new Error(e.message);
  }
});

// @desc    Update Income
// @route   PUT /api/income/:id
// @access  Private
const updateIncome = asyncHandler(async (req, res) => {
  const paramid = req.params.id;
  const { user } = req;
  const { incomedate, incometitle, incomeamount, categoryid } = req.body;
  let filename = '';
  let filepath = '';
  if (req.file !== undefined) {
    filename = req.file.originalname;
    filepath = req.file.path;
  }

  try {
    const income = await getIncomeByIdService(paramid);
    // Income not found
    if (!income) {
      res.status(400);
      throw new Error('Income not found');
    }

    // Check for user
    if (!user) {
      res.status(401);
      throw new Error('User not found');
    }

    // Check user and make sure the logged in user matches the category user
    const Authorized = await checkUserDataAuthorization(income, user);
    if (!Authorized) {
      res.status(401);
      throw new Error('User not authorized');
    }

    // Update income by Id
    const updatedIncome = await updateIncomeByIdService(
      paramid,
      incomedate,
      incometitle,
      incomeamount,
      categoryid,
      filename,
      filepath
    );

    const category = await getCategoryByIdService(categoryid);
    updatedIncome.category_id = category;

    res.status(200).json(updatedIncome);
  } catch (e) {
    throw new Error(e.message);
  }
});

// @desc    Delete Income
// @route   DELETE /api/income/:id
// @access  Private
const deleteIncome = asyncHandler(async (req, res) => {
  const paramid = req.params.id;
  const { user } = req;

  try {
    const income = await getIncomeByIdService(paramid);

    // Check for Income
    if (!income) {
      res.status(400);
      throw new Error('Income not found');
    }

    // Check for user
    if (!user) {
      res.status(401);
      throw new Error('User not found');
    }

    // Check user and make sure the logged in user matches the category user
    const Authorized = await checkUserDataAuthorization(income, user);
    if (!Authorized) {
      res.status(401);
      throw new Error('User not authorized');
    }

    await deleteIncomeService(income);

    const { exceedMsgReq, toalexpneseamount, toalincomeamount } = await getAlertExceedService(
      user.id
    );

    if (exceedMsgReq === true && toalexpneseamount > toalincomeamount) {
      await sendMailForExeed(req.user.email, toalexpneseamount, toalincomeamount);
    }

    res.status(200).json({ id: paramid });
  } catch (e) {
    throw new Error(e.message);
  }
});

// @desc    Get Income Summary
// @route   GET /api/income
// @access  Private
const getIncomeSummary = asyncHandler(async (req, res) => {
  const { id } = req.user;

  try {
    const income = await getIncomeSummaryServices(id, null, null);
    res.status(200).json(income);
  } catch (e) {
    throw new Error(e.message);
  }
});

module.exports = {
  getIncome,
  setIncome,
  updateIncome,
  deleteIncome,
  getIncomeSummary
};
