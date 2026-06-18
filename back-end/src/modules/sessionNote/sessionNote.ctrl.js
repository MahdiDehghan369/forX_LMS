// src/modules/sessionNote/sessionNote.ctrl.js
const { operationMessages } = require('../../base/enums');

class SessionNoteController {
  constructor(noteBl) {
    this.noteBl = noteBl;
  }

  // POST /api/v1/sessionNote
  createNote = async (req, res, next) => {
    const data = {
      sessionId: req.body.sessionId,
      content: req.body.content,
      createdBy: req.user?._id,
    };
    const createdBy = req.user?._id;
    const note = await this.noteBl.createNote({ ...data, createdBy });
    return res.sendResponse(201, {
      message: operationMessages["note.create.success"].fa,
      data: note,
    });
  };

  // GET /api/v1/sessionNote/:id
  getNote = async (req, res, next) => {
    const { id } = req.params;
    const note = await this.noteBl.getNote(id);
    return res.sendResponse(200, {
      message: operationMessages["note.get.success"].fa,
      data: note,
    });
  };

  // GET /api/v1/sessionNote/session/:sessionId
  getNotesBySession = async (req, res, next) => {
    const { sessionId } = req.params;
    const pagination = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
      sort: req.query.sort || 'desc',
    };
    const result = await this.noteBl.getNotesBySession(sessionId, pagination);
    return res.sendResponse(200, {
      message: operationMessages["note.list.success"].fa,
      data: result,
    });
  };

  // PUT /api/v1/sessionNote/:id
  updateNote = async (req, res, next) => {
    const { id } = req.params;
    const updated = await this.noteBl.updateNote(id, req.body);
    return res.sendResponse(200, {
      message: operationMessages["note.update.success"].fa,
      data: updated,
    });
  };

  // DELETE /api/v1/sessionNote/:id
  deleteNote = async (req, res, next) => {
    const { id } = req.params;
    await this.noteBl.deleteNote(id);
    return res.sendResponse(200, {
      message: operationMessages["note.delete.success"].fa,
    });
  };

  // PATCH /api/v1/sessionNote/:id/status
  changeStatus = async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await this.noteBl.changeStatus(id, status);
    return res.sendResponse(200, {
      message: operationMessages["note.status.change.success"].fa,
      data: updated,
    });
  };
}

module.exports = SessionNoteController;
