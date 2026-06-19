const sessionMaterialRoutes = {
  configs: {
    // The `:sessionId` param is part of the prefix, matching the session routes.
    prefix: "/api/v1/sessions/:sessionId/materials",
    controller: "sessionMaterialController",
  },
  routes: [
    {
      // POST   /api/v1/sessions/:sessionId/materials      – upload
      url: "/",
      methodName: "uploadMaterial",
      middlewares: [
        { name: "authMiddleware" },
        // Upload middleware – field name is "file"; type can be any allowed type.
        { name: "upload", args: ["DOCUMENT", "file"] },
        { name: "validate", args: ["materialUploadSchema"] },
      ],
      httpMethod: "post",
    },
    {
      // GET    /api/v1/sessions/:sessionId/materials      – list
      url: "/",
      methodName: "listMaterials",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["materialListSchema", "query"] },
      ],
      httpMethod: "get",
    },
    {
      // GET    /api/v1/sessions/:sessionId/materials/:materialId – view (increments view)
      url: "/:materialId",
      methodName: "viewMaterial",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["materialIdParamSchema", "params"] },
      ],
      httpMethod: "get",
    },
    {
      // GET metadata (no view count) – could reuse the same route but we expose a distinct method.
      url: "/:materialId/meta",
      methodName: "getMaterial",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["materialIdParamSchema", "params"] },
      ],
      httpMethod: "get",
    },
    {
      // PATCH  /api/v1/sessions/:sessionId/materials/:materialId – update metadata
      url: "/:materialId",
      methodName: "updateMaterial",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["materialIdParamSchema", "params"] },
        { name: "validate", args: ["materialUpdateSchema", "body"] },
      ],
      httpMethod: "patch",
    },
    {
      // DELETE /api/v1/sessions/:sessionId/materials/:materialId – delete
      url: "/:materialId",
      methodName: "deleteMaterial",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["materialIdParamSchema", "params"] },
      ],
      httpMethod: "delete",
    },
    {
      // POST   /api/v1/sessions/:sessionId/materials/:materialId/download – download + count
      url: "/:materialId/download",
      methodName: "downloadMaterial",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["materialIdParamSchema", "params"] },
      ],
      httpMethod: "post",
    },
  ],
};

module.exports = sessionMaterialRoutes;
