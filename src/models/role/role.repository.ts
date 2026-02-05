import prisma from "../../config/prisma.js";
import { CustomError } from "../../utils/customerError.js";
import { HTTP_STATUS_CODE } from "../../constants/statusCode.js";

export class RoleRepository {
  // ✅ Get all roles with permissions
  // async findAll() {
  //   return prisma.role.findMany({
  //     include: {
  //       permissions: {
  //         include: {
  //           permission: true,
  //         },
  //       },
  //     },
  //   });
  // }

  async findAllBySchool(schoolId: number) {
  return prisma.role.findMany({
    where: { schoolId }, // 🔥 TENANT FILTER
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
  });
}


  // ✅ Get role by id
  async findById(id: number) {
    return prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  // ✅ Find role by name + school
  async findByName(name: string, schoolId: number) {
    return prisma.role.findUnique({
      where: {
        name_schoolId: {
          name,
          schoolId,
        },
      },
    });
  }

  // ✅ Create role
  async createRole(name: string, schoolId: number) {
    return prisma.role.create({
      data: { name, schoolId },
    });
  }

  // ✅ Update role
  async updateRole(id: number, data: { name?: string }) {
    return prisma.role.update({
      where: { id },
      data,
    });
  }

  // ✅ Assign permissions to role
  async assignPermissions(roleId: number, permissionIds: number[]) {
    const existing = await prisma.rolePermission.findMany({
      where: {
        roleId,
        permissionId: { in: permissionIds },
      },
    });

    if (existing.length === permissionIds.length) {
      throw new CustomError(
        "All permissions already assigned",
        HTTP_STATUS_CODE.BAD_REQUEST
      );
    }

    await prisma.rolePermission.createMany({
      data: permissionIds.map(pid => ({
        roleId,
        permissionId: pid,
      })),
      skipDuplicates: true,
    });

    return this.findById(roleId);
  }

  // ✅ Delete role
  async deleteRole(id: number) {
    await prisma.role.delete({ where: { id } });
  }

  // ✅ Get roles of a user
  async getUserRoles(userId: number) {
    const roles = await prisma.userRole.findMany({
      where: { userId },
      include: {
        role: true,
      },
    });

    return roles.map(r => r.role);
  }

  // ✅ Get permissions by role IDs
  async getPermissionsByRoles(roleIds: number[]) {
    const rolePermissions = await prisma.rolePermission.findMany({
      where: {
        roleId: { in: roleIds },
      },
      include: {
        permission: true,
      },
    });

    // remove duplicates
    const map = new Map<number, any>();
    rolePermissions.forEach(rp => {
      map.set(rp.permission.id, rp.permission);
    });

    return Array.from(map.values());
  }
}
