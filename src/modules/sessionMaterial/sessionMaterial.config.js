/**
 * Dependency‑injection configuration for the sessionMaterial module.
 * Mirrors the structure of `session.config.js`.
 */

const SessionMaterialBl = require("./sessionMaterial.bl");
const SessionMaterialModel = require("./sessionMaterial.model");
const SessionMaterialController = require("./sessionMaterial.ctrl");
const SessionMaterialRepo = require("./sessionMaterial.repo");
const {
  materialUploadSchema,
  materialUpdateSchema,
  materialListSchema,
  materialIdParamSchema,
} = require("./sessionMaterial.schema");

module.exports = [
  {
    key: "sessionMaterialModel",
    Class: SessionMaterialModel,
    type: "model",
    options: { singleton: true },
  },
  {
    key: "sessionMaterialRepo",
    Class: SessionMaterialRepo,
    type: "repository",
    dependencies: ["sessionMaterialModel"],
  },
  {
    // sessionRepo is defined elsewhere (session module). We depend on it for validation.
    key: "sessionMaterialBl",
    Class: SessionMaterialBl,
    type: "bl",
    dependencies: ["sessionMaterialRepo", "sessionRepo"],
  },
  {
    key: "sessionMaterialController",
    Class: SessionMaterialController,
    type: "controller",
    dependencies: ["sessionMaterialBl"],
  },
  // Schemas
  { key: "materialUploadSchema", schema: materialUploadSchema, type: "schema" },
  { key: "materialUpdateSchema", schema: materialUpdateSchema, type: "schema" },
  { key: "materialListSchema", schema: materialListSchema, type: "schema" },
  { key: "materialIdParamSchema", schema: materialIdParamSchema, type: "schema" },
];
