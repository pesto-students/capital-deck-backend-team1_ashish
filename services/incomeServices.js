const mongoose = require('mongoose');
const Income = require('../models/incomeModel');

const getIncomeByIdService = async (id) => {
  const income = await Income.findById(id);
  return income;
};

const getIncomeServices = async (query, projection, option) => {
  const incomes = await Income.find(query, projection, option).populate({
    path: 'category_id',
    model: 'Category'
  });

  return incomes;
};

const setIncomeServices = async (
  incomedate,
  incometitle,
  incomeamount,
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

  const income = await Income.create({
    income_date: incomedate,
    income_title: incometitle,
    income_amount: incomeamount,
    category_id: mongoose.Types.ObjectId(category),
    file_name: filename,
    file_path: filepath,
    user: id
  });
  return income;
};

const updateIncomeByIdService = async (
  id,
  incomedate,
  incometitle,
  incomeamount,
  categoryid,
  filename,
  filepath
) => {
  let incomeData = {
    income_title: incometitle,
    income_date: incomedate,
    income_amount: incomeamount,
    category_id: mongoose.Types.ObjectId(categoryid)
  };

  if (filename !== '' && filename !== undefined && filepath !== '' && filepath !== undefined) {
    incomeData = {
      ...incomeData,
      file_name: filename,
      file_path: filepath
    };
  }

  const income = await Income.findByIdAndUpdate(id, incomeData, {
    new: true
  });
  return income;
};

const deleteIncomeService = async (dataobject) => {
  await dataobject.remove();
};

const getIncomeSummaryServices = async (id, projection, option) => {
  const totalincome = await Income.aggregate([
    {
      $match: { user: mongoose.Types.ObjectId(id) }
    },
    { $group: { _id: null, income_amount: { $sum: '$income_amount' } } }
  ]);

  const firstdate = new Date();
  const firstday = new Date(firstdate.getFullYear(), firstdate.getMonth() - 1, 1);
  const lastdate = new Date();
  const lastday = new Date(lastdate.getFullYear(), lastdate.getMonth(), 0);

  const lastincome = await Income.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(id),
        income_date: {
          $gte: new Date(firstday).toISOString(),
          $lt: new Date(lastday).toISOString()
        }
      }
    },
    { $group: { _id: null, income_amount: { $sum: '$income_amount' } } }
  ]);

  const averageincome = await Income.aggregate([
    {
      $match: { user: mongoose.Types.ObjectId(id) }
    },
    {
      $group: {
        _id: { month: { $month: { $toDate: '$income_date' } } },
        income_amount: { $sum: '$income_amount' }
      }
    }
  ]);

  const firstdatec = new Date();
  const firstdayc = new Date(firstdatec.getFullYear(), firstdatec.getMonth() - 0, 1);
  const lastdatec = new Date();

  const currentexpense = await Income.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(id),
        income_date: {
          $gte: new Date(firstdayc).toISOString(),
          $lt: new Date(lastdatec).toISOString()
        }
      }
    },
    { $group: { _id: null, income_amount: { $sum: '$income_amount' } } }
  ]);

  return { totalincome, lastincome, averageincome, currentexpense };
};

module.exports = {
  getIncomeByIdService,
  getIncomeServices,
  setIncomeServices,
  updateIncomeByIdService,
  deleteIncomeService,
  getIncomeSummaryServices
};
