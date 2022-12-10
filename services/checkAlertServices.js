const mongoose = require('mongoose');
const Alert = require('../models/alertModel');
const Income = require('../models/incomeModel');
const Expense = require('../models/expenseModel');

const getAlertExceedService = async (id) => {
  let exceedMsgReq = false;
  let toalexpneseamount = 0;
  let toalincomeamount = 0;

  const alert = await Alert.find({ user: id, notify_type: 'EXCEED' });

  if (alert.length > 0) {
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

const getAlertMonthlyService = async (id) => {
  let monthlyMsgReq = false;

  const alert = await Alert.find({ user: id, notify_type: 'MONTHLY' });

  if (alert.length > 0) {
    monthlyMsgReq = true;
  }

  return monthlyMsgReq;
};

const getAlertConditionService = async (id, categoryid) => {
  let conditionMsgReq = false;
  let maxamount = 0;
  let categorytype = '';
  let totalamount = 0;

  const alert = await Alert.find({ user: id, notify_type: 'CONDITION', category_id: categoryid });

  if (alert.length > 0) {
    conditionMsgReq = true;
    maxamount = alert[0].amount_max;
    categorytype = alert[0].category_type;
  }

  if (conditionMsgReq === true) {
    if (categorytype === 'EXPENSE') {
      const totalexpense = await Expense.aggregate([
        {
          $match: {
            $and: [
              { user: mongoose.Types.ObjectId(id) },
              { category_id: mongoose.Types.ObjectId(categoryid) }
            ]
          }
        },
        { $group: { _id: null, expense_amount: { $sum: '$expense_amount' } } }
      ]);
      totalamount = totalexpense[0].expense_amount;
    } else if (categorytype === 'INCOME') {
      const totalincome = await Income.aggregate([
        {
          $match: {
            $and: [
              { user: mongoose.Types.ObjectId(id) },
              { category_id: mongoose.Types.ObjectId(categoryid) }
            ]
          }
        },
        { $group: { _id: null, income_amount: { $sum: '$income_amount' } } }
      ]);
      totalamount = totalincome[0].income_amount;
    } else {
      conditionMsgReq = false;
    }
  }

  return { conditionMsgReq, maxamount, totalamount };
};

module.exports = {
  getAlertExceedService,
  getAlertMonthlyService,
  getAlertConditionService
};
