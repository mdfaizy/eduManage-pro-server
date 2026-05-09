import { Request, Response }
from "express";

import StudentAcademicRecordService
from "./studentAcademicRecord.service.js";

export class StudentAcademicRecordController {

  private service =
    StudentAcademicRecordService;

  // =====================================================
  // CURRENT
  // =====================================================

  async current(
    req: Request,
    res: Response
  ) {

    try {

      const studentId =
        Number(req.params.studentId);

      const data =
        await this.service
          .getCurrentRecord(
            studentId
          );

      res.json({

        success: true,

        data,
      });

    } catch (e: any) {

      res.status(404).json({

        success: false,

        message: e.message,
      });
    }
  }

// =====================================================
// GET PROMOTION STUDENTS
// =====================================================

async getPromotionStudents(
  req: Request,
  res: Response
) {

  try {

    const schoolId =
      (req as any).user.schoolId;

    const {
      academicYearId,
      classId,
      sectionId,
    } = req.query;

    const data =
      await this.service
        .getPromotionStudents(

          Number(academicYearId),

          Number(classId),

          sectionId
            ? Number(sectionId)
            : undefined,

          schoolId
        );

    res.json({
      success: true,
      data,
    });

  } catch (e: any) {

    res.status(400).json({
      success: false,
      message: e.message,
    });
  }
}

// =====================================================
// BULK PROMOTE
// =====================================================

async bulkPromote(
  req: Request,
  res: Response
) {

  try {

    const schoolId =
      (req as any).user.schoolId;

    const data =
      await this.service
        .bulkPromoteStudents(
          req.body,
          schoolId
        );

    res.json({

      success: true,

      message:
        "Students promoted successfully",

      data,
    });

  } catch (e: any) {

    res.status(400).json({

      success: false,

      message: e.message,
    });
  }
}


  // =====================================================
  // HISTORY
  // =====================================================

  async history(
    req: Request,
    res: Response
  ) {

    try {

      const studentId =
        Number(req.params.studentId);

      const data =
        await this.service
          .getHistory(
            studentId
          );

      res.json({

        success: true,

        data,
      });

    } catch (e: any) {

      res.status(400).json({

        success: false,

        message: e.message,
      });
    }
  }

  // =====================================================
  // PROMOTE
  // =====================================================

  async promote(
    req: Request,
    res: Response
  ) {

    try {

      const schoolId =
        (req as any).user.schoolId;

      const data =
        await this.service
          .promoteStudent(
            req.body,
            schoolId
          );

      res.json({

        success: true,

        data,
      });

    } catch (e: any) {

      res.status(400).json({

        success: false,

        message: e.message,
      });
    }
  }

  async getAllRecords(
  req: Request,
  res: Response
) {

  try {

    const schoolId =
      (req as any).user.schoolId;

    const data =
      await this.service.getAllRecords(
        schoolId
      );

    res.json({

      success: true,

      data,
    });

  } catch (e: any) {

    res.status(400).json({

      success: false,

      message: e.message,
    });
  }
}
}

export default new StudentAcademicRecordController();