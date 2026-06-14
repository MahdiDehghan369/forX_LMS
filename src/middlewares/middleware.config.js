const authMiddleware = require("./auth.middleware");
const errorHandler = require("./errorHandler.middleware");
const validate = require("./validate.middleware");
const upload = require("./multer.middleware");

module.exports = [
  {
    key: "authMiddleware",
    fn: authMiddleware,
    dependencies: ["userBl"],
    type: "middleware",
    options: {
      singleton: true,
    },
  },
  {
    key: "errorHandler",
    fn: errorHandler,
    dependencies: [],
    type: "middleware",
    options: {
      singleton: true,
    },
  },
  {
    key: "validate",
    fn: validate,
    type: "middleware",
    options: {
      singleton: true,
    },
  },
  {
    key: "upload",
    fn: upload,
    type: "middleware",
    options: {
      singleton: true,
    },
  },
];
