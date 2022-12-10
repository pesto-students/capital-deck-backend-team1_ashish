const express = require('express');

const router = express.Router();

const {
  getExpense,
  setExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
  getTotalAmountByExpense
} = require('../controllers/expenseController');
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/').get(protect, getExpense).post(protect, upload.single('file'), setExpense);
router
  .route('/:id')
  .put(protect, upload.single('file'), updateExpense)
  .delete(protect, deleteExpense);
router.route('/summary').get(protect, getExpenseSummary);
router.route('/amountexpense').get(protect, getTotalAmountByExpense);

module.exports = router;
