const mongoose = require("mongoose");

const answerTicketSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    creator: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "users",
    },
    ticket: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "tickets",
    },
    parentAnswer : {
      type: mongoose.Types.ObjectId,
      ref: "answerTickets",
    }
  },
  {
    timestamps: true,
  },
);

const answerTicketModel = mongoose.model('answerTickets', answerTicketSchema);

module.exports = answerTicketModel;
