/**
 * Mongoose model for course enrollment.
 * Mirrors the pattern of other models (session, material).
 */

const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const enrollmentSchema = new Schema(
  {
    /** Course reference */
    courseId: {
      type: Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    /** User (student) reference */
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    /** When the enrollment was created */
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    /** Enrollment status */
    status: {
      type: String,
      enum: ["active", "completed", "dropped", "pending"],
      default: "pending",
      index: true,
    },
    /** Timestamp when marked completed */
    completedAt: { type: Date, default: null },
    /** Timestamp when dropped */
    droppedAt: { type: Date, default: null },
    /** Who created the enrollment (admin/teacher/self) */
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

// Unique compound index to prevent duplicate enrollment of same user in same course
enrollmentSchema.index({ courseId: 1, userId: 1 }, { unique: true });

enrollmentSchema.index({ courseId: 1, status: 1 });

enrollmentSchema.index({ userId: 1, status: 1 });

const enrollmentModel = mongoose.model("CourseEnrollment", enrollmentSchema);
module.exports = enrollmentModel;
