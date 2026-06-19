const mongoose = require("mongoose");
const errorFactory = require("sillajError");
const { operationMessages } = require("../../base/enums");

class TicketBl {
  constructor(ticketRepo, departmentRepo) {
    this.ticketRepo = ticketRepo;
    this.departmentRepo = departmentRepo;
  }

  async createTicket(ticketData, userId) {
    const duplicate = await this.ticketRepo.findOne({
      userId: userId,
    });
    if (duplicate) {
      throw errorFactory.Conflict(
        operationMessages["ticket.create.conflict"].fa,
      );
    }

    const department = await this.departmentRepo.findById(ticketData.department);
    if(!department){
      throw errorFactory.Conflict(
        operationMessages["department.not.found"].fa,
      ); 
    }
    const newTicket = await this.ticketRepo.create(ticketData, userId);
    return newTicket;
  }

  async getTickets(data) {
    return this.ticketRepo.findByFilter(data);
  }

  async getTicket(ticketId) {
    const ticket = await this.ticketRepo.findById(ticketId);
    if (!ticket) {
      throw errorFactory.NotFound(operationMessages["ticket.notFound"].fa);
    }
    return ticket;
  }

  async updateTicket(ticketId, data, userId) {
    const { title, description, priority, status, department, tags } = data;
    const ticket = await this.ticketRepo.findById(ticketId);
    if (!ticket) {
      throw errorFactory.NotFound(operationMessages["ticket.notFound"].fa);
    }
    if (ticket.status === "closed") {
      throw errorFactory.BadRequest(
        operationMessages["ticket.update.closed.error"].fa,
      );
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (priority) updateData.priority = parseInt(priority);
    if (status) updateData.status = status;
    if (department) updateData.department = department;
    if (Array.isArray(tags))
      updateData.tags = tags.map((t) => mongoose.Types.ObjectId(t));

    const updatedTicket = await this.ticketRepo.updateByTicketId(
      ticketId,
      updateData,
    );
    return updatedTicket;
  }

  async changeTicketStatus(ticketId, status) {
    const validStatuses = [
      "open",
      "pending",
      "in_progress",
      "resolved",
      "closed",
    ];
    if (!validStatuses.includes(status)) {
      throw errorFactory.BadRequest(
        operationMessages["ticket.invalid.status"].fa,
      );
    }
    const updatedTicket = await this.ticketRepo.updateByTicketId(ticketId, {
      status,
    });
    return updatedTicket;
  }

  async deleteTicket(ticketId) {
    const ticket = await this.ticketRepo.findById(ticketId);
    if (!ticket) {
      throw errorFactory.NotFound(operationMessages["ticket.notFound"].fa);
    }
    await this.ticketRepo.deleteByTicketId(id);
  }
}

module.exports = TicketBl;
