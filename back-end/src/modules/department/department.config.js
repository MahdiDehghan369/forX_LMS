const DepartmentModel = require("./department.model");
const DepartmentRepo = require("./department.repo");
const DepartmentController = require("./department.ctrl");
const DepartmentBl = require("./department.bl");
const {
  departmentsSchema,
  getDepartmentSchema,
  updateDepartmentSchema,
} = require("./department.schema");

module.exports = [
  {
    key: "departmentModel",
    Class: DepartmentModel,
    type: "model",
    options: { singleton: true },
  },
  {
    key: "departmentRepo",
    Class: DepartmentRepo,
    dependencies: ["departmentModel"],
    type: "repository",
    options: { singleton: true },
  },
  {
    key: "departmentBl",
    Class: DepartmentBl,
    dependencies: ["departmentRepo"],
    type: "service",
    options: { singleton: true },
  },
  {
    key: "departmentController",
    Class: DepartmentController,
    dependencies: ["departmentBl", "departmentRepo"],
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
