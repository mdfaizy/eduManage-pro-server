import { Request, Response } from "express";
import { TimetableService } from "./timetable.service";

const service = new TimetableService();

export class TimetableController {

  async create(req: Request, res: Response) {
    const data = await service.createEntry(req.body);
    res.status(201).json({ message: "Timetable entry created", data });
  }

  async getBySection(req: Request, res: Response) {
    const sectionId = Number(req.params.sectionId);
    const data = await service.getSectionTimetable(sectionId);
    res.json({ data });
  }
}
