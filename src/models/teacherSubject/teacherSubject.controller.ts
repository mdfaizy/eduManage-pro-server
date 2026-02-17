// import { Request, Response } from "express";
// import { TeacherSubjectService } from "./teacherSubject.service";

// const service = new TeacherSubjectService();

// export class TeacherSubjectController {

//   async assign(req: Request, res: Response) {
//     const { teacherId, subjectId, classId ,sectionId} = req.body;

//     const data = await service.assign(
//       Number(teacherId),
//       Number(subjectId),
//       Number(classId),
//       Number(sectionId)
//     );

//     res.status(201).json({
//       message: "Teacher assigned to subject",
//       data,
//     });
//   }

//   async getByTeacher(req: Request, res: Response) {
//     const teacherId = Number(req.params.teacherId);
//     const data = await service.getTeacherSubjects(teacherId);

//     res.json({ data });
//   }

//   async remove(req: Request, res: Response) {
//     await service.remove(Number(req.params.id));
//     res.json({ message: "Assignment removed" });
//   }
// }


import { Request, Response } from "express";
import { TeacherSubjectService } from "./teacherSubject.service";

const service = new TeacherSubjectService();

export class TeacherSubjectController {

  async assign(req: Request, res: Response) {
    try {
      const teacherId = Number(req.body.teacherId);
      const subjectId = Number(req.body.subjectId);
      const classId = Number(req.body.classId);
      const sectionId = Number(req.body.sectionId);

      if (
        isNaN(teacherId) ||
        isNaN(subjectId) ||
        isNaN(classId) ||
        isNaN(sectionId)
      ) {
        return res.status(400).json({
          success: false,
          message: "All IDs must be valid numbers"
        });
      }

      const data = await service.assign(
        teacherId,
        subjectId,
        classId,
        sectionId
      );

      return res.status(201).json({
        success: true,
        message: "Teacher assigned to subject successfully",
        data
      });

    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getByTeacher(req: Request, res: Response) {
    try {
      const teacherId = Number(req.params.teacherId);

      if (isNaN(teacherId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid teacherId"
        });
      }

      const data = await service.getTeacherSubjects(teacherId);

      return res.json({
        success: true,
        data
      });

    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
async getAll(req: Request, res: Response) {
  try {
    const data = await service.getAll();

    return res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

  async remove(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid ID"
        });
      }

      await service.remove(id);

      return res.json({
        success: true,
        message: "Assignment removed successfully"
      });

    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}
