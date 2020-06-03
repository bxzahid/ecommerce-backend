const AppError = require('../utils/errors/AppError');

module.exports = ({ newPassword, confirmNewPassword }) => {
  const error = {};

  if (!newPassword) {
    error.newPassword = 'You Have to Provide a Valid Password';
  } else if (newPassword.length < 6) {
    error.newPassword = 'Password must be greater than 6 character';
  }

  if (!confirmNewPassword) {
    error.confirmNewPassword = 'You Have to Confirm Your Password';
  } else if (!(newPassword === confirmNewPassword)) {
    error.confirmNewPassword = `Password doesn't matched`;
  }
  if (Object.keys(error).length > 0) {
    throw new AppError('Wrong credentials ', 406, error);
  }

  return true;
};
