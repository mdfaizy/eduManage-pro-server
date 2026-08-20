import repository from "./auditLog.repository.js";
import { CreateAuditLogDTO } from "./auditLog.types.js";

class AuditLogService {

  // =====================================================
  // CREATE AUDIT LOG
  // =====================================================

  async create(data: CreateAuditLogDTO) {

    if (
      !Number.isInteger(data.schoolId) ||
      data.schoolId <= 0
    ) {
      throw new Error("Invalid school ID");
    }

    if (!data.action?.trim()) {
      throw new Error("Audit action is required");
    }

    if (!data.entity?.trim()) {
      throw new Error("Audit entity is required");
    }

    if (
      data.entityId !== undefined &&
      data.entityId !== null &&
      (!Number.isInteger(data.entityId) ||
        data.entityId <= 0)
    ) {
      throw new Error("Invalid entity ID");
    }

    return repository.create({
      ...data,

      action: data.action.trim(),

      entity: data.entity.trim(),
    });
  }

  // =====================================================
  // GET ONE
  // =====================================================

  async getOne(
    id: number,
    schoolId: number
  ) {

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("Invalid audit log ID");
    }

    const log = await repository.getOne(
      id,
      schoolId
    );

    if (!log) {
      throw new Error("Audit log not found");
    }

    return log;
  }

  // =====================================================
  // GET ALL
  // =====================================================

  async getAll(
    schoolId: number,
    where: any = {}
  ) {

    if (
      !Number.isInteger(schoolId) ||
      schoolId <= 0
    ) {
      throw new Error("Invalid school ID");
    }

    return repository.getAll(
      schoolId,
      where
    );
  }

  // =====================================================
  // GET BY ENTITY
  // =====================================================

  async getByEntity(
    entity: string,
    entityId: number,
    schoolId: number
  ) {

    if (!entity?.trim()) {
      throw new Error("Entity is required");
    }

    if (
      !Number.isInteger(entityId) ||
      entityId <= 0
    ) {
      throw new Error("Invalid entity ID");
    }

    return repository.getByEntity(
      entity.trim(),
      entityId,
      schoolId
    );
  }

  // =====================================================
  // GET BY USER
  // =====================================================

  async getByUser(
    userId: number,
    schoolId: number
  ) {

    if (
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      throw new Error("Invalid user ID");
    }

    return repository.getByUser(
      userId,
      schoolId
    );
  }
}

export default new AuditLogService();