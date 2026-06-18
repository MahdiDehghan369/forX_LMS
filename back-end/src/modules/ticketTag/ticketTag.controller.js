class TicketTagController {
  constructor(ticketTagService) {
    this.ticketTagService = ticketTagService;
  }
  async createTicketTag(req, res, next) {
    const ticketTag=await this.ticketTagService.createTicketTag(req.body)
    res.sendResponse(201, { message: "create ticket tag successfuly." ,ticketTag})
  }

  async getAllTicketTags(req, res, next) {
    const ticketTags = await this.ticketTagService.getAllTicketTags()
    res.sendResponse(200, { ticketTags })
  }

  async getTicketTag(req, res, next) {
    const { id } = req.params;
    const ticketTag = await this.ticketTagService.getTicketTag(id)
    res.sendResponse(200, { ticketTag })
  }

  async updateTicketTag(req, res, next) {
    const tag = await this.ticketTagService.updateTicketTag(req);
    res.sendResponse(200, { message: "ticketTag آپدیت شد.", ticketTag: tag })
  }

  async deleteTicketTag(req, res, next) {
    const { id } = req.params;
    await this.ticketTagService.deleteTicketTag(id);
    res.sendResponse(200, { message: "حذف ticketTag با موفقیت انجام شد." })
  }

}

module.exports = TicketTagController;
