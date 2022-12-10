const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async (msg) => {
  sgMail.send(msg).then(
    () => {},
    (error) => {
      console.error(error);
      if (error.response) {
        console.error(error.response.body);
      }
    }
  );
};

const sendMailForExeed = async (toMail, toalexpneseamount, toalincomeamount) => {
  const msg = {
    to: toMail,
    from: '18salmanz@gmail.com',
    subject: 'Capital Alert',
    html: `<p>According to your Capital Alert, Your expenses have exceeded your income please visit <a href="https://capitaldeck.netlify.app/login">Capital Deck</a> to track your Finances.</p><br>Income: ${toalincomeamount} ₹<br>Expense: ${toalexpneseamount} ₹`
  };
  await sendMail(msg);
};

const sendMailForSchedule = async (
  toMail,
  totalexpense,
  currentexpense,
  avgexpense,
  totalincome,
  currentincome,
  avgincome
) => {
  const mailexpensesummary = `<b>Expense Summary<b><br>Total Expense: ${totalexpense} ₹<br>Current Month Expense: ${currentexpense} ₹<br>Average Expense: ${avgexpense} ₹<br>`;
  const mailincomesummary = `<b>Income Summary<b><br>Total Income: ${totalincome} ₹<br>Current Month Income: ${currentincome} ₹<br>Average Income: ${avgincome} ₹<br>`;

  const msg = {
    to: toMail,
    from: '18salmanz@gmail.com',
    subject: 'Capital Alert',
    html: `<p>This is the monthly summary of your Finances as tracked on <a href="https://capitaldeck.netlify.app/login">Capital Deck</a>.<p><br><br>${mailexpensesummary}<br>${mailincomesummary}`
  };

  await sendMail(msg);
};

module.exports = { sendMailForExeed, sendMailForSchedule };
