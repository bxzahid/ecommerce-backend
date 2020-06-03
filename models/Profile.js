const mongoose = require('mongoose');

const { Schema, model } = mongoose;
const commonType = {
  type: String,
  trim: true,
  default: '',
};
const profileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      refPath: 'onModel',
    },
    onModel: {
      type: String,
      enum: ['Admin', 'Customer'],
    },
    name: {
      firstName: commonType,
      lastName: commonType,
    },
    address: {
      street: commonType,
      city: commonType,
      state: commonType,
      zip: { type: Number, default: null },
    },
    avatar: commonType,
    phone: {
      type: Number,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Profile = model('Profile', profileSchema);

module.exports = Profile;
