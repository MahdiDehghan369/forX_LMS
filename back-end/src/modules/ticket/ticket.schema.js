const yup = require("yup");

const createTicketSchema = yup.object({
  title: yup
    .string()
    .required("title is required"),

  description: yup
    .string()
    .required("description is required"),

  priority: yup
    .number()
    .oneOf([1, 2, 3, 4, 5], "priority must be one of 1, 2, 3, 4, 5")
    .optional(),

  department: yup
    .string()
    .required("department is required")
    .matches(/^[0-9a-fA-F]{24}$/, "department must be a valid ObjectId"),

  tags: yup
    .array()
    .of(yup.string().trim())
    .optional(),
})
  .noUnknown('فیلد غیرمجاز ارسال شده است.');

const updateTicketSchema = yup.object({
  title: yup
    .string()
    .optional(),

  description: yup
    .string()
    .optional(),

  priority: yup
    .number()
    .oneOf([1, 2, 3, 4, 5], "priority must be one of 1, 2, 3, 4, 5")
    .optional(),

  tags: yup
    .array()
    .of(yup.string().trim())
    .optional(),
})
  .noUnknown('فیلد غیرمجاز ارسال شده است.');

const getTicketSchema = yup.object({
  id: yup
    .string()
    .required("id is required")
    .matches(/^[0-9a-fA-F]{24}$/, "id must be a valid ObjectId")
});

const searchTicketSchema = yup.object({
  department: yup
    .string()
    .optional()
    .matches(/^[0-9a-fA-F]{24}$/, "id must be a valid ObjectId"),
});

const changeTicketStatusSchema=yup.object({
    status: yup
    .string()
    .oneOf(["Open", "Pending", "In Progress", "Resolved", "Closed"], "invalid status")
    .required(),
})

module.exports = { createTicketSchema, getTicketSchema, searchTicketSchema, updateTicketSchema,changeTicketStatusSchema };
