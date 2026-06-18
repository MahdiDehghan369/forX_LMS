const CourseBl = require('./course.bl');
const CourseModel = require('./course.model');
const CourseController = require('./course.ctrl');
const CourseRepo = require('./course.repo');
const { courseCreateSchema, courseCodeSchema, courseUpdateSchema, courseQuerySchema, courseStatusSchema, courseSessionsQuerySchema } = require('./course.schema');

module.exports = [
  {
    key: "courseModel",
    Class: CourseModel,
    type: "model",
    options: { singleton: true },
  },
  {
    key: "courseRepo",
    Class: CourseRepo,
    type: "repository",
    dependencies: ["courseModel"],
  },
  {
    key: "courseBl",
    Class: CourseBl,
    type: "bl",
    dependencies: ["courseRepo", "userRepo", "sessionRepo"],
  },
  {
    key: "courseController",
    Class: CourseController,
    type: "controller",
    dependencies: ["courseBl"],
  },
  {
    key: "courseCreateSchema",
    schema: courseCreateSchema,
    type: "schema",
  },
  {
    key: "courseCodeSchema",
    schema: courseCodeSchema,
    type: "schema",
  },
  {
    key: "courseUpdateSchema",
    schema: courseUpdateSchema,
    type: "schema",
  },
  {
    key: "courseQuerySchema",
    schema: courseQuerySchema,
    type: "schema",
  },
  {
    key: "courseStatusSchema",
    schema: courseStatusSchema,
    type: "schema",
  },
  {
    key: "courseSessionsQuerySchema",
    schema: courseSessionsQuerySchema,
    type: "schema",
  },
];