const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    sessionNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    startAt: {
      type: Date,
      required: true,
    },

    endAt: {
      type: Date,
      required: true,
    },

    durationMinutes: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ["scheduled", "live", "completed", "cancelled"],
      default: "scheduled",
    },

    location: {
      type: String,
      default: null,
      trim: true,
    },

    meetingLink: {
      type: String,
      default: null,
      trim: true,
    },

    cancelReason: {
      type: String,
      default: null,
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

sessionSchema.index(
  {
    courseId: 1,
    sessionNumber: 1,
  },
  {
    unique: true,
  },
);

sessionSchema.index({
  courseId: 1,
  startAt: 1,
});

const sessionModel = mongoose.model("Session", sessionSchema);
module.exports = sessionModel;
