const userRoutes = {
  configs: {
    prefix: "/api/v1/users",
    controller: "userController",
  },
  routes: [
    {
      url: "/",
      methodName: "getUsers",
      middlewares: [{ name: "authMiddleware" }],
      httpMethod: "get",
    },
    {
      url: "/:userId",
      methodName: "getUser",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["userIdSchema", "params"] },
      ],
      httpMethod: "get",
    },
    {
      url: "/:userId",
      methodName: "deleteUser",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["userIdSchema", "params"] },
      ],
      httpMethod: "delete",
    },
    {
      url: "/",
      methodName: "createUser",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["createUserSchema", "body"] },
      ],
      httpMethod: "post",
    },
    {
      url: "/:userId",
      methodName: "updateUser",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["userIdSchema", "params"] },
        { name: "validate", args: ["updateUserSchema", "body"] },
      ],
      httpMethod: "put",
    },
    {
      url: "/:userId/permissions",
      methodName: "addPermissions",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["userIdSchema", "params"] },
        { name: "validate", args: ["addRemovePermissionsSchema", "body"] },
      ],
      httpMethod: "post",
    },
    {
      url: "/:userId/permissions",
      methodName: "removePermissions",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["userIdSchema", "params"] },
        { name: "validate", args: ["addRemovePermissionsSchema", "body"] },
      ],
      httpMethod: "delete",
    },
    {
      url: "/:userId/permissions",
      methodName: "getPermissions",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["userIdSchema", "params"] },
      ],
      httpMethod: "get",
    },
    {
      url: "/",
      methodName: "updateMyProfile",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["updateMyProfileSchema", "body"] },
      ],
      httpMethod: "put",
    },
    {
      url: "/me/change-password",
      methodName: "changePassword",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["changePasswordSchema", "body"] },
      ],
      httpMethod: "patch",
    },
    {
      url: "/me/avatar",
      methodName: "uploadProfileImage",
      middlewares: [
        { name: "authMiddleware" },
        { name: "upload", args: ["PROFILE", "profile", "single"] },
      ],
      httpMethod: "post",
    },
    {
      url: "/me/avatar",
      methodName: "deleteProfileImage",
      middlewares: [
        { name: "authMiddleware" },
      ],
      httpMethod: "delete",
    },
  ],
};

module.exports = userRoutes;
