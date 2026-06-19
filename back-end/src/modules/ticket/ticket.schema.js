const yup = require("yup");

const createTicketSchema = yup
  .object({
    title: yup.string().required("عنوان تیکت الزامی است"),
    description: yup.string().required("توضیحات تیکت الزامی است"),
    status: yup
      .string()
      .oneOf(
        ["open", "pending", "in_progress", "resolved", "closed"],
        "وضعیت نامعتبر است",
      ),
    priority: yup
      .number()
      .oneOf([1, 2, 3, 4, 5], "اولویت باید یکی از اعداد 1، 2، 3، 4 یا 5 باشد"),
    department: yup
      .string()
      .required("دپارتمان الزامی است")
      .matches(/^[0-9a-fA-F]{24}$/, "شناسه دپارتمان معتبر نیست"),
    tags: yup
      .array()
      .of(yup.string().matches(/^[0-9a-fA-F]{24}$/, "شناسه برچسب معتبر نیست"))
      .optional(),
  })
  .noUnknown("فیلد ناشناس مجاز نیست");

const updateTicketSchema = yup
  .object({
    title: yup.string().notRequired().optional(),
    description: yup.string().notRequired().optional(),
    status: yup
      .string()
      .oneOf(
        ["open", "pending", "in_progress", "resolved", "closed"],
        "وضعیت نامعتبر است",
      )
      .optional(),
    priority: yup
      .number()
      .oneOf([1, 2, 3, 4, 5], "اولویت باید یکی از اعداد 1، 2، 3، 4 یا 5 باشد")
      .optional(),
    department: yup
      .string()
      .notRequired()
      .optional()
      .matches(/^[0-9a-fA-F]{24}$/, "شناسه دپارتمان معتبر نیست"),
    tags: yup
      .array()
      .of(yup.string().matches(/^[0-9a-fA-F]{24}$/, "شناسه برچسب معتبر نیست"))
      .optional(),
  })
  .noUnknown("فیلد ناشناس مجاز نیست");

const getTicketSchema = yup.object({
  id: yup
    .string()
    .required("شناسه تیکت الزامی است")
    .matches(/^[0-9a-fA-F]{24}$/, "شناسه تیکت معتبر نیست"),
});

const searchTicketSchema = yup
  .object({
    search: yup.string().optional().trim().default(""),

    department: yup
      .string()
      .optional()
      .matches(/^[0-9a-fA-F]{24}$/, "شناسه دپارتمان معتبر نیست"),

    tags: yup
      .string()
      .optional()
      .matches(/^[0-9a-fA-F]{24}$/, "شناسه برچسب معتبر نیست"),

    priority: yup
      .number()
      .oneOf([1, 2, 3, 4, 5], "اولویت باید یکی از اعداد 1، 2، 3، 4 یا 5 باشد")
      .optional(),

    status: yup
      .string()
      .oneOf(
        ["open", "pending", "in_progress", "resolved", "closed"],
        "وضعیت نامعتبر است",
      )
      .optional(),

    page: yup
      .number()
      .integer("شماره صفحه باید عدد صحیح باشد")
      .min(1, "شماره صفحه باید حداقل 1 باشد")
      .optional()
      .default(1),

    limit: yup
      .number()
      .integer("تعداد آیتم‌ها باید عدد صحیح باشد")
      .min(1, "تعداد آیتم‌ها باید حداقل 1 باشد")
      .max(100, "تعداد آیتم‌ها حداکثر 100 می‌تواند باشد")
      .optional()
      .default(10),

    sortMethod: yup
      .string()
      .oneOf(["asc", "desc"], "روش مرتب‌سازی باید 'asc' یا 'desc' باشد")
      .optional()
      .default("desc"),
  })
  .noUnknown("فیلد ناشناس مجاز نیست");

const changeTicketStatusSchema = yup.object({
  status: yup
    .string()
    .required("وضعیت الزامی است")
    .oneOf(
      ["open", "pending", "in_progress", "resolved", "closed"],
      "وضعیت نامعتبر است",
    ),
});

module.exports = {
  createTicketSchema,
  updateTicketSchema,
  getTicketSchema,
  searchTicketSchema,
  changeTicketStatusSchema,
};
