const { operationMessages } = require("../../base/enums");
const path = require("path");

class SessionMaterialController {
  constructor(materialBl) {
    this.materialBl = materialBl;
  }

  // -----------------------------------------------------------------
  // POST /:sessionId/materials – upload a new material (teacher/admin)
  // -----------------------------------------------------------------
  uploadMaterial = async (req, res, next) => {
    const { sessionId } = req.params;
    const uploader = req.user;
    const file = req.file; // multer assigns the uploaded file here
    const meta = {
      title: req.body.title,
      description: req.body.description,
      expiresAt: req.body.expiresAt,
    };
    const result = await this.materialBl.uploadMaterial(
      sessionId,
      uploader,
      file,
      meta,
    );
    return res.sendResponse(201, {
      message: operationMessages["material.upload.success"].fa,
      data: result,
    });
  };

  // -----------------------------------------------------------------
  // GET /:sessionId/materials – list materials for a session (paginated)
  // -----------------------------------------------------------------
  listMaterials = async (req, res, next) => {
    const { sessionId } = req.params;
    const query = req.query; // page, limit, sortMethod
    const result = await this.materialBl.listMaterials(
      sessionId,
      query,
    );
    return res.sendResponse(200, {
      message: operationMessages["material.list.success"].fa,
      data: result,
    });
  };

  // -----------------------------------------------------------------
  // GET /:sessionId/materials/:materialId – view material (increments view count)
  // -----------------------------------------------------------------
  viewMaterial = async (req, res, next) => {
    const { materialId } = req.params;
    const viewer = req.user;
    const material = await this.materialBl.registerView(materialId, viewer);
    return res.sendResponse(200, {
      message: operationMessages["material.get.success"].fa,
      data: material,
    });
  };

  // -----------------------------------------------------------------
  // POST /:sessionId/materials/:materialId/download – register download & stream file
  // -----------------------------------------------------------------
  downloadMaterial = async (req, res, next) => {
    const { materialId } = req.params;
    const downloader = req.user;
    const material = await this.materialBl.registerDownload(materialId, downloader);
    // Stream the physical file to the client
    const absolutePath = path.join(process.cwd(), material.filePath);
    res.setHeader("Content-Type", material.mimeType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${path.basename(material.filePath)}"`,
    );
    return res.sendFile(absolutePath, (err) => {
      if (err) next(err);
    });
  };

  // -----------------------------------------------------------------
  // GET /:sessionId/materials/:materialId – get material metadata (students view)
  // -----------------------------------------------------------------
  getMaterial = async (req, res, next) => {
    const { materialId } = req.params;
    const requester = req.user;
    const result = await this.materialBl.getMaterial(materialId, requester);
    return res.sendResponse(200, {
      message: operationMessages["material.get.success"].fa,
      data: result,
    });
  };

  // -----------------------------------------------------------------
  // PATCH /:sessionId/materials/:materialId – update metadata (teacher/admin)
  // -----------------------------------------------------------------
  updateMaterial = async (req, res, next) => {
    const { materialId } = req.params;
    const updater = req.user;
    const updates = req.body;
    const result = await this.materialBl.updateMaterial(
      materialId,
      updater,
      updates,
    );
    return res.sendResponse(200, {
      message: operationMessages["material.update.success"].fa,
      data: result,
    });
  };

  // -----------------------------------------------------------------
  // DELETE /:sessionId/materials/:materialId – delete material (teacher/admin)
  // -----------------------------------------------------------------
  deleteMaterial = async (req, res, next) => {
    const { materialId } = req.params;
    const deleter = req.user;
    await this.materialBl.deleteMaterial(materialId, deleter);
    return res.sendResponse(200, {
      message: operationMessages["material.delete.success"].fa,
    });
  };
}

module.exports = SessionMaterialController;
