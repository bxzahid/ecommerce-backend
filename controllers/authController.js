const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const generator = require('generate-password');
const parser = require('ua-parser-js');
const findUser = require('../utils/findUser');
const tokenGenerator = require('../utils/tokenGenerator');
const mailSender = require('../mailer/mailSender');
const loginValidator = require('../validators/loginValidator');
const generateAccessToken = require('../utils/generateAccessToken');
const passwordResetValidator = require('../validators/passwordResetValidator');
const changePasswordValidator = require('../validators/changePasswordValidator');
const AppError = require('../utils/errors/AppError');
const verifyToken = require('../utils/verifyToken');
const {
  APP_URL,
  REFRESH_SECRET_KEY,
  REFRESH_TOKEN_TIME,
  REFRESH_TOKEN_REMEMBER_TIME,
  SECRET_KEY,
  NODE_ENV,
} = require('../config/config');
// Generate Refresh token
const generateRefreshToken = async ({ user, req, rememberMe }) => {
  // Get user credentials for creating access and refresh token
  const { _id, password } = user;
  const loginHistory = { ...user.loginHistory };
  // Refresh token exp time
  let refreshTokenTime = REFRESH_TOKEN_TIME;
  if (rememberMe) {
    refreshTokenTime = REFRESH_TOKEN_REMEMBER_TIME;
  }

  // Create refresh token secret key using user hashed password
  const refreshTokenSecret = REFRESH_SECRET_KEY + password;

  // Create refresh token
  const refreshToken = jwt.sign({ _id }, refreshTokenSecret, {
    expiresIn: refreshTokenTime,
  });

  // get user browser and Os details
  const { browser, os } = parser(req.headers['user-agent']);

  // Update user login history details
  user.loginHistory = {
    ...loginHistory,
    [refreshToken]: {
      os,
      browser,
      lastLogin: new Date(),
    },
  };

  await user.save();

  return refreshToken;
};

// Create new activation link or resend new activation link
exports.resendActivationLink = async (req, res, next) => {
  const { _id } = req.params;

  try {
    const user = await findUser(_id);

    // If user not found
    if (!user) throw new AppError('User not found', 404);

    // If the account already activated
    if (user.isActivated)
      throw new AppError('Account already activated. Please login with your Username / Email and Password', 400);

    // Generate new Activation token and to the user
    user.activationToken = await tokenGenerator(user);

    // If user is sub admin then generate new temporary password
    let tempPassword = '';
    if (user.adminType === 'SUB_ADMIN') {
      // Create temporary password
      tempPassword = generator.generate({ numbers: true });
      //   Hash password
      user.password = bcrypt.hashSync(tempPassword, 10);
    }
    await user.save();

    // generate template
    let template = '';
    if (user.adminType === 'SUB_ADMIN') {
      template = `<a>${APP_URL}/${user._id}/active-account?token=${user.activationToken}</a> <br/> Your temporary password is: ${tempPassword}`;
    } else {
      template = `<a>${APP_URL}/${user._id}/active-account?token=${user.activationToken}</a>`;
    }

    // Send new activation token to user email after saving user data and response back to the user
    await mailSender({
      email: user.email,
      subject: 'Active your account',
      template,
    });

    res.status(201).json({
      _id: user._id,
      message: 'A new activation link has been sent to your email.',
    });
  } catch (error) {
    next(error);
  }
};

/* ========================================================================
============================== Active account =============================
======================================================================== */

exports.activeAccount = async (req, res, next) => {
  const { token } = req.query;

  try {
    // verify the activation token
    const { isInvalid, isExpired } = verifyToken(token, SECRET_KEY);

    // If token is invalid
    if (isInvalid) throw new AppError('Invalid activation link');

    // Decode the activation token
    const {
      payload: { _id },
    } = jwt.decode(token, { complete: true });

    // If token valid
    const user = await findUser(_id);

    // If user not found
    if (!user) throw new AppError('User not found', 404);

    // If the user account already activated then send response to the user
    if (user.isActivated)
      throw new AppError('Account already activated. Please login with your Username / Email and Password', 400);

    // If token isn't matched with user stored token
    if (user.activationToken !== token) throw new AppError('Invalid activation Link');

    // If token is expired then create new token and send it to the user email
    if (isExpired) {
      user.activationToken = await tokenGenerator(user);
      await user.save();

      // TODO:Have to make template
      const template = `<a>${APP_URL}/${user._id}/active-account?token=${user.activationToken}</a>`;

      // Send new activation token to user email after saving user data and response back to the user
      await mailSender({
        email: user.email,
        subject: 'Active your account',
        template,
      });

      throw new AppError('Activation link expired. A new activation link has been sent to your email', 401, {
        _id: user._id,
      });
    }

    // If all thing goes is Ok then active the user account
    user.activationToken = null;
    user.isActivated = true;
    await user.save();

    // Response back to the user
    return res.status(202).json({
      message: 'Account activated successfully. Now you can login with your Username / Email and Password',
    });
  } catch (error) {
    return next(error);
  }
};

