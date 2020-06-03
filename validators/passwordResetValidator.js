const AppError = require('../utils/errors/AppError');

module.exports = ({ password, confirmPassword }) => {
  const error = {};

  if (!password) {
    error.password = 'You Have to Provide a Valid Password';
  } else if (password.length < 6) {
    error.password = 'Password must be greater than 6 character';
  }

  if (!confirmPassword) {
    error.confirmPassword = 'You Have to Confirm Your Password';
  } else if (!(password === confirmPassword)) {
    // eslint-disable-next-line quotes
    error.confirmPassword = "Password doesn't matched";
  }

  if (Object.keys(error).length > 0) {
    throw new AppError('Wrong credentials ', 406, error);
  }

  return true;
};
