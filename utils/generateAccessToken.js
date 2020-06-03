const jwt = require('jsonwebtoken');
const { SECRET_KEY, ACCESS_TOKEN_TIME } = require('../config/config');

module.exports = user => {
  // Get user credentials for creating access  token
  const { _id, userName, admin, adminType, role, profile } = user;

  const adminInfo = {};

  // If user is an admin then add admin credentials into the  token
  if (admin) {
    adminInfo.admin = admin;
    adminInfo.adminType = adminType;
    adminInfo.role = role;
  }

  return jwt.sign(
    { user: { _id, userName, profile, ...adminInfo } },
    SECRET_KEY,
    // FIXME: Have to add RSA 256 algorithm
    { expiresIn: ACCESS_TOKEN_TIME }
  );
};
