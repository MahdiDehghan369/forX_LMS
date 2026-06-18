const errorFactory = require("sillajError");
const { operationMessages } = require("../../base/enums");

class CourseBl {
  constructor(courseRepo, userRepo, sessionRepo) {
    this.courseRepo = courseRepo;
    this.userRepo = userRepo;
    this.sessionRepo = sessionRepo;
  }

  #checkCourseExists = async (courseId) => {
    const course = await this.courseRepo.findCourseById(courseId);
    if (!course) {
      throw errorFactory.NotFound(
        operationMessages["course.notFound.error"].fa,
      );
    }
    return course;
  };

  createCourse = async (adminId, data) => {
    const instructorExists = await this.userRepo.findInstructorById(
      data.instructorId,
    );
    if (!instructorExists) {
      throw errorFactory.Conflict(
        operationMessages["instructor.notfound.error"].fa,
      );
    }
    const courseExists = await this.courseRepo.findByCourseCode(
      data.courseCode,
    );
    if (courseExists) {
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

  getCourse = async (courseId) => {
    const course = await this.#checkCourseExists(courseId);
    return course;
  };

  getCourses = async (data) => {
    const result = await this.courseRepo.findByFilter(data);
    return result;
  };

  deleteCourse = async (courseId) => {
    await this.#checkCourseExists(courseId);
    await this.courseRepo.deleteCourse(courseId);
  };

  updateCourse = async (courseId, data) => {
    await this.#checkCourseExists(courseId);
    const instructorExists = await this.userRepo.findInstructorById(
      data.instructorId,
    );
    if (!instructorExists) {
      throw errorFactory.Conflict(
        operationMessages["instructor.notfound.error"].fa,
      );
    }
    const updatedCourse = await this.courseRepo.updateByCourseId(
      courseId,
      data,
    );
    return updatedCourse;
  };

  changeStatus = async (courseId, status) => {
    const course = await this.#checkCourseExists(courseId);
    if (course.status.toLowerCase() === status.toLowerCase()) return course;
    const result = await this.courseRepo.updateByCourseId(
      courseId,
      { status },
      {},
    );
    return result;
  };

  getSessions = async (courseId, query) => {
    const course = await this.courseRepo.findCourseById(courseId);

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
