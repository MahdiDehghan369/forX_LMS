const courseEnrollmentRoutes = {
  configs: {
    prefix: "/api/v1/courseEnrollment",
    controller: "courseEnrollmentController",
  },
  routes: [
    {
      // POST /api/v1/courseEnrollment/enroll
      url: "/enroll",
      methodName: "enroll",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["enrollmentEnrollSchema"] },
      ],
      httpMethod: "post",
    },
    {
      // GET /api/v1/courseEnrollment/user/:userId
      url: "/user/:userId",
      methodName: "getUserEnrollments",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["enrollmentIdParamSchema", "params"] },
        { name: "validate", args: ["enrollmentListSchema", "query"] },
      ],
      httpMethod: "get",
    },
    {
      // GET /api/v1/courseEnrollment/course/:courseId  (admin/teacher only)
      url: "/course/:courseId",
      methodName: "getCourseEnrollments",
      middlewares: [
        { name: "authMiddleware" },
        { name: "roleMiddleware", args: ["teacher", "admin"] },
        { name: "validate", args: ["enrollmentIdParamSchema", "params"] },
        { name: "validate", args: ["enrollmentListSchema", "query"] },
      ],
      httpMethod: "get",
    },
    {
      // GET /api/v1/courseEnrollment/:id
      url: "/:id",
      methodName: "getEnrollmentById",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["enrollmentIdParamSchema", "params"] },
      ],
      httpMethod: "get",
    },
    {
      // PUT /api/v1/courseEnrollment/:id  (admin/teacher only)
      url: "/:id",
      methodName: "updateEnrollmentStatus",
      middlewares: [
        { name: "authMiddleware" },
        { name: "roleMiddleware", args: ["teacher", "admin"] },
        { name: "validate", args: ["enrollmentIdParamSchema", "params"] },
        { name: "validate", args: ["enrollmentUpdateStatusSchema"] },
      ],
      httpMethod: "put",
    },
    {
      // DELETE /api/v1/courseEnrollment/:id  (soft‑delete)
      url: "/:id",
      methodName: "dropEnrollment",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["enrollmentIdParamSchema", "params"] },
      ],
      httpMethod: "delete",
    },
    {
      // GET /api/v1/courseEnrollment/check?courseId=&userId=
      url: "/check",
      methodName: "checkEnrollment",
      middlewares: [
        { name: "authMiddleware" },
        { name: "validate", args: ["enrollmentCheckSchema", "query"] },
      ],
      httpMethod: "get",
    },
    {
      // GET /api/v1/courseEnrollment/course/:courseId/statistics  (admin/teacher only)
      url: "/course/:courseId/statistics",
      methodName: "getCourseStatistics",
      middlewares: [
        { name: "authMiddleware" },
        { name: "roleMiddleware", args: ["teacher", "admin"] },
        { name: "validate", args: ["enrollmentIdParamSchema", "params"] },
        { name: "validate", args: ["enrollmentStatsSchema", "query"] },
      ],
      httpMethod: "get",
    },
  ],
};

module.exports = courseEnrollmentRoutes;