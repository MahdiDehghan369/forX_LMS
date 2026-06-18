const yup = require('yup');

const ticketTagSchema = yup.object({
  name: yup
    .string()
    .required('عنوان ticketTag الزامی است')
    .trim('عنوان نباید شامل فاصله خالی در ابتدا و انتها باشد')
    .min(3, 'عنوان ticketTag باید حداقل ۳ کاراکتر باشد')
    .max(50, 'عنوان ticketTag نباید بیشتر از ۵۰ کاراکتر باشد'),

  color: yup
    .string()
    .required('آدرس لینک (href) الزامی است')
    .trim('عنوان نباید شامل فاصله خالی در ابتدا و انتها باشد')
});

const updateTicketTagSchema = yup.object({
  name: yup
    .string()
    .optional()
    .min(3, 'عنوان ticketTag باید حداقل ۳ کاراکتر باشد')
    .max(50, 'عنوان ticketTag نباید بیشتر از ۵۰ کاراکتر باشد'),

  color: yup
    .string()
    .optional()
    .min(3, 'عنوان ticketTag باید حداقل ۳ کاراکتر باشد')
});

const getTicketTagSchema = yup.object({
  id: yup
    .string()
    .required('id ticketTag الزامی است.')
    .matches(/^[0-9a-fA-F]{24}$/, "id must be a valid ObjectId"),
})

module.exports = { ticketTagSchema, getTicketTagSchema ,updateTicketTagSchema}