const BaseRepo = require("../../repositories/mongo.repo");
const redisRepo = require("../../repositories/redis.repo");
class ticketRepository extends BaseRepo {
  #prefix;
  constructor(ticketModel) {
    super(ticketModel);
    this.#prefix = "tickets";
  }

  async updateTicketById(id, data) {
    const result = await this.withTransaction(async (session) => {
      return await this.findOneAndUpdate({ _id: id }, data, {
        session,
        select: "-__v",
      });
    });

    return result;
  }

  getCache(id) {
    const key = this.#genrateKey(id);
    return redisRepo.get(key);
  }

  setCache(id, data) {
    const key = this.#genrateKey(id);
    return redisRepo.set(key, data, 3600);
  }

  deleteCache(id) {
    const key = this.#genrateKey(id);
    return redisRepo.delete(key);
  }

  #genrateKey(uri) {
    return `${this.#prefix}:${uri}`;
  }
}

module.exports = ticketRepository;
