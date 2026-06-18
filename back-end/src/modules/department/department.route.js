const departmentRoutes = {
  configs: {
    prefix: "/api/v1/departments",
    controller: "departmentController",
  },
  routes: [
    {
      url: "/",
      methodName: "createDepartment",
      middlewares: [{ name: "authMiddleware" },{name:"validate",args:["departmentsSchema","body"]}],
      httpMethod: "post",
    },
    {
      url: "/",
      methodName: "getAlldepartments",
      middlewares: [{ name: "authMiddleware" }],
      httpMethod: "get",
    },
    {
      url: "/:id",
      methodName: "getDepartment",
      middlewares: [
        { name: "authMiddleware" },
        {name:"validate",args:["getDepartmentSchema","params"]}
    ],
      httpMethod: "get",
    },
    {
      url: "/:id",
      methodName: "deleteDepartment",
      middlewares: [
        { name: "authMiddleware" },
        {name:"validate",args:["getDepartmentSchema","params"]}
    ],
      httpMethod: "delete",
    },
    {
      url: "/:id",
      methodName: "updateDepartment",
      middlewares: [
        { name: "authMiddleware" },
        {name:"validate",args:["getDepartmentSchema","params"]},
        {name:"validate",args:["updateDepartmentSchema","body"]}
    ],
      httpMethod: "put",
    },
  ],
};

module.exports = departmentRoutes;
