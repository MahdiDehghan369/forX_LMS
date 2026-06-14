const errorFactory = require("sillajError");
const { operationMessages } = require("../../base/enums");

class CourseEnrollmentBl {
  /**
   * @param {Object} enrollmentRepo – extends MongoBaseRepository
   * @param {Object} courseRepo     – CourseRepo (DI)
   * @param {Object} userRepo       – UserRepo (DI)
   */
  constructor(enrollmentRepo, courseRepo, userRepo) {
    this.enrollmentRepo = enrollmentRepo;
    this.courseRepo = courseRepo;
    this.userRepo = userRepo;
  }

  // --------------------------------------------------------------
  // Helper: verify caller can enroll the target user
  // --------------------------------------------------------------
  #ensureCanEnroll(requester, targetUserId) {
    // Students may only enroll themselves
    if ((requester.role || "").toLowerCase() === "student") {
      if (requester._id.toString() !== targetUserId.toString()) {
        throw errorFactory.Forbidden(
          operationMessages["enrollment.status.invalid.transition"].fa,
        );
      }
    }
    // Teachers / admins have no restriction
  }

  // --------------------------------------------------------------
  // Enroll a user in a course (auto‑assign self if userId omitted)
  // --------------------------------------------------------------
  async enroll(courseId, requester, userId) {
    const targetUserId = userId || requester._id;

    this.#ensureCanEnroll(requester, targetUserId);

    const course = await this.courseRepo.findById(courseId);
    if (!course) {
      throw errorFactory.NotFound(
        operationMessages["course.notFound.error"].fa,
      );
    }

    const user = await this.userRepo.findById(targetUserId);
    if (!user) {
      throw errorFactory.NotFound(operationMessages["user.notFound.error"].fa);
    }

    const already = await this.enrollmentRepo.findOne({
      courseId,
      userId: targetUserId,
    });
    if (already) {
      throw errorFactory.Conflict(
        operationMessages["enrollment.duplicate.error"].fa,
      );
    }

    const enrollment = await this.enrollmentRepo.create({
      courseId,
      userId: targetUserId,
      createdBy: requester._id,
      status: "pending",
    });

    return enrollment;
  }

  // --------------------------------------------------------------
  // Retrieve enrollment by its _id
  // --------------------------------------------------------------
  async getEnrollmentById(id) {
    const enrollment = await this.enrollmentRepo.findById(id);
    if (!enrollment) {
      throw errorFactory.NotFound(
        operationMessages["enrollment.notFound.error"].fa,
      );
    }
    return enrollment;
  }

  // --------------------------------------------------------------
  // Paginated list of enrollments for a given user
  // --------------------------------------------------------------
  async getUserEnrollments(userId, query = {}) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw errorFactory.NotFound(operationMessages["user.notFound.error"].fa);
    }

    const result = await this.enrollmentRepo.findByUser(userId, query);
    return result;
  }

  // --------------------------------------------------------------
  // Paginated list of enrollments for a given course
  // --------------------------------------------------------------
  async getCourseEnrollments(courseId, query = {}) {
    const course = await this.courseRepo.findById(courseId);
    if (!course) {
      throw errorFactory.NotFound(
        operationMessages["course.notFound.error"].fa,
      );
    }

    const result = await this.enrollmentRepo.findByCourse(courseId, query);
    return result;
  }

  // --------------------------------------------------------------
  // Update only the status field (atomic) and set timestamps
  // --------------------------------------------------------------
  async updateEnrollmentStatus(id, newStatus) {
    const enrollment = await this.enrollmentRepo.findById(id);
    if (!enrollment) {
      throw errorFactory.NotFound(
        operationMessages["enrollment.notFound.error"].fa,
      );
    }

    const validTransitions = {
      pending: ["active", "dropped"],
      active: ["completed", "dropped"],
      completed: [],
      dropped: [],
    };
    if (!validTransitions[enrollment.status]?.includes(newStatus)) {
      throw errorFactory.BadRequest(
        operationMessages["enrollment.status.invalid.transition"].fa,
      );
    }

    const update = { status: newStatus };
    if (newStatus === "completed") update.completedAt = new Date();
    if (newStatus === "dropped") update.droppedAt = new Date();

    const updated = await this.enrollmentRepo.updateById(id, update);
    return updated;
  }

  // --------------------------------------------------------------
  // Soft‑delete: mark status as "dropped"
  // --------------------------------------------------------------
  async dropEnrollment(id) {
    const enrollment = await this.enrollmentRepo.findById(id);
    if (!enrollment) {
      throw errorFactory.NotFound(
        operationMessages["enrollment.notFound.error"].fa,
      );
    }
    if (enrollment.status === "dropped") return enrollment; // already dropped

    const update = { status: "dropped", droppedAt: new Date() };
    await this.enrollmentRepo.updateById(id, update);
    return await this.enrollmentRepo.findById(id);
  }

  // --------------------------------------------------------------
  // Check if a user is currently enrolled (active or pending) in a course
  // --------------------------------------------------------------
  async checkEnrollment(courseId, userId) {
    const enrollment = await this.enrollmentRepo.findOne({
      courseId,
      userId,
      status: { $in: ["active", "pending"] },
    });
    return !!enrollment;
  }

  // --------------------------------------------------------------
  // Return simple statistics for a course
  // --------------------------------------------------------------
  async getCourseStatistics(courseId) {
    const course = await this.courseRepo.findById(courseId);
    if (!course) {
      throw errorFactory.NotFound(
        operationMessages["course.notFound.error"].fa,
      );
    }

    const stats = await this.enrollmentRepo.getStatistics(courseId);
    return stats;
  }
}

module.exports = CourseEnrollmentBl;
