import { Request, Response } from "express";
import { GradeService } from "./grade.service";

const service = new GradeService();

export class GradeController {

  async create(req: Request, res: Response) {
    try {
      const schoolId = req.user.schoolId;
      const { name, description } = req.body;

const data = await service.createGrade(
  name,
  description,
  schoolId
);


      res.status(201).json({ message: "Grade created", data });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  // async getAll(req: Request, res: Response) {
  //   const schoolId = req.user.schoolId;
  //   const data = await service.getGrades(schoolId);
  //   res.json({ data });
  // }

  async getAll(req: Request, res: Response) {
    const schoolId = req.user.schoolId;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string | undefined;

    const result = await service.getGradesPaginated(
      schoolId,
      page,
      limit,
      search
    );

    res.json(result);
  }

async getById(req: Request, res: Response) {
    try {
      const schoolId = req.user.schoolId;
      const id = Number(req.params.id);

      const data = await service.getGradeById(id, schoolId);
      res.json({ data });
    } catch (err: any) {
      res.status(404).json({ message: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const schoolId = req.user.schoolId;
      const id = Number(req.params.id);
      const { name, description } = req.body;

      const data = await service.updateGrade(
        id,
        schoolId,
        name,
        description
      );

      res.json({ message: "Grade updated", data });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  async toggle(req: Request, res: Response) {
    try {
      const schoolId = req.user.schoolId;
      const id = Number(req.params.id);

      const data = await service.toggleGrade(id, schoolId);
      res.json({ message: "Grade status updated", data });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
  async delete(req: Request, res: Response) {
    await service.deleteGrade(Number(req.params.id));
    res.json({ message: "Grade deleted" });
  }
}
