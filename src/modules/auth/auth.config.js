const AuthRepo = require("./auth.repo");
const AuthBl = require("./auth.bl");
const AuthController = require("./auth.ctrl");
const {loginSchema, registerSchema} = require('./auth.schema');

module.exports = [
  {
    key: "authRepo",
    Class: AuthRepo,
    type: "repository",
    dependencies: ["userModel"],
    options: { singleton: true },
  },
  {
    key: "authBl",
    Class: AuthBl,
    dependencies: ["authRepo"],
    type: "bl",
    options: { singleton: true },
  },
  {
    key: "authController",
    Class: AuthController,
    dependencies: ["authBl"],
    type: "controller",
    options: { singleton: true },
  },
  {
    key: "loginSchema",
    schema: loginSchema,
    type: "schema",
  },
  {
    key: "registerSchema",
    schema: registerSchema,
    type: "schema",
  },
];
