const mongoose = require('mongoose');
const Alert = require('../models/alertModel');
const Income = require('../models/incomeModel');
const Expense = require('../models/expenseModel');

// const getExpenseByIdService = async (id) => {
//   const expense = await Expense.findById(id);
//   return expense;
// };

const getAlertExceedService = async (id) => {
  let exceedMsgReq = false;
  let toalexpneseamount = 0;
  let toalincomeamount = 0;

  const expense = await Alert.find({ user: id, notify_type: 'EXCEED' }).populate({
    path: 'category_id',
    model: 'Category'
  });

  if (expense.length > 0) {
    exceedMsgReq = true;
  }

  if (exceedMsgReq === true) {
    const totalexpense = await Expense.aggregate([
      {
        $match: { user: mongoose.Types.ObjectId(id) }
      },
      { $group: { _id: null, expense_amount: { $sum: '$expense_amount' } } }
    ]);
    const totalincome = await Income.aggregate([
      {
        $match: { user: mongoose.Types.ObjectId(id) }
      },
      { $group: { _id: null, income_amount: { $sum: '$income_amount' } } }
    ]);
    toalexpneseamount = totalexpense[0].expense_amount;
    toalincomeamount = totalincome[0].income_amount;
  }
  return { exceedMsgReq, toalexpneseamount, toalincomeamount };
};

module.exports = {
  getAlertExceedService
};
