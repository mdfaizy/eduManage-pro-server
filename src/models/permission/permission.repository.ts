import prisma from "../../config/prisma.js";

export class PermissionRepository {
  // ✅ Get all permissions
  async findAll() {
    return prisma.permission.findMany();
  }

  // ✅ Get permission by ID
  async findById(id: number) {
    return prisma.permission.findUnique({
      where: { id },
    });
  }

  // ✅ Find permission by key (name)
  async findByKey(key: string) {
    return prisma.permission.findUnique({
      where: { key },
    });
  }

  // ✅ Create permission (unique key)
  async createPermission(key: string, description?: string) {
    const exists = await this.findByKey(key);
    if (exists) {
      throw new Error("Permission already exists");
    }

    return prisma.permission.create({
      data: {
        key,
        description,
      },
    });
  }

  // ✅ Update permission
  async updatePermission(id: number, key: string, description?: string) {
    const permission = await this.findById(id);
    if (!permission) {
      throw new Error("Permission not found");
    }

    const existing = await this.findByKey(key);
    if (existing && existing.id !== id) {
      throw new Error("Permission key must be unique");
    }

    return prisma.permission.update({
      where: { id },
      data: { key, description },
    });
  }

  // ✅ Delete permission
  async deletePermission(id: number) {
    const permission = await this.findById(id);
    if (!permission) {
      throw new Error("Permission not found");
    }

    await prisma.permission.delete({
      where: { id },
    });
  }
}
