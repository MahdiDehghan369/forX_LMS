class ChatController {
  constructor(chatService) {
    this.chatService = chatService;
  }

  /**
   * POST /api/v1/chat/conversations
   * گرفتن یا ساختن مکالمه با طرف مقابل
   */
  async getOrCreateConversation(req, res, next) {
    const conversation = await this.chatService.getOrCreateConversation(req);
    res.sendResponse(200, { conversation });
  }

  /**
   * GET /api/v1/chat/conversations
   * لیست تمام مکالمات کاربر جاری
   */
  async getUserConversations(req, res, next) {
    const conversations = await this.chatService.getUserConversations(req);
    res.sendResponse(200, { conversations });
  }

  /**
   * GET /api/v1/chat/conversations/:conversationId/messages
   * دریافت پیام‌های یک مکالمه (با pagination)
   */
  async getMessages(req, res, next) {
    const messages = await this.chatService.getMessages(req);
    res.sendResponse(200, { messages });
  }

  /**
   * PUT /api/v1/chat/conversations/:conversationId/messages/:messageId
   * ویرایش پیام
   */
  async editMessage(req, res, next) {
    const message = await this.chatService.editMessage(req);
    res.sendResponse(200, { message, info: "پیام با موفقیت ویرایش شد." });
  }

  /**
   * DELETE /api/v1/chat/conversations/:conversationId/messages/:messageId
   * حذف پیام
   */
  async deleteMessage(req, res, next) {
    const result = await this.chatService.deleteMessage(req);
    res.sendResponse(200, { ...result, info: "پیام با موفقیت حذف شد." });
  }
}

module.exports = ChatController;
