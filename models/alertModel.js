const mongoose = require('mongoose');

const alertSchema = mongoose.Schema(
  {
    alert_title: {
      type: String,
      required: [true, 'Please add alert name']
    },
    notify_type: { type: String, possibleValues: ['EXCEED', 'MONTHLY', 'CONDITION'] },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    },
    category_type: {
      type: String,
      possibleValues: ['EXPENSE', 'INCOME', '']
    },
    amount_max: {
      type: Number
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Alert', alertSchema);
