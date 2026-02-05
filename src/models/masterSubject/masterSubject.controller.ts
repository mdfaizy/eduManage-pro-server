import { Request, Response } from "express";
import { MasterSubjectService } from "./masterSubject.service";

const service = new MasterSubjectService();

export class MasterSubjectController {

  async create(req: Request, res: Response) {
    try {
      const schoolId = req.user.schoolId;
      const { name, grade, description } = req.body;

      const data = await service.create(name, Number(grade), schoolId, description);

      res.status(201).json({ message: "Master subject added", data });
    } catch (e: any) {
      res.status(400).json({ message: e.message });
    }
  }

  async getAll(req: Request, res: Response) {
    const schoolId = req.user.schoolId;
    const data = await service.getAll(schoolId);
    res.json({ data });
  }

  async delete(req: Request, res: Response) {
    await service.delete(Number(req.params.id));
    res.json({ message: "Deleted" });
  }
}
