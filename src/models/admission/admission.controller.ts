// import { Request, Response } from "express";
// import { AdmissionService } from "./admission.service.js";

// export class AdmissionController {
//   private service = new AdmissionService();

//   async createAdmission(req: Request, res: Response) {
//     try {
//       const schoolId = (req as any).user.schoolId;
//       const data = await this.service.createAdmission(
//         req.body,
//         schoolId
//       );

//       res.status(201).json({
//         success: true,
//         message: "Admission successful",
//         data,
//       });
//     } catch (e: any) {
//       res.status(400).json({ success: false, message: e.message });
//     }
//   }
// async getAllAdmissions(req: Request, res: Response) {
//   try {
//     const schoolId = (req as any).user.schoolId;
//     const data = await this.service.getAllAdmissions(schoolId);

//     res.json({ success: true, data });
//   } catch (e: any) {
//     res.status(400).json({ success: false, message: e.message });
//   }
// }
//   async getStudentAdmissions(req: Request, res: Response) {
//     try {
//       const studentId = Number(req.params.studentId);
//       const data = await this.service.getStudentAdmissions(studentId);
//       res.json({ success: true, data });
//     } catch (e: any) {
//       res.status(400).json({ success: false, message: e.message });
//     }
//   }
// }

// export default new AdmissionController();



import { Request, Response } from "express";
import {AdmissionService} from "./admission.service.js";

export class AdmissionController {
  private service = new AdmissionService();

  // ✅ APPLY
  async apply(req: Request, res: Response) {
    try {
      const schoolId = (req as any).user.schoolId;

      const data = await this.service.applyAdmission(
        req.body,
        schoolId
      );

      res.status(201).json({
        success: true,
        message: "Admission applied",
        data,
      });
    } catch (e: any) {
      res.status(400).json({
        success: false,
        message: e.message,
      });
    }
  }

  // ✅ APPROVE
  async approve(req: Request, res: Response) {
    try {
      const schoolId = (req as any).user.schoolId;
      const id = Number(req.params.id);

      const data = await this.service.approveAdmission(
        id,
        schoolId
      );

      res.json({ success: true, data });
    } catch (e: any) {
      res.status(400).json({
        success: false,
        message: e.message,
      });
    }
  }

  // ❌ REJECT
  async reject(req: Request, res: Response) {
    try {
      const schoolId = (req as any).user.schoolId;
      const id = Number(req.params.id);

      const data = await this.service.rejectAdmission(
        id,
        schoolId
      );

      res.json({ success: true, data });
    } catch (e: any) {
      res.status(400).json({
        success: false,
        message: e.message,
      });
    }
  }

  // 📋 LIST
  async list(req: Request, res: Response) {
    try {
      const schoolId = (req as any).user.schoolId;
      const data = await this.service.getAdmissions(schoolId);

      res.json({ success: true, data });
    } catch (e: any) {
      res.status(500).json({
        success: false,
        message: e.message,
      });
    }
  }
}

export default new AdmissionController();