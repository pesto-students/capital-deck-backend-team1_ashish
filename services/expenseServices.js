const mongoose = require('mongoose');
const Expense = require('../models/expenseModel');

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
  const expense = await Expense.create({
    expense_date: expensedate,
    expense_title: expensetitle,
    expense_amount: expenseamount,
    category_id: mongoose.Types.ObjectId(categoryid),
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
  const firstday = new Date(firstdate.getFullYear(), firstdate.getMonth() - 2, 1);
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
    }
  ]);

  return { totalexpense, lastexpense, averageexpense };
};

module.exports = {
  getExpenseByIdService,
  getExpenseServices,
  setExpenseServices,
  updateExpenseByIdService,
  deleteExpenseService,
  getExpenseSummaryServices
};
