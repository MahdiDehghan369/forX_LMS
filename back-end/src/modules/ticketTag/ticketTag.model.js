const mongoose = require("mongoose");

const ticketTagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const ticketTagsModel = mongoose.model('ticketTags', ticketTagSchema);

module.exports = ticketTagsModel;
