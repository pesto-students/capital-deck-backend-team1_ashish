const express = require('express');

const router = express.Router();

const { getAlert, setAlert, deleteAlert } = require('../controllers/alertController');

const protect = require('../middleware/authMiddleware');

router.route('/').get(protect, getAlert).post(protect, setAlert);
router.route('/:id').delete(protect, deleteAlert);

module.exports = router;
