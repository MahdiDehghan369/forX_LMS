const errorFactory = require("sillajError");
const { operationMessages } = require("../../base/enums");

class TicketBl {
  constructor(ticketRepo, departmentRepo) {
    this.ticketRepo = ticketRepo;
    this.departmentRepo = departmentRepo;
  }

  async createTicket({ department, title }, userId) {
    const ticketExist = await this.ticketRepo.exists({
      department,
      title,
      userId,
    });

    if (ticketExist) {
      throw errorFactory.Conflict(
        operationMessages["ticket.create.conflict"].fa,
      );
    }

    const departmentExist = await this.departmentRepo.exists({
      _id: department,
    });
    if (!departmentExist) {
      throw errorFactory.NotFound(operationMessages["department.notFound"].fa);
    }
    return await this.ticketRepo.create({ ...req.body, userId });
  }

  getTickets(req) {
    const { departmentId, tags, priority, status } = req.query;

    const query = {};
    if (departmentId) {
      query.departmentId = departmentId;
    }
    if (tags && tags.length > 0) {
      query.tags = { $all: tags };
    }
    if (priority) {
      query.priority = priority;
    }
    if (status) {
      query.status = status;
    }
    return this.ticketRepo.find(query);
  }

  async getTicket(id) {
    const existCache = await this.ticketRepo.getCache(id);
    if (existCache) {
      return existCache;
    }

    const ticket = await this.ticketRepo.findById(id);
    if (!ticket) {
      throw errorFactory.NotFound(operationMessages["ticket.notFound"]);
    }
    await this.ticketRepo.setCache(id, ticket);

    return ticket;
  }

  async updateTicket(req) {
    const { id } = req.params;
    const { title, description, priority, tags } = req.body;
    const user_id = req.user._id;

    const ticket = await this.ticketRepo.findById(id);
    if (!ticket) {
      throw errorFactory.NotFound(operationMessages["ticket.notFound"].fa);
    }
    if (ticket.user_id.toString() !== user_id.toString()) {
      throw errorFactory.Forbidden(operationMessages["accessDenied"].fa);
    }
    if (ticket.status === "Closed") {
      throw errorFactory.BadRequest(
        "امکان ویرایش تیکت‌های بسته شده وجود ندارد.",
      );
    }

    const conflict = await this.ticketRepo.findOne({ title, user_id });
    if (conflict) {
      throw errorFactory.Conflict(
        operationMessages["ticket.create.conflict"].fa,
      );
    }

    const updateData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(priority && { priority }),
      ...(tags && { tags }),
    };

    const updatedTicket = await this.ticketRepo.updateTicketById(
      id,
      updateData,
    );
    await this.ticketRepo.deleteCache(id);
    return updatedTicket;
  }

  async changeTicketStatus(req) {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = [
      "Open",
      "Pending",
      "In Progress",
      "Resolved",
      "Closed",
    ];
    if (!validStatuses.includes(status)) {
      throw errorFactory.BadRequest("وضعیت ارسالی نامعتبر است.");
    }
    const ticket = await this.ticketRepo.findById(id);
    if (!ticket) {
      throw errorFactory.NotFound(operationMessages["ticket.notFound"].fa);
    }

    const updatedTicket = await this.ticketRepo.updateById(id, { status });
    return updatedTicket;
  }

  async deleteTicket(id) {
    const ticket = await this.ticketRepo.exists({ _id: id });
    if (!ticket) {
      throw errorFactory.NotFound(operationMessages["ticket.notFound"].fa);
    }
    await this.ticketRepo.deleteById(id);
    await this.ticketRepo.deleteCache(id);
  }
}

module.exports = TicketBl;
