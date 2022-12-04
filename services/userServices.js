const User = require('../models/userModel');

const getUserByIdService = async (id) => {
  const user = await User.findById(id);
  return user;
};

const checkUserExistService = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

const createUserervice = async (name, email, hashedPassword, dob) => {
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    dob
  });
  return user;
};

const updateUserByIdService = async (
  id,
  name,
  email,
  hashedPassword,
  dob,
  contactno,
  gender,
  filename,
  filepath
) => {
  let userData = {
    name,
    email,
    dob,
    contact_no: contactno,
    gender
  };

  if (hashedPassword !== '' && hashedPassword !== undefined) {
    userData = {
      ...userData,
      password: hashedPassword
    };
  }

  if (filename !== '' && filename !== undefined && filepath !== '' && filepath !== undefined) {
    userData = {
      ...userData,
      file_name: filename,
      file_path: filepath
    };
  }

  const updatedUser = await User.findByIdAndUpdate(id, userData, {
    new: true
  });
  return updatedUser;
};

module.exports = {
  getUserByIdService,
  checkUserExistService,
  createUserervice,
  updateUserByIdService
};
