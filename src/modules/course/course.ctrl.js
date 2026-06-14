const { operationMessages } = require("../../base/enums");

class CourseController {
  constructor(courseBl) {
    this.courseBl = courseBl;
  }

  createCourse = async (req, res, next) => {
    const data = req.body;
    const adminId = req.user?._id;
    const result = await this.courseBl.createCourse(adminId, data);
    return res.sendResponse(201, {
      message: operationMessages["course.craeted.success"].fa,
      data: result,
    });
  };

  getCourse = async (req, res, next) => {
    const { courseCode } = req.params;
    const result = await this.courseBl.getCourse(courseCode);
    return res.sendResponse(200, {
      message: operationMessages["course.get.success"].fa,
      data: result,
    });
  };

  getCourses = async (req, res, next) => {
    const data = req.query;
    const result = await this.courseBl.getCourses(data);
    return res.sendResponse(200, {
      message: operationMessages["course.get.success"].fa,
      data: result,
    });
  };

  deleteCourse = async (req, res, next) => {
    const { courseCode } = req.params;
    await this.courseBl.deleteCourse(courseCode);
    return res.sendResponse(200, {
      message: operationMessages["course.delete.success"].fa,
    });
  };

  updateCourse = async (req, res, next) => {
    const { courseCode } = req.params;
    const data = req.body;
    const result = await this.courseBl.updateCourse(courseCode, data);
    return res.sendResponse(200, {
      message: operationMessages["course.update.success"].fa,
      data: result,
    });
  };

  changeStatus = async (req, res, next) => {
    const { status } = req.body;
    const { courseCode } = req.params;
    const result = await this.courseBl.changeStatus(courseCode, status);
    return res.sendResponse(200, {
      message: operationMessages["course.update.success"].fa,
      data: result,
    });
  };

  getSessions = async (req, res, next) => {
    const { courseCode } = req.params;
    const query = req.  query;

    const result = await this.courseBl.getSessions(courseCode, query);

    return res.sendResponse(200, {
      message: operationMessages["session.list.success"].fa,
      data: result,
    });
  };
}

module.exports = CourseController;
