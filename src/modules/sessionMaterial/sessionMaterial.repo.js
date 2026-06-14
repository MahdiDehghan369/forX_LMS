/**
 * Repository layer for session materials – mirrors session.repo.js.
 * Handles DB access via MongoBaseRepository and caching via Redis.
 */

const MongoBaseRepository = require("../../repositories/mongo.repo");
const redisRepository = require("../../repositories/redis.repo");

class SessionMaterialRepo extends MongoBaseRepository {
  constructor(sessionMaterialModel) {
    super(sessionMaterialModel);
    this.sessionMaterialModel = sessionMaterialModel;
  }

  // -----------------------------------------------------------------
  // Private helpers: populate & cache keys
  // -----------------------------------------------------------------
  #populateMaterial = () => [
    { path: "sessionId", select: "courseId title" },
    { path: "uploadedBy", select: "firstName lastName avatarUrl" },
  ];

  #getMaterialCacheKey = (materialId) => `material:${materialId}`;
  #getSessionMaterialsCacheKey = (sessionId, page, limit, sort) =>
    `session:${sessionId}:materials:${page}:${limit}:${sort}`;

  // -----------------------------------------------------------------
  // Find a material by its id – Redis cache first
  // -----------------------------------------------------------------
  findById = async (materialId, options = {}) => {
    const redisKey = this.#getMaterialCacheKey(materialId);
    let material = await redisRepository.get(redisKey);
    if (material) {
      return JSON.parse(material);
    }
    options = { ...options, populate: this.#populateMaterial() };
    material = await this.findOne({ _id: materialId }, options);
    if (material) {
      await redisRepository.set(redisKey, JSON.stringify(material));
    }
    return material;
  };

  // -----------------------------------------------------------------
  // Paginated list of materials for a given session.
  // includeExpired flag determines whether expired materials are shown.
  // -----------------------------------------------------------------
  findBySession = async (sessionId, filter = {}) => {
    let {
      page = 1,
      limit = 10,
      sortMethod = "desc",
      includeExpired = false,
    } = filter;

    page = +page;
    limit = +limit;

    const sort = sortMethod === "asc" ? 1 : -1;
    const query = { sessionId };
    if (!includeExpired) {
      query.$or = [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } },
      ];
    }

    const cacheKey = this.#getSessionMaterialsCacheKey(
      sessionId,
      page,
      limit,
      sortMethod,
    );
    const cached = await redisRepository.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const result = await this.paginate({
      filter: query,
      page,
      limit,
      sort: { createdAt: sort },
      populate: this.#populateMaterial(),
    });

    await redisRepository.set(cacheKey, JSON.stringify(result), 300);
    return result;
  };

  // -----------------------------------------------------------------
  // Create a new material – invalidate session‑materials cache.
  // -----------------------------------------------------------------
  createMaterial = async (data) => {
    const material = await this.create(data);
    // Invalidate the first page cache (simple approach – full invalidation could be added)
    await redisRepository.delete(
      this.#getSessionMaterialsCacheKey(data.sessionId, 1, 10, "desc"),
    );
    return material;
  };

  // -----------------------------------------------------------------
  // Update an existing material – invalidate material cache and session list.
  // -----------------------------------------------------------------
  updateById = async (materialId, data, options = {}) => {
    options = { ...options, populate: this.#populateMaterial() };
    const result = await this.findOneAndUpdate(
      { _id: materialId },
      data,
      { new: true, select: "-__v", ...options },
    );
    await redisRepository.delete(this.#getMaterialCacheKey(materialId));
    if (result?.sessionId) {
      await redisRepository.delete(
        this.#getSessionMaterialsCacheKey(result.sessionId, 1, 10, "desc"),
      );
    }
    return result;
  };

  // -----------------------------------------------------------------
  // Delete a material – remove DB record and related caches.
  // -----------------------------------------------------------------
  deleteById = async (materialId) => {
    const material = await this.findOne({ _id: materialId });
    await this.deleteOne({ _id: materialId });
    await redisRepository.delete(this.#getMaterialCacheKey(materialId));
    if (material?.sessionId) {
      await redisRepository.delete(
        this.#getSessionMaterialsCacheKey(material.sessionId, 1, 10, "desc"),
      );
    }
    return material;
  };

  // -----------------------------------------------------------------
  // Increment view counter (atomic $inc) and update lastViewedAt.
  // -----------------------------------------------------------------
  incrementView = async (materialId) => {
    const update = { $inc: { viewCount: 1 }, $set: { lastViewedAt: new Date() } };
    const material = await this.findOneAndUpdate(
      { _id: materialId },
      update,
      { new: true },
    );
    await redisRepository.delete(this.#getMaterialCacheKey(materialId));
    return material;
  };

  // -----------------------------------------------------------------
  // Increment download counter (atomic $inc) and update lastDownloadedAt.
  // -----------------------------------------------------------------
  incrementDownload = async (materialId) => {
    const update = { $inc: { downloadCount: 1 }, $set: { lastDownloadedAt: new Date() } };
    const material = await this.findOneAndUpdate(
      { _id: materialId },
      update,
      { new: true },
    );
    await redisRepository.delete(this.#getMaterialCacheKey(materialId));
    return material;
  };
}

module.exports = SessionMaterialRepo;
