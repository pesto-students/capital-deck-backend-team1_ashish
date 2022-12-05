const mongoose = require('mongoose');
const Expense = require('../models/expenseModel');

const getExpenseByIdService = async (id) => {
  const expense = await Expense.findById(id);
  return expense;
};

const getExpenseServices = async (query, projection, option) => {
  const expense = await Expense.find(query, projection, option);
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
  expensetitle,
  expensedate,
  expenseamount,
  categoryid
) => {
  const expense = await Expense.findByIdAndUpdate(
    id,
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
  return expense;
};

const deleteExpenseService = async (dataobject) => {
  await dataobject.remove();
};

module.exports = {
  getExpenseByIdService,
  getExpenseServices,
  setExpenseServices,
  updateExpenseByIdService,
  deleteExpenseService
};
