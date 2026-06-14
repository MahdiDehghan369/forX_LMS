const yup = require("yup");

const sessionCreateSchema = yup.object({
  sessionNumber: yup
    .number()
    .required("شماره جلسه الزامی است.")
    .min(1, "شماره جلسه باید بزرگتر از 0 باشد."),

  title: yup.string().trim().required("عنوان جلسه الزامی است.").min(3).max(200),

  description: yup.string().trim().default(""),

  startAt: yup
    .date()
    .required("زمان شروع الزامی است.")
    .typeError("زمان شروع معتبر نیست."),

  endAt: yup
    .date()
    .required("زمان پایان الزامی است.")
    .typeError("زمان پایان معتبر نیست.")
    .test(
      "date-order",
      "زمان پایان باید بعد از زمان شروع باشد.",
      function (value) {
        const { startAt } = this.parent;
        if (!startAt || !value) return true;
        return new Date(value) > new Date(startAt);
      },
    ),

  location: yup.string().nullable().default(null),

  meetingLink: yup.string().nullable().default(null),

});

const sessionIdParamSchema = yup.object({
  sessionId: yup
    .string()
    .required("شناسه جلسه الزامی است.")
    .test("is-objectid", "شناسه جلسه معتبر نیست.", (value) =>
      /^[0-9a-fA-F]{24}$/.test(value),
    ),
});

const sessionListSchema = yup.object({
  page: yup.number().min(1, "شماره صفحه باید بزرگتر از ۰ باشد.").default(1),

  limit: yup
    .number()
    .min(1, "حداقل تعداد آیتم ۱ است.")
    .max(100, "حداکثر تعداد آیتم ۱۰۰ است.")
    .default(10),

  status: yup
    .string()
    .oneOf(
      ["scheduled", "live", "completed", "cancelled"],
      "وضعیت جلسه معتبر نیست.",
    )
    .nullable(),

  sortMethod: yup
    .string()
    .oneOf(["asc", "desc"], "نوع مرتب‌سازی معتبر نیست.")
    .default("desc"),
});

const updateSessionSchema = yup.object({
  sessionNumber: yup
    .number()
    .min(1, "شماره جلسه باید بزرگتر از ۰ باشد.")
    .optional(),

  title: yup.string().min(3, "عنوان حداقل ۳ کاراکتر است.").max(200).optional(),

  description: yup.string().optional(),

  startAt: yup.date().typeError("تاریخ شروع معتبر نیست."),

  endAt: yup.date().typeError("تاریخ پایان معتبر نیست."),

  location: yup.string().nullable(),

  meetingLink: yup.string().nullable(),

  status: yup
    .string()
    .oneOf(["scheduled", "live", "completed", "cancelled"])
    .optional(),
});

const changeSessionStatusSchema = yup.object({
  status: yup
    .string()
    .required("وضعیت الزامی است.")
    .oneOf(
      ["scheduled", "live", "completed", "cancelled"],
      "وضعیت جلسه معتبر نیست.",
    ),
});

module.exports = {
  sessionCreateSchema,
  sessionIdParamSchema,
  sessionListSchema,
  updateSessionSchema,
  changeSessionStatusSchema,
};