const CourseEnrollmentBl = require("./courseEnrollment.bl");
  const CourseEnrollmentModel = require("./courseEnrollment.model");
  const CourseEnrollmentController = require("./courseEnrollment.ctrl");
  const CourseEnrollmentRepo = require("./courseEnrollment.repo");
  const {
    enrollmentEnrollSchema,
    enrollmentUpdateStatusSchema,
    enrollmentListSchema,
    enrollmentIdParamSchema,
    enrollmentCheckSchema,
    enrollmentStatsSchema,
  } = require("./courseEnrollment.schema");

  module.exports = [
    {
      key: "courseEnrollmentModel",
      Class: CourseEnrollmentModel,
      type: "model",
      options: { singleton: true },
    },
    {
      key: "courseEnrollmentRepo",
      Class: CourseEnrollmentRepo,
      type: "repository",
      dependencies: ["courseEnrollmentModel"],
    },
    {
      key: "courseEnrollmentBl",
      Class: CourseEnrollmentBl,
      type: "bl",
      dependencies: ["courseEnrollmentRepo", "courseRepo", "userRepo"],
    },
    {
      key: "courseEnrollmentController",
      Class: CourseEnrollmentController,
      type: "controller",
      dependencies: ["courseEnrollmentBl"],
    },
      // Schemas
    { key: "enrollmentEnrollSchema", schema: enrollmentEnrollSchema, type: "schema" },
    {
      key: "enrollmentUpdateStatusSchema",
      schema: enrollmentUpdateStatusSchema,
      type: "schema",
    },
    { key: "enrollmentListSchema", schema: enrollmentListSchema, type: "schema" },
    { key: "enrollmentIdParamSchema", schema: enrollmentIdParamSchema, type: "schema" },
    { key: "enrollmentCheckSchema", schema: enrollmentCheckSchema, type: "schema" },
    { key: "enrollmentStatsSchema", schema: enrollmentStatsSchema, type: "schema" },
  ];