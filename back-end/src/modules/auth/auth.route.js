const authRoutes = {
  configs: {
    prefix: "/api/v1/auth",
    controller: "authController",
  },
  routes: [
    {
      url: "/register",
      methodName: "register",
      middlewares: [{ name: "validate", args: ["registerSchema"] }],
      httpMethod: "post",
    },
    {
      url: "/login",
      methodName: "login",
      middlewares: [{ name: "validate", args: ["loginSchema"] }],
      httpMethod: "post",
    },
    {
      url: "/refresh-token",
      methodName: "refreshToken",
      middlewares: [],
      httpMethod: "post",
    },
    {
      url: "/me",
      methodName: "getMe",
      middlewares: [{ name: "authMiddleware" }],
      httpMethod: "get",
    },
    {
      url: "/logout",
      methodName: "logout",
      middlewares: [{ name: "authMiddleware" }],
      httpMethod: "post",
    },
  ],
};

module.exports = authRoutes;
