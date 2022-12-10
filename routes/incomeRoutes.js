const express = require('express');

const router = express.Router();

const {
  getIncome,
  setIncome,
  updateIncome,
  deleteIncome,
  getIncomeSummary,
  getTotalAmountByIncome,
  getRecentIncome
} = require('../controllers/incomeController');
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/').get(protect, getIncome).post(protect, upload.single('file'), setIncome);
router
  .route('/:id')
  .put(protect, upload.single('file'), updateIncome)
  .delete(protect, deleteIncome);
router.route('/summary').get(protect, getIncomeSummary);
router.route('/amountincome').get(protect, getTotalAmountByIncome);
router.route('/recent').get(protect, getRecentIncome);

module.exports = router;
