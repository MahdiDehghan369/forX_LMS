const ticketRepository = require("./ticket.repository");
const ticketService = require("./ticket.bl");
const ticketController = require("./ticket.controller");
const ticketModel = require("./ticket.model");
const { createTicketSchema, getTicketSchema,searchTicketSchema,updateTicketSchema ,changeTicketStatusSchema} = require("./ticket.schema")

module.exports = [
  {
    key: "ticketModel",
    Class: ticketModel,
    type: "model",
    options: { singleton: true },
  },
  {
    key: "ticketRepo",
    Class: ticketRepository,
    dependencies: ["ticketModel"],
    type: "repository",
    options: { singleton: true },
  },
  {
    key: "ticketService",
    Class: ticketService,
    dependencies: ["ticketRepo","departmentRepo"],
    type: "service",
    options: { singleton: true },
  },
  {
    key: "ticketController",
    Class: ticketController,
    dependencies: ["ticketService", "ticketRepo"],
    type: "controller",
    options: { singleton: true },
  },
  {
    key: "createTicketSchema",
    schema: createTicketSchema,
    type: "schema",
  },
  {
    key: "getTicketSchema",
    schema: getTicketSchema,
    type: "schema",
  },
  {
    key: "searchTicketSchema",
    schema: searchTicketSchema,
    type: "schema",
  },
  {
    key: "updateTicketSchema",
    schema: updateTicketSchema,
    type: "schema",
  },
  {
    key: "changeTicketStatusSchema",
    schema: changeTicketStatusSchema,
    type: "schema",
  },
];
