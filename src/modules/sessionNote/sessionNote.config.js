// src/modules/sessionNote/sessionNote.config.js
const SessionNoteBl = require('./sessionNote.bl');
const SessionNoteModel = require('./sessionNote.model');
const SessionNoteController = require('./sessionNote.ctrl');
const SessionNoteRepo = require('./sessionNote.repo');
const {
  createNoteSchema,
  noteIdParamSchema,
  updateNoteSchema,
  changeStatusSchema,
} = require('./sessionNote.schema');

module.exports = [
  // Model (singleton)
  {
    key: "sessionNoteModel",
    Class: SessionNoteModel,
    type: "model",
    options: { singleton: true },
  },
  // Repository (depends on model)
  {
    key: "sessionNoteRepo",
    Class: SessionNoteRepo,
    type: "repository",
    dependencies: ["sessionNoteModel"],
  },
  // Business Logic (needs note repo + existing session repo)
  {
    key: "sessionNoteBl",
    Class: SessionNoteBl,
    type: "bl",
    dependencies: ["sessionNoteRepo", "sessionRepo"], // sessionRepo comes from session module
  },
  // Controller (depends on BL)
  {
    key: "sessionNoteController",
    Class: SessionNoteController,
    type: "controller",
    dependencies: ["sessionNoteBl"],
  },
  // Schemas
  { key: "createNoteSchema", schema: createNoteSchema, type: "schema" },
  { key: "noteIdParamSchema", schema: noteIdParamSchema, type: "schema" },
  { key: "updateNoteSchema", schema: updateNoteSchema, type: "schema" },
  { key: "changeStatusSchema", schema: changeStatusSchema, type: "schema" },
];
