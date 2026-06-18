const mongoose = require("mongoose");

// ─── Message Sub-Schema ───────────────────────────────────────────────────────
const messageSchema = new mongoose.Schema(
  {
    sender_id: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
    content: {
      type: String,
      trim: true,
      default: null,
    },
    type: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text",
    },
    file_url: {
      type: String,
      default: null,
    },
    is_edited: {
      type: Boolean,
      default: false,
    },
    edited_at: {
      type: Date,
      default: null,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
    seen_at: {
      type: Date,
      default: null,
    },
    is_seen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ─── Conversation Schema ──────────────────────────────────────────────────────
const conversationSchema = new mongoose.Schema(
  {
    // دو طرف مکالمه — همیشه [student_id, teacher_id]
    participants: [
      {
        type: mongoose.Types.ObjectId,
        ref: "users",
        required: true,
      },
    ],
    // کورس مرتبط (اختیاری — برای فیلتر کردن مکالمات هر درس)
    course_id: {
      type: mongoose.Types.ObjectId,
      ref: "courses",
      default: null,
    },
    messages: [messageSchema],
    // آخرین پیام برای نمایش در لیست مکالمات
    last_message: {
      content: { type: String, default: null },
      sender_id: { type: mongoose.Types.ObjectId, default: null },
      sent_at: { type: Date, default: null },
      type: { type: String, enum: ["text", "image", "file"], default: "text" },
    },
    // تعداد پیام‌های خوانده‌نشده به تفکیک هر شرکت‌کننده
    unread_count: {
      type: Map,
      of: Number,
      default: {},
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// جلوگیری از ساخت مکالمه تکراری بین دو نفر برای یک کورس
conversationSchema.index(
  { participants: 1, course_id: 1 },
  { unique: true, sparse: true }
);
conversationSchema.index({ "participants": 1 });
conversationSchema.index({ "last_message.sent_at": -1 });

const model = mongoose.model("conversations", conversationSchema);

module.exports = model;
