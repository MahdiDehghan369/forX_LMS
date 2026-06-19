const AnswerTicketModel = require('./answerTicket.model');
const AnswerTicketRepo = require('./answerTicket.repo');
const AnswerTicketController = require('./answerTicket.ctrl');
const AnswerTicketBl = require('./answerTicket.bl');
const {
  answerTicketSchema,
  getAnswerTicketSchema,
  getAnswersTicketSchema,
  updateAnswerTicketSchema,
} = require('./answerTicket.schema');

module.exports = [
  {
    key: "answerTicketModel",
    Class: AnswerTicketModel,
    type: "model",
    options: { singleton: true },
  },
  {
    key: "answerTicketRepo",
    Class: AnswerTicketRepo,
    dependencies: ["answerTicketModel"],
    type: "repository",
    options: { singleton: true },
  },
  {
    key: "answerTicketBl",
    Class: AnswerTicketBl,
    dependencies: ["answerTicketRepo", "ticketRepo"],
    type: "service",
    options: { singleton: true },
  },
  {
    key: "answerTicketController",
    Class: AnswerTicketController,
    dependencies: ["answerTicketBl"],
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
