const MongoBaseRepository = require("../../repositories/mongo.repo");
const redisRepository = require("../../repositories/redis.repo");

class SessionRepo extends MongoBaseRepository {
  constructor(sessionModel) {
    super(sessionModel);
    this.sessionModel = sessionModel;
  }

  #populateSession = () => {
    return [
      {
        path: "courseId",
        select: "courseCode title",
      },
      {
        path: "createdBy",
        select: "firstName lastName avatarUrl",
      },
    ];
  };

  #getSessionCacheKey = (sessionId) => `session:${sessionId}`;

  #getCourseSessionsCacheKey = (courseId) => `course:sessions:${courseId}`;

  calculateDurationMinutes(startAt, endAt) {
    if (!startAt || !endAt) return 1;
    return Math.floor(
      (new Date(endAt) - new Date(startAt)) / 60000,
    );
  }

  findBySessionId = async (sessionId, options = {}) => {
    const redisKey = this.#getSessionCacheKey(sessionId);

    let session = await redisRepository.get(redisKey);

    if (session) {
      return JSON.parse(session);
    }

    options = {
      ...options,
      populate: this.#populateSession(),
    };

    session = await this.findOne({ _id: sessionId }, options);

    if (!session) return null;

    await redisRepository.set(redisKey, JSON.stringify(session));

    return session;
  };

  findByCourseId = async (courseId, filter = {}) => {
    const { page = 1, limit = 10, status, sortMethod = "desc" } = filter;

    const query = { courseId };

    if (status) {
      query.status = status;
    }

    const sort = sortMethod === "asc" ? 1 : -1;
    const cacheKey = this.#getCourseSessionsCacheKey(courseId);

    let cached = await redisRepository.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const result = await this.paginate({
      filter: query,
      page,
      limit,
      sort: { startAt: sort },
      populate: this.#populateSession(),
    });

    await redisRepository.set(cacheKey, JSON.stringify(result), { expireAt: Date.now() + 300 });

    return result;
  };

  createSession = async (data) => {
    const session = await this.create(data);

    await redisRepository.delete(
      this.#getCourseSessionsCacheKey(data.courseId),
    );

    return session;
  };

  updateBySessionId = async (sessionId, data, options = {}) => {
    options = {
      ...options,
      populate: this.#populateSession(),
    };

    const result = await this.withTransaction(async (session) => {
      let updateData = { ...data };
      if (data.startAt || data.endAt) {
        const startAt = data.startAt || session?.startAt;
        const endAt = data.endAt || session?.endAt;
        updateData.durationMinutes = this.calculateDurationMinutes(startAt, endAt);
      }

      return await this.findOneAndUpdate({ _id: sessionId }, updateData, {
        session,
        select: "-__v",
        ...options,
      });
    });

    await redisRepository.delete(`session:${sessionId}`);

    if (result?.courseId) {
      await redisRepository.delete(
        this.#getCourseSessionsCacheKey(result.courseId),
      );
    }

    return result;
  };

  deleteSession = async (sessionId) => {
    const session = await this.findOne({ _id: sessionId });

    await this.deleteOne({ _id: sessionId });

    await redisRepository.delete(this.#getSessionCacheKey(sessionId));

    if (session?.courseId) {
      await redisRepository.delete(
        this.#getCourseSessionsCacheKey(session.courseId),
      );
    }
  };

  findOverlappingSession = async (courseId, startAt, endAt) => {
    return await this.findOne({
      courseId,
      $or: [
        {
          startAt: { $lt: endAt },
          endAt: { $gt: startAt },
        },
      ],
    });
  };

  findDuplicateSessionNumber = async (courseId, sessionNumber) => {
    return await this.findOne({
      courseId,
      sessionNumber,
    });
  };
}

module.exports = SessionRepo;