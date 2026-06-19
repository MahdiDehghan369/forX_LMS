const mongoose = require('mongoose');
const errorFactory = require('sillajError');
const { operationMessages } = require('../../base/enums');

class AnswerTicketBl {
  constructor(answerTicketRepo, ticketRepo) {
    this.answerTicketRepo = answerTicketRepo;
    this.ticketRepo = ticketRepo;
  }

  async createAnswerTicket(data, userId) {
    const { ticketId, content, attachments, isSolution } = data;
    const ticketExists = await this.ticketRepo.findById(ticketId);
    if (!ticketExists) {
      throw errorFactory.NotFound(operationMessages["ticket.notFound"].fa);
    }
    const answer = await this.answerTicketRepo.create({
      ticketId,
      userId,
      content,
      attachments: attachments || [],
      isSolution: !!isSolution,
    });
    return answer;
  }

  async getAllAnswerTickets() {
    return this.answerTicketRepo.find();
  }

  async getAnswersTicket(ticketId) {
    const ticket = await this.ticketRepo.findById(ticketId);
    if (!ticket) {
      throw errorFactory.NotFound(operationMessages["ticket.notFound"]);
    }
    return this.answerTicketRepo.find({ ticketId });
  }

  async getAnswerTicket(answerTicketId) {
    const answer = await this.answerTicketRepo.findById(answerTicketId);
    if (!answer) {
      throw errorFactory.NotFound(
        operationMessages["answerTicket.notFound"].fa,
      );
    }
    return answer;
  }

  async updateAnswerTicket(answerTicketId, data) {
    const { content, attachments, isSolution } = data;
    const answer = await this.answerTicketRepo.findById(answerTicketId);
    if (!answer) {
      throw errorFactory.NotFound(
        operationMessages["answerTicket.notFound"].fa,
      );
    }

    const updateData = {};
    if (content !== undefined) updateData.content = content;
    if (attachments !== undefined) updateData.attachments = attachments;
    if (isSolution !== undefined) updateData.isSolution = isSolution;

    const updated = await this.answerTicketRepo.updateByAnswerTicketId(
      answerTicketId,
      updateData,
    );
    return updated;
  }

  async deleteAnswerTicket(answerTicketId) {
    const answer = await this.answerTicketRepo.findById(answerTicketId);
    if (!answer) {
      throw errorFactory.NotFound(
        operationMessages["answerTicket.notFound"].fa,
      );
    }
    await this.answerTicketRepo.deleteByAnswerTicketId(answerTicketId);
  }
}

module.exports = AnswerTicketBl;
