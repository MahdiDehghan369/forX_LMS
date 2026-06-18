const mongoose = require("mongoose");

const sessionNoteSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Optional status for soft‑archive / visibility control
    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

// Unique index for a note per session+creator (optional, prevents duplicate notes)
sessionNoteSchema.index(
  { sessionId: 1, createdBy: 1 },
  { unique: false },
);

module.exports = mongoose.model("SessionNote", sessionNoteSchema);
