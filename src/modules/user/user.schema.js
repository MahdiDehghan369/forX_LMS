const yup = require("yup");

const userIdSchema = yup.object({
  userId: yup
    .string()
    .required("شناسه الزامی است")
    .matches(/^[0-9a-fA-F]{24}$/, "شناسه وارد شده معتبر نیست"),
});

const createUserSchema = yup.object({
  firstName: yup
    .string()
    .trim()
    .required("نام الزامی است.")
    .min(1, "نام نمی‌تواند خالی باشد.")
    .max(50, "نام نباید بیش از ۵۰ کاراکتر باشد."),

  lastName: yup
    .string()
    .trim()
    .required("نام خانوادگی الزامی است.")
    .min(1, "نام خانوادگی نمی‌تواند خالی باشد.")
    .max(50, "نام خانوادگی نباید بیش از ۵۰ کاراکتر باشد."),

  username: yup
    .string()
    .trim()
    .required("نام کاربری الزامی است.")
    .min(3, "نام کاربری باید حداقل ۳ کاراکتر باشد.")
    .max(30, "نام کاربری نباید بیش از ۳۰ کاراکتر باشد.")
    .matches(
      /^[a-z0-9_]+$/,
      "نام کاربری فقط می‌تواند شامل حروف کوچک انگلیسی، اعداد و آندرلاین باشد.",
    ),
  email: yup
    .string()
    .trim()
    .email("فرمت ایمیل نامعتبر است.")
    .required("ایمیل الزامی است.")
    .max(100, "ایمیل نباید بیش از ۱۰۰ کاراکتر باشد."),

  phone: yup
    .string()
    .trim()
    .required("شماره تلفن الزامی است.")
    .matches(/^[0-9]+$/, "شماره تلفن فقط می‌تواند شامل اعداد باشد.")
    .min(10, "شماره تلفن باید حداقل ۱۰ رقم باشد.")
    .max(11, "شماره تلفن نباید بیش از ۱۵ رقم باشد."),

  password: yup
    .string()
    .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
    .max(100, "رمز عبور نباید بیش از ۱۰۰ کاراکتر باشد.")
    .matches(/[A-Z]/, "رمز عبور باید حداقل یک حرف بزرگ داشته باشد")
    .matches(/[0-9]/, "رمز عبور باید حداقل یک عدد داشته باشد")
    .required("رمز عبور جدید الزامی است"),

  permissions: yup.array().of(yup.string()).optional(),
});

const updateUserSchema = yup.object({
  firstName: yup
    .string()
    .trim()
    .min(1, "نام نباید خالی باشد.")
    .max(50, "نام نباید بیش از ۵۰ کاراکتر باشد.")
    .optional(),
  lastName: yup
    .string()
    .trim()
    .min(1, "نام خانوادگی نباید خالی باشد.")
    .max(50, "نام خانوادگی نباید بیش از ۵۰ کاراکتر باشد.")
    .optional(),
  username: yup
    .string()
    .trim()
    .min(3, "نام کاربری باید حداقل ۳ کاراکتر باشد.")
    .max(30, "نام کاربری نباید بیش از ۳۰ کاراکتر باشد.")
    .matches(
      /^[a-z0-9_]+$/,
      "نام کاربری فقط می‌تواند شامل حروف کوچک انگلیسی، اعداد و آندرلاین باشد.",
    )
    .optional(),
  email: yup
    .string()
    .trim()
    .email("فرمت ایمیل نامعتبر است.")
    .max(100, "ایمیل نباید بیش از ۱۰۰ کاراکتر باشد.")
    .optional(),
  phone: yup
    .string()
    .trim()
    .matches(/^[0-9]+$/, "شماره تلفن فقط می‌تواند شامل اعداد باشد.")
    .min(10, "شماره تلفن باید حداقل ۱۰ رقم باشد.")
    .max(15, "شماره تلفن نباید بیش از ۱۵ رقم باشد.")
    .optional(),
  permissions: yup.array().of(yup.string()).optional(),
  password: yup
    .string()
    .trim()
    .required("رمز عبور الزامی است.")
    .min(8, "رمز عبور باید حداقل ۶ کاراکتر باشد.")
    .max(100, "رمز عبور نباید بیش از ۱۰۰ کاراکتر باشد.")
    .optional(),
});

const addRemovePermissionsSchema = yup.object({
  permissions: yup
    .array()
    .of(yup.string().trim().min(1, "مجوز ها نامعتبر هستند"))
    .min(1, "باید حداقل یک مجوز ارسال شود")
    .required("ارسال مجوز الزامی است."),
});

const updateMyProfileSchema = yup.object({
  firstName: yup
    .string()
    .trim()
    .min(1, "نام نباید خالی باشد.")
    .max(50, "نام نباید بیش از ۵۰ کاراکتر باشد.")
    .optional(),
  lastName: yup
    .string()
    .trim()
    .min(1, "نام خانوادگی نباید خالی باشد.")
    .max(50, "نام خانوادگی نباید بیش از ۵۰ کاراکتر باشد.")
    .optional(),
  email: yup
    .string()
    .trim()
    .email("فرمت ایمیل نامعتبر است.")
    .max(100, "ایمیل نباید بیش از ۱۰۰ کاراکتر باشد.")
    .optional(),
  phone: yup
    .string()
    .trim()
    .matches(/^[0-9]+$/, "شماره تلفن فقط می‌تواند شامل اعداد باشد.")
    .min(10, "شماره تلفن باید حداقل ۱۰ رقم باشد.")
    .max(15, "شماره تلفن نباید بیش از ۱۵ رقم باشد.")
    .optional(),
  bio: yup
    .string()
    .trim()
    .max(100, "بیوگرافی نباید بیش از ۱۰۰ کاراکتر باشد.")
    .optional(),
});

const changePasswordSchema = yup.object({
  currentPassword: yup.string().required("رمز عبور فعلی الزامی است"),
  newPassword: yup
    .string()
    .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
    .matches(/[A-Z]/, "رمز عبور باید حداقل یک حرف بزرگ داشته باشد")
    .matches(/[0-9]/, "رمز عبور باید حداقل یک عدد داشته باشد")
    .required("رمز عبور جدید الزامی است"),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "رمز عبور جدید با تکرار آن مطابقت ندارد")
    .required("تکرار رمز عبور الزامی است"),
});

module.exports = {
  userIdSchema,
  createUserSchema,
  updateUserSchema,
  addRemovePermissionsSchema,
  updateMyProfileSchema,
  changePasswordSchema,
};
