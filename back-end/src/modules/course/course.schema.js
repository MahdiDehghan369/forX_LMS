const yup = require("yup");
const { Types } = require("mongoose");

const objectIdTest = (value) => {
  if (value === undefined || value === null || value === "") return true;
  return /^[0-9a-fA-F]{24}$/.test(value);
};


const courseCreateSchema = yup
  .object({
    courseCode: yup
      .string()
      .trim()
      .required("کد درس الزامی است.")
      .min(2, "کد درس باید حداقل ۲ کاراکتر باشد.")
      .max(50, "کد درس نمی‌تواند بیشتر از ۵۰ کاراکتر باشد."),

    title: yup
      .string()
      .trim()
      .required("عنوان درس الزامی است.")
      .min(3, "عنوان درس باید حداقل ۳ کاراکتر باشد.")
      .max(220, "عنوان درس نمی‌تواند بیشتر از ۲۲۰ کاراکتر باشد."),

    description: yup
      .string()
      .trim()
      .max(5000, "توضیحات نمی‌تواند بیشتر از ۵۰۰۰ کاراکتر باشد.")
      .default(""),

    instructorId: yup
      .string()
      .required("استاد درس الزامی است.")
      .test("is-objectid", "شناسه استاد معتبر نیست.", objectIdTest),

    status: yup
      .string()
      .oneOf(["draft", "published", "archived"], "وضعیت درس معتبر نیست.")
      .default("draft"),

    startsAt: yup.date().nullable().typeError("تاریخ شروع معتبر نیست."),

    endsAt: yup.date().nullable().typeError("تاریخ پایان معتبر نیست."),
  })
  .test(
    "date-order",
    "تاریخ پایان باید بعد از تاریخ شروع باشد.",
    function (value) {
      if (!value?.startsAt || !value?.endsAt) return true;
      return new Date(value.endsAt) > new Date(value.startsAt);
    },
  );

const courseCodeSchema = yup.object({
  courseCode: yup.string().trim().required("کد درس الزامی است."),
});

const courseUpdateSchema = yup
  .object({
    courseCode: yup
      .string()
      .trim()
      .min(2, "کد درس باید حداقل ۲ کاراکتر باشد.")
      .max(50, "کد درس نمی‌تواند بیشتر از ۵۰ کاراکتر باشد.")
      .optional(),

    title: yup
      .string()
      .trim()
      .min(3, "عنوان درس باید حداقل ۳ کاراکتر باشد.")
      .max(220, "عنوان درس نمی‌تواند بیشتر از ۲۲۰ کاراکتر باشد.")
      .optional(),

    description: yup
      .string()
      .trim()
      .max(5000, "توضیحات نمی‌تواند بیشتر از ۵۰۰۰ کاراکتر باشد.")
      .optional(),

    instructorId: yup
      .string()
      .test("is-objectid", "شناسه استاد معتبر نیست.", objectIdTest)
      .optional(),

    status: yup
      .string()
      .oneOf(["draft", "published", "archived"], "وضعیت درس معتبر نیست.")
      .optional(),

    startsAt: yup
      .date()
      .nullable()
      .typeError("تاریخ شروع معتبر نیست.")
      .optional(),

    endsAt: yup
      .date()
      .nullable()
      .typeError("تاریخ پایان معتبر نیست.")
      .optional(),
  })
  .test(
    "date-order",
    "تاریخ پایان باید بعد از تاریخ شروع باشد.",
    function (value) {
      if (value?.startsAt !== undefined && value?.endsAt !== undefined) {
        if (!value.startsAt || !value.endsAt) return true;
        return new Date(value.endsAt) > new Date(value.startsAt);
      }
      return true;
    },
  );


const courseQuerySchema = yup.object({
  search: yup
    .string()
    .trim()
    .default("")
    .optional(),

  instructorId: yup
    .string()
    .optional()
    .test("is-objectid", "شناسه استاد معتبر نیست.", objectIdTest),

  status: yup
    .string()
    .oneOf(
      ["draft", "published", "archived"],
      "وضعیت درس نامعتبر است. لطفا یکی از گزینه‌های published, draft, archived را انتخاب کنید.",
    )
    .optional(),

  createdByAdminId: yup
    .string()
    .optional()
    .test("is-objectid", "شناسه ادمین معتبر نیست.", objectIdTest),

  page: yup
    .number()
    .integer("شماره صفحه باید یک عدد صحیح باشد.")
    .positive("شماره صفحه باید مثبت باشد.")
    .default(1),

  limit: yup
    .number()
    .integer("تعداد آیتم در صفحه باید یک عدد صحیح باشد.")
    .positive("تعداد آیتم در صفحه باید مثبت باشد.")
    .min(1, "حداقل ۱ آیتم در هر صفحه مجاز است.")
    .max(100, "حداکثر ۱۰۰ آیتم در هر صفحه مجاز است.")
    .default(10),

  sort: yup
    .string()
    .oneOf(
      ["asc", "desc"],
      "مقدار مرتب‌سازی نامعتبر است. فقط asc یا desc مجاز است.",
    )
    .default("desc")
    .optional(),
});

const courseStatusSchema = yup.object({
  status: yup
    .string()
    .oneOf(["draft", "published", "archived"], "وضعیت درس معتبر نیست.")
    .required("وارد کردن وضعیت درس الزامی است."),
});

const courseSessionsQuerySchema = yup.object({
  status: yup
    .string()
    .oneOf(
      ["scheduled", "live", "completed", "cancelled"],
      "وضعیت جلسه نامعتبر است. لطفا یکی از گزینه‌های scheduled",
      "live",
      "completed",
      "cancelled را انتخاب کنید.",
    )
    .optional(),

  page: yup
    .number()
    .integer("شماره صفحه باید یک عدد صحیح باشد.")
    .positive("شماره صفحه باید مثبت باشد.")
    .default(1),

  limit: yup
    .number()
    .integer("تعداد آیتم در صفحه باید یک عدد صحیح باشد.")
    .positive("تعداد آیتم در صفحه باید مثبت باشد.")
    .min(1, "حداقل ۱ آیتم در هر صفحه مجاز است.")
    .max(100, "حداکثر ۱۰۰ آیتم در هر صفحه مجاز است.")
    .default(10),

  sortMethod: yup
    .string()
    .oneOf(
      ["asc", "desc"],
      "مقدار مرتب‌سازی نامعتبر است. فقط asc یا desc مجاز است.",
    )
    .default("desc")
    .optional(),
});

module.exports = {
  courseCreateSchema,
  courseCodeSchema,
  courseUpdateSchema,
  courseQuerySchema,
  courseStatusSchema,
  courseSessionsQuerySchema,
};
