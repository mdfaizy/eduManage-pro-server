import { Request, Response } from "express";
import { SchoolService } from "../models/school/school.service.js";

export const SchoolController = {
  async getSchool(req: Request, res: Response) {
    try {
      const school = await SchoolService.getSchoolProfile(
        Number(req.params.id)
      );
      res.json(school);
    } catch (err: any) {
      res.status(404).json({ message: err.message });
    }
  },

  async listSchools(req: Request, res: Response) {
    const schools = await SchoolService.listSchools();
    res.json(schools);
  },
};
