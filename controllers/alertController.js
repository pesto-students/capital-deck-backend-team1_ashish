const asyncHandler = require('express-async-handler');
const { checkUserDataAuthorization } = require('../services/commonServices');

const {
  getAlertService,
  setAlertService,
  getAlertByIdService,
  deleteAlertService
} = require('../services/alertServices');

// @desc    Get Alert
// @route   GET /api/alert
// @access  Private
const getAlert = asyncHandler(async (req, res) => {
  const { id } = req.user;

  try {
    const alert = await getAlertService({ user: id }, null, null);
    res.status(200).json(alert);
  } catch (e) {
    throw new Error(e.message);
  }
});

// @desc    Set Alert
// @route   POST /api/alert
// @access  Private
const setAlert = asyncHandler(async (req, res) => {
  const { alerttitle, amountmax, notifytype, categorytype } = req.body;
  const { id } = req.user;

  if (!alerttitle && !amountmax) {
    res.status(400);
    throw new Error('Please fill these details');
  }

  try {
    const alert = await setAlertService(alerttitle, amountmax, notifytype, categorytype, id);
    res.status(200).json(alert);
  } catch (e) {
    throw new Error(e.message);
  }
});

// @desc    Delete Alert
// @route   DELETE /api/alert/:id
// @access  Private
const deleteAlert = asyncHandler(async (req, res) => {
  const paramid = req.params.id;
  const { user } = req;

  try {
    const alert = await getAlertByIdService(paramid);

    // Check for alert
    if (!alert) {
      res.status(400);
      throw new Error('Alert not found');
    }

    // Check for user
    if (!user) {
      res.status(401);
      throw new Error('User not found');
    }

    // Check user and make sure the logged in user matches the category user
    const Authorized = await checkUserDataAuthorization(alert, user);
    if (!Authorized) {
      res.status(401);
      throw new Error('User not authorized');
    }

    await deleteAlertService(alert);

    res.status(200).json({ id: paramid });
  } catch (e) {
    throw new Error(e.message);
  }
});

module.exports = { getAlert, setAlert, deleteAlert };
