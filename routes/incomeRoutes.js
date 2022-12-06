const express = require('express');

const router = express.Router();

const {
  getIncome,
  setIncome,
  updateIncome,
  deleteIncome
} = require('../controllers/incomeController');
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/').get(protect, getIncome).post(protect, upload.single('file'), setIncome);
router.route('/:id').put(protect, updateIncome).delete(protect, deleteIncome);
module.exports = router;