/* ===============f=======================================================================
===================================== Login controller ==================================
========================================================================================= */
exports.login = async (req, res, next) => {
  try {
    const { user, password, rememberMe } = req.body;

    // Validate input data and throw error if data is invalid
    loginValidator({ user, password });

    const currentUser = await findUser(user);

    // If user not found
    if (!currentUser) throw new AppError('User not found', 404);

    // If user is disabled
    if (currentUser.isDisable) throw new AppError('Your account has been disabled', 404);

    // If user account not activated
    if (!currentUser.isActivated) {
      // Generate new activation token
      currentUser.activationToken = await tokenGenerator(currentUser);
      await currentUser.save();

      // TODO:Have to make template
      const template = `<a>${APP_URL}/${user._id}/active-account?token=${currentUser.activationToken}</a>`;

      // Send new activation token to user email after saving user data and response back to the user
      await mailSender({
        email: currentUser.email,
        subject: 'Active your account',
        template,
      });

      throw new AppError(
        `Your account isn't activated yet.A new activation link send to your email.Please verify your email`,
        401
      );
    }

    // If user password don't matched with the given password
    if (!bcrypt.compareSync(password, currentUser.password))
      throw new AppError('Invalid credential', 401, {
        password: 'Invalid password',
      });

    // TODO:Have to implement 2fa authentication

    // Create access token
    const accessToken = await generateAccessToken(currentUser);
    // Create refresh token and save the user
    const refreshToken = await generateRefreshToken({
      user: currentUser,
      rememberMe,
      req,
    });

    // Attach tokens with response
    res.cookie('x-refresh-token', refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production', // Use HTTPS always
    });

    res.cookie('x-access-token', accessToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production', // Use HTTPS always
    });

    return res.status(200).json({
      message: 'Login successful',
    });
  } catch (error) {
    return next(error);
  }
};

/* ============================================================================================
============================================ Forgot Password====================================
=============================================================================================== */

exports.forgotPassword = async (req, res, next) => {
  try {
    const { user } = req.body;

    const currentUser = await findUser(user);

    // If user not found
    if (!currentUser) throw new AppError('User not found', 404);

    const passwordResetToken = await tokenGenerator(currentUser);

    currentUser.passwordResetToken = passwordResetToken;

    await currentUser.save();

    const template = `<a href="${APP_URL}/reset-password?token=${currentUser.passwordResetToken}">Reset your password</a>`;

    await mailSender({
      email: currentUser.email,
      subject: 'Reset your password',
      template,
    });

    return res.status('201').json({ message: 'Password reset token has been sent to you email' });
  } catch (error) {
    return next(error);
  }
};

/* ============================================================================================
============================================ Reset Password====================================
=============================================================================================== */

exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.query;
    const { password, confirmPassword } = req.body;

    // Verify the activation token
    const { isInvalid, isExpired } = verifyToken(token, SECRET_KEY);

    // If token is invalid
    if (isInvalid) throw new AppError('Invalid password reset link');

    // Decode the activation token
    const {
      payload: { _id },
    } = jwt.decode(token, { complete: true });

    const user = await findUser(_id);

    // If user not found
    if (!user) throw new AppError('User not found', 400);

    // If token isn't matched with user stored token
    if (user.passwordResetToken !== token || isInvalid) throw new AppError('Invalid password reset token');

    // If token is expired then create new token and send it to the user email
    if (isExpired) {
      user.passwordResetToken = await tokenGenerator(user);
      await user.save();

      // TODO:Have to make template
      const template = `<a>${APP_URL}/${user._id}/password-reset?token=${user.passwordResetToken}</a>`;

      // Send new activation token to user email after saving user data and response back to the user
      await mailSender({
        email: user.email,
        subject: 'Reset your password',
        template,
      });

      throw new AppError('Password reset link expired. A new link has been sent to your email', 401, { _id: user._id });
    }

    // Validate password  if the password is invalid then throw error
    passwordResetValidator({ password, confirmPassword });

    // If all thing goes is Ok then reset the user password

    //   Hash password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    user.password = hash;
    user.passwordResetToken = '';
    await user.save();

    // Send mail to the user
    const template = 'Password reset successfully';
    mailSender({
      email: user.email,
      subject: 'Password reset successfully',
      template,
    });

    // Response to the user
    return res.status(205).json({
      message: 'Password reset successfully',
    });
  } catch (error) {
    return next(error);
  }
};

/* ======================================================================================
===================================== Change password =====================================
========================================================================================= */
exports.changePassword = async (req, res, next) => {
  try {
    const {
      user,
      body: { currentPassword, newPassword, confirmNewPassword },
    } = req;

    // If user password don't matched with the given password
    if (!bcrypt.compareSync(currentPassword, user.password))
      throw new AppError('Invalid credential', 401, {
        currentPassword: 'Invalid current password',
      });

    // Validate password  if the password is invalid then throw error
    changePasswordValidator({ newPassword, confirmNewPassword });

    //   Hash password and insert it into the user model
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPassword, salt);
    user.password = hash;

    // Logout from all device and browser
    user.loginHistory = {};

    // Create refresh token and save the user
    const refreshToken = await generateRefreshToken({ user, req });

    // Send mail to the user
    const template = 'Password change successfully';
    mailSender({
      email: user.email,
      subject: 'Password change successfully',
      template,
    });

    // Attach tokens with response
    res.cookie('x-refresh-token', refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production', // Use HTTPS always
    });

    return res.status(200).json({ message: 'Password change successfully' });
  } catch (error) {
    return next(error);
  }
};

/* ======================================================================================
===================================== Logout =============================================
========================================================================================= */
exports.logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies['x-refresh-token'];

    // Get the login user
    const { user } = req;

    // user login history
    const loginHistory = { ...user.loginHistory };

    // delete current login history
    delete loginHistory[refreshToken];

    user.loginHistory = { ...loginHistory };

    // Save the user
    await user.save();

    res.clearCookie('x-access-token');
    res.clearCookie('x-refresh-token');

    return res.status(200).json({ message: 'Logout successfully' });
  } catch (error) {
    return next(error);
  }
};

exports.test = async (req, res) => {
  res.json(req.user);
};
