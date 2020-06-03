/* ======================================================================================
/* =============================== Add user into req ===========================================
/* ====================================================================================== */
const jwt = require('jsonwebtoken');
const findUser = require('../utils/findUser');

module.exports = async (req, res, next) => {
  try {
    const refreshToken = req.cookies['x-refresh-token'];

    if (!refreshToken) {
      req.user = null;
      return next();
    }

    const {
      payload: { _id },
    } = jwt.decode(refreshToken, { complete: true });

    const user = await findUser(_id);

    if (user) {
      req.user = user;
      return next();
    }

    req.user = null;
    return next();
  } catch (error) {
    return next(error);
  }
};
