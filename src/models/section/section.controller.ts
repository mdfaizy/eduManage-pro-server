import { Request, Response } from "express";
import { SectionService } from "./section.service";
const service = new SectionService();
export class SectionController {
 async create(req: Request, res: Response) {
    const schoolId = req.user.schoolId;
    const { name, classId, capacity } = req.body;
    const data = await service.createSection(
      name,
      Number(classId),
      schoolId,
      Number(capacity)
    );
    res.status(201).json({ message: "Section created", data });
  }
async getByClass(req: Request, res: Response) {
  const schoolId = req.user.schoolId;
  const classId = req.query.classId ? Number(req.query.classId) : undefined;
  const data = await service.getSections(classId, schoolId);
  res.json({ data });
}
  async getAll(req: Request, res: Response) {
    const schoolId = req.user.schoolId;
    const classId = req.query.classId
      ? Number(req.query.classId)
      : undefined;
    const data = await service.getSections(classId, schoolId);
    res.json(data);
  }
async getOne(req: Request, res: Response) {
  const id = Number(req.params.id);
  const data = await service.getSectionById(id);
  res.json(data);
}
  async delete(req: Request, res: Response) {
    await service.deleteSection(Number(req.params.id));
    res.json({ message: "Section deleted" });
  }
  async update(req: Request, res: Response) {
  const id = Number(req.params.id);
  const data = req.body;

  const updated = await service.updateSection(id, data);
  res.json({ message: "Section updated", data: updated });
}

}
