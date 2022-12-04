const Income = require('../models/incomeModel');

const getIncomeByIdService = async (id) => {
  const income = await Income.findById(id);
  return income;
};

const getIncomeServices = async (query, projection, option) => {
  const incomes = await Income.find(query, projection, option);
  return incomes;
};

const setIncomeServices = async (
  incomedate,
  incometitle,
  incomeamount,
  incomereceipt,
  categoryid,
  id
) => {
  const income = await Income.create({
    income_date: incomedate,
    income_title: incometitle,
    income_amount: incomeamount,
    income_receipt: incomereceipt,
    category_id: categoryid,
    user: id
  });
  return income;
};

const updateIncomeByIdService = async (id, incometitle, incomedate, incomeamount, categoryid) => {
  console.log(id, incomeamount);
  const income = await Income.findByIdAndUpdate(
    id,
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
  return income;
};

const deleteIncomeService = async (dataobject) => {
  await dataobject.remove();
};

module.exports = {
  getIncomeByIdService,
  getIncomeServices,
  setIncomeServices,
  updateIncomeByIdService,
  deleteIncomeService
};
