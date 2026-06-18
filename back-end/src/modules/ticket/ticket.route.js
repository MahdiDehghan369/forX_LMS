const ticketRoutes = {
  configs: {
    prefix: "/api/v1/tickets",
    controller: "ticketController",
  },
  routes: [
    {
      url: "/",
      methodName: "createTicket",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["createTicketSchema", "body"] }
      ],
      httpMethod: "post",
    },
    {
      url: "/",
      methodName: "getTickets",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["searchTicketSchema", "query"] }
      ],
      httpMethod: "get",
    },
    {
      url: "/:id",
      methodName: "getTicket",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["getTicketSchema", "params"] }
      ],
      httpMethod: "get",
    },
    {
      url: "/:id",
      methodName: "deleteTicket",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["getTicketSchema", "params"] }
      ],
      httpMethod: "delete",
    },
    {
      url: "/:id",
      methodName: "updateTicket",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["getTicketSchema", "params"] },
        { name: "validate", args: ["updateTicketSchema", "body"] }
      ],
      httpMethod: "put",
    },
    {
      url: "/changeStatus/:id",
      methodName: "changeTicketStatus",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["getTicketSchema", "params"] },
        { name: "validate", args: ["changeTicketStatusSchema", "body"] }
      ],
      httpMethod: "patch",
    },
  ],
};

module.exports = ticketRoutes;
