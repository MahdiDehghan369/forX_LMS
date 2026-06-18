const errorFactory = require("sillajError")
const { operationMessages } = require("../../base/enums")
class DepartmentService {
  constructor(departmentRepo) {
    this.departmentRepo = departmentRepo;
  }

  async createDepartment(body) {
    const { title, href } = body;
    const existDepartment = await this.departmentRepo.findOne({ $or: [{ href }, { title }] });
    if (existDepartment) {
      throw errorFactory.Conflict(operationMessages["department.create.conflict"].fa);
    }
    const department = await this.departmentRepo.create({ title, href });

    return department;
  }

  async getAllDepartments() {
    const departments = await this.departmentRepo.find();
    return departments;
  }

  async getDepartment(id) {
    const existCache = await this.departmentRepo.getCache(id);
    if (existCache) {
      return existCache;
    }

    const department = await this.departmentRepo.findById(id);
    if (!department) {
      throw errorFactory.NotFound(operationMessages["department.notFound"].fa)
    }

    await this.departmentRepo.setCache(id, department);
    return department;
  }

  async updateDepartment(req) {
    const { id } = req.params;
    const { href, title } = req.body;
    const department = await this.departmentRepo.findById(id);
    if (!department) {
      throw errorFactory.NotFound(operationMessages["department.notFound"].fa);
    }
    const conflict = await this.departmentRepo.findOne({ $or: [{ href }, { title }] });

    if (conflict) {
      throw errorFactory.Conflict(operationMessages["department.create.conflict"].fa)
    }

    const updatedDepartment = await this.departmentRepo.updateDepartmentById(id, { title, href });
    await this.departmentRepo.deleteCache(id)
    return updatedDepartment;
  }

  async deleteDepartment(id) {
    const department = await this.departmentRepo.exists({ _id: id });
    if (!department) {
      throw errorFactory.NotFound(operationMessages["department.notFound"].fa)
    }
    await this.departmentRepo.deleteById(id);
    await this.departmentRepo.deleteCache(id);
  }

}

module.exports = DepartmentService;
