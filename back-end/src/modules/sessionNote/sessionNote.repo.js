// src/modules/sessionNote/sessionNote.repo.js
const MongoBaseRepository = require("../../repositories/mongo.repo");
const redisRepository = require("../../repositories/redis.repo");

class SessionNoteRepo extends MongoBaseRepository {
  constructor(noteModel) {
    super(noteModel);
    this.noteModel = noteModel;
  }

  // ---------- Cache key helpers ----------
  #noteCacheKey = (noteId) => `sessionNote:${noteId}`;
  #sessionNotesCacheKey = (sessionId) => `sessionNotes:session:${sessionId}`;

  // ---------- Populate helper ----------
  #populateNote = () => [
    { path: "sessionId", select: "title startAt endAt" },
    { path: "createdBy", select: "firstName lastName avatarUrl" },
  ];

  // ---------- Find one note (with cache) ----------
  async findById(noteId, options = {}) {
    const redisKey = this.#noteCacheKey(noteId);
    const cached = await redisRepository.get(redisKey);
    if (cached) return cached;

    options = { ...options, populate: this.#populateNote() };
    const note = await this.findOne({ _id: noteId }, options);
    if (!note) return null;
    await redisRepository.set(redisKey, note);
    return note;
  }

  // ---------- List notes for a session (cached) ----------
  async findBySessionId(sessionId, filter = { page: 1, limit: 20 }) {
    const cacheKey = this.#sessionNotesCacheKey(sessionId);
    const cached = await redisRepository.get(cacheKey);
    if (cached) return cached;

    const { page = 1, limit = 20, sort = "desc" } = filter;
    const sortDir = sort === "asc" ? 1 : -1;

    const result = await this.paginate({
      filter: { sessionId, status: "active" },
      page,
      limit,
      sort: { createdAt: sortDir },
      populate: this.#populateNote(),
    });

    await redisRepository.set(cacheKey, result);
    return result;
  }

  // ---------- Create ----------
  async createNote(data) {
    const note = await this.create(data);
    // Invalidate the per‑session list cache
    await redisRepository.delete(this.#sessionNotesCacheKey(data.sessionId));
    return note;
  }

  // ---------- Update ----------
  async updateById(noteId, data, options = {}) {
    options = { ...options, populate: this.#populateNote() };
    const updated = await this.withTransaction(async (session) => {
      return this.findOneAndUpdate(
        { _id: noteId },
        data,
        { session, ...options },
      );
    });
    // Refresh caches
    await redisRepository.delete(this.#noteCacheKey(noteId));
    if (updated?.sessionId) {
      await redisRepository.delete(this.#sessionNotesCacheKey(updated.sessionId));
    }
    return updated;
  }

  // ---------- Delete ----------
  async deleteNote(noteId) {
    const note = await this.findOne({ _id: noteId });
    if (!note) return null;
    await this.deleteOne({ _id: noteId });
    await redisRepository.delete(this.#noteCacheKey(noteId));
    if (note.sessionId) {
      await redisRepository.delete(this.#sessionNotesCacheKey(note.sessionId));
    }
    return true;
  }
}

module.exports = SessionNoteRepo;
