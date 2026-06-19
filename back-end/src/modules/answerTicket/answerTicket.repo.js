const MongoBaseRepository = require("../../repositories/mongo.repo");
const redisRepo = require("../../repositories/redis.repo");

class AnswerTicketRepository extends MongoBaseRepository {
  #prefix = "answerTicket";

  constructor(answerTicketModel) {
    super(answerTicketModel);
    this.model = answerTicketModel;
  }

  async findById(id) {
    const cached = await this.getCache(id);
    if (cached) return cached;
    const doc = await super.findById(id);
    if (doc) await this.setCache(id, doc);
    return doc;
  }

  async create(data) {
    const doc = await super.create(data);
    if (doc) await this.setCache(doc._id.toString(), doc);
    return doc;
  }

  // Update and clear cache
  async updateById(id, data) {
    const doc = await super.updateById(id, data);
    await this.deleteCache(id);
    return doc;
  }

  // Cache operations
  async getCache(id) {
    const key = `${this.#prefix}:${id}`;
    const cached = await redisRepo.get(key);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (_) {
        return null;
      }
    }
    return null;
  }

  async setCache(id, data) {
    const key = `${this.#prefix}:${id}`;
    await redisRepo.set(key, JSON.stringify(data), 3600);
  }

  async deleteCache(id) {
    const key = `${this.#prefix}:${id}`;
    await redisRepo.delete(key);
  }

  updateByAnswerTicketId = async (answerTicketId, data, options = {}) => {
    options = {
      ...options,
    };
    const result = await this.withTransaction(async (session) => {
      return await this.findOneAndUpdate({ answerTicketId }, data, {
        session,
        select: "-__v",
        ...options,
      });
    });
    await this.deleteCache(answerTicketId);
    return result;
  };

  deleteByAnswerTicketId = async (answerTicketId) => {
    await this.deleteById(answerTicketId);
    await this.deleteCache(answerTicketId);
  };
}

module.exports = AnswerTicketRepository;
