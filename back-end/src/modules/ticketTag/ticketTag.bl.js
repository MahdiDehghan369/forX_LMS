const errorFactory = require("sillajError");
const { operationMessages } = require("../../base/enums");

class TicketTagBl {
  constructor(ticketTagRepo, userRepo) {
    this.ticketTagRepo = ticketTagRepo;
    this.userRepo = userRepo;
  }

  async createTag(data, createdBy) {
    const normalizedData = {
      createdBy,
      ...data,
      name: data.name.trim(),
      color: data.color || "#default",
    };

    const duplicateCheck = await this.ticketTagRepo.findOne({
      name: normalizedData.name,
      isActive: true,
    });

    if (duplicateCheck) {
      throw errorFactory.Conflict(
        operationMessages["tag.name.duplicate.error"].fa,
      );
    }

    const tag = await this.ticketTagRepo.create(normalizedData);
    return tag;
  }

  async getTags(query = {}) {
    return this.ticketTagRepo.findByFilter(query);
  }

  async getTag(tagId) {
    const tag = await this.ticketTagRepo.findById(tagId);
    if (!tag) {
      throw errorFactory.NotFound(operationMessages["tag.notFound"].fa);
    }
    return tag;
  }

  async updateTag(tagId, updateData) {
    const tag = await this.ticketTagRepo.findById(tagId);
    if (!tag) {
      throw errorFactory.NotFound(operationMessages["tag.notFound"].fa);
    }

    if (updateData.name && updateData.name !== tag.name) {
      const normalizedName = updateData.name.trim();
      const duplicateTag = await this.ticketTagRepo.findOne({
        name: normalizedName,
        isActive: true,
        _id: { $ne: id },
      });

      if (duplicateTag) {
        throw errorFactory.Conflict(
          operationMessages["tag.name.duplicate.error"].fa,
        );
      }
    }

    const normalizedUpdate = {};
    if (updateData.name) normalizedUpdate.name = updateData.name.trim();
    if (updateData.description !== undefined)
      normalizedUpdate.description = updateData.description;
    if (updateData.color !== undefined)
      normalizedUpdate.color = updateData.color;
    if (updateData.isActive !== undefined)
      normalizedUpdate.isActive = updateData.isActive;

    const updatedTag = await this.ticketTagRepo.updateByTagId(
      tagId,
      normalizedUpdate,
    );
    return updatedTag;
  }

  async deleteTag(tagId) {
    const tag = await this.ticketTagRepo.findById(tagId);
    if (!tag) {
      throw errorFactory.NotFound(operationMessages["tag.notFound"].fa);
    }
    await this.ticketTagRepo.updateByTagId(tagId, { isActive: false });
  }
}

module.exports = TicketTagBl;