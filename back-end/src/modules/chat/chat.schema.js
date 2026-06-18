const { object, string, number } = require("yup");

const objectIdPattern = /^[0-9a-fA-F]{24}$/;
const objectId = string().matches(objectIdPattern, "شناسه وارد شده معتبر نیست.");

// ─── Conversation ─────────────────────────────────────────────────────────────

const getOrCreateConversationSchema = object({
  target_user_id: objectId.required("شناسه کاربر مقابل الزامی است."),
  course_id: objectId.optional(),
});

const conversationIdSchema = object({
  conversationId: objectId.required("شناسه مکالمه الزامی است."),
});

// ─── Messages ─────────────────────────────────────────────────────────────────

const getMessagesQuerySchema = object({
  page: number().integer().min(1).default(1),
});

const editMessageParamsSchema = object({
  conversationId: objectId.required(),
  messageId: objectId.required(),
});

const editMessageBodySchema = object({
  content: string()
    .trim()
    .min(1, "محتوای پیام نمی‌تواند خالی باشد.")
    .max(2000, "پیام نمی‌تواند بیشتر از ۲۰۰۰ کاراکتر باشد.")
    .required("محتوای جدید پیام الزامی است."),
});

const deleteMessageParamsSchema = object({
  conversationId: objectId.required(),
  messageId: objectId.required(),
});

module.exports = {
  getOrCreateConversationSchema,
  conversationIdSchema,
  getMessagesQuerySchema,
  editMessageParamsSchema,
  editMessageBodySchema,
  deleteMessageParamsSchema,
};