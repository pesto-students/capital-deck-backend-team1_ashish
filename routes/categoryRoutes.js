const express = require('express');

const router = express.Router();

const {
  getCategories,
  setCategory,
  updateCategory,
  deleteCategory,
  getCategoriesByType
} = require('../controllers/categoryController');
const protect = require('../middleware/authMiddleware');

router.route('/').get(protect, getCategories).post(protect, setCategory);
router.route('/:id').delete(protect, deleteCategory).put(protect, updateCategory);
router.route('/:categorytype').get(protect, getCategoriesByType);
module.exports = router;
