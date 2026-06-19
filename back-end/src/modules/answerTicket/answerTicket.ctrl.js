const { operationMessages } = require("../../base/enums");

class AnswerTicketController {
  constructor(answerTicketBl) {
    this.answerTicketBl = answerTicketBl;
  }

  async createAnswerTicket(req, res, next) {
    const data = req.body;
    const userId = req.user._id;
    const answerTicket = await this.answerTicketBl.createAnswerTicket(
      data,
      userId,
    );
    return res.sendResponse(201, {
      message: operationMessages["answerTicket.create.success"].fa,
      data: answerTicket,
    });
  }

  // GET /answerTicket (list all)
  async getAllAnswerTickets(req, res, next) {
    const tickets = await this.answerTicketBl.getAllAnswerTickets();
    return res.sendResponse(200, {
      message: operationMessages["answerTicket.getAll.success"].fa,
      data: tickets,
    });
  }

  // GET /answerTicket/:id
  async getAnswerTicket(req, res, next) {
    const answerTicketId = req.params.id;
    const ticket = await this.answerTicketBl.getAnswerTicket(answerTicketId);
    return res.sendResponse(200, {
      message: operationMessages["answerTicket.get.success"].fa,
      data: ticket,
    });
  }

  // GET /answerTicket/ticket/:ticketId – all answers for a ticket
  async getAnswersTicket(req, res, next) {
    const { ticketId } = req.params;
    const answers = await this.answerTicketBl.getAnswersTicket(ticketId);
    return res.sendResponse(200, {
      message: operationMessages["answerTicket.getByTicket.success"].fa,
      data: answers,
    });
  }

  // PUT /answerTicket/:id
  async updateAnswerTicket(req, res, next) {
    const answerTicketId = req.params.id;
    const data = req.body;
    const updated = await this.answerTicketBl.updateAnswerTicket(
      answerTicketId,
      data,
    );
    return res.sendResponse(200, {
      message: operationMessages["answerTicket.update.success"].fa,
      data: updated,
    });
  }

  // DELETE /answerTicket/:id
  async deleteAnswerTicket(req, res, next) {
    const answerTicketId = req.params.id;
    await this.answerTicketBl.deleteAnswerTicket(answerTicketId);
    return res.sendResponse(200, {
      message: operationMessages["answerTicket.delete.success"].fa,
    });
  }
}

module.exports = AnswerTicketController;
