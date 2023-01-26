/* eslint-disable no-await-in-loop */
const mongoose = require('mongoose');
const Expense = require('../models/expenseModel');
const { getCategoryByIdService } = require('./categoryServices');

const getExpenseByIdService = async (id) => {
  const expense = await Expense.findById(id);
  return expense;
};

const getExpenseServices = async (query, projection, option) => {
  const expense = await Expense.find(query, projection, option).populate({
    path: 'category_id',
    model: 'Category'
  });

  return expense;
};

const setExpenseServices = async (
  expensedate,
  expensetitle,
  expenseamount,
  categoryid,
  filename,
  filepath,
  id
) => {
  let category = 0;
  if (categoryid === '') {
    category = 0;
  } else {
    category = categoryid;
  }

  const expense = await Expense.create({
    expense_date: expensedate,
    expense_title: expensetitle,
    expense_amount: expenseamount,
    category_id: mongoose.Types.ObjectId(category),
    file_name: filename,
    file_path: filepath,
    user: id
  });
  return expense;
};

const updateExpenseByIdService = async (
  id,
  expensedate,
  expensetitle,
  expenseamount,
  categoryid,
  filename,
  filepath
) => {
  let expenseData = {
    expense_title: expensetitle,
    expense_date: expensedate,
    expense_amount: expenseamount,
    category_id: mongoose.Types.ObjectId(categoryid)
  };

  if (filename !== '' && filename !== undefined && filepath !== '' && filepath !== undefined) {
    expenseData = {
      ...expenseData,
      file_name: filename,
      file_path: filepath
    };
  }

  const expense = await Expense.findByIdAndUpdate(id, expenseData, {
    new: true
  });
  return expense;
};

const deleteExpenseService = async (dataobject) => {
  await dataobject.remove();
};

const getExpenseSummaryServices = async (id, projection, option) => {
  const totalexpense = await Expense.aggregate([
    {
      $match: { user: mongoose.Types.ObjectId(id) }
    },
    { $group: { _id: null, expense_amount: { $sum: '$expense_amount' } } }
  ]);

  const firstdate = new Date();
  const firstday = new Date(firstdate.getFullYear(), firstdate.getMonth() - 1, 1);
  const lastdate = new Date();
  const lastday = new Date(lastdate.getFullYear(), lastdate.getMonth(), 0);

  const lastexpense = await Expense.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(id),
        expense_date: {
          $gte: new Date(firstday).toISOString(),
          $lt: new Date(lastday).toISOString()
        }
      }
    },
    { $group: { _id: null, expense_amount: { $sum: '$expense_amount' } } }
  ]);

  const averageexpense = await Expense.aggregate([
    {
      $match: { user: mongoose.Types.ObjectId(id) }
    },
    {
      $group: {
        _id: { month: { $month: { $toDate: '$expense_date' } } },
        expense_amount: { $sum: '$expense_amount' }
      }
    },
    { $sort: { expense_date: -1 } }
  ]);

  const firstdatec = new Date();
  const firstdayc = new Date(firstdatec.getFullYear(), firstdatec.getMonth() - 0, 1);
  const lastdatec = new Date();

  const currentexpense = await Expense.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(id),
        expense_date: {
          $gte: new Date(firstdayc).toISOString(),
          $lt: new Date(lastdatec).toISOString()
        }
      }
    },
    { $group: { _id: null, expense_amount: { $sum: '$expense_amount' } } }
  ]);

  return { totalexpense, lastexpense, averageexpense, currentexpense };
};

const getTotalAmountByExpenseService = async (id, projection, option) => {
  const amountbyexpense = await Expense.aggregate([
    {
      $match: { user: mongoose.Types.ObjectId(id) }
    },
    {
      $group: {
        _id: { category: '$category_id' },
        expense_amount: { $sum: '$expense_amount' }
      }
    }
  ]);

  const totalAmountbyexpense = [];
  for (let i = 0; i < amountbyexpense.length; i += 1) {
    const categoryid = amountbyexpense[i]._id.category;
    const amount = amountbyexpense[i].expense_amount;
    const category = await getCategoryByIdService(categoryid);
    if (category) {
      const data = {
        categoryid,
        categoryname: category.category_name,
        color: category.color,
        totalamount: amount
      };
      totalAmountbyexpense.push(data);
    }
  }

  return totalAmountbyexpense;
};

const getRecentExpenseServices = async (query, projection, option) => {
  const expense = await Expense.find(query, projection, option)
    .limit(5)
    .sort({ expense_date: -1 })
    .populate({
      path: 'category_id',
      model: 'Category'
    });

  return expense;
};

module.exports = {
  getExpenseByIdService,
  getExpenseServices,
  setExpenseServices,
  updateExpenseByIdService,
  deleteExpenseService,
  getExpenseSummaryServices,
  getTotalAmountByExpenseService,
  getRecentExpenseServices
};
