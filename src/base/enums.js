const operationMessages = {
  "auth.register.success": {
    fa: "ثبت نام شما با موفقیت انجام شد.",
    en: "Your registration was successful.",
  },
  "auth.register.email_exists": {
    fa: "این آدرس ایمیل قبلاً ثبت شده است.",
    en: "This email address is already registered.",
  },
  "auth.register.username_exists": {
    fa: "این نام کاربری قبلاً گرفته شده است. لطفاً نام دیگری انتخاب کنید.",
    en: "This username is already taken. Please choose another one.",
  },
  "auth.register.weak_password": {
    fa: "رمز عبور انتخابی شما ضعیف است. لطفاً رمز عبور قوی‌تری انتخاب کنید.",
    en: "Your chosen password is too weak. Please choose a stronger password.",
  },
  "auth.register.error": {
    fa: "خطایی در هنگام ثبت نام رخ داد. لطفاً دوباره تلاش کنید.",
    en: "An error occurred during registration. Please try again.",
  },

  "auth.login.success": {
    fa: "ورود شما با موفقیت انجام شد.",
    en: "You have logged in successfully.",
  },
  "auth.login.invalid_credentials": {
    fa: "نام کاربری یا رمز عبور نامعتبر است.",
    en: "Invalid username or password.",
  },
  "auth.login.account_locked": {
    fa: "حساب کاربری شما به دلیل تلاش‌های ناموفق متعدد قفل شده است.",
    en: "Your account has been locked due to multiple failed attempts.",
  },
  "auth.login.error": {
    fa: "خطایی در هنگام ورود رخ داد. لطفاً بعداً دوباره امتحان کنید.",
    en: "An error occurred during login. Please try again later.",
  },

  "auth.password_reset.request_success": {
    fa: "ایمیل بازنشانی رمز عبور برای شما ارسال شد. لطفاً صندوق ورودی خود را بررسی کنید.",
    en: "A password reset email has been sent to your address. Please check your inbox.",
  },
  "auth.password_reset.token_invalid": {
    fa: "لینک بازنشانی رمز عبور نامعتبر است یا منقضی شده است.",
    en: "The password reset link is invalid or has expired.",
  },
  "auth.password_reset.success": {
    fa: "رمز عبور شما با موفقیت بازنشانی شد.",
    en: "Your password has been reset successfully.",
  },
  "auth.get_me.success": {
    fa: "اطلاعات حساب کاربری شما با موفقیت دریافت شد.",
    en: "Your account information was successfully retrieved.",
  },
  "auth.refresh_token.revoked_success": {
    fa: "جلسه شما با موفقیت پایان یافت.",
    en: "Your session has been successfully ended.",
  },
  "auth.refresh_token.invalid_token": {
    fa: "توکن بازآوری نامعتبر است.",
    en: "Invalid refresh token.",
  },
  "auth.refresh_token.error": {
    fa: "خطایی در هنگام پردازش توکن بازآوری رخ داد.",
    en: "An error occurred while processing the refresh token.",
  },
  "auth.logout.success": {
    fa: "شما با موفقیت از حساب کاربری خود خارج شدید.",
    en: "You have been logged out successfully.",
  },
  "auth.logout.error": {
    fa: "خطایی هنگام خروج از حساب کاربری رخ داد.",
    en: "An error occurred during logout.",
  },
  "auth.registration_limit_exceeded": {
    fa: "ثبت‌نام کاربر جدید مجاز نیست. این سایت فقط امکان ثبت‌نام یک کاربر را دارد.",
    en: "New user registration is not allowed. This site only permits one registered user.",
  },
  "auth.invalid_credentials": {
    fa: "نام کاربری یا رمز عبور نامعتبر است.",
    en: "Invalid username or password.",
  },
  "common.data_saved": {
    fa: "اطلاعات با موفقیت ذخیره شد.",
    en: "Data saved successfully.",
  },
  "common.operation_failed": {
    fa: "عملیات با شکست مواجه شد.",
    en: "Operation failed.",
  },
  "common.error_occurred": {
    fa: "یک خطای غیرمنتظره رخ داده است.",
    en: "An unexpected error has occurred.",
  },
  "common.not_found": {
    fa: "مورد درخواستی یافت نشد.",
    en: "The requested item was not found.",
  },
  "common.username_exists": {
    fa: "این نام کاربری قبلاً استفاده شده است. لطفاً نام دیگری انتخاب کنید.",
    en: "This username is already in use. Please choose another one.",
  },
  "common.user_not_found": {
    fa: "کاربر یافت نشد.",
    en: "User not found.",
  },
  "common.file.format": {
    fa: "فرمت فایل انتخابی پشتیبانی نمی شود.",
    en: "File format is not supported.",
  },

  "user.get.success": {
    fa: "اطلاعات کاربر با موفقیت دریافت شد.",
    en: "User information retrieved successfully.",
  },
  "user.get.invalid_id": {
    fa: "شناسه کاربری نامعتبر است.",
    en: "Invalid user ID.",
  },
  "user.update.success": {
    fa: "اطلاعات کاربر با موفقیت به‌روزرسانی شد.",
    en: "User information updated successfully.",
  },
  "user.update.email_exists": {
    fa: "این آدرس ایمیل قبلاً توسط کاربر دیگری ثبت شده است.",
    en: "This email address is already registered by another user.",
  },
  "user.update.username_exists": {
    fa: "این نام کاربری قبلاً گرفته شده است. لطفاً نام دیگری انتخاب کنید.",
    en: "This username is already taken. Please choose another one.",
  },
  "user.update.error": {
    fa: "خطایی در هنگام به‌روزرسانی اطلاعات کاربر رخ داد. لطفاً دوباره تلاش کنید.",
    en: "An error occurred while updating user information. Please try again.",
  },
  "user.delete.success": {
    fa: "کاربر با موفقیت حذف شد.",
    en: "User deleted successfully.",
  },
  "user.delete.error": {
    fa: "خطایی در هنگام حذف کاربر رخ داد. لطفاً دوباره تلاش کنید.",
    en: "An error occurred while deleting the user. Please try again.",
  },
  "user.delete.own.error": {
    fa: "شما نمی توانید خود را حذف کنید.",
    en: "You can not delete yourself.",
  },
  "user.create.success": {
    fa: "کاربر با موفقیت ایجاد شد.",
    en: "User created successfully.",
  },
  "user.list.empty": {
    fa: "هیچ کاربری یافت نشد.",
    en: "No users found.",
  },
  "user.list.error": {
    fa: "خطایی در هنگام دریافت لیست کاربران رخ داد.",
    en: "An error occurred while retrieving the list of users.",
  },
  "user.username.duplicate.error": {
    fa: "نام کاربری قبلاً ثبت شده است",
    en: "Username is already exists.",
  },
  "user.email.duplicate.error": {
    fa: "ایمیل قبلاً ثبت شده است",
    en: "Email is already exists.",
  },
  "user.phone.duplicate.error": {
    fa: "شماره تلفن قبلاً ثبت شده است",
    en: "Phone is already exists.",
  },
  "user.banned.own.error": {
    fa: "شما نمی توانید خود را مسدود کنید.",
    en: "You can not ban yourself.",
  },
  "user.change.own.permission.error": {
    fa: "شما نمی‌توانید دسترسی خودتان را تغییر .",
    en: "You can not change your permissions.",
  },
  "user.profile.updated.successfully": {
    fa: "پروفایل با موفقیت آپدیت شد .",
    en: "Profile updated successfully.",
  },
  "user.password.wrong.error": {
    fa: "رمز عبور فعلی نادرست است .",
    en: "Current password is wrong.",
  },
  "user.password.updated.successfully": {
    fa: "رمز عبور با موفقیت به‌روزرسانی شد .",
    en: "Password updated successfully.",
  },
  "user.profile.image.deleted.successfully": {
    fa: "عکس پروفایل با موفقیت حذف شد .",
    en: "Profile image deleted successfully.",
  },
  "user.not.instructor.error": {
    fa: "کاربر انتخاب‌شده استاد نیست.",
    en: "Selected user is not an instructor.",
  },
  "instructor.notfound.error": {
    fa: "استاد مورد نظر پیدا نشد.",
    en: "Instructor not found.",
  },
  "course.duplicate.error": {
    fa: "این کد درس قبلاً ثبت شده است.",
    en: "This course code already exists.",
  },
  "course.craeted.success": {
    fa: "درس با موفقیت ایجاد شد.",
    en: "Course created successfully.",
  },
  "course.get.success": {
    fa: "اطلاعات درس با موفقیت دریافت شد.",
    en: "Course information retrieved successfully.",
  },
  "course.notFound.error": {
    fa: "درس یافت نشد.",
    en: "Course not found.",
  },
  "course.delete.success": {
    fa: "درس با موفقیت حذف شد.",
    en: "Course deleted successfully.",
  },
  "course.update.success": {
    fa: "درس با موفقیت آپدیت شد.",
    en: "Course updated successfully.",
  },
  "file.required.error": {
    fa: "آپلود عکس پروفایل الزامی است .",
    en: "Profile image must be uploaded.",
  },
  "session.notFound.error": {
    fa: "جلسه مورد نظر پیدا نشد.",
    en: "Session not found.",
  },

  "session.duplicate.error": {
    fa: "شماره این جلسه برای این درس قبلاً ثبت شده است.",
    en: "Session number already exists for this course.",
  },

  "session.time.conflict.error": {
    fa: "این بازه زمانی با یک جلسه دیگر تداخل دارد.",
    en: "Session time overlaps with another session.",
  },

  "session.create.success": {
    fa: "جلسه با موفقیت ایجاد شد.",
    en: "Session created successfully.",
  },

  "session.get.success": {
    fa: "جلسه با موفقیت دریافت شد.",
    en: "Session fetched successfully.",
  },

  "session.list.success": {
    fa: "لیست جلسات با موفقیت دریافت شد.",
    en: "Sessions fetched successfully.",
  },

  "session.update.success": {
    fa: "جلسه با موفقیت ویرایش شد.",
    en: "Session updated successfully.",
  },

  "session.delete.success": {
    fa: "جلسه با موفقیت حذف شد.",
    en: "Session deleted successfully.",
  },

  "session.status.update.success": {
    fa: "وضعیت جلسه با موفقیت تغییر کرد.",
    en: "Session status updated successfully.",
  },
  "session.time.invalid.error": {
    fa: "زمان پایان باید بعد از زمان شروع باشد.",
    en: "End time must be after start time.",
  },

  "session.time.conflict.error": {
    fa: "این بازه زمانی با یک جلسه دیگر تداخل دارد.",
    en: "Session time conflicts with another session.",
  },

  "session.delete.live.error": {
    fa: "جلسه در حال برگزاری قابل حذف نیست.",
    en: "Live session cannot be deleted.",
  },

  "session.status.invalid.transition": {
    fa: "تغییر وضعیت از این حالت مجاز نیست.",
    en: "Invalid status transition.",
  },

  "material.session.notFound.error": {
    fa: "جلسه ای برای فایل مورد نظر پیدا نشد.",
    en: "Session for the material not found.",
  },
  "enrollment.enroll.success": {
    fa: "ثبت نام در دوره با موفقیت انجام شد.",
    en: "Enrollment successful.",
  },
  "enrollment.notFound.error": {
    fa: "ثبت نام دوره یافت نشد.",
    en: "Enrollment not found.",
  },
  "enrollment.duplicate.error": {
    fa: "کاربر قبلاً در این دوره ثبت نام کرده است.",
    en: "User is already enrolled in this course.",
  },
  "enrollment.status.update.success": {
    fa: "وضعیت ثبت نام با موفقیت به‌روزرسانی شد.",
    en: "Enrollment status updated successfully.",
  },
  "enrollment.status.invalid.transition": {
    fa: "تغییر وضعیت ثبت نام نامعتبر است.",
    en: "Invalid enrollment status transition.",
  },
  "enrollment.check.success": {
    fa: "کاربر در دوره ثبت نام دارد.",
    en: "User is enrolled in the course",
  },
  "enrollment.check.notEnrolled": {
    fa: "کاربر در دوره ثبت نام نکرده است.",
    en: "User is not enrolled in the course.",
  },
  "enrollment.statistics.success": {
    fa: "آمار ثبت نام دوره با موفقیت بازیابی شد.",
    en: "Course enrollment statistics retrieved successfully.",
  },

  "material.upload.success": {
    fa: "فایل با موفقیت آپلود شد.",
    en: "File uploaded successfully.",
  },
  "material.get.success": {
    fa: "فایل با موفقیت دریافت شد.",
    en: "Material retrieved successfully.",
  },
  "material.list.success": {
    fa: "لیست فایل‌ها با موفقیت دریافت شد.",
    en: "Materials list retrieved successfully.",
  },
  "material.update.success": {
    fa: "فایل با موفقیت به‌روزرسانی شد.",
    en: "Material updated successfully.",
  },
  "material.delete.success": {
    fa: "فایل با موفقیت حذف شد.",
    en: "Material deleted successfully.",
  },
  "material.bulk.upload.success": {
    fa: "فایل‌ها با موفقیت آپلود انبوه شدند.",
    en: "Files bulk uploaded successfully.",
  },
  "material.notFound.error": {
    fa: "فایل مورد نظر پیدا نشد.",
    en: "Material not found.",
  },
  "material.version.create.success": {
    fa: "نسخه جدید فایل با موفقیت ایجاد شد.",
    en: "New material version created successfully.",
  },
  "material.session.notFound.error": {
    fa: "جلسه برای فایل مورد نظر پیدا نشد.",
    en: "Session for the material not found.",
  },

  "note.get.success": {
    fa: "یادداشت با موفقیت دریافت شد.",
    en: "Note retrieved successfully.",
  },
  "note.list.success": {
    fa: "لیست یادداشت‌ها با موفقیت دریافت شد.",
    en: "Notes list retrieved successfully.",
  },
  "note.create.success": {
    fa: "یادداشت با موفقیت ایجاد شد.",
    en: "Note created successfully.",
  },
  "note.update.success": {
    fa: "یادداشت با موفقیت به‌روزرسانی شد.",
    en: "Note updated successfully.",
  },
  "note.delete.success": {
    fa: "یادداشت با موفقیت حذف شد.",
    en: "Note deleted successfully.",
  },
  "note.status.change.success": {
    fa: "وضعیت یادداشت با موفقیت تغییر کرد.",
    en: "Note status changed successfully.",
  },
  "note.notFound.error": {
    fa: "یادداشت مورد نظر پیدا نشد.",
    en: "Note not found.",
  },
};

const codes = Object.freeze({
  registration_limit_exceeded: "REGISTRATION_LIMIT_EXCEEDED",
  invalid_refresh_token: "INVALID_REFRESH_TOKEN",
});

const refreshTokenExpire = +process.env.REFRESH_TOKEN_EXPIRES_IN * 24 * 60 * 60;

const FILE_TYPES = {
  PROFILE: {
    limit: 2 * 1024 * 1024,
    mimes: ["image/jpeg", "image/png", "image/jpg"],
  },
  DOCUMENT: {
    dir: "public/documents",
    limit: 5 * 1024 * 1024,
    mimes: [
      "application/pdf",
      "application/msword",
      "video/mp4",
      "video/mkv",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ],
  },
  VIDEO: {
    dir: "public/videos",
    limit: 50 * 1024 * 1024,
    mimes: ["video/mp4", "video/mkv"],
  },
};

module.exports = {
  operationMessages,
  codes,
  refreshTokenExpire,
  FILE_TYPES,
};
