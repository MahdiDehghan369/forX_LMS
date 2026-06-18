const authRoutes = require("./modules/auth/auth.route");
const courseRoutes = require("./modules/course/course.route");
const sessionsRoutes = require("./modules/session/session.route");
const userRoutes = require("./modules/user/user.route");
const sessionNoteRoutes = require("./modules/sessionNote/sessionNote.route");
const sessionMaterialRoutes = require("./modules/sessionMaterial/sessionMaterial.route");

module.exports = [
  authRoutes,
  userRoutes,
  courseRoutes,
  sessionsRoutes,
  sessionNoteRoutes,
  sessionMaterialRoutes,
];
