// src/modules/ticket/ticket.repository.js
// Repository Layer - Extends MongoBaseRepository with Redis caching

const MongoBaseRepository = require("../../repositories/mongo.repo");
const redisRepository = require("../../repositories/redis.repo");
const mongoose = require("mongoose");

class TicketRepository extends MongoBaseRepository {
  constructor(ticketModel) {
    super(ticketModel);
    this.ticketModel = ticketModel;
  }

  async create(data, userId) {
    const ticketData = { ...data, userId };
    const result = await super.create(ticketData);
    await redisRepository.set(
      `ticket:${result._id.toString()}`,
      JSON.stringify(result),
      3600,
    );
    return result;
  }

  async updateTicketById(ticketId, data) {
    const result = await this.withTransaction(async (session) => {
      return await this.findOneAndUpdate({ _id: ticketId }, data, {
        session,
        select: "-__v",
        new: true,
      });
    });
    await redisRepository.delete(`ticket:${ticketId}`);
    return result;
  }

  async getCache(id) {
    const key = `ticket:${id}`;
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
    const key = `ticket:${id}`;
    await redisRepository.set(key, JSON.stringify(data), 3600);
    return true;
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

  findByFilter = async (data) => {
    const {
      department,
      tags,
      priority,
      status,
      search,
      page = 1,
      limit = 10,
      sortMethod = "desc",
    } = data;

    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { courseCode: { $regex: search, $options: "i" } },
      ];
    }

    if (tags && tags.length > 0) {
      if (Array.isArray(tags)) {
        query.tags = { $in: tags };
      } else {
        query.tags = tags;
      }
    }

    if (department) {
      query.department = department;
    }
    if (priority) {
      query.priority = priority;
    }
    if (status) {
      query.status = status;
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

  updateByTicketId = async (ticketId, data, options = {}) => {
    options = {
      ...options,
    };
    const result = await this.withTransaction(async (session) => {
      return await this.findOneAndUpdate({ ticketId }, data, {
        session,
        select: "-__v",
        ...options,
      });
    });
    await redisRepository.delete(`ticket:${ticketId}`);
    return result;
  };

  deleteByTicketId = async (ticketId) => {
    await this.deleteById(ticketId);
    await redisRepository.delete(`ticket:${ticketId}`);
  };
}

module.exports = TicketRepository;
