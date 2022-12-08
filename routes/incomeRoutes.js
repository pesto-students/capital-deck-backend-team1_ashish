const express = require('express');

const router = express.Router();

const {
  getIncome,
  setIncome,
  updateIncome,
  deleteIncome,
  getIncomeSummary
} = require('../controllers/incomeController');
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/').get(protect, getIncome).post(protect, upload.single('file'), setIncome);

router
  .route('/:id')
  .put(protect, upload.single('file'), updateIncome)
  .delete(protect, deleteIncome);
router.route('/summary').get(protect, getIncomeSummary);

module.exports = router;
