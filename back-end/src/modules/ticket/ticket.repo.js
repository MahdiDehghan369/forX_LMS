const MongoBaseRepository = require("../../repositories/mongo.repo");
const redisRepository = require("../../repositories/redis.repo");

class ticketRepository extends MongoBaseRepository {
  constructor(ticketModel) {
    super(ticketModel);
    this.ticketModel = ticketModel;
  }

  async updateTicketById(ticketId, data) {
    const result = await this.withTransaction(async (session) => {
      return await this.findOneAndUpdate({ _id: ticketId }, data, {
        session,
        select: "-__v",
      });
    });
    await redisRepository.delete(`ticket:${ticketId}`);
    return result;
  }

  getCache(id) {
    const key = this.#genrateKey(id);
    return redisRepository.get(key);
  }

  setCache(id, data) {
    const key = this.#genrateKey(id);
    return redisRepository.set(key, data, 3600);
  }

  deleteCache(id) {
    const key = this.#genrateKey(id);
    return redisRepository.delete(key);
  }

  #genrateKey(uri) {
    return `${this.#prefix}:${uri}`;
  }
}

module.exports = ticketRepository;
