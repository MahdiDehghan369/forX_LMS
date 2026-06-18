// Yup validation schemas for session material endpoints
// Mirrors the style of other modules' schema files

const yup = require("yup");

// -------------------------------------------------------------------
// Upload – title/description optional, expiresAt optional
// -------------------------------------------------------------------
const materialUploadSchema = yup.object({
  title: yup.string().trim().optional(),
  description: yup.string().trim().optional(),
  expiresAt: yup
    .date()
    .nullable()
    .optional()
    .typeError("تاریخ انقضا معتبر نیست."),
});

// -------------------------------------------------------------------
// Update – same fields, all optional
// -------------------------------------------------------------------
const materialUpdateSchema = yup.object({
  title: yup.string().trim().optional(),
  description: yup.string().trim().optional(),
  expiresAt: yup
    .date()
    .nullable()
    .optional()
    .typeError("تاریخ انقضا معتبر نیست."),
});

// -------------------------------------------------------------------
// List – pagination & sorting
// -------------------------------------------------------------------
const materialListSchema = yup.object({
  page: yup.number().min(1).default(1),
  limit: yup.number().min(1).max(100).default(10),
  sortMethod: yup.string().oneOf(["asc", "desc"]).default("desc"),
});

// -------------------------------------------------------------------
// Params – materialId validation (Mongo ObjectId)
// -------------------------------------------------------------------
const materialIdParamSchema = yup.object({
  materialId: yup
    .string()
    .required("شناسه فایل الزامی است.")
    .test("is-objectid", "شناسه فایل معتبر نیست.", (value) =>
      /^[0-9a-fA-F]{24}$/.test(value),
    ),
});

module.exports = {
  materialUploadSchema,
  materialUpdateSchema,
  materialListSchema,
  materialIdParamSchema,
};
