const courseRoutes = {
  configs: {
    prefix: "/api/v1/courses",
    controller: "courseController",
  },
  routes: [
    {
      url: "/",
      methodName: "createCourse",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["courseCreateSchema"] },
      ],
      httpMethod: "post",
    },
    {
      url: "/:courseCode",
      methodName: "getCourse",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["courseCodeSchema", "params"] },
      ],
      httpMethod: "get",
    },
    {
      url: "/:courseCode",
      methodName: "updateCourse",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["courseCodeSchema", "params"] },
        { name: "validate", args: ["courseUpdateSchema", "body"] },
      ],
      httpMethod: "put",
    },
    {
      url: "/:courseCode",
      methodName: "deleteCourse",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["courseCodeSchema", "params"] },
      ],
      httpMethod: "delete",
    },
    {
      url: "/",
      methodName: "getCourses",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["courseQuerySchema", "query"] },
      ],
      httpMethod: "get",
    },
    {
      url: "/:courseCode/status",
      methodName: "changeStatus",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["courseCodeSchema", "params"] },
        { name: "validate", args: ["courseStatusSchema", "body"] },
      ],
      httpMethod: "patch",
    },
    {
      url: "/:courseCode/sessions",
      methodName: "getSessions",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["courseSessionsQuerySchema", "query"] },
      ],
      httpMethod: "get",
    },
  ],
};

module.exports = courseRoutes;
