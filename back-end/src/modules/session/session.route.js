const sessionsRoutes = {
  configs: {
    prefix: "/api/v1/sessions",
    controller: "sessionController",
  },
  routes: [
    {
      url: "/:courseCode",
      methodName: "createSession",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["sessionCreateSchema"] },
      ],
      httpMethod: "post",
    },
    {
      url: "/:sessionId",
      methodName: "getSession",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["sessionIdParamSchema", "params"] },
      ],
      httpMethod: "get",
    },
    {
      url: "/:sessionId",
      methodName: "updateSession",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["sessionIdParamSchema", "params"] },
        { name: "validate", args: ["updateSessionSchema", "body"] },
      ],
      httpMethod: "put",
    },
    {
      url: "/:sessionId",
      methodName: "deleteSession",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["sessionIdParamSchema", "params"] },
      ],
      httpMethod: "delete",
    },
    {
      url: "/:sessionId/status",
      methodName: "changeStatus",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["sessionIdParamSchema", "params"] },
        { name: "validate", args: ["changeSessionStatusSchema", "body"] },
      ],
      httpMethod: "patch",
    },
  ],
};

module.exports = sessionsRoutes;
