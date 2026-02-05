import { Request, Response } from "express";
import { ClassService } from "./class.service";

const service = new ClassService();

export class ClassController {

  async create(req: Request, res: Response) {
    try {
      const schoolId = req.user.schoolId;
      const { name, maxStudents, gradeId } = req.body;

      const data = await service.createClass(
        name,
        schoolId,
        Number(maxStudents),
        Number(gradeId)
      );

      res.status(201).json({ message: "Class created", data });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  async getAll(req: Request, res: Response) {
    const schoolId = req.user.schoolId;
    const gradeId = req.query.gradeId ? Number(req.query.gradeId) : undefined;
    const data = await service.getClasses(schoolId, gradeId);
    res.json(data);
  }

  async getOne(req: Request, res: Response) {
    const data = await service.getClassById(Number(req.params.id));
    res.json(data);
  }

  async update(req: Request, res: Response) {
    try {
      const { name, isActive, maxStudents, gradeId } = req.body;

      const data = await service.updateClass(Number(req.params.id), {
        name,
        isActive,
        maxStudents: maxStudents ? Number(maxStudents) : undefined,
        gradeId: gradeId ? Number(gradeId) : undefined,
      });

      res.json({ message: "Class updated", data });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    await service.deleteClass(Number(req.params.id));
    res.json({ message: "Class deleted" });
  }
}
