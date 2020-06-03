const dotNotationTool = require('mongo-dot-notation-tool');
const AppError = require('../utils/errors/AppError');

// Profile validator

const validateProfile = ({ name, phone }) => {
  const error = {};

  if (name && name.firstName === '') {
    error.name = { firstName: 'First name is required' };
  }

  if (name && name.lastName === '') {
    error.name = { lastName: 'Last name is required' };
  }

  if (phone === '') {
    error.phone = 'Phone is required';
  }

  if (Object.keys(error).length > 0) throw new AppError('Validation failed', 400, error);

  return true;
};

/* ======================================================================================
/* =============================== Update profile =======================================
/* ====================================================================================== */

exports.edit = async (req, res, next) => {
  try {
    const { user, body } = req;

    validateProfile(body);

    user.profile.set(dotNotationTool.encode(body));
    await user.profile.save();

    return res.status(200).json({
      message: 'Profile update successfully',
      profile: user.profile,
    });
  } catch (error) {
    return next(error);
  }
};

/* ======================================================================================
/* =============================== get profile =======================================
/* ====================================================================================== */

exports.getProfile = async (req, res, next) => {
  try {
    return res.status(200).json(req.user.profile);
  } catch (error) {
    return next(error);
  }
};
