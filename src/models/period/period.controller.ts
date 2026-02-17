import { Request, Response } from "express";
import { PeriodService } from "./period.service";

const service = new PeriodService();

export class PeriodController {
  async create(req: Request, res: Response) {
    try {
      const schoolId = req.user.schoolId;

      const result = await service.createSingle({
        ...req.body,
        schoolId,
      });

      res.status(201).json({
        success: true,
        message: "Period created successfully",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async bulkCreate(req: Request, res: Response) {
    try {
      const schoolId = req.user.schoolId;

      const result = await service.bulkCreate({
        ...req.body,
        schoolId,
      });

      res.json({
        success: true,
        message: "Period configuration saved",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const schoolId = req.user.schoolId;
      const academicYearId = Number(req.query.academicYearId);

      if (!academicYearId) {
        return res.status(400).json({
          success: false,
          message: "academicYearId is required",
        });
      }

      const data = await service.getAll(schoolId, academicYearId);

      res.json({
        success: true,
        data,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      await service.delete(id);

      res.json({
        success: true,
        message: "Period deleted",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
