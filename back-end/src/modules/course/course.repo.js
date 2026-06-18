const MongoBaseRepository = require("../../repositories/mongo.repo");
const redisRepository = require("../../repositories/redis.repo");

class CourseRepo extends MongoBaseRepository {
  constructor(courseModel) {
    super(courseModel);
    this.courseModel = courseModel;
  }

  #populateCourse = () => {
    return [
      {
        path: "instructorId",
        select: "firstName lastName avatarUrl",
      },
      {
        path: "createdByAdminId",
        select: "firstName lastName avatarUrl",
      },
    ];
  };

  findByFilter = async (data) => {
    const {
      search = "",
      instructorId = null,
      status = null,
      createdByAdminId = null,
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

    if (instructorId) {
      query.instructorId = instructorId;
    }
    if (createdByAdminId) {
      query.createdByAdminId = createdByAdminId;
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
      populate: this.#populateCourse(),
    });
    return result;
  };

  findByCourseCode = async (courseCode, options = {}) => {
    const redisKey = `course:${courseCode}`;
    let course = await redisRepository.get(redisKey);
    if (course) {
      return JSON.parse(course);
    }
    options = {
      ...options,
      populate: this.#populateCourse(),
    };
    course = await this.findOne({ courseCode }, options);
    if (!course) return null;
    await redisRepository.set(redisKey, JSON.stringify(course));
    return course;
  };

  deleteCourse = async (courseCode) => {
    await this.withTransaction(async (session) => {
      await this.deleteOne({ courseCode }, { session });
    });
    await redisRepository.delete(`course:${courseCode}`);
  };

  updateByCourseCode = async (courseCode, data, options = {}) => {
    options = {
      ...options,
      populate: this.#populateCourse(),
    };
    const result = await this.withTransaction(async (session) => {
      return await this.findOneAndUpdate({ courseCode }, data, {
        session,
        select: "-__v",
        ...options,
      });
    });
    await redisRepository.delete(`course:${courseCode}`);
    return result;
  };
}

module.exports = CourseRepo;
