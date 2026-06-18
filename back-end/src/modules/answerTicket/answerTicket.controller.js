class AnswerTicketController {
  constructor(answerTicketService) {
    this.answerTicketService = answerTicketService;
  }
  async createAnswerTicket(req, res, next) {
    const answerTicket=await this.answerTicketService.createAnswerTicket(req)
    res.sendResponse(201,{ message: "create answerTicket successfuly." ,answerTicket})
  }

  async getAllAnswerTickets(req, res, next) {
    const answerTickets = await this.answerTicketService.getAllAnswerTickets()
    res.sendResponse(200,{answerTickets})
  }

  async getAnswerTicket(req, res, next) {
    const { id } = req.params;
    const answerTicket = await this.answerTicketService.getAnswerTicket(id)
    res.sendResponse(200,{answerTicket})
  }

  async getAnswersTicket(req,res,next){
    const {ticketId}=req.params;
    const answersTicket=await this.answerTicketService.getAnswersTicket(ticketId);
    res.sendResponse(200,{answersTicket})
  }
  
  async updateAnswerTicket(req,res,next){
    const answerTicket=await this.answerTicketService.updateAnswerTicket(req);
    res.sendResponse(200,{message:"update answerTicket sucessfuly.",answerTicket})
  }

  async deleteAnswerTicket(req,res,next){
    const {id}=req.params;
    await this.answerTicketService.deleteAnswerTicket(id);
    res.sendResponse(200,{message:"پاسخ تیکت حذف شد."})
  }

}

module.exports = AnswerTicketController;
