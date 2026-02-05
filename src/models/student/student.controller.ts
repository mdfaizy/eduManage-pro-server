import { Request, Response } from "express";
import { StudentService } from "./student.service";

const service = new StudentService();

export class StudentController {

  async admit(req: Request, res: Response) {
    try {
      const schoolId = (req as any).user.schoolId;
      const student = await service.admitStudent(req.body, schoolId);

      res.status(201).json({
        message: "Student admission completed",
        student,
      });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
}
