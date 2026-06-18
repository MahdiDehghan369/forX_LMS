/**
 * Yup validation schemas for course enrollment module.
 * Mirrors the style of other modules' schema files.
 */

const yup = require("yup");

// -------------------------------------------------------------------
// Enroll payload – courseId required, userId optional (self enrollment)
// -------------------------------------------------------------------
const enrollmentEnrollSchema = yup.object({
  courseId: yup
    .string()
    .required("شناسه دوره الزامی است.")
    .test("is-objectid", "شناسه دوره معتبر نیست.", (value) => /^[0-9a-fA-F]{24}$/i.test(value)),
  userId: yup
    .string()
    .optional()
    .test("is-objectid", "شناسه کاربر معتبر نیست.", (value) => !value || /^[0-9a-fA-F]{24}$/i.test(value)),
});

// -------------------------------------------------------------------
// Update status payload – only status field allowed
// -------------------------------------------------------------------
const enrollmentUpdateStatusSchema = yup.object({
  status: yup
    .string()
    .required("وضعیت الزامی است.")
    .oneOf(["active", "completed", "dropped", "pending"], "وضعیت ثبت نام معتبر نیست."),
});

// -------------------------------------------------------------------
// Pagination schema (used for list endpoints)
// -------------------------------------------------------------------
const enrollmentListSchema = yup.object({
  page: yup.number().min(1).default(1),
  limit: yup.number().min(1).max(100).default(10),
  sortMethod: yup.string().oneOf(["asc", "desc"]).default("desc"),
});

// -------------------------------------------------------------------
// Params – enrollment id (for get / update / delete)
// -------------------------------------------------------------------
const enrollmentIdParamSchema = yup.object({
  id: yup
    .string()
    .required("شناسه ثبت نام الزامی است.")
    .test("is-objectid", "شناسه ثبت نام معتبر نیست.", (value) => /^[0-9a-fA-F]{24}$/i.test(value)),
});

// -------------------------------------------------------------------
// Check enrollment query – courseId & userId required
// -------------------------------------------------------------------
const enrollmentCheckSchema = yup.object({
  courseId: yup
    .string()
    .required("شناسه دوره الزامی است.")
    .test("is-objectid", "شناسه دوره معتبر نیست.", (value) => /^[0-9a-fA-F]{24}$/i.test(value)),
  userId: yup
    .string()
    .required("شناسه کاربر الزامی است.")
    .test("is-objectid", "شناسه کاربر معتبر نیست.", (value) => /^[0-9a-fA-F]{24}$/i.test(value)),
});

// -------------------------------------------------------------------
// Statistics query – courseId required
// -------------------------------------------------------------------
const enrollmentStatsSchema = yup.object({
  courseId: yup
    .string()
    .required("شناسه دوره الزامی است.")
    .test("is-objectid", "شناسه دوره معتبر نیست.", (value) => /^[0-9a-fA-F]{24}$/i.test(value)),
});

module.exports = {
  enrollmentEnrollSchema,
  enrollmentUpdateStatusSchema,
  enrollmentListSchema,
  enrollmentIdParamSchema,
  enrollmentCheckSchema,
  enrollmentStatsSchema,
};
