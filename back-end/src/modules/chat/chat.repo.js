const BaseRepo = require("../../repositories/mongo.repo");
const redisRepo = require("../../repositories/redis.repo");

class ChatRepository extends BaseRepo {
  #prefix;

  constructor(conversationModel) {
    super(conversationModel);
    this.#prefix = "chat";
  }

  // ─── Conversation Methods ───────────────────────────────────────────────────

  /**
   * پیدا کردن مکالمه بین دو نفر (با یا بدون کورس)
   */
  findConversation(participant1, participant2, course_id = null) {
    const query = {
      participants: { $all: [participant1, participant2] },
      is_active: true,
    };
    if (course_id) query.course_id = course_id;
    return this.findOne(query);
  }

  /**
   * لیست تمام مکالمات یک کاربر — مرتب شده بر اساس آخرین پیام
   */
  getUserConversations(userId) {
    return this.model
      .find({ participants: userId, is_active: true })
      .select("-messages")
      .populate("participants", "name email role avatar")
      .populate("course_id", "title")
      .sort({ "last_message.sent_at": -1 });
  }

  /**
   * ساخت مکالمه جدید
   */
  createConversation(data) {
    return this.create(data);
  }

  // ─── Message Methods ────────────────────────────────────────────────────────

  /**
   * اضافه کردن پیام جدید + آپدیت last_message و unread_count
   */
  async addMessage(conversationId, message, receiverId) {
    const result = await this.withTransaction(async (session) => {
      const unreadKey = `unread_count.${receiverId}`;

      return await this.model.findByIdAndUpdate(
        conversationId,
        {
          $push: { messages: message },
          $set: {
            "last_message.content":
              message.type === "text" ? message.content : `[${message.type}]`,
            "last_message.sender_id": message.sender_id,
            "last_message.sent_at": new Date(),
            "last_message.type": message.type,
          },
          $inc: { [unreadKey]: 1 },
        },
        { new: true, session, select: "messages last_message unread_count" }
      );
    });
    return result;
  }

  /**
   * دریافت پیام‌ها با pagination
   */
  getMessages(conversationId, page = 1, limit = 30) {
    const skip = (page - 1) * limit;
    return this.model
      .findById(conversationId)
      .select({
        messages: { $slice: [-(skip + limit), limit] },
        participants: 1,
      })
      .lean();
  }

  /**
   * ویرایش پیام
   */
  editMessage(conversationId, messageId, newContent, senderId) {
    return this.withTransaction(async (session) => {
      return await this.model.findOneAndUpdate(
        {
          _id: conversationId,
          "messages._id": messageId,
          "messages.sender_id": senderId,
          "messages.is_deleted": false,
        },
        {
          $set: {
            "messages.$.content": newContent,
            "messages.$.is_edited": true,
            "messages.$.edited_at": new Date(),
          },
        },
        { new: true, session }
      );
    });
  }

  /**
   * حذف پیام (soft delete)
   */
  deleteMessage(conversationId, messageId, senderId) {
    return this.withTransaction(async (session) => {
      return await this.model.findOneAndUpdate(
        {
          _id: conversationId,
          "messages._id": messageId,
          "messages.sender_id": senderId,
          "messages.is_deleted": false,
        },
        {
          $set: {
            "messages.$.is_deleted": true,
            "messages.$.deleted_at": new Date(),
            "messages.$.content": null,
          },
        },
        { new: true, session }
      );
    });
  }

  /**
   * علامت‌گذاری تمام پیام‌های یک مکالمه به عنوان خوانده‌شده
   */
  markAllAsSeen(conversationId, userId) {
    const unreadKey = `unread_count.${userId}`;
    return this.withTransaction(async (session) => {
      return await this.model.findByIdAndUpdate(
        conversationId,
        {
          $set: {
            "messages.$[elem].is_seen": true,
            "messages.$[elem].seen_at": new Date(),
            [unreadKey]: 0,
          },
        },
        {
          arrayFilters: [
            {
              "elem.sender_id": { $ne: userId },
              "elem.is_seen": false,
              "elem.is_deleted": false,
            },
          ],
          new: true,
          session,
        }
      );
    });
  }

  // ─── Redis Cache Methods ────────────────────────────────────────────────────

  /**
   * کش کردن پیام‌های اخیر (30 پیام آخر)
   */
  getRecentMessagesCache(conversationId) {
    return redisRepo.get(this.#generateKey("messages", conversationId));
  }

  setRecentMessagesCache(conversationId, messages) {
    // نگهداری 10 دقیقه
    return redisRepo.set(
      this.#generateKey("messages", conversationId),
      messages,
      600
    );
  }

  deleteRecentMessagesCache(conversationId) {
    return redisRepo.delete(this.#generateKey("messages", conversationId));
  }

  /**
   * کش کردن لیست مکالمات کاربر
   */
  getConversationsListCache(userId) {
    return redisRepo.get(this.#generateKey("conversations", userId));
  }

  setConversationsListCache(userId, data) {
    return redisRepo.set(
      this.#generateKey("conversations", userId),
      data,
      300 // 5 دقیقه
    );
  }

  deleteConversationsListCache(userId) {
    return redisRepo.delete(this.#generateKey("conversations", userId));
  }

  // ─── Private ────────────────────────────────────────────────────────────────

  #generateKey(type, id) {
    return `${this.#prefix}:${type}:${id}`;
  }
}

module.exports = ChatRepository;
