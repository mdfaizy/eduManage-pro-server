import { Request, Response } from "express";
import { PermissionService } from "./permission.service.js";
import { HTTP_STATUS_CODE } from "../../constants/statusCode.js";

export class PermissionController {
  private service = new PermissionService();

  // helper
  private parseId(req: Request, res: Response): number | null {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json({ message: "Invalid permission ID" });
      return null;
    }
    return id;
  }

  // ✅ Create
  async createPermission(req: Request, res: Response) {
    try {
      const { key, description } = req.body;
      console.log(req.body); 
      const permission = await this.service.createPermission(
        key,
        description
      );

      return res.status(HTTP_STATUS_CODE.CREATED).json({
        message: "Permission created successfully",
        data: permission,
      });
    } catch (e: any) {
      return res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json({ error: e.message });
    }
  }

  // ✅ Get all
  async getAllPermissions(_req: Request, res: Response) {
    const permissions = await this.service.getAllPermissions();
    return res.status(HTTP_STATUS_CODE.OK).json({ data: permissions });
  }

  // ✅ Get by id
  async getPermissionById(req: Request, res: Response) {
    try {
      const id = this.parseId(req, res);
      if (!id) return;

      const permission = await this.service.getPermissionById(id);
      return res.status(HTTP_STATUS_CODE.OK).json({ data: permission });
    } catch (e: any) {
      return res
        .status(HTTP_STATUS_CODE.NOT_FOUND)
        .json({ error: e.message });
    }
  }

  // ✅ Update
  async updatePermissionById(req: Request, res: Response) {
    try {
      const id = this.parseId(req, res);
      if (!id) return;

      const { key, description } = req.body;
      const permission = await this.service.updatePermissionById(
        id,
        key,
        description
      );

      return res.status(HTTP_STATUS_CODE.OK).json({
        message: "Permission updated successfully",
        data: permission,
      });
    } catch (e: any) {
      return res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json({ error: e.message });
    }
  }

  // ✅ Delete
  async deletePermissionById(req: Request, res: Response) {
    try {
      const id = this.parseId(req, res);
      if (!id) return;

      await this.service.deletePermission(id);
      return res
        .status(HTTP_STATUS_CODE.OK)
        .json({ message: "Permission deleted successfully" });
    } catch (e: any) {
      return res
        .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ error: e.message });
    }
  }
}

export default new PermissionController();
