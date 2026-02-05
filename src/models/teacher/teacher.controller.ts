// src/models/teacher/teacher.controller.ts
import { Request, Response } from "express";
import { TeacherService } from "./teacher.service";

const service = new TeacherService();

export class TeacherController {
  async create(req: Request, res: Response) {
    try {
      const schoolId = (req as any).user.schoolId;
      const { userId } = req.body;

      const teacher = await service.createTeacher(userId, schoolId);

      res.status(201).json({
        message: "Teacher profile created",
        teacher,
      });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  async getAll(req: Request, res: Response) {
    const schoolId = (req as any).user.schoolId;
    const data = await service.getTeachers(schoolId);
    res.json(data);
  }

  async getOne(req: Request, res: Response) {
    const data = await service.getTeacher(Number(req.params.id));
    res.json(data);
  }
   async update(req: Request, res: Response) {
  try {
    const teacherId = Number(req.params.id);
    const { name, email } = req.body;

    const teacher = await service.getTeacher(teacherId);
    const userId = teacher.userId;

    const updated = await service.updateTeacherUser(userId, name, email);

    res.json({ message: "Teacher updated", updated });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}


}
