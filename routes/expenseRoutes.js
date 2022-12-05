const express = require('express');

const router = express.Router();

const {
  getExpense,
  setExpense,
  updateExpense,
  deleteExpense
} = require('../controllers/expenseController');
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/').get(protect, getExpense).post(protect, upload.single('file'), setExpense);
router.route('/:id').put(protect, updateExpense).delete(protect, deleteExpense);

module.exports = router;
