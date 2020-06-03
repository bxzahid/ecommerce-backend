const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/config');

module.exports = async ({ _id }) => {
  return jwt.sign({ _id }, SECRET_KEY, {
    expiresIn: '7d',
  });
};
