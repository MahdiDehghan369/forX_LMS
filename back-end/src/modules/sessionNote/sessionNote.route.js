const sessionNoteRoutes = {
  configs: {
    prefix: "/api/v1/sessionNote",
    controller: "sessionNoteController",
  },
  routes: [
    // ---- CREATE ----
    {
      url: "/",
      methodName: "createNote",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["createNoteSchema"] },
      ],
      httpMethod: "post",
    },

    // ---- READ SINGLE NOTE ----
    {
      url: "/:id",
      methodName: "getNote",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["noteIdParamSchema", "params"] },
      ],
      httpMethod: "get",
    },
    
    // ---- UPDATE ----
    {
      url: "/:id",
      methodName: "updateNote",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["noteIdParamSchema", "params"] },
        { name: "validate", args: ["updateNoteSchema", "body"] },
      ],
      httpMethod: "put",
    },

    // ---- DELETE ----
    {
      url: "/:id",
      methodName: "deleteNote",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["noteIdParamSchema", "params"] },
      ],
      httpMethod: "delete",
    },

    // ---- PATCH STATUS (active / archived) ----
    {
      url: "/:id/status",
      methodName: "changeStatus",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["noteIdParamSchema", "params"] },
        { name: "validate", args: ["changeStatusSchema", "body"] },
      ],
      httpMethod: "patch",
    },
  ],
};

module.exports = sessionNoteRoutes;
