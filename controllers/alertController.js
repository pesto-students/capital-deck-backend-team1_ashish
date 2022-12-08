const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const Alert = require('../models/alertModel');

// @desc    Get Alert
// @route   GET /api/alert
// @access  Private

const getAlert = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const alert = await Alert.find({ user: id });

  res.status(200).json(alert);
});

// @desc    Set Alert
// @route   POST /api/alert
// @access  Private
const setAlert = asyncHandler(async (req, res) => {
  const { alerttitle, amountmax, notifytype, categorytype, categoryid } = req.body;
  const { id } = req.user;

  if (!alerttitle && !amountmax) {
    res.status(400);
    throw new Error('Please fill these details');
  }

  let category = 0;
  if (categoryid === '') {
    category = 0;
  } else {
    category = categoryid;
  }

  const alert = await Alert.create({
    alert_title: alerttitle,
    amount_max: amountmax,
    notify_type: notifytype,
    category_type: categorytype,
    category_id: mongoose.Types.ObjectId(category),
    user: id
  });

  res.status(200).json(alert);
});

// @desc    Delete Alert
// @route   DELETE /api/alert/:id
// @access  Private

const deleteAlert = asyncHandler(async (req, res) => {
  const paramid = req.params.id;
  const alert = await Alert.findById(paramid);
  const { user } = req;

  if (!alert) {
    res.status(400);
    throw new Error('Alert not found');
  }

  // Check for user
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  // Make sure the logged in user matches the alert
  if (alert.user.toString() !== user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await alert.remove();
  res.status(200).json({ id: paramid });
});

module.exports = { getAlert, setAlert, deleteAlert };
