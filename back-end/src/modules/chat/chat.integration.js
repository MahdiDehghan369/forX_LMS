/**
 * ─────────────────────────────────────────────────────────────────────────────
 * راهنمای اتصال ماژول چت به سرور اصلی
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * ۱) نصب وابستگی
 *    npm install socket.io
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ۲) در فایل app.js یا server.js خود:
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── server.js (نمونه) ──────────────────────────────────────────────────────

const http = require("http");
const { Server } = require("socket.io");
const app = require("./app"); // express app شما

// ساخت HTTP server از روی express
const server = http.createServer(app);

// ساخت Socket.IO روی همان server
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
  // تنظیمات بهینه‌سازی
  pingTimeout: 60000,
  pingInterval: 25000,
});

// ─── راه‌اندازی Chat Socket ────────────────────────────────────────────────
const { createChatSocket } = require("./modules/chat/chat.socket");
const container = require("./container"); // DI container شما

// گرفتن chatService از container
const chatService = container.resolve("chatService");

// تابع احراز هویت JWT (باید token را verify کند و user object برگرداند)
const verifyToken = async (token) => {
  const jwt = require("jsonwebtoken");
  const userRepo = container.resolve("userRepo");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return await userRepo.findById(decoded._id || decoded.id);
};

// اتصال socket namespace
createChatSocket(io, chatService, verifyToken);

// شروع server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ۳) نمونه استفاده در کلاینت (JavaScript)
 * ─────────────────────────────────────────────────────────────────────────────
 */

/*
import { io } from "socket.io-client";

const socket = io("http://localhost:3000/chat", {
  auth: {
    token: "Bearer eyJhbGci...",  // JWT token
  },
});

// ── اتصال و ورود به مکالمه ────────────────────────────────────────────────
socket.on("connect", () => {
  console.log("متصل شدید");
  socket.emit("join_conversation", { conversationId: "64f1a2..." });
});

// ── دریافت پیام جدید ──────────────────────────────────────────────────────
socket.on("new_message", ({ conversationId, message }) => {
  console.log("پیام جدید:", message);
});

// ── ارسال پیام ────────────────────────────────────────────────────────────
socket.emit("send_message", {
  conversationId: "64f1a2...",
  content: "سلام استاد!",
  type: "text",
});

// ── ویرایش پیام ──────────────────────────────────────────────────────────
socket.emit("edit_message", {
  conversationId: "64f1a2...",
  messageId: "64f9b3...",
  content: "متن ویرایش شده",
});
socket.on("message_edited", ({ conversationId, messageId, message }) => {
  console.log("پیام ویرایش شد:", message);
});

// ── حذف پیام ─────────────────────────────────────────────────────────────
socket.emit("delete_message", {
  conversationId: "64f1a2...",
  messageId: "64f9b3...",
});
socket.on("message_deleted", ({ conversationId, messageId }) => {
  console.log("پیام حذف شد:", messageId);
});

// ── seen ─────────────────────────────────────────────────────────────────
socket.emit("seen_messages", { conversationId: "64f1a2..." });
socket.on("messages_seen", ({ conversationId, seenBy }) => {
  console.log(`پیام‌ها توسط ${seenBy} خوانده شد`);
});

// ── typing ────────────────────────────────────────────────────────────────
socket.emit("typing", { conversationId: "64f1a2..." });
socket.on("user_typing", ({ userId }) => {
  console.log(`${userId} در حال تایپ است...`);
});
socket.emit("stop_typing", { conversationId: "64f1a2..." });

// ── آنلاین/آفلاین ─────────────────────────────────────────────────────────
socket.on("user_online",  ({ userId }) => console.log(`${userId} آنلاین شد`));
socket.on("user_offline", ({ userId }) => console.log(`${userId} آفلاین شد`));

// ── خطاها ────────────────────────────────────────────────────────────────
socket.on("error", ({ message }) => console.error("خطا:", message));
*/
