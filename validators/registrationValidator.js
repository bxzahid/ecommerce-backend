const validator = require('validator');
const AppError = require('../utils/errors/AppError');
const findUser = require('../utils/findUser');

const registrationValidator = async ({
  firstName,
  lastName,
  phone,
  userName,
  email,
  password,
  confirmPassword,
  isSubAdmin = false,
}) => {
  const error = {};

  if (!firstName) {
    error.firstName = 'You Have to Provide First Name';
  }

  if (!lastName) {
    error.lastName = 'You Have to Provide Last Name';
  }

  if (!phone) {
    error.lastName = 'You Have to Provide phone number';
  }

  if (!userName) {
    error.userName = 'You Have to Provide an Username';
  } else if (await findUser(userName)) {
    error.userName = 'Username already exist';
  }

  if (!email) {
    error.email = 'You Have to Provide a Email';
  } else if (!validator.isEmail(email)) {
    error.email = 'You Have to Provide a Valid Email';
  } else if (await findUser(email)) {
    error.email = 'Email already exist';
  }

  if (!isSubAdmin) {
    if (!password) {
      error.password = 'You Have to Provide a Valid Password';
    } else if (password.length < 6) {
      error.password = 'Password must be gather than 6 character';
    }

    if (!confirmPassword) {
      error.confirmPassword = 'You Have to Confirm Your Password';
    } else if (!(password === confirmPassword)) {
      // eslint-disable-next-line quotes
      error.confirmPassword = "Password doesn't matched";
    }
  }

  if (Object.keys(error).length > 0) {
    throw new AppError('Validation failed', 400, error);
  }

  return true;
};

module.exports = registrationValidator;
