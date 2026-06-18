const departmentModel = require("./department.model");
const departmentRepo = require("./department.repository");
const departmentController = require("./department.controller");
const departmentService = require("./department.bl");
const { departmentsSchema,getDepartmentSchema,updateDepartmentSchema } = require("./department.schema");

module.exports = [
  {
    key: "departmentModel",
    Class: departmentModel,
    type: "model",
    options: { singleton: true },
  },
  {
    key: "departmentRepo",
    Class: departmentRepo,
    dependencies: ["departmentModel"],
    type: "repository",
    options: { singleton: true },
  },
  {
    key: "departmentService",
    Class: departmentService,
    dependencies: ["departmentRepo"],
    type: "service",
    options: { singleton: true },
  },
  {
    key: "departmentController",
    Class: departmentController,
    dependencies: ["departmentService", "departmentRepo"],
    type: "controller",
    options: { singleton: true },
  },
  {
    key: "departmentsSchema",
    schema: departmentsSchema,
    type: "schema",
  },
  {
    key: "getDepartmentSchema",
    schema: getDepartmentSchema,
    type: "schema",
  },
  {
    key: "updateDepartmentSchema",
    schema: updateDepartmentSchema,
    type: "schema",
  },
];
