import { Request, Response } from "express";
import { TeacherSubjectService } from "./teacherSubject.service";

const service = new TeacherSubjectService();

export class TeacherSubjectController {

  async assign(req: Request, res: Response) {
    const { teacherId, subjectId, classId } = req.body;

    const data = await service.assign(
      Number(teacherId),
      Number(subjectId),
      Number(classId)
    );

    res.status(201).json({
      message: "Teacher assigned to subject",
      data,
    });
  }

  async getByTeacher(req: Request, res: Response) {
    const teacherId = Number(req.params.teacherId);
    const data = await service.getTeacherSubjects(teacherId);

    res.json({ data });
  }

  async remove(req: Request, res: Response) {
    await service.remove(Number(req.params.id));
    res.json({ message: "Assignment removed" });
  }
}
