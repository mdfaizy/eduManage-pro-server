// =====================================================
// exam.controller.ts
// =====================================================

import { Request, Response }
from "express";

import ExamService
from "./exam.service.js";

export class ExamController {

  // =====================================================
  // CREATE EXAM
  // =====================================================

  async create(
    req: Request,
    res: Response
  ) {

    try {

      const schoolId =
        (req as any).user.schoolId;

      const data =
        await ExamService
          .create({

            ...req.body,

            schoolId,
          });

      res.status(201).json({

        success: true,

        message:
          "Exam created successfully",

        data,
      });

    } catch (e: any) {

      res.status(400).json({

        success: false,

        message:
          e.message,
      });
    }
  }

  // =====================================================
  // GET ALL
  // =====================================================

  async getAll(
    req: Request,
    res: Response
  ) {

    try {

      const schoolId =
        (req as any).user.schoolId;

      const data =
        await ExamService
          .getAll(
            schoolId
          );

      res.json({

        success: true,

        data,
      });

    } catch (e: any) {

      res.status(500).json({

        success: false,

        message:
          e.message,
      });
    }
  }

  // =====================================================
  // GET BY ID
  // =====================================================

  async getById(
    req: Request,
    res: Response
  ) {

    try {

      const schoolId =
        (req as any).user.schoolId;

      const id =
        Number(req.params.id);

      const data =
        await ExamService
          .getById(
            id,
            schoolId
          );

      res.json({

        success: true,

        data,
      });

    } catch (e: any) {

      res.status(500).json({

        success: false,

        message:
          e.message,
      });
    }
  }

  // =====================================================
  // UPDATE
  // =====================================================

  async update(
    req: Request,
    res: Response
  ) {

    try {

      const schoolId =
        (req as any).user.schoolId;

      const id =
        Number(req.params.id);

      const data =
        await ExamService
          .update(

            id,

            schoolId,

            req.body
          );

      res.json({

        success: true,

        message:
          "Exam updated successfully",

        data,
      });

    } catch (e: any) {

      res.status(400).json({

        success: false,

        message:
          e.message,
      });
    }
  }

  // =====================================================
  // DELETE
  // =====================================================

  async delete(
    req: Request,
    res: Response
  ) {

    try {

      const schoolId =
        (req as any).user.schoolId;

      const id =
        Number(req.params.id);

      await ExamService
        .delete(
          id,
          schoolId
        );

      res.json({

        success: true,

        message:
          "Exam deleted successfully",
      });

    } catch (e: any) {

      res.status(400).json({

        success: false,

        message:
          e.message,
      });
    }
  }

  // =====================================================
  // ADD SUBJECT
  // =====================================================

  async addSubject(
    req: Request,
    res: Response
  ) {

    try {

      const data =
        await ExamService
          .addSubject(
            req.body
          );

      res.json({

        success: true,

        message:
          "Subject added successfully",

        data,
      });

    } catch (e: any) {

      res.status(400).json({

        success: false,

        message:
          e.message,
      });
    }
  }

  // =====================================================
  // ENTER MARKS
  // =====================================================

  async enterMarks(
    req: Request,
    res: Response
  ) {

    try {

      const data =
        await ExamService
          .enterMarks(
            req.body
          );

      res.json({

        success: true,

        message:
          "Marks saved successfully",

        data,
      });

    } catch (e: any) {

      res.status(400).json({

        success: false,

        message:
          e.message,
      });
    }
  }
}

export default
new ExamController();