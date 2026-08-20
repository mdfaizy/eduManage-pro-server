import prisma from "../../config/prisma.js";
import { CreateAuditLogDTO } from "./auditLog.types.js";

class AuditLogRepository {

  // =====================================================
  // CREATE AUDIT LOG
  // =====================================================

  async create(data: CreateAuditLogDTO) {
    return prisma.auditLog.create({
      data: {
        schoolId: data.schoolId,

        userId: data.userId ?? null,

        action: data.action,

        entity: data.entity,

        entityId: data.entityId ?? null,

        oldData: data.oldData ?? undefined,

        newData: data.newData ?? undefined,

        reason: data.reason ?? null,

        ipAddress: data.ipAddress ?? null,

        userAgent: data.userAgent ?? null,
      },
    });
  }

  // =====================================================
  // GET ONE AUDIT LOG
  // =====================================================

  async getOne(
    id: number,
    schoolId: number
  ) {
    return prisma.auditLog.findFirst({
      where: {
        id,
        schoolId,
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  // =====================================================
  // GET ALL AUDIT LOGS
  // =====================================================

  async getAll(
    schoolId: number,
    where: any = {}
  ) {
    return prisma.auditLog.findMany({
      where: {
        schoolId,
        ...where,
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // =====================================================
  // GET AUDIT LOGS BY ENTITY
  // =====================================================

  async getByEntity(
    entity: string,
    entityId: number,
    schoolId: number
  ) {
    return prisma.auditLog.findMany({
      where: {
        schoolId,
        entity,
        entityId,
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // =====================================================
  // GET AUDIT LOGS BY USER
  // =====================================================

  async getByUser(
    userId: number,
    schoolId: number
  ) {
    return prisma.auditLog.findMany({
      where: {
        schoolId,
        userId,
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }
}

export default new AuditLogRepository();