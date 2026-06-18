const chatRoutes = {
  configs: {
    prefix: "/api/v1/chat",
    controller: "chatController",
  },
  routes: [
    // ─── Conversations ──────────────────────────────────────────────────────
    {
      // گرفتن یا ساختن مکالمه با طرف مقابل
      url: "/conversations",
      methodName: "getOrCreateConversation",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["getOrCreateConversationSchema", "body"] },
      ],
      httpMethod: "post",
    },
    {
      // لیست تمام مکالمات کاربر جاری
      url: "/conversations",
      methodName: "getUserConversations",
      middlewares: [
        { name: "authMiddleware" },
      ],
      httpMethod: "get",
    },

    // ─── Messages ───────────────────────────────────────────────────────────
    {
      // دریافت پیام‌های یک مکالمه با pagination
      url: "/conversations/:conversationId/messages",
      methodName: "getMessages",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["conversationIdSchema", "params"] },
        { name: "validate", args: ["getMessagesQuerySchema", "query"] },
      ],
      httpMethod: "get",
    },
    {
      // ویرایش پیام
      url: "/conversations/:conversationId/messages/:messageId",
      methodName: "editMessage",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["editMessageParamsSchema", "params"] },
        { name: "validate", args: ["editMessageBodySchema", "body"] },
      ],
      httpMethod: "put",
    },
    {
      // حذف پیام (soft delete)
      url: "/conversations/:conversationId/messages/:messageId",
      methodName: "deleteMessage",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["deleteMessageParamsSchema", "params"] },
      ],
      httpMethod: "delete",
    },
  ],
};

module.exports = chatRoutes;
