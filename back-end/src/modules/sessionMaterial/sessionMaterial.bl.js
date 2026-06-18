/**
 * Business Logic layer for session materials.
 * Mirrors session.bl.js pattern – no input validation, only domain rules.
 */

const errorFactory = require("sillajError");
const { operationMessages, FILE_TYPES } = require("../../base/enums");
const path = require("path");
const fs = require("fs");

class SessionMaterialBl {
  constructor(materialRepo, sessionRepo) {
    this.materialRepo = materialRepo;
    this.sessionRepo = sessionRepo;
  }

  // -----------------------------------------------------------------
  // Helper – enforce teacher/admin role
  // -----------------------------------------------------------------
  #ensureTeacherOrAdmin(user) {
    if (!user) {
      throw errorFactory.Unauthorized(
        operationMessages["auth.login.invalid_credentials"].fa,
      );
    }
    const role = (user.role || "").toLowerCase();
    if (!["teacher", "admin"].includes(role)) {
      throw errorFactory.Forbidden(
        operationMessages["session.notFound.error"].fa,
      );
    }
  }

  // -----------------------------------------------------------------
  // Upload a new material for a given session.
  // -----------------------------------------------------------------
  uploadMaterial = async (sessionId, uploader, file, meta = {}) => {
    // Verify session exists
    const session = await this.sessionRepo.findBySessionId(sessionId);
    if (!session) {
      throw errorFactory.NotFound(
        operationMessages["session.notFound.error"].fa,
      );
    }

    // Determine upload folder based on file extension
    let typeKey = "DOCUMENT";
    const folder = FILE_TYPES[typeKey]?.dir || "public/documents";

    // Ensure target directory exists
    const targetDir = path.join(process.cwd(), folder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Move file to final location
    const finalPath = path.join(folder, `${Date.now()}_${file.originalname}`);
    const absolutePath = path.join(process.cwd(), finalPath);
    fs.renameSync(file.path, absolutePath);

    // Build DB record
    const materialData = {
      sessionId,
      uploadedBy: uploader._id,
      title: meta.title || file.originalname,
      description: meta.description || "",
      filePath: finalPath,
      mimeType: file.mimetype,
      size: file.size,
      expiresAt: meta.expiresAt || null,
    };

    const created = await this.materialRepo.createMaterial(materialData);
    return created;
  };

  // -----------------------------------------------------------------
  // Retrieve a single material (students cannot see expired ones)
  // -----------------------------------------------------------------
  getMaterial = async (materialId, requester) => {
    const material = await this.materialRepo.findById(materialId);
    if (!material) {
      throw errorFactory.NotFound(
        operationMessages["material.notFound.error"].fa,
      );
    }
    if (material.expiresAt && material.expiresAt < new Date()) {
      throw errorFactory.Forbidden(
        operationMessages["material.notFound.error"].fa,
      );
    }
    return material;
  };

  // -----------------------------------------------------------------
  // List materials for a session (paginated, respects expiration for students)
  // -----------------------------------------------------------------
  listMaterials = async (sessionId, query = {}) => {
    const session = await this.sessionRepo.findBySessionId(sessionId);
    if (!session) {
      throw errorFactory.NotFound(
        operationMessages["session.notFound.error"].fa,
      );
    }
    const result = await this.materialRepo.findBySession(sessionId, {
      ...query,
    });
    return result;
  };

  // -----------------------------------------------------------------
  // Update material metadata (only teachers/admins)
  // -----------------------------------------------------------------
  updateMaterial = async (materialId, updater, updates) => {
    const material = await this.materialRepo.findById(materialId);
    if (!material) {
      throw errorFactory.NotFound(
        operationMessages["material.notFound.error"].fa,
      );
    }

    const allowed = ["title", "description", "expiresAt"];
    const data = {};
    allowed.forEach((k) => {
      if (updates[k] !== undefined) data[k] = updates[k];
    });

    const updated = await this.materialRepo.updateById(materialId, data);
    return updated;
  };

  // -----------------------------------------------------------------
  // Delete a material (teachers/admins only); also remove file from disk.
  // -----------------------------------------------------------------
  deleteMaterial = async (materialId, deleter) => {
    const material = await this.materialRepo.findById(materialId);
    if (!material) {
      throw errorFactory.NotFound(
        operationMessages["material.notFound.error"].fa,
      );
    }

    // Remove physical file
    const absolutePath = path.join(process.cwd(), material.filePath);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }

    await this.materialRepo.deleteById(materialId);
    return true;
  };

  // -----------------------------------------------------------------
  // Register a view (increment viewCount)
  // -----------------------------------------------------------------
  registerView = async (materialId) => {
    const material = await this.materialRepo.incrementView(materialId);
    if (!material) {
      throw errorFactory.NotFound(
        operationMessages["material.notFound.error"].fa,
      );
    }
    return material;
  };

  // -----------------------------------------------------------------
  // Register a download (increment downloadCount)
  // -----------------------------------------------------------------
  registerDownload = async (materialId) => {
    const material = await this.materialRepo.incrementDownload(materialId);
    if (!material) {
      throw errorFactory.NotFound(
        operationMessages["material.notFound.error"].fa,
      );
    }
    return material;
  };
}

module.exports = SessionMaterialBl;
