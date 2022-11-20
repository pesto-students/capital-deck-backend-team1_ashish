const express = require('express');

const router = express.Router();

const {
  getExpense,
  setExpense,
  updateExpense,
  deleteExpense
} = require('../controllers/expenseController');
const protect = require('../middleware/authMiddleware');

router.route('/').get(protect, getExpense).post(protect, setExpense);
router.route('/:id').put(protect, updateExpense).delete(protect, deleteExpense);

module.exports = router;
