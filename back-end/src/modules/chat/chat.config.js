const ChatRepository = require("./chat.repo");
const ChatService = require("./chat.bl");
const ChatController = require("./chat.controller");
const conversationModel = require("./chat.model");

const {
  getOrCreateConversationSchema,
  conversationIdSchema,
  getMessagesQuerySchema,
  editMessageParamsSchema,
  editMessageBodySchema,
  deleteMessageParamsSchema,
} = require("./chat.schema");

module.exports = [
  // ─── Model ──────────────────────────────────────────────────────────────
  {
    key: "conversationModel",
    Class: conversationModel,
    type: "model",
    options: { singleton: true },
  },

  // ─── Repository ──────────────────────────────────────────────────────────
  {
    key: "chatRepo",
    Class: ChatRepository,
    dependencies: ["conversationModel"],
    type: "repository",
    options: { singleton: true },
  },

  // ─── Service ─────────────────────────────────────────────────────────────
  {
    key: "chatService",
    Class: ChatService,
    dependencies: ["chatRepo", "userRepo"],   // userRepo از ماژول users تزریق می‌شه
    type: "service",
    options: { singleton: true },
  },

  // ─── Controller ──────────────────────────────────────────────────────────
  {
    key: "chatController",
    Class: ChatController,
    dependencies: ["chatService"],
    type: "controller",
    options: { singleton: true },
  },

  // ─── Schemas ─────────────────────────────────────────────────────────────
  {
    key: "getOrCreateConversationSchema",
    schema: getOrCreateConversationSchema,
    type: "schema",
  },
  {
    key: "conversationIdSchema",
    schema: conversationIdSchema,
    type: "schema",
  },
  {
    key: "getMessagesQuerySchema",
    schema: getMessagesQuerySchema,
    type: "schema",
  },
  {
    key: "editMessageParamsSchema",
    schema: editMessageParamsSchema,
    type: "schema",
  },
  {
    key: "editMessageBodySchema",
    schema: editMessageBodySchema,
    type: "schema",
  },
  {
    key: "deleteMessageParamsSchema",
    schema: deleteMessageParamsSchema,
    type: "schema",
  },
];
