const UserBl = require("./user.bl");
const UserController = require("./user.ctrl");
const UserModel = require("./user.model");
const UserRepo = require("./user.repo");
const { userIdSchema, createUserSchema, updateUserSchema, addRemovePermissionsSchema, updateMyProfileSchema, changePasswordSchema } = require("./user.schema");

module.exports = [
  {
    key: "userModel",
    Class: UserModel,
    type: "model",
    options: { singleton: true },
  },
  {
    key: "userRepo",
    Class: UserRepo,
    type: "repository",
    dependencies: ["userModel"],
  },
  {
    key: "userBl",
    Class: UserBl,
    type: "bl",
    dependencies: ["userRepo"],
  },
  {
    key: "userController",
    Class: UserController,
    type: "controller",
    dependencies: ["userBl"],
  },
  {
    key: "userIdSchema",
    schema: userIdSchema,
    type: "schema",
  },
  {
    key: "createUserSchema",
    schema: createUserSchema,
    type: "schema",
  },
  {
    key: "updateUserSchema",
    schema: updateUserSchema,
    type: "schema",
  },
  {
    key: "addRemovePermissionsSchema",
    schema: addRemovePermissionsSchema,
    type: "schema",
  },
  {
    key: "updateMyProfileSchema",
    schema: updateMyProfileSchema,
    type: "schema",
  },
  {
    key: "changePasswordSchema",
    schema: changePasswordSchema,
    type: "schema",
  },
];
