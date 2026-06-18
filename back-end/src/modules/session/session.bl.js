const errorFactory = require('sillajError');
const { operationMessages } = require("../../base/enums");

class SessionBl {
  constructor(sessionRepo, courseRepo) {
    this.sessionRepo = sessionRepo;
    this.courseRepo = courseRepo;
  }

  /** Helper to compute duration */
  #calcDuration(start, end) {
    return Math.floor((new Date(end) - new Date(start)) / 60000);
  }

  /** Create a new session */
  createSession = async (courseCode, adminId, data) => {
    const course = await this.courseRepo.findByCourseCode(courseCode);
    if (!course) {
      throw errorFactory.NotFound(
        operationMessages["course.notFound.error"].fa,
      );
    }

    // Prevent duplicate session numbers
    const exists = await this.sessionRepo.findOne({
      courseId: course._id,
      sessionNumber: data.sessionNumber,
    });
    if (exists) {
      throw errorFactory.Conflict(
        operationMessages["session.duplicate.error"].fa,
      );
    }

    // Ensure no time overlap with existing sessions
    const overlapping = await this.sessionRepo.findOverlappingSession(
      course._id,
      data.startAt,
      data.endAt,
    );
    if (overlapping) {
      throw errorFactory.Conflict(
        operationMessages["session.time.conflict.error"].fa,
      );
    }

    const durationMinutes = this.#calcDuration(data.startAt, data.endAt);

    const session = await this.sessionRepo.create({
      courseId: course._id,
      sessionNumber: data.sessionNumber,
      title: data.title,
      description: data.description,
      startAt: data.startAt,
      endAt: data.endAt,
      durationMinutes,
      location: data.location,
      meetingLink: data.meetingLink,
      status: data.status || "scheduled",
      createdBy: adminId,
    });
    return session;
  };

  /** Retrieve a session */
  getSession = async (sessionId) => {
    const session = await this.sessionRepo.findBySessionId(sessionId);
    if (!session) {
      throw errorFactory.NotFound(
        operationMessages["session.notFound.error"].fa,
      );
    }
    return session;
  };

  /** Update a session */
  updateSession = async (sessionId, data) => {
    const session = await this.sessionRepo.findBySessionId(sessionId);
    if (!session) {
      throw errorFactory.NotFound(
        operationMessages["session.notFound.error"].fa,
      );
    }

    const startAt = data.startAt || session.startAt;
    const endAt = data.endAt || session.endAt;

    if (new Date(endAt) <= new Date(startAt)) {
      throw errorFactory.BadRequest(
        operationMessages["session.time.invalid.error"].fa,
      );
    }

    // Time overlap validation when dates change
    if (data.startAt || data.endAt) {
      const conflict = await this.sessionRepo.findOverlappingSession(
        session.courseId,
        startAt,
        endAt,
      );
      if (conflict && conflict._id.toString() !== sessionId) {
        throw errorFactory.Conflict(
          operationMessages["session.time.conflict.error"].fa,
        );
      }
    }

    // Duplicate session number validation
    if (data.sessionNumber) {
      const duplicate = await this.sessionRepo.findDuplicateSessionNumber(
        session.courseId,
        data.sessionNumber,
      );
      if (duplicate && duplicate._id.toString() !== sessionId) {
        throw errorFactory.Conflict(
          operationMessages["session.duplicate.error"].fa,
        );
      }
    }

    // Re‑calculate duration when dates are altered
    if (data.startAt || data.endAt) {
      data.durationMinutes = this.#calcDuration(startAt, endAt);
    }

    const updated = await this.sessionRepo.updateBySessionId(sessionId, data);
    return updated;
  };

  /** Delete a session (cannot delete a live session) */
  deleteSession = async (sessionId) => {
    const session = await this.sessionRepo.findBySessionId(sessionId);
    if (!session) {
      throw errorFactory.NotFound(
        operationMessages["session.notFound.error"].fa,
      );
    }
    if (session.status === "live") {
      throw errorFactory.BadRequest(
        operationMessages["session.delete.live.error"].fa,
      );
    }
    await this.sessionRepo.deleteSession(sessionId);
    return true;
  };

  /** Change session status with timestamps and optional cancel reason */
  changeStatus = async (sessionId, payload) => {
    const { status, cancelReason } = payload;
    const session = await this.sessionRepo.findBySessionId(sessionId);
    if (!session) {
      throw errorFactory.NotFound(
        operationMessages["session.notFound.error"].fa,
      );
    }
    if (session.status.toLowerCase() === status.toLowerCase()) {
      return session;
    }

    const validTransitions = {
      scheduled: ["live", "cancelled"],
      live: ["completed", "cancelled"],
      completed: [],
      cancelled: [],
    };
    const canChange = validTransitions[session.status]?.includes(status);
    if (!canChange) {
      throw errorFactory.BadRequest(
        operationMessages["session.status.invalid.transition"].fa,
      );
    }

    const updateData = { status };
    if (status === "live") {
      updateData.startAt = new Date();
    }
    if (status === "completed") {
      updateData.endAt = new Date();
    }
    if (status === "cancelled" && cancelReason) {
      updateData.cancelReason = cancelReason;
    }

    const updated = await this.sessionRepo.updateBySessionId(
      sessionId,
      updateData,
    );
    return updated;
  };
}

module.exports = SessionBl;