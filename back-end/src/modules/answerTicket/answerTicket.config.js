const answerTicketModel = require("./answerTicket.model");
const answerTicketRepo = require("./answerTicket.repository");
const answerTicketController = require("./answerTicket.controller");
const answerTicketService = require("./answerTicket.bl");
const { answerTicketSchema,getAnswerTicketSchema,getAnswersTicketSchema,updateAnswerTicketSchema } = require("./answerTicket.schema");

module.exports = [
  {
    key: "answerTicketModel",
    Class: answerTicketModel,
    type: "model",
    options: { singleton: true },
  },
  {
    key: "answerTicketRepo",
    Class: answerTicketRepo,
    dependencies: ["answerTicketModel"],
    type: "repository",
    options: { singleton: true },
  },
  {
    key: "answerTicketService",
    Class: answerTicketService,
    dependencies: ["answerTicketRepo","ticketRepo"],
    type: "service",
    options: { singleton: true },
  },
  {
    key: "answerTicketController",
    Class: answerTicketController,
    dependencies: ["answerTicketService", "answerTicketRepo"],
    type: "controller",
    options: { singleton: true },
  },
  {
    key: "answerTicketSchema",
    schema: answerTicketSchema,
    type: "schema",
  },
  {
    key: "getAnswerTicketSchema",
    schema: getAnswerTicketSchema,
    type: "schema",
  },
  {
    key: "getAnswersTicketSchema",
    schema: getAnswersTicketSchema,
    type: "schema",
  },
  {
    key: "updateAnswerTicketSchema",
    schema: updateAnswerTicketSchema,
    type: "schema",
  },
];
