const answerTicketRoutes = {
  configs: {
    prefix: "/api/v1/answerTicket",
    controller: "answerTicketController",
  },
  routes: [
    {
      url: "/",
      methodName: "createAnswerTicket",
      middlewares: [{ name: "authMiddleware" }, { name: "validate", args: ["answerTicketSchema", "body"] }],
      httpMethod: "post",
    },
    {
      url: "/",
      methodName: "getAllAnswerTickets",
      middlewares: [{ name: "authMiddleware" }],
      httpMethod: "get",
    },
    {
      url: "/:id",
      methodName: "getAnswerTicket",
      middlewares: [{ name: "validate", args: ["getAnswerTicketSchema", "params"] }],
      httpMethod: "get",
    },
    {
      url: "/:id",
      methodName: "deleteAnswerTicket",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["getAnswerTicketSchema", "params"] }
      ],
      httpMethod: "delete",
    },
    {
      url: "/:id",
      methodName: "updateAnswerTicket",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["getAnswerTicketSchema", "params"] },
        { name: "validate", args: ["updateAnswerTicketSchema", "body"] }
      ],
      httpMethod: "put",
    },
    {
      url: "/ticket/:ticketId",
      methodName: "getAnswersTicket",
      middlewares: [{ name: "validate", args: ["getAnswersTicketSchema", "params"] }],
      httpMethod: "get",
    },
  ],
};

module.exports = answerTicketRoutes;
