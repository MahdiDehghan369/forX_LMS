const MongoBaseRepository = require("../../repositories/mongo.repo");
const redisRepository = require("../../repositories/redis.repo");

class TicketTagRepository extends MongoBaseRepository {
  constructor(ticketTagModel) {
    super(ticketTagModel);
    this.ticketTagModel = ticketTagModel;
  }

  async getCache(id) {
    const key = `ticketTag:${id}`;
    const cached = await redisRepository.get(key);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  async setCache(id, data) {
    const key = `ticketTag:${id}`;
    await redisRepository.set(key, JSON.stringify(data), 3600);
    return true;
  }

  async deleteCache(id) {
    const key = `ticketTag:${id}`;
    return await redisRepository.delete(key);
  }

  async findById(id) {
    const cached = await this.getCache(id);
    if (cached) return cached;

    const doc = await super.findById(id);
    if (doc) {
      await this.setCache(id, doc);
    }
    return doc;
  }

  async findByFilter(data = {}) {
    const {
      isActive = null,
      createdBy = null,
      page = 1,
      limit = 10,
      sortMethod = "desc",
    } = data;

    const query = {};

    if (createdBy) {
      query.createdBy = createdBy;
    }
    if (isActive) {
      query.isActive = isActive;
    }

    const sort = sortMethod.toLowerCase() === "asc" ? 1 : -1;
    const result = await this.paginate({
      filter: query,
      page,
      limit,
      sort: { createdAt: sort },
    });
    return result;
  }

  async create(data) {
    const doc = await super.create(data);
    if (doc) {
      await this.setCache(doc._id, doc);
    }
    return doc;
  }

  updateByTagId = async (tagId, data, options = {}) => {
    options = {
      ...options
    };
    const result = await this.withTransaction(async (session) => {
      return await this.findOneAndUpdate({ tagId }, data, {
        session,
        select: "-__v",
        ...options,
      });
    });
    await this.deleteCache(tagId);
    return result;
  };
}

module.exports = TicketTagRepository;