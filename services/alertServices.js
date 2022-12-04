const Alert = require('../models/alertModel');

const getAlertByIdService = async (id) => {
  const alert = await Alert.findById(id);
  return alert;
};

const getAlertService = async (query, projection, option) => {
  const alerts = await Alert.find(query, projection, option);
  return alerts;
};

const setAlertService = async (alerttitle, amountmax, notifytype, categorytype, id) => {
  const alert = await Alert.create({
    alert_title: alerttitle,
    amount_max: amountmax,
    notify_type: notifytype,
    category_type: categorytype,
    user: id
  });
  return alert;
};

const deleteAlertService = async (dataobject) => {
  await dataobject.remove();
};

module.exports = {
  getAlertService,
  setAlertService,
  getAlertByIdService,
  deleteAlertService
};
