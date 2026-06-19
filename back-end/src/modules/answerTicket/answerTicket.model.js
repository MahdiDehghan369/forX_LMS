const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const answerTicketSchema = new Schema(
  {
    ticketId: {
      type: Types.ObjectId,
      ref: 'Ticket',
      required: true,
      index: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    attachments: {
      type: [String],
      default: [],
    },
    isSolution: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = model('AnswerTicket', answerTicketSchema);
