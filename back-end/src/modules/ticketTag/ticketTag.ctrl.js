const { operationMessages } = require("../../base/enums");

class TicketTagController {
  constructor(ticketTagBl) {
    this.ticketTagBl = ticketTagBl;
  }

  async createTag(req, res, next) {
    const data = req.body;
    const createdBy = req.user._id;
    const tag = await this.ticketTagBl.createTag(data, createdBy);
    return res.sendResponse(201, {
      message: operationMessages["tag.create.success"].fa,
      data: tag,
    });
  }

  async getTags(req, res, next) {
    const query = req.query;
    const tags = await this.ticketTagBl.getTags(query);
    return res.sendResponse(200, {
      message: operationMessages["tag.get.success"].fa,
      data: tags,
    });
  }

  async getTag(req, res, next) {
    const tagId = req.params;
    const tag = await this.ticketTagBl.getTag(tagId);
    return res.sendResponse(200, {
      message: operationMessages["tag.get.success"].fa,
      data: tag,
    });
  }

  async updateTag(req, res, next) {
    const tagId = req.params;
    const data = req.body;
    const updatedTag = await this.ticketTagBl.updateTag(tagId, data);
    return res.sendResponse(200, {
      message: operationMessages["tag.update.success"].fa,
      data: updatedTag,
    });
  }

  async deleteTag(req, res, next) {
    const tagId = req.params;
    await this.ticketTagBl.deleteTag(tagId);
    return res.sendResponse(200, {
      message: operationMessages["tag.delete.success"].fa,
    });
  }
}

module.exports = TicketTagController;
