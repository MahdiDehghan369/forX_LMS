const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

const ticketTagSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    color: {
      type: String,
      trim: true,
      default: "#6c757d",
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

ticketTagSchema.index({ isActive: 1, name: 1 }, { unique: false });

ticketTagSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.name = this.name.trim().toLowerCase();
  }
  next();
});

module.exports = model("TicketTag", ticketTagSchema);