const redisRepository = require("../repositories/redis.repo");
const Logger = require("sillajLogger");

const connectRedis = async () => {
  try {
    await redisRepository.connect({
      HOST: process.env.REDIS_HOST || "127.0.0.1",
      PORT: process.env.REDIS_PORT || 6379,
    });
    Logger.info("Redis connected successfully");
  } catch (error) {
    Logger.error("Redis connection failed:", error.message);
    throw error;
  }
};

module.exports = connectRedis;
