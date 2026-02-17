import { Request, Response } from "express";
import { ClassTeacherService } from "./classTeacher.service";

const service = new ClassTeacherService();

export class ClassTeacherController {
  

  async assign(req: Request, res: Response) {
    // const { teacherId, classId, sectionId } = req.body;
      const teacherId = Number(req.body.teacherId);
    const classId = Number(req.body.classId);
    const sectionId = Number(req.body.sectionId);

    if (
      isNaN(teacherId) ||
      isNaN(classId) ||
      isNaN(sectionId)
    ) {
      return res.status(400).json({
        success: false,
        message: "All IDs must be valid numbers"
      });
    }

    const data = await service.assign(
      Number(teacherId),
      Number(classId),
      Number(sectionId)
    );

    res.status(201).json({ message: "Class teacher assigned", data });
  }

  // async get(req: Request, res: Response) {
  //   // const { classId, sectionId } = req.query;
  //   const classId = Number(req.query.classId);
  //   const sectionId = Number(req.query.sectionId);

  //   if (isNaN(classId) || isNaN(sectionId)) {
  //     return res.status(400).json({
  //       success: false,
  //       message: "classId and sectionId are required and must be valid numbers"
  //     });
  //   }

  //   const data = await service.get(
  //     Number(classId),
  //     Number(sectionId)
  //   );

  //   res.json({ data });
  // }

  async get(req: Request, res: Response) {
  try {
    const data = await service.getAll();

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
    await service.remove(Number(req.params.id));
    res.json({ message: "Assignment removed" });
  }
}
