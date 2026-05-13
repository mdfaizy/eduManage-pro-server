import { Request, Response } from "express";
import { ClassService } from "./class.service";

const service = new ClassService();

export class ClassController {

  // =========================================
  // CREATE CLASS
  // =========================================

  async create(
    req: Request,
    res: Response
  ) {

    try {

      const schoolId =
        req.user.schoolId;

      const {
        name,
        maxStudents,
        description,
      } = req.body;

      const data =
        await service.createClass(
          name,
          schoolId,

          maxStudents
            ? Number(maxStudents)
            : undefined,

          description
        );

      res.status(201).json({
        message: "Class created",
        data,
      });

    } catch (err: any) {

      res.status(400).json({
        message: err.message,
      });
    }
  }

  // =========================================
  // GET ALL CLASSES
  // =========================================

async getAll(
  req: Request,
  res: Response
) {

  try {

    const schoolId =
      req.user.schoolId;

    console.log(
      "SCHOOL ID =>",
      schoolId
    );

    const activeOnly =
      req.query.active === "true";

    const data =
      await service.getClasses(
        schoolId,
        activeOnly
      );

    console.log(
      "CLASS DATA =>",
      data
    );

    res.json(data);

  } catch (err: any) {

    console.log(
      "CLASS ERROR =>",
      err
    );

    res.status(400).json({
      message: err.message,
    });
  }
}

  // =========================================
  // GET SINGLE CLASS
  // =========================================

  async getOne(
    req: Request,
    res: Response
  ) {

    try {

      const schoolId =
        req.user.schoolId;

      const data =
        await service.getClassById(
          Number(req.params.id),
          schoolId
        );

      res.json(data);

    } catch (err: any) {

      res.status(400).json({
        message: err.message,
      });
    }
  }

  // =========================================
  // UPDATE CLASS
  // =========================================

  async update(
    req: Request,
    res: Response
  ) {

    try {

      const schoolId =
        req.user.schoolId;

      const {
        name,
        description,
        maxStudents,
        isActive,
      } = req.body;

      const data =
        await service.updateClass(
          Number(req.params.id),
          schoolId,
          {
            name,

            description,

            maxStudents:
              maxStudents
                ? Number(maxStudents)
                : undefined,

            isActive,
          }
        );

      res.json({
        message: "Class updated",
        data,
      });

    } catch (err: any) {

      res.status(400).json({
        message: err.message,
      });
    }
  }

  // =========================================
  // DELETE CLASS
  // =========================================

  async delete(
    req: Request,
    res: Response
  ) {

    try {

      const schoolId =
        req.user.schoolId;

      await service.deleteClass(
        Number(req.params.id),
        schoolId
      );

      res.json({
        message: "Class deleted",
      });

    } catch (err: any) {

      res.status(400).json({
        message: err.message,
      });
    }
  }
}