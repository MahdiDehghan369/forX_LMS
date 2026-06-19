const { operationMessages } = require("../../base/enums");

class TicketController {
  constructor(ticketBl) {
    this.ticketBl = ticketBl;
  }

  async createTicket(req, res, next) {
    const data = req.body;
    const userId = req.user._id;
    const ticket = await this.ticketBl.createTicket(data, userId);
    return res.sendResponse(201, {
      message: operationMessages["ticket.create.success"].fa,
      data: ticket,
    });
  }

  async getTickets(req, res, next) {
    const query = req.query;
    const tickets = await this.ticketBl.getTickets(query);
    return res.sendResponse(200, {
      message: operationMessages["ticket.get.success"].fa,
      data: tickets,
    });
  }

  async getTicket(req, res, next) {
    const { id } = req.params;
    const ticket = await this.ticketBl.getTicket(id);
    return res.sendResponse(200, {
      message: operationMessages["ticket.get.success"].fa,
      data: ticket,
    });
  }

  async changeTicketStatus(req, res, next) {
    const { id } = req.params;
    const { status } = req.body;
    const updatedTicket = await this.ticketBl.changeTicketStatus(id, status);
    return res.sendResponse(200, {
      message: operationMessages["ticket.status.update.success"].fa,
      data: updatedTicket,
    });
  }

  async updateTicket(req, res, next) {
    const ticketId = req.params.id;
    const data = req.body;
    const userId = req.user._id;
    const updatedTicket = await this.ticketBl.updateTicket(
      ticketId,
      data,
      userId,
    );
    return res.sendResponse(200, {
      message: operationMessages["ticket.update.success"].fa,
      data: updatedTicket,
    });
  }

  async deleteTicket(req, res, next) {
    const ticketId = req.params.id;
    await this.ticketBl.deleteTicket(ticketId);
    return res.sendResponse(200, {
      message: operationMessages["ticket.delete.success"].fa,
    });
  }
}

module.exports = TicketController;
