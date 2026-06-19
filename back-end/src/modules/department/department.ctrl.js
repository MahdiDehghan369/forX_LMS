const { operationMessages } = require("../../base/enums");

class DepartmentController {
  constructor(departmentBl, departmentRepo) {
    this.departmentBl = departmentBl;
    this.departmentRepo = departmentRepo;
  }

  async createDepartment(req, res, next) {
    const data = req.body;
    const department = await this.departmentBl.createDepartment(data);
    return res.sendResponse(201, {
      message: operationMessages["department.create.success"],
      data: department,
    });
  }

  async getAlldepartments(req, res, next) {
    const departments = await this.departmentBl.getAllDepartments();
    return res.sendResponse(200, {
      message: operationMessages["department.get.all.success"],
      data: departments,
    });
  }

  async getDepartment(req, res, next) {
    const departmentId = req.params.id;
    const department = await this.departmentBl.getDepartment(departmentId);
    return res.sendResponse(200, {
      message: operationMessages["department.get.success"],
      data: department,
    });
  }

  async updateDepartment(req, res, next) {
    const departmentId = req.params.id;
    const body = req.body;
    const department = await this.departmentBl.updateDepartment(
      departmentId,
      body,
    );
    return res.sendResponse(200, {
      message: operationMessages["department.update.success"],
      data: department,
    });
  }

  async deleteDepartment(req, res, next) {
    const departmentId = req.params.id;
    await this.departmentBl.deleteDepartment(departmentId);
    return res.sendResponse(200, {
      message: operationMessages["department.delete.success"],
    });
  }
}

module.exports = DepartmentController;
