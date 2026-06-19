const yup = require("yup");

const answerTicketSchema = yup
  .object({
    ticketId: yup
      .string()
      .required("شناسه تیکت الزامی است")
      .matches(/^[0-9a-fA-F]{24}$/, "شناسه تیکت باید یک ObjectId معتبر باشد"),

    content: yup
      .string()
      .required("متن پاسخ الزامی است")
      .trim()
      .min(1, "متن پاسخ نمی‌تواند خالی باشد")
      .max(5000, "متن پاسخ نباید بیشتر از ۵۰۰۰ کاراکتر باشد"),

    attachments: yup.array().of(yup.string().trim()).optional().default([]),

    isSolution: yup.boolean().optional().default(false),
  })
  .noUnknown("فیلد ناشناس مجاز نیست");

const updateAnswerTicketSchema = yup
  .object({
    content: yup
      .string()
      .trim()
      .optional()
      .min(1, "متن پاسخ نمی‌تواند خالی باشد")
      .max(5000, "متن پاسخ نباید بیشتر از ۵۰۰۰ کاراکتر باشد"),

    attachments: yup.array().of(yup.string().trim()).optional(),

    isSolution: yup.boolean().optional(),
  })
  .test(
    "at-least-one-field",
    "حداقل یکی از فیلدها باید مقدار داشته باشد",
    (value) => {
      return (
        value && Object.keys(value).some((key) => value[key] !== undefined)
      );
    },
  )
  .noUnknown("فیلد ناشناس مجاز نیست");

const getAnswerTicketSchema = yup.object({
  id: yup
    .string()
    .required("شناسه پاسخ الزامی است")
    .matches(/^[0-9a-fA-F]{24}$/, "شناسه پاسخ باید یک ObjectId معتبر باشد"),
});

const getAnswersTicketSchema = yup
  .object({
    ticketId: yup
      .string()
      .required("شناسه تیکت الزامی است")
      .matches(/^[0-9a-fA-F]{24}$/, "شناسه تیکت باید یک ObjectId معتبر باشد"),

    page: yup
      .number()
      .integer("شماره صفحه باید عدد صحیح باشد")
      .min(1, "شماره صفحه باید حداقل ۱ باشد")
      .optional()
      .default(1),

    limit: yup
      .number()
      .integer("تعداد آیتم‌ها باید عدد صحیح باشد")
      .min(1, "تعداد آیتم‌ها باید حداقل ۱ باشد")
      .max(100, "تعداد آیتم‌ها حداکثر ۱۰۰ می‌تواند باشد")
      .optional()
      .default(20),

    sortMethod: yup
      .string()
      .oneOf(["asc", "desc"], "روش مرتب‌سازی باید 'asc' یا 'desc' باشد")
      .optional()
      .default("desc"),
  })
  .noUnknown("فیلد ناشناس مجاز نیست");

module.exports = {
  answerTicketSchema,
  updateAnswerTicketSchema,
  getAnswerTicketSchema,
  getAnswersTicketSchema,
};
