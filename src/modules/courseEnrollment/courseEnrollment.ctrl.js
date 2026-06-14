const { operationMessages } = require("../../base/enums");

class CourseEnrollmentController {
  constructor(enrollmentBl) {
    this.enrollmentBl = enrollmentBl;
  }

  // POST /api/v1/courseEnrollment/enroll
  enroll = async (req, res, next) => {
    const { courseId, userId } = req.body; // userId optional (self‑enroll)
    const requester = req.user;
    const result = await this.enrollmentBl.enroll(courseId, requester, userId);
    return res.sendResponse(201, {
      message: operationMessages["enrollment.enroll.success"].fa,
      data: result,
    });
  };

  // GET /api/v1/courseEnrollment/user/:userId
  getUserEnrollments = async (req, res, next) => {
    const { userId } = req.params;
    const query = req.query; // pagination / sorting
    const result = await this.enrollmentBl.getByUser(userId, query);
    return res.sendResponse(200, {
      message:
        operationMessages["enrollment.get.success"]?.fa ||
        "Enrollments fetched successfully.",
      data: result,
    });
  };

  // GET /api/v1/courseEnrollment/course/:courseId
  getCourseEnrollments = async (req, res, next) => {
    const { courseId } = req.params;
    const query = req.query;
    const result = await this.enrollmentBl.getByCourse(courseId, query);
    return res.sendResponse(200, {
      message:
        operationMessages["enrollment.get.success"]?.fa ||
        "Enrollments fetched successfully.",
      data: result,
    });
  };

  // GET /api/v1/courseEnrollment/:id
  getEnrollmentById = async (req, res, next) => {
    const { id } = req.params;
    const result = await this.enrollmentBl.getById(id);
    return res.sendResponse(200, {
      message:
        operationMessages["enrollment.get.success"]?.fa ||
        "Enrollment fetched successfully.",
      data: result,
    });
  };

  // PUT /api/v1/courseEnrollment/:id   (status only)
  updateEnrollmentStatus = async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;
    const result = await this.enrollmentBl.updateStatus(id, status);
    return res.sendResponse(200, {
      message: operationMessages["enrollment.status.update.success"].fa,
      data: result,
    });
  };

  // DELETE /api/v1/courseEnrollment/:id   (soft‑delete → status = dropped)
  dropEnrollment = async (req, res, next) => {
    const { id } = req.params;
    await this.enrollmentBl.dropEnrollment(id);
    return res.sendResponse(200, {
      message: operationMessages["enrollment.status.update.success"].fa,
    });
  };

  // GET /api/v1/courseEnrollment/check?courseId=&userId=
  checkEnrollment = async (req, res, next) => {
    const { courseId, userId } = req.query;
    const exists = await this.enrollmentBl.checkEnrollment(courseId, userId);
    const msgKey = exists
      ? "enrollment.check.success"
      : "enrollment.check.notEnrolled";
    return res.sendResponse(200, { message: operationMessages[msgKey].fa });
  };

  // GET /api/v1/courseEnrollment/course/:courseId/statistics
  getCourseStatistics = async (req, res, next) => {
    const { courseId } = req.params;
    const stats = await this.enrollmentBl.getStatistics(courseId);
    return res.sendResponse(200, {
      message: operationMessages["enrollment.statistics.success"].fa,
      data: stats,
    });
  };
}

module.exports = CourseEnrollmentController;
