const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const ticketSchema = new Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      refPath: 'onModel',
    },
    onModel: {
      type: String,
      enum: ['Admin', 'Customer'],
    },
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'TicketCategory',
    },
    subject: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    files: [],
    status: String,
    state: String, // open/close
    managedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
    },
    TicketTimeline: [Object],
  },
  {
    timestamps: true,
  }
);

const Ticket = model('Ticket', ticketSchema);

module.exports = Ticket;
