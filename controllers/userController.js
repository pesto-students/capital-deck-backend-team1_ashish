const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, 'capitaldeck2022', {
    expiresIn: '30d'
  });
};

// @desc    Register New User
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, cpassword, dob } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  // Check password and confirm password different
  if (password !== cpassword) {
    res.status(400);
    throw new Error('Confirm password does not match with password');
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    dob
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
});

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// @desc    Update User Profile
// @route   PUT /api/users/:id
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, password, dob, contactno, gender } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(400);
    throw new Error('User not found');
  }

  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error('User not found');
  }

  // Make sure the logged in user matches the user
  if (user._id.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      name,
      email,
      password: hashedPassword,
      dob,
      contact_no: contactno,
      gender
    },
    {
      new: true
    }
  );

  res.status(200).json(updatedUser);
});

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile
};
