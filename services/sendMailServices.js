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

const sendMailForSchedule = async () => {
  const msg = {
    to: '18salmanz@gmail.com',
    from: '18salmanz@gmail.com',
    subject: 'Capital Alert',
    html: `<p>Hello<p>`
  };

  await sendMail(msg);
};

module.exports = { sendMailForExeed, sendMailForSchedule };
