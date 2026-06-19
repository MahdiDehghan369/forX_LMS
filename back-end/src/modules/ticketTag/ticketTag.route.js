const ticketTagRoutes = {
  configs: {
    prefix: "/api/v1/ticket-tags",
    controller: "ticketTagController",
  },
  routes: [
    {
      url: "/",
      methodName: "createTag",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["createTicketTagSchema", "body"] },
      ],
      httpMethod: "post",
    },
    {
      url: "/",
      methodName: "getTags",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["searchTicketTagSchema", "query"] },
      ],
      httpMethod: "get",
    },
    {
      url: "/:id",
      methodName: "getTag",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["getTicketTagSchema", "params"] },
      ],
      httpMethod: "get",
    },
    {
      url: "/:id",
      methodName: "deleteTag",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["getTicketTagSchema", "params"] },
      ],
      httpMethod: "delete",
    },
    {
      url: "/:id",
      methodName: "updateTag",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["getTicketTagSchema", "params"] },
        { name: "validate", args: ["updateTicketTagSchema", "body"] },
      ],
      httpMethod: "put",
    },
  ],
};

module.exports = ticketTagRoutes;
