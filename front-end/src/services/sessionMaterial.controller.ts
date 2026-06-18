import { errorFactory } from '../../base/errorFactory';
import { operationMessages } from '../../base/enums';
import { SessionMaterial } from '../../models/sessionMaterial.model';
import * as fs from 'fs';
import * as path from 'path';

export class SessionMaterialController {
  constructor(private repo: any) {}

  // --------------------------------------------------------------
  // CREATE MATERIAL
  // --------------------------------------------------------------
  async createMaterial(
    sessionId: string,
    payload: any,
    userId: string,
    file?: any,
  ) {
    // Verify session exists
    const session = await this.repo.findSession(sessionId);
    if (!session) {
      throw errorFactory.NotFound(operationMessages['session.notFound.error'].fa);
    }

    // Build material data
    const material = await this.repo.create({
      sessionId,
      title: payload.title,
      description: payload.description || '',
      filePath: file?.path || payload.filePath,
      mimeType: file?.mimetype || payload.mimeType,
      size: file?.size || payload.size,
      expiresAt: payload.expiresAt,
      createdBy: userId,
      version: 1,
    });

    return material;
  }

  // --------------------------------------------------------------
  // READ MATERIAL
  // --------------------------------------------------------------
  async getMaterial(id: string) {
    const material = await this.repo.findById(id);
    if (!material) {
      throw errorFactory.NotFound(
        operationMessages['material.notFound.error'].fa,
      );
    }

    // Check expiration
    if (material.expiresAt && new Date(material.expiresAt) < new Date()) {
      throw errorFactory.Forbidden(
        operationMessages['material.notFound.error'].fa,
      );
    }

    return material;
  }

  // --------------------------------------------------------------
  // UPDATE MATERIAL
  // --------------------------------------------------------------
  async updateMaterial(id: string, payload: any) {
    const material = await this.repo.findById(id);
    if (!material) {
      throw errorFactory.NotFound(
        operationMessages['material.notFound.error'].fa,
      );
    }

    // Validate allowed fields
    const allowed = ['title', 'description', 'expiresAt'];
    const updates: any = {};
    allowed.forEach((key) => {
      if (payload[key] !== undefined) {
        updates[key] = payload[key];
      }
    });

    const updated = await this.repo.updateById(id, updates);
    return updated;
  }

  // --------------------------------------------------------------
  // DELETE MATERIAL
  // --------------------------------------------------------------
  async deleteMaterial(id: string) {
    const material = await this.repo.findById(id);
    if (!material) {
      throw errorFactory.NotFound(
        operationMessages['material.notFound.error'].fa,
      );
    }

    // Delete file from filesystem
    if (material.filePath) {
      const absolutePath = path.join(process.cwd(), material.filePath);
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
      }
    }

    await this.repo.deleteOne(id);
    return true;
  }

  // --------------------------------------------------------------
  // VIEW COUNTER
  // --------------------------------------------------------------
  async viewMaterial(id: string) {
    const material = await this.repo.incrementView(id);
    if (!material) {
      throw errorFactory.NotFound(
        operationMessages['material.notFound.error'].fa,
      );
    }
    return material;
  }

  // --------------------------------------------------------------
  // DOWNLOAD COUNTER
  // --------------------------------------------------------------
  async downloadMaterial(id: string) {
    const material = await this.repo.incrementDownload(id);
    if (!material) {
      throw errorFactory.NotFound(
        operationMessages['material.notFound.error'].fa,
      );
    }
    return material;
  }

  // --------------------------------------------------------------
  // NEW VERSION
  // --------------------------------------------------------------
  async createNewVersion(
    id: string,
    payload: any,
    file?: any,
  ) {
    const oldMaterial = await this.repo.findById(id);
    if (!oldMaterial) {
      throw errorFactory.NotFound(
        operationMessages['material.notFound.error'].fa,
      );
    }

    // Upload new file
    const material = await this.createMaterial(
      oldMaterial.sessionId,
      payload,
      oldMaterial.createdBy,
      file,
    );

    // Update version chain
    material.version = oldMaterial.version + 1;
    material.previousVersion = oldMaterial._id;
    await material.save();

    return material;
  }
}