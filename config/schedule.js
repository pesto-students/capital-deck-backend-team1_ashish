const schedule = require('node-schedule');
const { sendMailForSchedule } = require('../services/sendMailServices');

const scheduleMail = () => {
  const job = schedule.scheduleJob('28 * * * *', async function () {
    await sendMailForSchedule();
  });
};

module.exports = scheduleMail;
