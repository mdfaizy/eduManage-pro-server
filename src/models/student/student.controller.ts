import { Request, Response } from "express";
import { StudentService } from "./student.service.js";

export class StudentController {
  private service = new StudentService();

  async createStudent(req: Request, res: Response) {
    try {
      const schoolId = (req as any).user.schoolId;
      const data = await this.service.createStudent(req.body, schoolId);

      res.status(201).json({
        success: true,
        message: "Student created successfully",
        data,
      });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  }

  async getStudents(req: Request, res: Response) {
    try {
      const schoolId = (req as any).user.schoolId;
      const data = await this.service.getStudents(schoolId);
      res.json({ success: true, data });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  }

  async getStudent(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const user = (req as any).user;

      const data = await this.service.getStudent(id, user);
      res.json({ success: true, data });
    } catch (e: any) {
      res.status(403).json({ success: false, message: e.message });
    }
  }

  async linkParent(req: Request, res: Response) {
    try {
      const schoolId = (req as any).user.schoolId;
      const { studentId, parentEmail, parentName } = req.body;

      const data = await this.service.linkParent(
        studentId,
        parentEmail,
        parentName,
        schoolId
      );

      res.json({ success: true, data });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  }

  async deleteStudent(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await this.service.deleteStudent(id);
      res.json({ success: true, message: "Student deleted" });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  }
}

export default new StudentController();