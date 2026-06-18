class DepartmentController {
  constructor(departmentService, departmentRepo) {
    this.departmentService = departmentService;
    this.departmentRepo = departmentRepo;
  }
  async createDepartment(req, res, next) {
    const department=await this.departmentService.createDepartment(req.body);
    res.sendResponse(201,{ message: "create Department successfuly.",department });
  }

  async getAlldepartments(req, res, next) {
    const departments = await this.departmentService.getAllDepartments();
    res.sendResponse(200,{departments});
  }

  async getDepartment(req, res, next) {
    const { id } = req.params;
    const department = await this.departmentService.getDepartment(id);
    res.sendResponse(200,{department});
  }

  async updateDepartment(req,res,next){
    const department=await this.departmentService.updateDepartment(req);
    res.sendResponse(200,{message:"دپارتمنت آپدیت شد.",department})
  }
  
  async deleteDepartment(req,res,next){
    const {id}=req.params;
    await this.departmentService.deleteDepartment(id);
    res.sendResponse(200,{message:"دپارتمنت حذف شد."})
  }

}

module.exports = DepartmentController;
