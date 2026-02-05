import { Request, Response } from "express";
import { ClassTeacherService } from "./classTeacher.service";

const service = new ClassTeacherService();

export class ClassTeacherController {

  async assign(req: Request, res: Response) {
    const { teacherId, classId, isClassTeacher } = req.body;

    const data = await service.assignTeacher(
      Number(teacherId),
      Number(classId),
      Boolean(isClassTeacher)
    );

    res.status(201).json({ message: "Teacher assigned to class", data });
  }

  async getByClass(req: Request, res: Response) {
    const classId = Number(req.query.classId);
    const data = await service.getClassTeachers(classId);

    res.json({ data });
  }

  async remove(req: Request, res: Response) {
    await service.remove(Number(req.params.id));
    res.json({ message: "Assignment removed" });
  }
}
