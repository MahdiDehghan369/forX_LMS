const redis = require("redis");
const Logger = require("sillajLogger"); // فرض می‌کنیم این ماژول موجود است
const errorFactory = require("sillajError"); // فرض می‌کنیم این ماژول موجود است

class RedisRepository {
  constructor() {
    this.redisRepo = null;
    this.isConnecting = false;
    this.connectionPromise = null;
  }

  async connect(config = {}) {
    if (this.redisRepo) {
      Logger.warn("Redis already connected.");
      return this.redisRepo;
    }
    if (this.isConnecting) {
      Logger.warn(
        "Redis connection already in progress. Waiting for existing connection.",
      );
      return this.connectionPromise;
    }

    this.isConnecting = true;
    const redisConfig = {
      host: config.HOST || "127.0.0.1",
      port: config.PORT || 6379,
      username: config.USERNAME || null,
      password: config.PASSWORD || null,
      retry: config.RETRY || {
        attempts: 10,
        delay: 1000,
      },
    };

    const url = `redis://${redisConfig.host}:${redisConfig.port}`;

    const client = redis.createClient({
      url,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > redisConfig.retry.attempts) {
            Logger.error(`Redis: Max retry attempts reached!`);
            return errorFactory.DBConnection("Retry attempts exhausted");
          }
          const delay = redisConfig.retry.delay;
          Logger.warn(
            `Redis reconnecting attempt ${retries}, retry in ${delay}ms`,
            { retries, delay, redisConfig },
          );
          return delay;
        },
      },
    });

    client.on("connect", () => {
      Logger.info(`Redis connected → ${url}`);
    });

    client.on("ready", () => {
      Logger.info(`Redis ready for use`);
    });

    client.on("error", (err) => {
      Logger.error("Redis Error:", err);
    });

    client.on("end", () => {
      Logger.warn("Redis connection closed");
      this.redisRepo = null;
      this.isConnecting = false;
      this.connectionPromise = null;
    });

    this.connectionPromise = client
      .connect()
      .then(() => {
        this.redisRepo = client;
        this.isConnecting = false;
        return this.redisRepo;
      })
      .catch((err) => {
        Logger.error("Redis connection failed:", err);
        this.isConnecting = false;
        this.connectionPromise = null;
      });

    return this.connectionPromise;
  }

  async set(key, value, ttlSeconds = null) {
    if (!this.redisRepo) throw new Error("Redis not connected.");
    if (ttlSeconds) {
      return await this.redisRepo.set(key, JSON.stringify(value), {
        EX: ttlSeconds,
      });
    }
    return await this.redisRepo.set(key, JSON.stringify(value));
  }

  async get(key) {
    if (!this.redisRepo) throw new Error("Redis not connected.");
    const data = await this.redisRepo.get(key);
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }

  async delete(key) {
    if (!this.redisRepo) throw new Error("Redis not connected.");
    return await this.redisRepo.del(key);
  }

  async exists(key) {
    if (!this.redisRepo) throw new Error("Redis not connected.");
    return await this.redisRepo.exists(key);
  }

  async expire(key, seconds) {
    if (!this.redisRepo) throw new Error("Redis not connected.");
    return await this.redisRepo.expire(key, seconds);
  }

  async flushAll() {
    if (!this.redisRepo) throw new Error("Redis not connected.");
    return await this.redisRepo.flushAll();
  }

  async disconnect() {
    if (this.redisRepo) {
      Logger.info("Closing Redis connection...");
      await this.redisRepo.quit();
      this.redisRepo = null;
      this.isConnecting = false;
      this.connectionPromise = null;
    }
  }

  getRedisRepo() {
    if (!this.redisRepo) {
      throw new Error("Redis not connected yet. Call connect() first.");
    }
    return this.redisRepo;
  }
}

const redisRepository = new RedisRepository();
module.exports = redisRepository;