import { Request, Response } from "express";
import { AdmissionService } from "./admission.service.js";

export class AdmissionController {
  private service = new AdmissionService();

  async createAdmission(req: Request, res: Response) {
    try {
      const schoolId = (req as any).user.schoolId;
      const data = await this.service.createAdmission(
        req.body,
        schoolId
      );

      res.status(201).json({
        success: true,
        message: "Admission successful",
        data,
      });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  }

  async getStudentAdmissions(req: Request, res: Response) {
    try {
      const studentId = Number(req.params.studentId);
      const data = await this.service.getStudentAdmissions(studentId);
      res.json({ success: true, data });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  }
}

export default new AdmissionController();