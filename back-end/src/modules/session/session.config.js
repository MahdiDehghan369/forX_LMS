const SessionBl = require("./session.bl");
const SessionModel = require("./session.model");
const SessionController = require("./session.ctrl");
const SessionRepo = require("./session.repo");
const { changeSessionStatusSchema, sessionCreateSchema, sessionIdParamSchema, sessionListSchema, updateSessionSchema } = require("./session.schema");

module.exports = [
  {
    key: "sessionModel",
    Class: SessionModel,
    type: "model",
    options: { singleton: true },
  },
  {
    key: "sessionRepo",
    Class: SessionRepo,
    type: "repository",
    dependencies: ["sessionModel"],
  },
  {
    key: "sessionBl",
    Class: SessionBl,
    type: "bl",
    dependencies: ["sessionRepo", "courseRepo", "sessionNoteRepo"],
  },
  {
    key: "sessionController",
    Class: SessionController,
    type: "controller",
    dependencies: ["sessionBl"],
  },
  {
    key: "changeSessionStatusSchema",
    schema: changeSessionStatusSchema,
    type: "schema",
  },
  {
    key: "sessionCreateSchema",
    schema: sessionCreateSchema,
    type: "schema",
  },
  {
    key: "sessionIdParamSchema",
    schema: sessionIdParamSchema,
    type: "schema",
  },
  {
    key: "sessionListSchema",
    schema: sessionListSchema,
    type: "schema",
  },
  {
    key: "updateSessionSchema",
    schema: updateSessionSchema,
    type: "schema",
  },
];
