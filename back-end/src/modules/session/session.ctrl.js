const { operationMessages } = require("../../base/enums");

class SessionController {
  constructor(sessionBl) {
    this.sessionBl = sessionBl;
  }

  createSession = async (req, res, next) => {
    const { courseId } = req.params;
    const data = req.body;
    const adminId = req.user?._id;

    const result = await this.sessionBl.createSession(courseId, adminId, data);

    return res.sendResponse(201, {
      message: operationMessages["session.create.success"].fa,
      data: result,
    });
  };

  getSession = async (req, res, next) => {
    const { sessionId } = req.params;

    const result = await this.sessionBl.getSession(sessionId);

    return res.sendResponse(200, {
      message: operationMessages["session.get.success"].fa,
      data: result,
    });
  };

  updateSession = async (req, res, next) => {
    const { sessionId } = req.params;
    const data = req.body;

    const result = await this.sessionBl.updateSession(sessionId, data);

    return res.sendResponse(200, {
      message: operationMessages["session.update.success"].fa,
      data: result,
    });
  };

  deleteSession = async (req, res, next) => {
    const { sessionId } = req.params;

    await this.sessionBl.deleteSession(sessionId);

    return res.sendResponse(200, {
      message: operationMessages["session.delete.success"].fa,
    });
  };

  changeStatus = async (req, res, next) => {
    const { sessionId } = req.params;
    const data = req.body;

    const result = await this.sessionBl.changeStatus(sessionId, data);

    return res.sendResponse(200, {
      message: operationMessages["session.status.update.success"].fa,
      data: result,
    });
  };

  getNotesBySession = async (req, res, next) => {
    const { sessionId } = req.params;
    const pagination = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
      sort: req.query.sort || "desc",
    };
    const result = await this.sessionBl.getNotesBySession(
      sessionId,
      pagination,
    );
    return res.sendResponse(200, {
      message: operationMessages["note.list.success"].fa,
      data: result,
    });
  };
}

module.exports = SessionController;