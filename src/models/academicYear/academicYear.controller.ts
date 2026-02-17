import { Request, Response } from "express";
import { AcademicYearService } from "./academicYear.service";

const service = new AcademicYearService();

export class AcademicYearController {

  // ✅ CREATE
  create = async (req: Request, res: Response) => {
    try {
      console.log("USER:", req.user);

      const schoolId = req.user.schoolId;

      const result = await service.create({
        ...req.body,
        schoolId,
      });

      res.status(201).json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  // ✅ GET ALL
  getAll = async (req: Request, res: Response) => {
    const schoolId = (req as any).user.schoolId;
    const data = await service.getAll(schoolId);
    res.json({ success: true, data });
  };

  // ✅ GET BY ID (NEW)
  getById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const data = await service.getById(id);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(404).json({ success: false, message: err.message });
    }
  };

  // ✅ TOGGLE ACTIVE
  setActive = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const schoolId = (req as any).user.schoolId;

      const result = await service.setActive(id, schoolId);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  // ✅ PUT
  update = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await service.update(id, req.body);
    res.json({ success: true, data: result });
  };

  // ✅ PATCH
  patch = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await service.patch(id, req.body);
    res.json({ success: true, data: result });
  };

  // ✅ DELETE
  delete = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await service.delete(id);
    res.json({ success: true, message: "Deleted successfully" });
  };

  // ✅ GET ACTIVE
  getActive = async (req: Request, res: Response) => {
    try {
      const schoolId = (req as any).user.schoolId;
      const data = await service.getActive(schoolId);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(404).json({ success: false, message: err.message });
    }
  };
}
