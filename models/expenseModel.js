const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema(
  {
    expense_date: {
      type: String
    },
    expense_title: {
      type: String,
      required: [true, 'Please add the Title']
    },
    expense_amount: {
      type: Number,
      required: [true, 'Please add the Amount']
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Category'
    },
    file_name: {
      type: String
    },
    file_path: {
      type: String
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

module.exports = mongoose.model('Expense', expenseSchema);
