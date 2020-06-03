const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const adminSchema = new Schema(
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
    managedTickets: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Ticket',
      },
    ],
    rootAdminChangeToken: {
      type: String,
      default: null,
    },
    admin: {
      type: Boolean,
      default: true,
    },
    adminType: {
      type: String,
      default: 'stuff',
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
function autoPopulateProfile(next) {
  this.populate('profile');
  if (this.role) {
    this.populate('role');
  }
  next();
}

adminSchema
  .pre('findOne', autoPopulateProfile)
  .pre('find', autoPopulateProfile)
  .pre('findById', autoPopulateProfile);
const Admin = model('Admin', adminSchema);

module.exports = Admin;
