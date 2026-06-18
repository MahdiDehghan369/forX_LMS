const errorFactory = require("sillajError");
const { operationMessages } = require("../../base/enums");

class CourseBl {
  constructor(courseRepo, userRepo, sessionRepo) {
    this.courseRepo = courseRepo;
    this.userRepo = userRepo;
    this.sessionRepo = sessionRepo;
  }

  #checkCourseExists = async (courseCode) => {
    const course = await this.courseRepo.findByCourseCode(courseCode);
    if (!course) {
      throw errorFactory.NotFound(
        operationMessages["course.notFound.error"].fa,
      );
    }
    return course;
  };

  createCourse = async (adminId, data) => {
    const instructor = await this.userRepo.findInstructorById(
      data.instructorId,
    );
    const exists = await this.courseRepo.findByCourseCode(data.courseCode);
    if (exists) {
      throw errorFactory.Conflict(
        operationMessages["course.duplicate.error"].fa,
      );
    }
    const course = await this.courseRepo.create({
      ...data,
      createdByAdminId: adminId,
    });
    return course;
  };

  getCourse = async (courseCode) => {
    const course = await this.#checkCourseExists(courseCode);
    return course;
  };

  getCourses = async (data) => {
    const result = await this.courseRepo.findByFilter(data);
    return result;
  };

  deleteCourse = async (courseCode) => {
    await this.#checkCourseExists(courseCode);
    await this.courseRepo.deleteCourse(courseCode);
  };

  updateCourse = async (courseCode, data) => {
    const currentCourse = await this.#checkCourseExists(courseCode);
    if (
      data.courseCode &&
      data.courseCode.toString() !== courseCode.toString()
    ) {
      const conflictingCourse = await this.courseRepo.findOne({
        courseCode: data.courseCode,
        _id: { $ne: currentCourse._id },
      });

      if (conflictingCourse) {
        throw errorFactory.Conflict(
          operationMessages["course.duplicate.error"].fa,
        );
      }
    }

    await this.userRepo.findInstructorById(data.instructorId);
    const updatedCourse = await this.courseRepo.updateByCourseCode(
      courseCode,
      data,
    );
    return updatedCourse;
  };

  changeStatus = async (courseCode, status) => {
    const course = await this.#checkCourseExists(courseCode);
    if (course.status.toLowerCase() === status.toLowerCase()) return course;
    const result = await this.courseRepo.updateByCourseCode(
      courseCode,
      { status },
      {},
    );
    return result;
  };

  getSessions = async (courseCode, query) => {
    const course = await this.courseRepo.findByCourseCode(courseCode);

    if (!course) {
      throw errorFactory.NotFound(
        operationMessages["course.notFound.error"].fa,
      );
    }

    const result = await this.sessionRepo.findByCourseId(course._id, query);

    return result;
  };
}

module.exports = CourseBl;
