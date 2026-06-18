const errorFactory = require("sillajError")
const { operationMessages } = require("../../base/enums")
class AnswerTicketService {
  constructor(answerTicketRepo, ticketRepo) {
    this.answerTicketRepo = answerTicketRepo;
    this.ticketRepo = ticketRepo;
  }

  async createAnswerTicket(req) {
    const { content, ticket, parentAnswer } = req.body;
    const user_id = req.user._id;
    const existTicket = await this.ticketRepo.findById(ticket);
    if (!existTicket) {
      throw errorFactory.NotFound(operationMessages["ticket.notFound"].fa);
    }
    if (parentAnswer) {
      const existParentAnswer = await this.answerTicketRepo.findById(parentAnswer);
      if (!existParentAnswer) {
        throw errorFactory.NotFound(operationMessages["answerTicket.parentAnswer.notFound"].fa);
      }
    }
    const answerTicket = await this.answerTicketRepo.create({ ticket, content, parentAnswer, creator: user_id });

    return answerTicket;
  }

  async getAllAnswerTickets() {
    const answerTickets = await this.answerTicketRepo.find();
    return answerTickets;
  }

  async getAnswersTicket(ticketId) {
    const answersTicket = await this.answerTicketRepo.find({ ticket: ticketId });
    return answersTicket;
  }

  async getAnswerTicket(id) {
    const existCache = await this.answerTicketRepo.getCache(id);
    if (existCache) {
      return existCache;
    }

    const answerTicket = await this.answerTicketRepo.findById(id);
    if (!answerTicket) {
      throw errorFactory.NotFound(operationMessages["answerTicket.notFound"].fa)
    }

    await this.answerTicketRepo.setCache(id, answerTicket);
    return answerTicket;
  }

  async updateAnswerTicket(req) {
    const { id } = req.params;
    const { content } = req.body;
    const user_id = req.user._id;

    const answer = await this.answerTicketRepo.findById(id);
    if (!answer) {
      throw errorFactory.NotFound(operationMessages["answerTicket.notFound"].fa);
    }
    if (answer.creator.toString() !== user_id.toString()) {
      throw errorFactory.Forbidden(operationMessages["accessDenied"].fa);
    }

    const updatedAnswer = await this.answerTicketRepo.updatedAnswer(id, { content });
    await this.answerTicketRepo.deleteCache(id);
    return updatedAnswer;
  }

  async deleteAnswerTicket(id) {
    const answer = await this.answerTicketRepo.exists({ _id: id });
    if (!answer) {
      throw errorFactory.NotFound(operationMessages["answerTicket.notFound"].fa)
    }
    await this.answerTicketRepo.deleteById(id);
    await this.answerTicketRepo.deleteCache(id);
  }

}

module.exports = AnswerTicketService;
