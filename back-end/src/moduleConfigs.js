const middlewareConfig = require("./middlewares/middleware.config");
const authConfig = require("./modules/auth/auth.config");
const userConfig = require("./modules/user/user.config");
const courseConfig = require("./modules/course/course.config");
const sessionConfig = require("./modules/session/session.config");
const sessionNoteConfig = require("./modules/sessionNote/sessionNote.config");
const sessionMaterialConfig = require("./modules/sessionMaterial/sessionMaterial.config");
const ticketConfig = require("./modules/ticket/ticket.config");
const ticketTagConfig = require("./modules/ticketTag/ticketTag.config");
const departmentConfig = require("./modules/department/department.config");
const answerTicketConfig = require("./modules/answerTicket/answerTicket.config");

module.exports = [
  ...userConfig,
  ...courseConfig,
  ...sessionConfig,
  ...sessionNoteConfig,
  ...sessionMaterialConfig,
  ...ticketConfig,
  ...departmentConfig,
  ...ticketTagConfig,
  ...answerTicketConfig,
  ...authConfig,
  ...middlewareConfig,
];
