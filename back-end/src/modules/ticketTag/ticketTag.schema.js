const yup = require("yup");

const createTicketTagSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("نام برچسب الزامی است")
    .min(1, "نام برچسب نمی‌تواند خالی باشد")
    .max(50, "نام برچسب نباید بیشتر از ۵۰ کاراکتر باشد"),

  description: yup
    .string()
    .trim()
    .max(500, "توضیحات نباید بیشتر از ۵۰۰ کاراکتر باشد")
    .optional(),

  color: yup
    .string()
    .trim()
    .matches(
      /^#[0-9A-Fa-f]{6}$/,
      "رنگ باید یک کد هگز معتبر باشد (مانند #FF0000)",
    )
    .optional(),
});

const updateTicketTagSchema = yup
  .object({
    name: yup
      .string()
      .trim()
      .min(1, "نام برچسب نمی‌تواند خالی باشد")
      .max(50, "نام برچسب نباید بیشتر از ۵۰ کاراکتر باشد")
      .optional(),

    description: yup
      .string()
      .trim()
      .max(500, "توضیحات نباید بیشتر از ۵۰۰ کاراکتر باشد")
      .optional(),

    color: yup
      .string()
      .trim()
      .matches(
        /^#[0-9A-Fa-f]{6}$/,
        "رنگ باید یک کد هگز معتبر باشد (مانند #FF0000)",
      )
      .optional(),

    isActive: yup.boolean().optional(),
  })
  .test(
    "at-least-one-field",
    "حداقل یکی از فیلدها باید مقدار داشته باشد",
    (value) => {
      return (
        value && Object.keys(value).some((key) => value[key] !== undefined)
      );
    },
  );

const getTicketTagSchema = yup.object({
  id: yup
    .string()
    .required("شناسه برچسب الزامی است")
    .matches(/^[0-9a-fA-F]{24}$/, "شناسه برچسب معتبر نیست"),
});

const searchTicketTagSchema = yup
  .object({
    name: yup.string().trim().optional(),

    isActive: yup.boolean().optional(),

    createdBy: yup
      .string()
      .optional()
      .matches(/^[0-9a-fA-F]{24}$/, "شناسه کاربر معتبر نیست"),

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
      .default(10),

    sortMethod: yup
      .string()
      .oneOf(["asc", "desc"], "روش مرتب‌سازی باید 'asc' یا 'desc' باشد")
      .optional()
      .default("desc"),
  })
  .noUnknown("فیلد ناشناس مجاز نیست");

module.exports = {
  createTicketTagSchema,
  updateTicketTagSchema,
  getTicketTagSchema,
  searchTicketTagSchema,
};
