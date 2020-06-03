const mongoose = require("mongoose");
const { isEmail } = require("validator");
const Customer = require("../models/Customer");
const Admin = require("../models/Admin");

module.exports = async query => {
  let user = null,
    _id,
    email,
    userName;

  //Catch query type _id/email/username
  if (mongoose.Types.ObjectId.isValid(query)) {
    _id = query;
  } else if (isEmail(query)) {
    email = query;
  } else {
    userName = query;
  }

  //   Find a user by user id
  if (_id) {
    user = await Customer.findById(_id);

    if (!user) {
      user = await Admin.findById(_id);
    }

    return user;
  }

  //   Find a user by email
  if (email) {
    user = await Customer.findOne({ email });

    if (!user) {
      user = await Admin.findOne({ email });
    }

    return user;
  }

  //   Find a user by userName
  if (userName) {
    user = await Customer.findOne({ userName });

    if (!user) {
      user = await Admin.findOne({ userName });
    }

    return user;
  }

  return user;
};
