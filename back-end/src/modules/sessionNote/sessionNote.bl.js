// src/modules/sessionNote/sessionNote.bl.js
const errorFactory = require('sillajError');
const { operationMessages } = require('../../base/enums');

class SessionNoteBl {
  constructor(noteRepo, sessionRepo) {
    this.noteRepo = noteRepo; // SessionNoteRepo
    this.sessionRepo = sessionRepo; // SessionRepo (existing)
  }

  // Helper to verify that a session exists before linking a note
  async #ensureSessionExists(sessionId) {
    const session = await this.sessionRepo.findBySessionId(sessionId);
    if (!session) {
      throw errorFactory.NotFound(
        operationMessages['session.notFound.error'].fa,
      );
    }
    return session;
  }

  /** Create a new note for a session */
  async createNote({ sessionId, content, createdBy }) {
    await this.#ensureSessionExists(sessionId);
    const note = await this.noteRepo.createNote({
      sessionId,
      content,
      createdBy,
    });
    return note;
  }

  /** Get a single note by its id */
  async getNote(noteId) {
    const note = await this.noteRepo.findById(noteId);
    if (!note) {
      throw errorFactory.NotFound(operationMessages["note.notFound.error"].fa);
    }
    return note;
  }

  /** Get paginated notes for a specific session */
  async getNotesBySession(sessionId, pagination = {}) {
    await this.#ensureSessionExists(sessionId);
    return this.noteRepo.findBySessionId(sessionId, pagination);
  }

  /** Update a note */
  async updateNote(noteId, data) {
    const note = await this.noteRepo.findById(noteId);
    if (!note) {
      throw errorFactory.NotFound(operationMessages["note.notFound.error"].fa);
    }
    // If sessionId is being changed, validate the target session exists
    if (data.sessionId) {
      await this.#ensureSessionExists(data.sessionId);
    }
    const updated = await this.noteRepo.updateById(noteId, data);
    return updated;
  }

  /** Delete a note */
  async deleteNote(noteId) {
    const note = await this.noteRepo.findById(noteId);
    if (!note) {
      throw errorFactory.NotFound(operationMessages["note.notFound.error"].fa);
    }
    await this.noteRepo.deleteNote(noteId);
    return true;
  }

  /** Change status (active / archived) */
  async changeStatus(noteId, status) {
    const updated = await this.noteRepo.updateById(noteId, { status });
    return updated;
  }
}

module.exports = SessionNoteBl;
