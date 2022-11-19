const express = require('express');

const router = express.Router();

const {
  getIncome,
  setIncome,
  updateIncome,
  deleteIncome
} = require('../controllers/incomeController');
const protect = require('../middleware/authMiddleware');

router.route('/').get(protect, getIncome).post(protect, setIncome);
router.route('/:id').put(protect, updateIncome).delete(protect, deleteIncome);
module.exports = router;
