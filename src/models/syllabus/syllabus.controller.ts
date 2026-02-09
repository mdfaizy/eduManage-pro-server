import { Request, Response } from "express";
import { SyllabusService } from "./syllabus.service";

const service = new SyllabusService();

export class SyllabusController {

  async create(req: Request, res: Response) {
    try {
      const schoolId = req.user.schoolId;
      const {
        subjectId,
        gradeId,
        classId,
        type,
        chapters,
        maxMarks,
        passMarks
      } = req.body;

      const data = await service.createSyllabus({
        subjectId: Number(subjectId),
        gradeId: gradeId ? Number(gradeId) : undefined,
        classId: classId ? Number(classId) : undefined,
        schoolId,
        type,
        chapters,
        maxMarks,
        passMarks
      });

      res.status(201).json({ message: "Syllabus created", data });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  async getByClass(req: Request, res: Response) {
    const schoolId = req.user.schoolId;
    const classId = Number(req.query.classId);
    const gradeId = Number(req.query.gradeId);

    if (!classId || !gradeId) {
      return res.status(400).json({
        message: "classId and gradeId are required"
      });
    }

    const data = await service.getClassSyllabus(
      classId,
      gradeId,
      schoolId
    );

    res.json({ data });
  }

  async getAll(req: Request, res: Response) {
    const schoolId = req.user.schoolId;
    const data = await service.getAll(schoolId);
    res.json({ data });
  }

  async delete(req: Request, res: Response) {
    await service.delete(Number(req.params.id));
    res.json({ message: "Syllabus deleted" });
  }
}
