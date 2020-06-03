const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const customerSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    userName: {
      type: String,
      unique: true,
      trim: true,
    },
    twoFa: {
      isActive: {
        type: Boolean,
        default: false,
      },
      pin: {
        type: Number,
        default: null,
      },
    },
    isActivated: {
      type: Boolean,
      default: false,
    },
    isDisable: {
      type: Boolean,
      default: false,
    },
    activationToken: {
      type: String,
      trim: true,
      default: null,
    },
    passwordResetToken: {
      type: String,
      trim: true,
      default: null,
    },
    loginHistory: {
      type: Object,
      default: {},
    },
    profile: {
      type: Schema.Types.ObjectId,
      ref: 'Profile',
    },
    notifications: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Notification',
      },
    ],
    tickets: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Ticket',
      },
    ],
    wishLists: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    myWallet: {
      amount: {
        type: Number,
        default: 0,
      },
      walletTransaction: [Object],
    },
    referral: String,
    cart: {
      type: Schema.Types.ObjectId,
      ref: 'Cart',
    },
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Ticket',
      },
    ],
    transactions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Transaction',
      },
    ],
  },
  {
    timestamps: true,
  }
);

function autoPopulateProfile(next) {
  this.populate('profile');
  next();
}

customerSchema
  .pre('findOne', autoPopulateProfile)
  .pre('find', autoPopulateProfile)
  .pre('findById', autoPopulateProfile);
const Customer = model('Customer', customerSchema);

module.exports = Customer;
