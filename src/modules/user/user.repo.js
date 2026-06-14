const { operationMessages } = require("../../base/enums");
const MongoBaseRepository = require("../../repositories/mongo.repo");
const redisRepository = require("./../../repositories/redis.repo");
const errorFactory = require('sillajError');

class UserRepo extends MongoBaseRepository {
  constructor(userModel) {
    super(userModel);
    this.userModel = userModel;
  }

  findByFilter = async (data) => {
    const { search = "", permissions = "", sortMethod = "desc", page = 1, limit = 10 } = data;

    const query = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
      ];
    }

    if (permissions) {
      query.permissions = {
        $in: Array.isArray(permissions) ? permissions : [permissions],
      };
    }

    const sort = sortMethod.toLowerCase() === "asc" ? 1 : -1; 
    const result = await this.paginate({
      filter: query,
      page,
      limit,
      sort: { createdAt: sort },
    });
    return result;
  };

  findByUserId = async (userId) => {
    const cacheKey = `users:${userId}`;
    const cacheUser = await redisRepository.get(cacheKey);
    if (cacheUser) {
      return JSON.parse(cacheUser);
    }
    const user = await this.findById(userId, { select: "-__v -password" });
    if (!user) return null;
    await redisRepository.set(cacheKey, JSON.stringify(user), 3600);
    return user;
  };

  deleteUserById = async (userId) => {
    await this.withTransaction(async (session) => {
      await this.deleteById(userId, { session });
    });
    await redisRepository.delete(`users:${userId}`);
  };

  createUser = async ({
    firstName,
    lastName,
    username,
    phone,
    email,
    password,
    permissions,
  }) => {
    const user = await this.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username,
      phone,
      email,
      permissions,
      password,
    });
    const result = user.toObject();
    delete result.__v;
    delete result.password;
    delete result.id;
    return result;
  };

  updateUserById = async (userId, data, options = {}) => {
    const result = await this.withTransaction(async (session) => {
      return await this.findOneAndUpdate({ _id: userId }, data, {
        session,
        select: "-__v -password -id",
        ...options,
      });
    });
    await redisRepository.delete(`users:${userId}`);
    return result;
  };

  findInstructorById = async (instructorId) => {
    const instructor = await this.findById(instructorId);
    if (!instructor) {
      throw errorFactory.NotFound(
        operationMessages["instructor.notfound.error"].fa,
      );
    }
    if (!instructor.permissions?.includes("instructor")) {
      throw errorFactory.BadRequest(
        operationMessages["user.not.instructor.error"].fa,
      );
    }
    return instructor;
  };
}

module.exports = UserRepo;
