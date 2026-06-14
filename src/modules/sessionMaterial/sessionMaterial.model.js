const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema(
  {
    /** Session this material belongs to */
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
      index: true,
    },

    /** User that uploaded the material (teacher / admin) */
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /** Human‑readable title */
    title: {
      type: String,
      required: true,
      trim: true,
    },

    /** Optional description */
    description: {
      type: String,
      default: "",
      trim: true,
    },

    /** Stored filename on disk (relative to the upload root) */
    filePath: {
      type: String,
      required: true,
    },

    /** MIME type of the uploaded file */
    mimeType: {
      type: String,
      required: true,
    },

    /** Size in bytes */
    size: {
      type: Number,
      required: true,
    },

    /** Optional expiration date */
    expiresAt: {
      type: Date,
      default: null,
    },

    /** Statistics */
    viewCount: { type: Number, default: 0 },
    downloadCount: { type: Number, default: 0 },

    /** Timestamp of the last view / download */
    lastViewedAt: { type: Date, default: null },
    lastDownloadedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  },
);

/* ------------------------------------------------------------------ */
/* Indexes – same style as the session model                           */
/* ------------------------------------------------------------------ */
materialSchema.index(
  {
    sessionId: 1,
  },
  { unique: true },
);

materialSchema.index({ sessionId: 1, title: 1 });

const sessionMaterialModel = mongoose.model("SessionMaterial", materialSchema);
module.exports = sessionMaterialModel;
