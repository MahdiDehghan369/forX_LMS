const ticketTagRoutes = {
  configs: {
    prefix: "/api/v1/ticketTags",
    controller: "ticketTagController",
  },
  routes: [
    {
      url: "/",
      methodName: "createTicketTag",
      middlewares: [{ name: "authMiddleware" }, { name: "validate", args: ["ticketTagSchema", "body"] }],
      httpMethod: "post",
    },
    {
      url: "/",
      methodName: "getAllTicketTags",
      middlewares: [{ name: "authMiddleware" }],
      httpMethod: "get",
    },
    {
      url: "/:id",
      methodName: "getTicketTag",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["getTicketTagSchema", "params"] }
      ],
      httpMethod: "get",
    },
    {
      url: "/:id",
      methodName: "deleteTicketTag",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["getTicketTagSchema", "params"] }
      ],
      httpMethod: "delete",
    },
    {
      url: "/:id",
      methodName: "updateTicketTag",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["getTicketTagSchema", "params"] },
        { name: "validate", args: ["updateTicketTagSchema", "body"] }
      ],
      httpMethod: "put",
    },
  ],
};

module.exports = ticketTagRoutes;
