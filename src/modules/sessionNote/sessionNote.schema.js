// src/modules/sessionNote/sessionNote.schema.js
const yup = require('yup');

// ObjectId validator (24‑hex characters)
const objectId = yup
  .string()
  .required()
  .test('is-objectid', 'شناسه معتبر نیست.', (value) => /^[0-9a-fA-F]{24}$/.test(value));

// ---------- Create note ----------
const createNoteSchema = yup.object({
  sessionId: objectId,
  content: yup.string().trim().required('محتوا الزامی است.').min(1),
});

// ---------- Params containing an id (used for :id or :sessionId) ----------
const noteIdParamSchema = yup.object({
  id: objectId,
});

// ---------- Update note ----------
const updateNoteSchema = yup.object({
  sessionId: objectId.optional(),
  content: yup.string().trim().min(1).optional(),
  status: yup.string().oneOf(['active', 'archived']).optional(),
});

// ---------- Change status ----------
const changeStatusSchema = yup.object({
  status: yup
    .string()
    .required('وضعیت الزامی است.')
    .oneOf(['active', 'archived'], 'وضعیت نادرست است.'),
});

module.exports = {
  createNoteSchema,
  noteIdParamSchema,
  updateNoteSchema,
  changeStatusSchema,
};
