const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const Customer = require('../models/Customer');
const Profile = require('../models/Profile');
const tokenGenerator = require('../utils/tokenGenerator');
const mailSender = require('../mailer/mailSender');
const registrationValidator = require('../validators/registrationValidator');
const AppError = require('../utils/errors/AppError');
const { APP_URL, SECRET_KEY } = require('../config/config');

/* ======================================================================================
/* =============================== Create customer ===========================================
/* ====================================================================================== */
exports.createCustomer = async (req, res, next) => {
  try {
    const { ref } = req.query;
    const { firstName, lastName, phone, userName, email, password, confirmPassword } = req.body;
    // Valid input data and throw error if data is invalid
    await registrationValidator({ firstName, lastName, phone, userName, email, password, confirmPassword });

    //   Hash password
    const hash = bcrypt.hashSync(password, 10);

    const customer = new Customer({
      userName,
      email,
      password: hash,
    });

    // Create profile
    const profile = new Profile({
      name: {
        firstName,
        lastName,
      },
      phone,
      user: customer._id,
      onModel: 'Customer',
    });

    // Create an assign activation token
    customer.activationToken = await tokenGenerator(customer);
    customer.profile = profile._id;

    customer.referral = jwt.sign({ _id: customer._id }, SECRET_KEY);

    // If this customer registered with referral link
    if (ref) {
      const {
        payload: { _id },
      } = jwt.decode(ref, { complete: true });

      // Add referral bonus into referral customer wallet
      const referredUser = await Customer.findById(_id);

      // eslint-disable-next-line prefer-const
      let { amount, walletTransaction } = { ...referredUser.myWallet };

      amount += 30; // TODO:Have to add referral amount dynamically by admin

      referredUser.myWallet = {
        amount,
        walletTransaction: [...walletTransaction, { credit: 30, data: new Date() }],
      };

      await referredUser.save();

      // Add referral bonus into current customer wallet
      customer.myWallet = {
        amount: 30,
        walletTransaction: [{ credit: 30, data: new Date() }],
      };
    }

    await profile.save();
    await customer.save();

    // TODO:Have to make template
    const template = `<a>${APP_URL}/${customer._id}/active-account?token=${customer.activationToken}</a>`;

    await mailSender({
      subject: 'Active your account',
      email: customer.email,
      template,
    });

    return res.status(201).json({
      _id: customer._id,
      message: 'Account created successfully. Please verify your email.',
    });
  } catch (error) {
    return next(error);
  }
};

/* ======================================================================================
/* =============================== Get all Customer ===========================================
/* ====================================================================================== */
exports.getAllCustomers = async (req, res, next) => {
  try {
    const allCustomers = (await Customer.find()
      .select('isDisable userName email loginHistory')
      .populate('profile', ['name', 'avatar']))
      // Filter last login from login history
      .map(customer => {
        const { loginHistory } = customer;
        let lastLoginHistory = null;

        _.forOwn(loginHistory, history => {
          if (!lastLoginHistory) {
            lastLoginHistory = history;
          } else if (history.lastLogin > lastLoginHistory.lastLogin) {
            lastLoginHistory = history;
          }
        });

        customer.loginHistory = { ...lastLoginHistory };
        return customer;
      });

    if (!allCustomers) throw new AppError('No customer found', 404);

    return res.status(201).json(allCustomers);
  } catch (error) {
    return next(error);
  }
};

/* ======================================================================================
/* =============================== Disable customer ===========================================
/* ====================================================================================== */
exports.disableCustomer = async (req, res, next) => {
  try {
    const { _id } = req.params;
    await Customer.findByIdAndUpdate(_id, { $set: { isDisable: true } }, { new: true });

    return res.status(200).json({ message: 'Customer disabled successfully' });
  } catch (error) {
    return next(error);
  }
};

/* ======================================================================================
/* =============================== Enable Customer ===========================================
/* ====================================================================================== */
exports.enableCustomer = async (req, res, next) => {
  try {
    const { _id } = req.params;
    await Customer.findByIdAndUpdate(_id, { $set: { isDisable: false } });

    return res.status(200).json({ message: 'Customer enable successfully' });
  } catch (error) {
    return next(error);
  }
};
