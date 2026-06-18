const mongoose = require("mongoose");

const departmentsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    href: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const departmentModel = mongoose.model('departments', departmentsSchema);

module.exports = departmentModel;
