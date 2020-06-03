const bcrypt = require('bcryptjs');
const generator = require('generate-password');
const _ = require('lodash');
const Admin = require('../models/Admin');
const Profile = require('../models/Profile');
const tokenGenerator = require('../utils/tokenGenerator');
const mailSender = require('../mailer/mailSender');
const registrationValidator = require('../validators/registrationValidator');
const AppError = require('../utils/errors/AppError');
const { APP_URL } = require('../config/config');

module.exports.createRootAdmin = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, userName, email, password } = req.body;

    const rootAdminExist = await Admin.findOne({
      adminType: 'ROOT_ADMIN',
    });

    // If root admin already registered then redirect to login page
    if (rootAdminExist) {
      return res.status(301).redirect('/login');
    }

    // Valid input data and throw error if data is invalid
    await registrationValidator(req.body);

    //   Hash password
    const hash = bcrypt.hashSync(password, 10);

    const admin = new Admin({
      userName,
      email,
      password: hash,
      adminType: 'ROOT_ADMIN',
    });

    // Create profile
    const profile = new Profile({
      name: {
        firstName,
        lastName,
      },
      phone,
      user: admin._id,
      onModel: 'Admin',
    });

    // Create an assign activation token
    admin.activationToken = await tokenGenerator(admin);
    admin.profile = profile._id;

    await profile.save();
    await admin.save();

    // TODO:Have to make template
    const template = `<a>${APP_URL}/${admin._id}/active-account?token=${admin.activationToken}</a>`;

    await mailSender({
      subject: 'Active your account',
      email: admin.email,
      template,
    });

    return res.status(201).json({
      _id: admin._id,
      message: 'Root Admin created successfully. Please verify your email.',
    });
  } catch (error) {
    return next(error);
  }
};

/* ======================================================================================
/* =============================== Create sub admin ===========================================
/* ====================================================================================== */
exports.createAdmin = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, userName, email, role } = req.body;

    // Valid input data and throw error if data is invalid
    await registrationValidator({ firstName, lastName, phone, userName, email, isSubAdmin: true });

    // Create temporary password
    const tempPassword = generator.generate({ numbers: true });
    //   Hash password
    const hash = bcrypt.hashSync(tempPassword, 10);

    // Create sub admin
    const admin = new Admin({
      userName,
      email,
      password: hash,
      adminType: 'SUB_ADMIN',
      role,
    });

    // Create profile
    const profile = new Profile({
      name: {
        firstName,
        lastName,
      },
      phone,
      user: admin._id,
      onModel: 'Admin',
    });

    // Create an assign activation token
    admin.activationToken = await tokenGenerator(admin);
    admin.profile = profile._id;
    await profile.save();
    await admin.save();

    // TODO:Have to make template
    const template = `<a>${APP_URL}/${admin._id}/active-account?token=${admin.activationToken}</a>  Your temporary password is : ${tempPassword} <br/> `;

    await mailSender({
      subject: 'Active your account',
      email: admin.email,
      template,
    });

    return res.status(201).json({
      _id: admin._id,
      message: 'Sub admin created successfully.',
    });
  } catch (error) {
    return next(error);
  }
};

/* ======================================================================================
/* =============================== Get all admins ===========================================
/* ====================================================================================== */
exports.getAllAdmins = async (req, res, next) => {
  try {
    const allAdmins = (await Admin.find({ adminType: 'SUB_ADMIN' })
      .select('isDisable userName email loginHistory')
      .populate('profile', ['name', 'avatar'])
      .populate('role'))
      // Filter last login from login history
      .map(admin => {
        const { loginHistory } = admin;
        let lastLoginHistory = null;

        _.forOwn(loginHistory, history => {
          if (!lastLoginHistory) {
            lastLoginHistory = history;
          } else if (history.lastLogin > lastLoginHistory.lastLogin) {
            lastLoginHistory = history;
          }
        });

        admin.loginHistory = { ...lastLoginHistory };
        return admin;
      });

    if (!allAdmins) throw new AppError('No admin found', 404);

    return res.status(201).json(allAdmins);
  } catch (error) {
    return next(error);
  }
};

/* ======================================================================================
/* =============================== Change sub admin rules ===========================================
/* ====================================================================================== */
exports.changeRole = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const { role } = req.body;
    await Admin.findByIdAndUpdate(_id, { $set: { role } });

    return res.status(200).json({ message: 'Role has been changed successfully' });
  } catch (error) {
    return next(error);
  }
};

/* ======================================================================================
/* =============================== Disable sub admin ===========================================
/* ====================================================================================== */
exports.disableAdmin = async (req, res, next) => {
  try {
    const { _id } = req.params;
    await Admin.findByIdAndUpdate(_id, { $set: { isDisable: true } });

    return res.status(200).json({ message: 'Admin disabled successfully' });
  } catch (error) {
    return next(error);
  }
};

/* ======================================================================================
/* =============================== Enable sub admin ===========================================
/* ====================================================================================== */
exports.enableAdmin = async (req, res, next) => {
  try {
    const { _id } = req.params;
    await Admin.findByIdAndUpdate(_id, { $set: { isDisable: false } });

    return res.status(200).json({ message: 'Admin enable successfully' });
  } catch (error) {
    return next(error);
  }
};
