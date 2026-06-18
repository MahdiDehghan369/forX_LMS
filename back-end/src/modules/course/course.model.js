const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const CourseSchema = new Schema(
  {
    courseCode: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 220,
      index: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    instructorId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },
    publishedAt: { type: Date },
    archivedAt: { type: Date },
    startsAt: { type: Date, index: true },
    endsAt: { type: Date, index: true },
    createdByAdminId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

CourseSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    if (this.status === "published" && !this.publishedAt)
      this.publishedAt = new Date();
    if (this.status === "archived" && !this.archivedAt)
      this.archivedAt = new Date();
  }
  next();
});

const courseModel = model("Course", CourseSchema);
module.exports = courseModel;
