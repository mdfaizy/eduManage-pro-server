import { Request, Response } from "express";
import { GradeService } from "./grade.service";

const service = new GradeService();

export class GradeController {

  async create(req: Request, res: Response) {
    try {
      const schoolId = req.user.schoolId;
      const { name, level, order } = req.body;

      const data = await service.createGrade(name, level, Number(order), schoolId);

      res.status(201).json({ message: "Grade created", data });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  async getAll(req: Request, res: Response) {
    const schoolId = req.user.schoolId;
    const data = await service.getGrades(schoolId);
    res.json({ data });
  }

  async delete(req: Request, res: Response) {
    await service.deleteGrade(Number(req.params.id));
    res.json({ message: "Grade deleted" });
  }
}
