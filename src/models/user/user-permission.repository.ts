import prisma from "../../config/prisma.js";

export class UserPermissionRepository {

  async grant(userId: number, permissionId: number) {
    return prisma.userPermission.upsert({
      where: {
        userId_permissionId: { userId, permissionId },
      },
      update: { granted: true },
      create: { userId, permissionId, granted: true },
    });
  }

  async revoke(userId: number, permissionId: number) {
    return prisma.userPermission.upsert({
      where: {
        userId_permissionId: { userId, permissionId },
      },
      update: { granted: false },
      create: { userId, permissionId, granted: false },
    });
  }

  async findByUser(userId: number) {
    return prisma.userPermission.findMany({
      where: { userId },
      include: { permission: true },
    });
  }
}
