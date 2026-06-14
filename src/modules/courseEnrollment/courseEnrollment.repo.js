const MongoBaseRepository = require("../../repositories/mongo.repo");
const redisRepository = require("../../repositories/redis.repo");

class CourseEnrollmentRepo extends MongoBaseRepository {
  /**
   * @param {Model} sessionEnrollmentModel – the Mongoose model for enrollments
   */
  constructor(sessionEnrollmentModel) {
    super(sessionEnrollmentModel);
    this.sessionEnrollmentModel = sessionEnrollmentModel;
  }

  // --------------------------------------------------------------
  // Private helpers
  // --------------------------------------------------------------
  /**
   * Build a standard populate projection for a material‑like object.
   * Used by many read methods to include related entities.
   */
  #populateProjection() {
    return [
      {
        path: "courseId",
        select: "courseCode title",
      },
      {
        path: "userId",
        select: "firstName lastName avatarUrl",
      },
      {
        path: "createdBy",
        select: "firstName lastName avatarUrl role",
      },
    ];
  }

  /**
   * Build a deterministic Redis cache key for a cacheable operation.
   */
  #makeCacheKey(...parts) {
    return parts.join(":");
  }

  // --------------------------------------------------------------
  // Basic CRUD helpers (with caching)
  // --------------------------------------------------------------

  /**
   * Get a single enrollment document by its _id.
   * Caches the result under `material:<id>` for 5 minutes.
   * Also populates the three referenced fields.
   */
  async findById(id, opts = {}) {
    const cacheKey = `enrollment:${id}`;
    let cached = await redisRepository.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const populate = this.#populateProjection();
    const result = await this.findOne(
      { _id: id },
      {
        ...opts,
        populate,
      },
    );

    if (result) {
      await redisRepository.set(cacheKey, JSON.stringify(result), 300); // 5 min
    }

    return result;
  }

  /**
   * Delete a document and clean up its cache entries.
   */
  async deleteOne(filter) {
    const doc = await this.findOne(filter);
    if (!doc) return null;

    await this.deleteOne(filter);
    // Invalidate any cached entries that referenced this doc
    await redisRepository.del(`enrollment:${doc._id}`);

    // Invalidate pagination caches that included this doc
    // (simple approach: delete any cache that starts with "enrollments:user:" or "enrollments:course:")
    // A full cleanup can be added later if needed.
    return doc;
  }

  // --------------------------------------------------------------
  // Custom queries required by the BL layer
  // --------------------------------------------------------------
  async findByUser(userId, query = {}) {
    const cacheKey = this.#makeCacheKey(
      "enrollments:user",
      userId,
      query.page,
      query.limit,
      query.sortMethod,
    );
    let cached = await redisRepository.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const populate = this.#populateProjection();
    const filter = { userId };
    // Apply optional status filter (active, completed, dropped, pending) – default to all
    if (query.status) {
      filter.status = query.status;
    }

    const result = await this.paginate({
      filter,
      populate,
      ...query,
    });

    await redisRepository.set(cacheKey, JSON.stringify(result), 300);
    return result;
  }

  async findByCourse(courseId, query = {}) {
    const cacheKey = this.#makeCacheKey(
      "enrollments:course",
      courseId,
      query.page,
      query.limit,
      query.sortMethod,
    );
    let cached = await redisRepository.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const populate = this.#populateProjection();
    const filter = { courseId };
    if (query.status) {
      filter.status = query.status;
    }

    const result = await this.paginate({
      filter,
      populate,
      ...query,
    });

    await redisRepository.set(cacheKey, JSON.stringify(result), 300);
    return result;
  }

  /**
   * Get simple statistics for a course (counts by status).
   *  */
  async getCourseStatistics(courseId) {
    // Ensure the course actually exists – cheap check
    const courseExists = await this.sessionEnrollmentModel
      .exists({ courseId: courseId })
      .lean()
      .exec();

    if (!courseExists) {
      throw new Error("Course not found");
    }

    // Aggregate pipeline to get counts per status
    const stats = await this.aggregate()
      .match({ courseId })
      .group({
        _id: "$status",
        count: { $sum: 1 },
      })
      .project({
        _id: 0,
        status: "$_id",
        count: 1,
      })
      .exec();

    // Convert to a plain object for easier consumption
    const obj = {};
    stats.forEach((doc) => {
      obj[doc.status] = doc.count;
    });
    return obj;
  }
  /**
   * Check whether a particular user is enrolled in a course.
   * Returns true/false (no caching – cheap lookup).
   */
  async checkEnrollment(userId, courseId) {
    const exists = await this.exists({
      userId,
      courseId,
    });
    return !!exists;
  }

  /**
   * Soft‑delete an enrollment by setting its status to "dropped".
   */
  async softDelete(id) {
    const updated = await this.updateById(id, {
      status: "dropped",
      droppedAt: new Date(),
    });
    if (!updated) return null;

    // Invalidate any caches that referenced this enrollment
    await redisRepository.del(`enrollment:${id}`);

    // Invalidate pagination caches that might have included it
    // (simple approach: delete generic enrolments user/course caches)
    // … (could be expanded later)

    return updated;
  }
}

module.exports = CourseEnrollmentRepo;
