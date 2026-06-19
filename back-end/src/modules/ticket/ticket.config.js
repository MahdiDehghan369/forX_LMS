const TicketRepository = require("./ticket.repo");
const TicketBl = require("./ticket.bl");
const TicketController = require("./ticket.ctrl");
const TicketModel = require("./ticket.model");
const {
  createTicketSchema,
  getTicketSchema,
  searchTicketSchema,
  updateTicketSchema,
  changeTicketStatusSchema,
} = require("./ticket.schema");

module.exports = [
  {
    key: "ticketModel",
    Class: TicketModel,
    type: "model",
    options: { singleton: true },
  },
  {
    key: "ticketRepo",
    Class: TicketRepository,
    dependencies: ["ticketModel"],
    type: "repository",
    options: { singleton: true },
  },
  {
    key: "ticketBl",
    Class: TicketBl,
    dependencies: ["ticketRepo", "departmentRepo"],
    type: "service",
    options: { singleton: true },
  },
  {
    key: "ticketController",
    Class: TicketController,
    dependencies: ["ticketBl"],
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
