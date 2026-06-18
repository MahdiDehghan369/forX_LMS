/**
 * chat.socket.js
 * ──────────────────────────────────────────────────────────────────────────────
 * این فایل Gateway اصلی WebSocket چت است.
 * باید در فایل اصلی سرور (app.js / server.js) به این صورت فراخوانی شود:
 *
 *   const { createChatSocket } = require('./modules/chat/chat.socket');
 *   createChatSocket(io, chatService, authMiddleware);
 *
 * ──────────────────────────────────────────────────────────────────────────────
 * Event های Server → Client:
 *   - "new_message"       : پیام جدید دریافت شد
 *   - "message_edited"    : پیامی ویرایش شد
 *   - "message_deleted"   : پیامی حذف شد
 *   - "messages_seen"     : پیام‌ها خوانده شدند
 *   - "user_typing"       : طرف مقابل در حال تایپ است
 *   - "user_online"       : کاربری آنلاین شد
 *   - "user_offline"      : کاربری آفلاین شد
 *   - "error"             : خطا
 *
 * Event های Client → Server:
 *   - "join_conversation" : ورود به room مکالمه
 *   - "send_message"      : ارسال پیام
 *   - "edit_message"      : ویرایش پیام
 *   - "delete_message"    : حذف پیام
 *   - "seen_messages"     : خواندن پیام‌ها
 *   - "typing"            : شروع تایپ
 *   - "stop_typing"       : پایان تایپ
 *   - "leave_conversation": خروج از room
 */

/**
 * @param {import('socket.io').Server} io
 * @param {import('./chat.bl')} chatService
 * @param {Function} verifyToken - تابع احراز هویت JWT که user object برمی‌گرداند
 */
