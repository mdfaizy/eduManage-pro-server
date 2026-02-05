import { Request, Response } from "express";
import { RoleService } from "./role.service.js";
import { HTTP_STATUS_CODE } from "../../constants/statusCode.js";

export class RoleController {
  private service = new RoleService();

  // ✅ Create role
  // async createRole(req: Request, res: Response) {
  //   try {
  //     const { name } = req.body;
  //     const schoolId = (req as any).user.schoolId;
  //     const role = await this.service.createRole(name, schoolId);
  //     return res.status(HTTP_STATUS_CODE.CREATED).json({
  //       message: "Role created successfully",
  //       role,
  //     });
  //   } catch (e: any) {
  //     return res
  //       .status(HTTP_STATUS_CODE.BAD_REQUEST)
  //       .json({ error: e.message });
  //   }
  // }

  async createRole(req: Request, res: Response) {
  try {
    const { name } = req.body;

    // ✅ INPUT VALIDATION (controller ka kaam)
    if (!name || name.trim() === "") {
      return res.status(400).json({
        message: "Role name is required",
      });
    }

    const schoolId = (req as any).user.schoolId;

    const role = await this.service.createRole(name, schoolId);

    return res.status(201).json({
      message: "Role created successfully",
      role,
    });
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
}


  // ✅ Update role
  async updateRole(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const role = await this.service.updateRole(id, req.body);

      return res.json({
        message: "Role updated successfully",
        role,
      });
    } catch (e: any) {
      return res.status(400).json({ error: e.message });
    }
  }

  // ✅ Get all roles
  // async getAllRoles(_req: Request, res: Response) {
  //   const roles = await this.service.getAllRoles();
  //   return res.json({ roles });
  // }

  async getAllRoles(req: Request, res: Response) {
  const schoolId = (req as any).user.schoolId;

  const roles = await this.service.getAllRoles(schoolId);

  return res.json({ roles });
}


  // ✅ Get role by id
  async getRoleById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const role = await this.service.getRoleById(id);

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    return res.json(role);
  }

  // ✅ Assign permissions
  async assignPermissions(req: Request, res: Response) {
    try {
      const { roleId, permissionIds } = req.body;

      const role = await this.service.assignPermissions(
        roleId,
        permissionIds
      );

      return res.json({
        message: "Permissions assigned successfully",
        role,
      });
    } catch (e: any) {
      return res.status(400).json({ error: e.message });
    }
  }

  // ✅ Delete role
  async deleteRole(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await this.service.deleteRole(id);
      return res.json({ message: "Role deleted successfully" });
    } catch (e: any) {
      return res.status(400).json({ error: e.message });
    }
  }
}

export default new RoleController();
