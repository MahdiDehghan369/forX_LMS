const TicketTagRepository = require("./ticketTag.repo");
const TicketTagBl = require("./ticketTag.bl");
const TicketTagController = require("./ticketTag.ctrl");
const TicketTagModel = require("./ticketTag.model");
const {
  createTicketTagSchema,
  updateTicketTagSchema,
  getTicketTagSchema,
  searchTicketTagSchema,
} = require("./ticketTag.schema");

module.exports = [
  {
    key: "ticketTagModel",
    Class: TicketTagModel,
    type: "model",
    options: { singleton: true },
  },
  {
    key: "ticketTagRepo",
    Class: TicketTagRepository,
    dependencies: ["ticketTagModel"],
    type: "repository",
    options: { singleton: true },
  },
  {
    key: "ticketTagBl",
    Class: TicketTagBl,
    dependencies: ["ticketTagRepo", "userRepo"],
    type: "service",
    options: { singleton: true },
  },
  {
    key: "ticketTagController",
    Class: TicketTagController,
    dependencies: ["ticketTagBl"],
    type: "controller",
    options: { singleton: true },
  },
  {
    key: "createTicketTagSchema",
    schema: createTicketTagSchema,
    type: "schema",
  },
  {
    key: "updateTicketTagSchema",
    schema: updateTicketTagSchema,
    type: "schema",
  },
  {
    key: "getTicketTagSchema",
    schema: getTicketTagSchema,
    type: "schema",
  },
  {
    key: "searchTicketTagSchema",
    schema: searchTicketTagSchema,
    type: "schema",
  },
];
