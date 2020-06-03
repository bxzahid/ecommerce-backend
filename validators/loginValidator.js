const validator = require("validator");
const AppError = require("../utils/errors/AppError");
module.exports = ({ user, password }) => {
  const error = {};

  if (!user) {
    error.user = "You Have to Provide an Username/Email";
  }

  if (!password) {
    error.password = "You Have to Provide a Valid Password";
  }

  if (Object.keys(error).length > 0) {
    throw new AppError("Wrong credentials ", 406, error);
  }

  return true;
};
