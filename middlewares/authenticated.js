const verifyToken = require('../utils/verifyToken');
const generateAccessToken = require('../utils/generateAccessToken');
const { SECRET_KEY, REFRESH_SECRET_KEY, NODE_ENV } = require('../config/config');

module.exports = async (req, res, next) => {
  try {
    // Get the refresh token
    const refreshToken = req.cookies['x-refresh-token'];
    const accessToken = req.cookies['x-access-token'];

    // If access and refresh is undefined then logout user
    if (!refreshToken || !accessToken) throw new Error();

    // Verify access token
    const { user, isInvalid, isExpired } = verifyToken(accessToken, SECRET_KEY);

    // If access token is Invalid then logout user
    if (isInvalid) throw new Error();

    // If access token is valid then continue the user
    if (user) {
      return next();
    }

    // If access token is expired
    if (isExpired) {
      const loginHistory = { ...req.user.loginHistory };

      //  check user login history has the token if not then logout the user
      if (!Object.keys(loginHistory).includes(refreshToken)) throw new Error();

      // Verify the token
      const { isInvalid: refreshIsInvalid, isExpired: refreshIsExpired } = verifyToken(
        refreshToken,
        `${REFRESH_SECRET_KEY}${req.user.password}`
      );

      // If refresh token is Invalid/Expired then logout the user
      if (refreshIsInvalid || refreshIsExpired) throw new Error();

      //   If all things goes well then the user is authorized

      // Create access token and attach with response
      const newAccessToken = await generateAccessToken(req.user);
      res.cookie('x-access-token', newAccessToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production', // Use HTTPS always
      });

      const refreshTokenDetails = { ...loginHistory[refreshToken] };
      refreshTokenDetails.lastLogin = new Date();

      //   Update last login details and save the user
      loginHistory[refreshToken] = refreshTokenDetails;

      req.user.loginHistory = {
        ...loginHistory,
      };

      await req.user.save();

      return next();
    }

    throw new Error();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);

    res.clearCookie('x-access-token');
    res.clearCookie('x-refresh-token');
    error.message = 'Authentication failed';
    error.status = 401;
    return next(error);
  }
};
