class TicketController {
  constructor(ticketBl, ticketRepo) {
    this.ticketBl = ticketBl;
    this.ticketRepo = ticketRepo;
  }

  async createTicket(req, res, next) {
    const body = req.body;
    const userId = req.user._id;
    const ticket = await this.ticketBl.createTicket(body, userId);
    return res.sendResponse(201, {
      message: "create ticket sucessfuly.",
      ticket,
    });
  }

  async getTickets(req, res, next) {
    const tickets = await this.ticketBl.getTickets(req);
    res.sendResponse(200, { tickets });
  }

  async getTicket(req, res, next) {
    const { id } = req.params;
    const ticket = await this.ticketBl.getTicket(id);
    res.sendResponse(200, { ticket });
  }

  async changeTicketStatus(req, res, next) {
    await this.ticketBl.changeTicketStatus(req);
    res.sendResponse(200, { message: "ticket status updated." });
  }

  async updateTicket(req, res, next) {
    const ticket = await this.ticketBl.updateTicket(req);
    res.sendResponse(200, { ticket });
  }

  async deleteTicket(req, res, next) {
    const { id } = req.params;
    await this.ticketBl.deleteTicket(id);
    res.sendResponse(200, { message: "حذف تیکت با موفقیت انجام شد." });
  }
}

module.exports = TicketController;
