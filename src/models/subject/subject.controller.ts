import { Request, Response } from "express";
import { SubjectService } from "./subject.service";

const service = new SubjectService();

export class SubjectController {

  // async create(req: Request, res: Response) {
  //   const { name, classId, schoolId } = req.body;

  //   const data = await service.createSubject(
  //     name,
  //     Number(classId),
  //     Number(schoolId)
  //   );

  //   res.status(201).json({
  //     message: "Subject created successfully",
  //     data,
  //   });
  // }

  async create(req: Request, res: Response) {
  try {
    const { name, classId, description } = req.body;
    const schoolId = req.user.schoolId;   // 🔥 FROM TOKEN

    const data = await service.createSubject(
      name,
      Number(classId),
      schoolId,
      description
    );

    res.status(201).json({
      message: "Subject created successfully",
      data,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

// async getAll(req: Request, res: Response) {
//   const schoolId = req.user.schoolId;  // 🏫 only own school
//   const data = await service.getAllSubjects(schoolId);
//   res.json({ data });
// }

async getAll(req: Request, res: Response) {
  const { role, schoolId } = req.user;

  const data =
    role === "SUPER_ADMIN"
      ? await service.getAllSubjects()
      : await service.getAllSubjects(schoolId);

  res.json({ data });
}

async update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { name, description } = req.body;
    const schoolId = req.user.schoolId;

    const data = await service.updateSubject(id, schoolId, name, description);

    res.json({ message: "Subject updated", data });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

async getByClass(req: Request, res: Response) {
  const classId = Number(req.query.classId);
  const schoolId = req.user.schoolId;   // 🔥 TOKEN

  if (!classId) {
    return res.status(400).json({ message: "classId query param required" });
  }

  const data = await service.getSubjects(classId, schoolId);

  res.json({ data });
}






  // async getByClass(req: Request, res: Response) {
  //   const classId = Number(req.query.classId);
  //   const data = await service.getSubjects(classId);

  //   res.json({ data });
  // }
//   async getByClass(req: Request, res: Response) {
//   const classId = Number(req.query.classId);

//   if (!classId) {
//     return res.status(400).json({ message: "classId query param required" });
//   }

//   const data = await service.getSubjects(classId);
//   res.json({ data });
// }


  async delete(req: Request, res: Response) {
    await service.deleteSubject(Number(req.params.id));
    res.json({ message: "Subject deleted" });
  }
}
