const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ticketSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Open", "Pending", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },
    priority: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5],
      default: 5,
    },
    department: {
      type: mongoose.Types.ObjectId,
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TicketTag",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Ticket = model("Ticket", ticketSchema);
module.exports = Ticket;
