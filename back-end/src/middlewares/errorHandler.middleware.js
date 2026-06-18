const logger = require("sillajLogger");

const errorHandler = (err, req, res, next) => {
  const status = err?.statusCode || 500;
  const errorInfo = {
    message: err?.message || "Internal Server Error",
    status,
    code: err?.code || "INTERNAL_ERROR",
    path: req?.path,
    method: req?.method,
    data: err?.data || {},
    trackingHeaders: req?.trackingHeaders,
  };

  if (err?.status >= 400) {
    logger.error("Request Error", errorInfo);
  } else {
    logger.error("Unhandled Error", errorInfo);
  }
    // res.sendResponse(status, errorInfo);
    res.status(status).json({
      ...errorInfo
    })
};

module.exports = errorHandler;
