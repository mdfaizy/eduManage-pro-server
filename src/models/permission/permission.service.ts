import { PermissionRepository } from "./permission.repository.js";

export class PermissionService {
  private repo = new PermissionRepository();

  async createPermission(key: string, description?: string) {
    return this.repo.createPermission(key, description);
  }

  async getAllPermissions() {
    return this.repo.findAll();
  }

  async getPermissionById(id: number) {
    const permission = await this.repo.findById(id);
    if (!permission) {
      throw new Error("Permission not found");
    }
    return permission;
  }

  async updatePermissionById(id: number, key: string, description?: string) {
    return this.repo.updatePermission(id, key, description);
  }

  async deletePermission(id: number) {
    await this.repo.deletePermission(id);
  }
}
