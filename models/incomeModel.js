const mongoose = require('mongoose');

const incomeSchema = mongoose.Schema(
  {
    income_date: {
      type: String,
      required: [true, 'Please add the Date']
    },
    income_title: {
      type: String,
      required: [true, 'Please add the Title']
    },
    income_amount: {
      type: String,
      required: [true, 'Please add the Amount']
    },
    income_receipt: {
      type: String
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Category'
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

module.exports = mongoose.model('Income', incomeSchema);
