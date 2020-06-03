const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const role = new Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    permissions: [Object],
  },
  {
    timestamps: true,
  }
);

const Role = model('Role', role);

module.exports = Role;
