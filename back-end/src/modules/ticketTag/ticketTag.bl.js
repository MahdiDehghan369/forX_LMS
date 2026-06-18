const errorFactory = require("sillajError")
const { operationMessages } = require("../../base/enums")
class ticketTagService {
  constructor(ticketTagRepo) {
    this.ticketTagRepo = ticketTagRepo;
  }

  async createTicketTag(body) {
    const { name, color } = body;
    const existTicketTag = await this.ticketTagRepo.findOne({ name });
    if (existTicketTag) {
      throw errorFactory.Conflict(operationMessages["ticketTag.create.conflict"].fa);
    }
    const ticketTag = await this.ticketTagRepo.create({ name, color });

    return ticketTag;
  }

  async getAllTicketTags() {
    const ticketTags = await this.ticketTagRepo.find();
    return ticketTags;
  }

  async getTicketTag(id) {
    const existCache = await this.ticketTagRepo.getCache(id);
    if (existCache) {
      return existCache;
    }

    const ticketTag = await this.ticketTagRepo.findById(id);
    if (!ticketTag) {
      throw errorFactory.NotFound(operationMessages["ticketTag.notFound"].fa);
    }

    await this.ticketTagRepo.setCache(id, ticketTag);
    return ticketTag;
  }

  async updateTicketTag(req) {
    const { id } = req.params;
    const { name, color } = req.body;

    const ticketTag = await this.ticketTagRepo.findById(id);
    if (!ticketTag) {
      throw errorFactory.NotFound(operationMessages["ticketTag.notFound"].fa);
    }

    const conflict = await this.ticketTagRepo.findOne({ name });
    if (conflict) {
      throw errorFactory.Conflict(operationMessages["ticketTag.create.conflict"].fa)
    }

    const updatedTicketTag = await this.ticketTagRepo.updateTicketTagById(id, { name, color });
    await this.ticketTagRepo.deleteCache(id);
    return updatedTicketTag;
  }

  async deleteTicketTag(id) {
    const ticketTag = await this.ticketTagRepo.exists({ _id: id });
    if (!ticketTag) {
      throw errorFactory.NotFound(operationMessages["ticketTag.notFound"].fa);
    }

    await this.ticketTagRepo.deleteById(id);
    await this.ticketTagRepo.deleteCache(id);
  }

}

module.exports = ticketTagService;
