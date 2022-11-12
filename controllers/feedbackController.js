const asyncHandler = require('express-async-handler');
const Feedback = require('../models/feedbackModel');

// @desc    Get Feedback
// @route   GET /api/feedback
// @access  Public
const getFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.find();

  res.status(200).json(feedback);
});

// @desc    Set Feedback
// @route   POST /api/feedback
// @access  Public
const setFeedback = asyncHandler(async (req, res) => {
  if (!req.body.name && !req.body.email) {
    res.status(400);
    throw new Error('Please fill all field');
  }

  const feedback = await Feedback.create({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message
  });

  res.status(200).json(feedback);
});

module.exports = {
  getFeedback,
  setFeedback
};
