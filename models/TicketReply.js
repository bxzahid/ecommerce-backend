const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const ticketReplySchema = new Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      refPath: 'onModel',
    },
    onModel: {
      type: String,
      enum: ['Admin', 'Customer'],
    },
    message: {
      type: String,
      trim: true,
    },
    files: [String],
    to: String, // User or Admin : A reply for whom
    ticket: {
      type: Schema.Types.ObjectId,
      ref: 'Ticket',
    },
  },
  {
    timestamps: true,
  }
);

const TicketReply = model('TicketReply', ticketReplySchema);

module.exports = TicketReply;
