const errorFactory = require("sillajError");
const { operationMessages } = require("../../base/enums");
class DepartmentService {
  constructor(departmentRepo) {
    this.departmentRepo = departmentRepo;
  }

  async createDepartment(body) {
    const { title, href } = body;
    const existDepartment = await this.departmentRepo.findOne({
      $or: [{ href }, { title }],
    });
    if (existDepartment) {
      throw errorFactory.Conflict(
        operationMessages["department.duplicate.error"].fa,
      );
    }
    const department = await this.departmentRepo.create(body);
    return department;
  }

  async getAllDepartments() {
    const departments = await this.departmentRepo.find();
    return departments;
  }

  async getDepartment(departmentId) {
    const department =
      await this.departmentRepo.findByDepartmentId(departmentId);
    if (!department) {
      throw errorFactory.NotFound(operationMessages["department.not.found"].fa);
    }
    return department;
  }

  async updateDepartment(departmentId, body) {
    const { href, title } = body;

    const department =
      await this.departmentRepo.findByDepartmentId(departmentId);
    if (!department) {
      throw errorFactory.NotFound(operationMessages["department.notFound"].fa);
    }

    const conflict = await this.departmentRepo.findOne({
      $or: [{ href }, { title }],
    });

    if (conflict) {
      throw errorFactory.Conflict(
        operationMessages["department.create.conflict"].fa,
      );
    }

    const updatedDepartment = await this.departmentRepo.updateDepartmentById(
      departmentId,
      body,
    );
    return updatedDepartment;
  }

  async deleteDepartment(departmentId) {
    const department =
      await this.departmentRepo.findByDepartmentId(departmentId);
    if (!department) {
      throw errorFactory.NotFound(operationMessages["department.not.found"].fa);
    }
    await this.departmentRepo.deleteByDepartmentId(id);
  }
}

module.exports = DepartmentService;
