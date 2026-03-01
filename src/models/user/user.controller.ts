import { Request, Response } from "express";
import { UserService } from "./user.service.js";
import { parseId } from "../../utils/parseId.js";

export class UserController {
  private service = new UserService();

  async createUser(req: Request, res: Response) {
    try {
      const schoolId = (req as any).user.schoolId;
      const user = await this.service.inviteUser(req.body, schoolId);
      res.status(201).json({ success: true, message: "Invite sent", user });
    } catch (e: any) {
      res.status(e.statusCode || 400).json({ success: false, message: e.message });
    }
  }

  async setPassword(req: Request, res: Response) {
    try {
      await this.service.setPassword(req.body.token, req.body.password);
      res.json({ success: true, message: "Password set successfully" });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  }

  // async getUsers(req: Request, res: Response) {
  //   try {
  //     const schoolId = (req as any).user.schoolId;
  //     const role = req.query.role as string | undefined;
  //     console.log("ROLE FROM QUERY 👉", role);
  //     const users = await this.service.getUsers(schoolId, role);
  //     res.json({ success: true, data: users });
  //   } catch (e: any) {
  //     res.status(500).json({ success: false, message: e.message });
  //   }
  // }

  async getUsers(req: Request, res: Response) {
  try {
    console.log("REQ.USER 👉", (req as any).user);

    const schoolId = (req as any).user?.schoolId;
    console.log("SCHOOL ID 👉", schoolId);

    const role = req.query.role as string | undefined;
    console.log("ROLE FROM QUERY 👉", role);

    const users = await this.service.getUsers(schoolId, role);
    res.json({ success: true, data: users });
  } catch (e: any) {
    console.error("GET USERS ERROR 👉", e);
    res.status(500).json({ success: false, message: e.message });
  }
}

getUsersPaginated = async (req: Request, res: Response) => {
  try {
    const schoolId = (req as any).user?.schoolId;

    if (!schoolId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
    const search = (req.query.search as string) || "";
    const role = req.query.role as string | undefined;

    const result = await this.service.getUsersPaginated(
      schoolId,
      page,
      limit,
      search,
      role
    );

    res.json({
      success: true,
      data: result.data,
      meta: result.meta,
    });
  } catch (e: any) {
    console.error("GET USERS PAGINATED ERROR 👉", e);
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};
async updateUser(req: Request, res: Response) {
  try {
    const id = parseId(req.params.id);

    const user = await this.service.updateUser(id, req.body);

    res.json({
      success: true,
      message: "User updated",
      data: user,
    });
  } catch (e: any) {
    res.status(e.statusCode || 500).json({
      success: false,
      message: e.message,
    });
  }
}
  async getUser(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      const user = await this.service.getUser(id);
      res.json({ success: true, data: user });
    } catch (e: any) {
      res.status(e.statusCode || 500).json({ success: false, message: e.message });
    }
  }

  async updateUserStatus(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      await this.service.updateUserStatus(id, req.body.isActive);
      res.json({ success: true, message: "Status updated" });
    } catch (e: any) {
      res.status(e.statusCode || 500).json({ success: false, message: e.message });
    }
  }

  async assignRole(req: Request, res: Response) {
    try {
      const userId = parseId(req.body.userId);
      const roleId = parseId(req.body.roleId);
      await this.service.assignRole(userId, roleId);
      res.json({ success: true, message: "Role assigned" });
    } catch (e: any) {
      res.status(e.statusCode || 500).json({ success: false, message: e.message });
    }
  }

  // async deleteUser(req: Request, res: Response) {
  //   try {
  //     const id = parseId(req.params.id);
  //     await this.service.deleteUser(id);
  //     res.json({ success: true, message: "User deleted" });
  //   } catch (e: any) {
  //     res.status(e.statusCode || 500).json({ success: false, message: e.message });
  //   }
  // }

  async deleteUser(req: Request, res: Response) {
  try {
    const id = parseId(req.params.id);
    await this.service.softDeleteUser(id);
    res.json({ success: true, message: "User deleted" });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
  }
}

  async getUserPermissions(req: Request, res: Response) {
  const userId = Number(req.params.id);
  const permissions = await this.service.getUserPermissions(userId);
  res.json({ success: true, data: permissions });
}

async grantPermission(req: Request, res: Response) {
  const userId = Number(req.params.id);
  const { permissionId } = req.body;

  await this.service.grantPermission(userId, permissionId);
  res.json({ success: true, message: "Permission granted" });
}

async revokePermission(req: Request, res: Response) {
  const userId = Number(req.params.id);
  const { permissionId } = req.body;

  await this.service.revokePermission(userId, permissionId);
  res.json({ success: true, message: "Permission revoked" });
}

}

export default new UserController();
