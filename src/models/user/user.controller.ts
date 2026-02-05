import { Request, Response } from "express";
import { UserService } from "./user.service.js";

export class UserController {
  private service = new UserService();

  // async createUser(req: Request, res: Response) {
  //   try {
  //     const schoolId = (req as any).user.schoolId;
  //     const user = await this.service.createUser(req.body, schoolId);
  //     res.status(201).json({ message: "User created", user });
  //   } catch (e: any) {
  //     res.status(400).json({ error: e.message });
  //   }
  // }

  async createUser(req: Request, res: Response) {
    try {
      const schoolId = (req as any).user.schoolId;
      const user = await this.service.inviteUser(req.body, schoolId);
      res.status(201).json({ message: "Invite sent", user });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  async setPassword(req: Request, res: Response) {
    try {
      await this.service.setPassword(req.body.token, req.body.password);
      res.json({ message: "Password set successfully" });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  async getUsers(req: Request, res: Response) {
    const schoolId = (req as any).user.schoolId;
    const role = req.query.role as string | undefined;
    const users = await this.service.getUsers(schoolId, role);
    res.json(users);
  }

  async updateUserStatus(req: Request, res: Response) {
    await this.service.updateUserStatus(
      Number(req.params.id),
      req.body.isActive
    );
    res.json({ message: "Status updated" });
  }

 


  async getUser(req: Request, res: Response) {
    const user = await this.service.getUser(Number(req.params.id));
    res.json(user);
  }

  async assignRole(req: Request, res: Response) {
    const { userId, roleId } = req.body;
    await this.service.assignRole(userId, roleId);
    res.json({ message: "Role assigned" });
  }


  async deleteUser(req: Request, res: Response) {
    await this.service.deleteUser(Number(req.params.id));
    res.json({ message: "User deleted" });
  }

}

export default new UserController();
