class ticketController {
  constructor(ticketService, ticketRepo) {
    this.ticketService = ticketService;
    this.ticketRepo = ticketRepo;
  }

  async createTicket(req, res, next) {
    const ticket = await this.ticketService.createTicket(req);
    res.sendResponse(201, { message: "create ticket sucessfuly.", ticket });
  }

  async getTickets(req, res, next) {
    const tickets = await this.ticketService.getTickets(req);
    res.sendResponse(200, { tickets });
  }

  async getTicket(req, res, next) {
    const { id } = req.params;
    const ticket = await this.ticketService.getTicket(id);
    res.sendResponse(200, { ticket });
  }

  async changeTicketStatus(req, res, next) {
    await this.ticketService.changeTicketStatus(req);
    res.sendResponse(200, { message: "ticket status updated." });
  }

  async updateTicket(req, res, next) {
    const ticket = await this.ticketService.updateTicket(req);
    res.sendResponse(200, { ticket });
  }

  async deleteTicket(req, res, next) {
    const { id } = req.params;
    await this.ticketService.deleteTicket(id);
    res.sendResponse(200, { message: "حذف تیکت با موفقیت انجام شد." });
  }
}

module.exports = ticketController;
