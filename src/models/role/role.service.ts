import { RoleRepository } from "./role.repository.js";

export class RoleService {
  private repo = new RoleRepository();

//   async createRole(name: string, schoolId: number) {
//     const exists = await this.repo.findByName(name, schoolId);
//     if (exists) {
//       throw new Error("Role already exists");
//     }
//     return this.repo.createRole(name, schoolId);
//   }
async createRole(name: string, schoolId: number) {
  const exists = await this.repo.findByName(name, schoolId);
  if (exists) {
    throw new Error("Role already exists");
  }

  return this.repo.createRole(name, schoolId);
}


  async updateRole(id: number, data: { name?: string }) {
    const role = await this.repo.findById(id);
    if (!role) throw new Error("Role not found");

    return this.repo.updateRole(id, data);
  }

  async getRoleById(id: number) {
    return this.repo.findById(id);
  }

  // async getAllRoles() {
  //   return this.repo.findAll();
  // }
  async getAllRoles(schoolId: number) {
  return this.repo.findAllBySchool(schoolId);
}


  async assignPermissions(roleId: number, permissionIds: number[]) {
    return this.repo.assignPermissions(roleId, permissionIds);
  }

  async deleteRole(id: number) {
    const role = await this.repo.findById(id);
    if (!role) throw new Error("Role not found");

    await this.repo.deleteRole(id);
  }

  async getPermissionsByRole(roleId: number) {
    const role = await this.repo.findById(roleId);
    if (!role) throw new Error("Role not found");

    return role.permissions.map(rp => rp.permission);
  }
}
