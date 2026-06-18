const mongoose = require("mongoose");

class MongoBaseRepository {
  constructor(model) {
    if (!model) {
      throw new Error("Model is required in BaseRepository");
    }
    this.model = model;
  }

  async create(data, options = {}) {
    const [document] = await this.model.create([data], options);
    return document;
  }

  async createMany(data = [], options = {}) {
    return this.model.insertMany(data, options);
  }

  async find(filter = {}, options = {}) {
    return this.#buildQuery(this.model.find(filter), options);
  }

  async findOne(filter = {}, options = {}) {
    return this.#buildQuery(this.model.findOne(filter), options);
  }

  async findById(id, options = {}) {
    return this.#buildQuery(this.model.findById(id), options);
  }

  async exists(filter = {}) {
    return this.model.exists(filter);
  }

  async count(filter = {}) {
    return this.model.countDocuments(filter);
  }

  async updateOne(filter, update, options = {}) {
    return this.model.updateOne(filter, update, options);
  }

  async updateMany(filter, update, options = {}) {
    return this.model.updateMany(filter, update, options);
  }

  async findOneAndUpdate(filter, update, options = {}) {
    return this.#buildQuery(
      this.model.findOneAndUpdate(filter, update, {
        new: true,
        ...options,
      }),
      options,
    );
  }

  async updateById(id, update, options = {}) {
    return this.#buildQuery(
      this.model.findByIdAndUpdate(id, update, {
        new: true,
        ...options,
      }),
      options,
    );
  }

  async deleteOne(filter, options = {}) {
    return this.model.deleteOne(filter, options);
  }

  async deleteMany(filter, options = {}) {
    return this.model.deleteMany(filter, options);
  }

  async deleteById(id, options = {}) {
    return this.model.findByIdAndDelete(id, options);
  }

  async softDelete(id) {
    return this.updateById(id, {
      deletedAt: new Date(),
      isDeleted: true,
    });
  }

  async restore(id) {
    return this.updateById(id, {
      deletedAt: null,
      isDeleted: false,
    });
  }

  async paginate({
    filter = {},
    page = 1,
    limit = 10,
    sort = { createdAt: -1 },
    select = null,
    populate = null,
    lean = true,
  }) {
    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    let query = this.model.find(filter).skip(skip).limit(limit).sort(sort);

    if (select) {
      query = query.select(select);
    }

    if (populate) {
      query = query.populate(populate);
    }
    if (lean) {
      query = query.lean();
    }

    const [items, total] = await Promise.all([query, this.count(filter)]);

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  }

  async aggregate(pipeline = [], options = {}) {
    return this.model.aggregate(pipeline, options);
  }

  async withTransaction(callback) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const result = await callback(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async bulkWrite(operations = [], options = {}) {
    return this.model.bulkWrite(operations, options);
  }

  async distinct(field, filter = {}) {
    return this.model.distinct(field, filter);
  }

  async raw() {
    return this.model;
  }

  #buildQuery(query, options = {}) {
    const { populate, select, sort, lean = false, session } = options;

    if (populate) {
      query.populate(populate);
    }

    if (select) {
      query.select(select);
    }

    if (sort) {
      query.sort(sort);
    }

    if (lean) {
      query.lean();
    }

    if (session) {
      query.session(session);
    }

    return query;
  }
}

module.exports = MongoBaseRepository;