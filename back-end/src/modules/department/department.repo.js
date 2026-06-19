const BaseRepo = require("../../repositories/mongo.repo");
const redisRepo = require("../../repositories/redis.repo");
class DepartmentRepo extends BaseRepo {
  constructor(departmentModel) {
    super(departmentModel);
    this.model = departmentModel;
  }

  async updateDepartmentById(departmentId, data) {
    const result = await this.withTransaction(async (session) => {
      return await this.findOneAndUpdate({ _id: departmentId }, data, {
        session,
        select: "-__v",
        new: true,
      });
    });
    await this.deleteCache(departmentId);
    return result;
  }

  getCache(id) {
    const key = this.#genrateKey(id);
    return redisRepo.get(key);
  }

  async setCache(id, data) {
    const key = this.#genrateKey(id);
    await redisRepository.set(key, JSON.stringify(data), 3600);
    return true;
  }

  deleteCache(id) {
    const key = this.#genrateKey(id);
    return redisRepo.delete(key);
  }

  #genrateKey(id) {
    return `department:${id}`;
  }

  async findByDepartmentId(departmentId) {
    const cached = await this.getCache(departmentId);
    if (cached) return cached;
    const doc = await super.findById(departmentId);
    if (doc) {
      await this.setCache(departmentId, doc);
    }
    return doc;
  }

  async deleteByDepartmentId(departmentId) {
    await this.deleteById(departmentId);
    await this.deleteCache(departmentId);
  }
}

module.exports = DepartmentRepo;
