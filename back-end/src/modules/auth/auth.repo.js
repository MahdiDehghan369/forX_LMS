const MongoBaseRepository = require("../../repositories/mongo.repo");
const redisRepository = require("../../repositories/redis.repo");

class AuthRepo extends MongoBaseRepository {
  constructor(userModel) {
    super(userModel);
    this.userModel = userModel;
  }

  saveTokenInCache = async (key, value, expire) => {
    if (expire) {
      await redisRepository.set(key, value, expire);
    } else {
      await redisRepository.set(key, value);
    }
  };

  existsTokenInCache = async (key) => {
    return await redisRepository.exists(key);
  };

  deleteTokenFromCache = async (key) => {
    return await redisRepository.delete(key);
  }
}

module.exports = AuthRepo;