function createChatSocket(io, chatService, verifyToken) {
  // ─── Namespace اختصاصی چت ─────────────────────────────────────────────────
  const chatNamespace = io.of("/chat");

  // ─── Middleware احراز هویت ────────────────────────────────────────────────
  chatNamespace.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(" ")[1];

      if (!token) {
        return next(new Error("احراز هویت الزامی است."));
      }

      const user = await verifyToken(token);
      if (!user) {
        return next(new Error("توکن نامعتبر است."));
      }

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("خطا در احراز هویت: " + err.message));
    }
  });

  // ─── Connection ───────────────────────────────────────────────────────────
  chatNamespace.on("connection", (socket) => {
    const userId = socket.user._id.toString();
    const userRole = socket.user.role;

    console.log(`[Chat Socket] کاربر متصل شد: ${userId} (${userRole})`);

    // عضو کردن کاربر در room شخصی خودش (برای notificationهای آفلاین)
    socket.join(`user:${userId}`);

    // اطلاع‌رسانی آنلاین شدن به همه در room های مشترک
    socket.broadcast.emit("user_online", { userId });

    // ─── Join Conversation ─────────────────────────────────────────────────
    socket.on("join_conversation", async ({ conversationId }) => {
      try {
        if (!conversationId) {
          return socket.emit("error", { message: "شناسه مکالمه الزامی است." });
        }

        // بررسی دسترسی کاربر به مکالمه
        const conversation = await chatService._getAndAuthorizeConversation(
          conversationId,
          userId
        );

        socket.join(`conversation:${conversationId}`);
        socket.currentConversationId = conversationId;

        // علامت‌گذاری پیام‌های خوانده‌نشده به محض ورود
        await chatService.markAsSeen(conversationId, userId);

        // اطلاع به طرف مقابل
        socket.to(`conversation:${conversationId}`).emit("messages_seen", {
          conversationId,
          seenBy: userId,
        });

        socket.emit("joined_conversation", {
          conversationId,
          message: "به مکالمه پیوستید.",
        });
      } catch (err) {
        socket.emit("error", { message: err.message });
      }
    });

    // ─── Send Message ──────────────────────────────────────────────────────
    socket.on("send_message", async ({ conversationId, content, type = "text", file_url = null }) => {
      try {
        if (!conversationId) {
          return socket.emit("error", { message: "شناسه مکالمه الزامی است." });
        }
        if (type === "text" && (!content || !content.trim())) {
          return socket.emit("error", { message: "محتوای پیام نمی‌تواند خالی باشد." });
        }

        // پیدا کردن گیرنده (طرف مقابل)
        const conversation = await chatService._getAndAuthorizeConversation(
          conversationId,
          userId
        );
        const receiverId = conversation.participants
          .map((p) => p.toString())
          .find((id) => id !== userId);

        const sentMessage = await chatService.sendMessage(
          conversationId,
          userId,
          receiverId,
          content?.trim(),
          type,
          file_url
        );

        const payload = {
          conversationId,
          message: sentMessage,
        };

        // ارسال به همه در room (شامل فرستنده)
        chatNamespace
          .to(`conversation:${conversationId}`)
          .emit("new_message", payload);

        // اگر گیرنده در room نیست، به room شخصی او ارسال می‌کنیم (notification)
        const receiverSockets = await chatNamespace
          .in(`conversation:${conversationId}`)
          .fetchSockets();
        const receiverInRoom = receiverSockets.some(
          (s) => s.user._id.toString() === receiverId
        );

        if (!receiverInRoom) {
          chatNamespace.to(`user:${receiverId}`).emit("new_message", payload);
        }
      } catch (err) {
        socket.emit("error", { message: err.message });
      }
    });

    // ─── Edit Message ──────────────────────────────────────────────────────
    socket.on("edit_message", async ({ conversationId, messageId, content }) => {
      try {
        if (!content || !content.trim()) {
          return socket.emit("error", { message: "محتوای جدید نمی‌تواند خالی باشد." });
        }

        // ساختن req mock برای استفاده از chatService
        const mockReq = {
          params: { conversationId, messageId },
          body: { content },
          user: socket.user,
        };

        const editedMessage = await chatService.editMessage(mockReq);

        chatNamespace
          .to(`conversation:${conversationId}`)
          .emit("message_edited", {
            conversationId,
            messageId,
            message: editedMessage,
          });
      } catch (err) {
        socket.emit("error", { message: err.message });
      }
    });

    // ─── Delete Message ────────────────────────────────────────────────────
    socket.on("delete_message", async ({ conversationId, messageId }) => {
      try {
        const mockReq = {
          params: { conversationId, messageId },
          user: socket.user,
        };

        await chatService.deleteMessage(mockReq);

        chatNamespace
          .to(`conversation:${conversationId}`)
          .emit("message_deleted", {
            conversationId,
            messageId,
          });
      } catch (err) {
        socket.emit("error", { message: err.message });
      }
    });

    // ─── Seen Messages ─────────────────────────────────────────────────────
    socket.on("seen_messages", async ({ conversationId }) => {
      try {
        await chatService.markAsSeen(conversationId, userId);

        socket.to(`conversation:${conversationId}`).emit("messages_seen", {
          conversationId,
          seenBy: userId,
        });
      } catch (err) {
        socket.emit("error", { message: err.message });
      }
    });

    // ─── Typing ────────────────────────────────────────────────────────────
    socket.on("typing", ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit("user_typing", {
        conversationId,
        userId,
      });
    });

    socket.on("stop_typing", ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit("user_stop_typing", {
        conversationId,
        userId,
      });
    });

    // ─── Leave Conversation ────────────────────────────────────────────────
    socket.on("leave_conversation", ({ conversationId }) => {
      socket.leave(`conversation:${conversationId}`);
      socket.currentConversationId = null;
    });

    // ─── Disconnect ────────────────────────────────────────────────────────
    socket.on("disconnect", (reason) => {
      console.log(`[Chat Socket] کاربر قطع شد: ${userId} | دلیل: ${reason}`);
      socket.broadcast.emit("user_offline", { userId });
    });
  });

  return chatNamespace;
}

module.exports = { createChatSocket };
