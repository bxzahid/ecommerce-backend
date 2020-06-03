const jwt = require("jsonwebtoken");

module.exports = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    const { message } = error;
    if (message === "invalid signature") {
      return { isInvalid: true };
    }

    if (message === "jwt expired") {
      return { isExpired: true };
    }

    throw error;
  }
};
