const AppError = require('../utils/errors/AppError');

module.exports = (req, res, next) => {
  try {
    if (req.user.adminType !== 'ROOT_ADMIN') throw new AppError(`Your aren't permitted for doing this action`, 203);
    return next();
  } catch (error) {
    return next(error);
  }
};
