const yup = require('yup');

const answerTicketSchema = yup.object({
  content: yup
    .string()
    .required(),
  ticket: yup
    .string()
    .required("ticket الزامی است.")
    .matches(/^[0-9a-fA-F]{24}$/, "ticket id must be a valid ObjectId"),
  parentAnswer: yup
    .string()
    .optional()
    .matches(/^[0-9a-fA-F]{24}$/, "parentAnswer id must be a valid ObjectId"),
});
const updateAnswerTicketSchema = yup.object({
  content: yup
    .string()
    .required(),
});

const getAnswerTicketSchema = yup.object({
  id: yup
    .string()
    .required('id answerTicket الزامی است.')
    .matches(/^[0-9a-fA-F]{24}$/, "answerTicket id must be a valid ObjectId"),
});

const getAnswersTicketSchema = yup.object({
  ticketId: yup
    .string()
    .required('ticketId الزامی است.')
    .matches(/^[0-9a-fA-F]{24}$/, "ticketId must be a valid ObjectId"),
});

module.exports = { answerTicketSchema, getAnswerTicketSchema, getAnswersTicketSchema,updateAnswerTicketSchema }