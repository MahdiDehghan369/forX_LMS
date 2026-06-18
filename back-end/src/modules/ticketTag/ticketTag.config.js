const ticketTagModel = require("./ticketTag.model");
const ticketTagRepo = require("./ticketTag.repository");
const ticketTagController = require("./ticketTag.controller");
const ticketTagService = require("./ticketTag.bl");
const { ticketTagSchema,getTicketTagSchema,updateTicketTagSchema } = require("./ticketTag.schema");

module.exports = [
  {
    key: "ticketTagModel",
    Class: ticketTagModel,
    type: "model",
    options: { singleton: true },
  },
  {
    key: "ticketTagRepo",
    Class: ticketTagRepo,
    dependencies: ["ticketTagModel"],
    type: "repository",
    options: { singleton: true },
  },
  {
    key: "ticketTagService",
    Class: ticketTagService,
    dependencies: ["ticketTagRepo"],
    type: "service",
    options: { singleton: true },
  },
  {
    key: "ticketTagController",
    Class: ticketTagController,
    dependencies: ["ticketTagService"],
    type: "controller",
    options: { singleton: true },
  },
  {
    key: "ticketTagSchema",
    schema: ticketTagSchema,
    type: "schema",
  },
  {
    key: "getTicketTagSchema",
    schema: getTicketTagSchema,
    type: "schema",
  },
  {
    key: "updateTicketTagSchema",
    schema: updateTicketTagSchema,
    type: "schema",
  },
];
