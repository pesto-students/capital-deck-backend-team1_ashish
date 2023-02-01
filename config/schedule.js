/* eslint-disable no-await-in-loop */
const schedule = require('node-schedule');
const { sendMailForSchedule } = require('../services/sendMailServices');
const { getAlertMonthlyService } = require('../services/checkAlertServices');
const { getAllUser } = require('../services/userServices');
const { getExpenseSummaryServices } = require('../services/expenseServices');
const { getIncomeSummaryServices } = require('../services/incomeServices');

const scheduleMail = () => {
  const job = schedule.scheduleJob('* * 1 * *', async function () {
    let totalexpense = 0;
    let totalincome = 0;
    let avgexpense = 0;
    let avgincome = 0;
    let currentexpense = 0;
    let currentincome = 0;

    const users = await getAllUser();

    for (let i = 0; i < users.length; i += 1) {
      const monthlyMsgReq = await getAlertMonthlyService(users[i]._id);
      if (monthlyMsgReq) {
        const expense = await getExpenseSummaryServices(users[i]._id, null, null);
        const income = await getIncomeSummaryServices(users[i]._id, null, null);

        if (expense.totalexpense.length > 0)
          totalexpense = expense.totalexpense[0].expense_amount.toFixed(2);

        if (income.totalincome.length > 0)
          totalincome = income.totalincome[0].income_amount.toFixed(2);

        if (expense.currentexpense.length > 0)
          currentexpense = expense.currentexpense[0].expense_amount.toFixed(2);

        if (income.currentincome.length > 0)
          currentincome = income.currentincome[0].income_amount.toFixed(2);

        if (expense.averageexpense.length > 0)
          avgexpense = (totalexpense / expense.averageexpense.length).toFixed(2);

        if (income.averageincome.length > 0)
          avgincome = (totalincome / income.averageincome.length).toFixed(2);

        await sendMailForSchedule(
          users[i].email,
          totalexpense,
          currentexpense,
          avgexpense,
          totalincome,
          currentincome,
          avgincome
        );
      }
    }
  });
};

module.exports = scheduleMail;
