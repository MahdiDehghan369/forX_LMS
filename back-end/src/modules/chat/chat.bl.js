const errorFactory = require("sillajError");
const { operationMessages } = require("../../base/enums");

class ChatService {
  constructor(chatRepo, userRepo) {
    this.chatRepo = chatRepo;
    this.userRepo = userRepo;
  }

  // ─── Conversation ───────────────────────────────────────────────────────────

  /**
   * گرفتن یا ساختن مکالمه بین دو نفر
   * فقط استاد و دانشجو می‌توانند با هم مکالمه داشته باشند
   */
  async getOrCreateConversation(req) {
    const requesterId = req.user._id;
    const requesterRole = req.user.role;
    const { target_user_id, course_id } = req.body;

    // بررسی وجود طرف مقابل
    const targetUser = await this.userRepo.findById(target_user_id);
    if (!targetUser) {
      throw errorFactory.NotFound(operationMessages["user.notFound"]?.fa || "کاربر مورد نظر یافت نشد.");
    }

    // فقط استاد-دانشجو مجاز است
    const allowedPairs = [
      ["teacher", "student"],
      ["student", "teacher"],
    ];
    const roles = [requesterRole, targetUser.role];
    const isAllowed = allowedPairs.some(
      (pair) => pair[0] === roles[0] && pair[1] === roles[1]
    );
    if (!isAllowed) {
      throw errorFactory.Forbidden("چت فقط بین استاد و دانشجو مجاز است.");
    }

    // پیدا کردن مکالمه موجود
    let conversation = await this.chatRepo.findConversation(
      requesterId,
      target_user_id,
      course_id || null
    );

    if (!conversation) {
      conversation = await this.chatRepo.createConversation({
        participants: [requesterId, target_user_id],
        course_id: course_id || null,
        unread_count: {
          [requesterId]: 0,
          [target_user_id]: 0,
        },
      });
    }

    return conversation;
  }

  /**
   * لیست مکالمات کاربر با کش Redis
   */
  async getUserConversations(req) {
    const userId = req.user._id.toString();

    const cached = await this.chatRepo.getConversationsListCache(userId);
    if (cached) return cached;

    const conversations = await this.chatRepo.getUserConversations(userId);
    await this.chatRepo.setConversationsListCache(userId, conversations);

    return conversations;
  }

  // ─── Messages ───────────────────────────────────────────────────────────────

  /**
   * دریافت پیام‌های یک مکالمه با pagination و کش
   */
  async getMessages(req) {
    const { conversationId } = req.params;
    const { page = 1 } = req.query;
    const userId = req.user._id.toString();

    const conversation = await this._getAndAuthorizeConversation(
      conversationId,
      userId
    );

    // فقط صفحه اول را کش می‌کنیم
    if (Number(page) === 1) {
      const cached = await this.chatRepo.getRecentMessagesCache(conversationId);
      if (cached) return cached;
    }

    const result = await this.chatRepo.getMessages(
      conversationId,
      Number(page),
      30
    );

    // فیلتر کردن پیام‌های حذف‌شده برای نمایش
    const messages = result.messages.map((msg) =>
      msg.is_deleted
        ? { ...msg, content: "این پیام حذف شده است." }
        : msg
    );

    if (Number(page) === 1) {
      await this.chatRepo.setRecentMessagesCache(conversationId, messages);
    }

    return messages;
  }

  /**
   * ارسال پیام متنی — برگشت داده‌ها برای socket emit
   */
  async sendMessage(conversationId, senderId, receiverId, content, type = "text", file_url = null) {
    const message = {
      sender_id: senderId,
      content: type === "text" ? content : null,
      type,
      file_url,
      is_seen: false,
    };

    const updated = await this.chatRepo.addMessage(
      conversationId,
      message,
      receiverId
    );

    if (!updated) {
      throw errorFactory.NotFound("مکالمه یافت نشد.");
    }

    // پاک کردن کش پیام‌های اخیر
    await this.chatRepo.deleteRecentMessagesCache(conversationId);
    await this.chatRepo.deleteConversationsListCache(receiverId.toString());
    await this.chatRepo.deleteConversationsListCache(senderId.toString());

    // برگرداندن آخرین پیام اضافه‌شده
    const sentMessage =
      updated.messages[updated.messages.length - 1];
    return sentMessage;
  }

  /**
   * ویرایش پیام
   */
  async editMessage(req) {
    const { conversationId, messageId } = req.params;
    const { content } = req.body;
    const senderId = req.user._id;

    if (!content || !content.trim()) {
      throw errorFactory.BadRequest("محتوای پیام نمی‌تواند خالی باشد.");
    }

    const updated = await this.chatRepo.editMessage(
      conversationId,
      messageId,
      content.trim(),
      senderId
    );

    if (!updated) {
      throw errorFactory.NotFound(
        "پیام یافت نشد یا شما اجازه ویرایش آن را ندارید."
      );
    }

    await this.chatRepo.deleteRecentMessagesCache(conversationId);

    const editedMessage = updated.messages.find(
      (m) => m._id.toString() === messageId
    );
    return editedMessage;
  }

  /**
   * حذف پیام (soft delete)
   */
  async deleteMessage(req) {
    const { conversationId, messageId } = req.params;
    const senderId = req.user._id;

    const updated = await this.chatRepo.deleteMessage(
      conversationId,
      messageId,
      senderId
    );

    if (!updated) {
      throw errorFactory.NotFound(
        "پیام یافت نشد یا شما اجازه حذف آن را ندارید."
      );
    }

    await this.chatRepo.deleteRecentMessagesCache(conversationId);
    return { messageId, conversationId };
  }

  /**
   * علامت‌گذاری پیام‌ها به عنوان خوانده‌شده
   */
  async markAsSeen(conversationId, userId) {
    await this.chatRepo.markAllAsSeen(conversationId, userId);
    await this.chatRepo.deleteRecentMessagesCache(conversationId);
    await this.chatRepo.deleteConversationsListCache(userId);
  }

  // ─── Private Helpers ────────────────────────────────────────────────────────

  async _getAndAuthorizeConversation(conversationId, userId) {
    const conversation = await this.chatRepo.findById(conversationId);
    if (!conversation) {
      throw errorFactory.NotFound("مکالمه یافت نشد.");
    }
    const isMember = conversation.participants
      .map((p) => p.toString())
      .includes(userId.toString());
    if (!isMember) {
      throw errorFactory.Forbidden("شما به این مکالمه دسترسی ندارید.");
    }
    return conversation;
  }
}

module.exports = ChatService;
