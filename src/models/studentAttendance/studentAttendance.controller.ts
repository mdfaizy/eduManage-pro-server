// studentAttendance.controller.ts

import { Request, Response }
from "express";

import StudentAttendanceService
from "./studentAttendance.service.js";

export class StudentAttendanceController {

  private service =
    StudentAttendanceService;

  // =====================================================
  // GET STUDENTS
  // =====================================================

  async getStudents(
    req: Request,
    res: Response
  ) {

    try {

      const schoolId =
        (req as any).user.schoolId;

      const {

        classId,

        sectionId,

      } = req.query;

      const data =
        await this.service
          .getStudents(

            schoolId,

            Number(classId),

            sectionId
              ? Number(sectionId)
              : undefined
          );

      res.json({

        success: true,

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
  // MARK ATTENDANCE
  // =====================================================

  async markAttendance(
    req: Request,
    res: Response
  ) {

    try {

      const schoolId =
        (req as any).user.schoolId;
 console.log(
  "USER =>",
  (req as any).user
);
     const markedById =
  (req as any).user.userId;

      const data =
        await this.service
          .markAttendance(

            req.body,

            schoolId,

            markedById
          );

      res.json(data);

    } catch (e: any) {

      res.status(400).json({

        success: false,

        message:
          e.message,
      });
    }
  }

  // =====================================================
  // DAILY ATTENDANCE
  // =====================================================

async dailyAttendance(
  req: Request,
  res: Response
) {

  try {

    const schoolId =
      (req as any).user.schoolId;

    const {

      attendanceDate,

      classId,

      sectionId,

    } = req.query;

    // =====================================
    // VALIDATION
    // =====================================

    if (!attendanceDate) {

      return res.status(400).json({

        success: false,

        message:
          "attendanceDate is required",
      });
    }

    // =====================================
    // GET DATA
    // =====================================

    const data =
      await this.service
        .getDailyAttendance(

          schoolId,

          new Date(
            String(
              attendanceDate
            )
          ),

          classId
            ? Number(classId)
            : undefined,

          sectionId
            ? Number(sectionId)
            : undefined
        );

    // =====================================
    // RESPONSE
    // =====================================

    res.json({

      success: true,

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
  async updateAttendance(
  req: Request,
  res: Response
) {

  try {

    const data =
      await this.service
        .updateAttendance(
          req.body
        );

    res.json({

      success: true,

      message:
        "Attendance updated successfully",

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
  // MONTHLY REPORT
  // =====================================================

//  async monthlyReport(
//   req: Request,
//   res: Response
// ) {

//   try {

//     const schoolId =
//       (req as any).user.schoolId;

//     const {

//       month,

//       classId,

//       sectionId,

//     } = req.query;

//     // =====================================
//     // VALIDATION
//     // =====================================

//     if (!month) {

//       return res.status(400).json({

//         success: false,

//         message:
//           "month is required",
//       });
//     }

//     // =====================================
//     // GET REPORT
//     // =====================================

//     const data =
//       await this.service
//         .monthlyReport(

//           schoolId,

//           String(month),

//           classId
//             ? Number(classId)
//             : undefined,

//           sectionId
//             ? Number(sectionId)
//             : undefined
//         );

//     // =====================================
//     // RESPONSE
//     // =====================================

//     res.json({

//       success: true,

//       data,
//     });

//   } catch (e: any) {

//     res.status(400).json({

//       success: false,

//       message:
//         e.message,
//     });
//   }
// }
async monthlyReport(
  req: Request,
  res: Response
) {

  try {

    const schoolId =
      (req as any).user.schoolId;

    const {

      startDate,

      endDate,

      classId,

      sectionId,

    } = req.query;

    // =====================================
    // VALIDATION
    // =====================================

    if (
      !startDate ||

      !endDate
    ) {

      return res.status(400).json({

        success: false,

        message:
          "startDate and endDate are required",
      });
    }

    // =====================================
    // GET REPORT
    // =====================================

    const data =
      await this.service
        .monthlyReport(

          schoolId,

          String(startDate),

          String(endDate),

          classId
            ? Number(classId)
            : undefined,

        sectionId !== undefined &&
sectionId !== null &&
sectionId !== ""
  ? Number(sectionId)
  : undefined
        );

    // =====================================
    // RESPONSE
    // =====================================

    res.json({

      success: true,

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
  // STUDENT REPORT
  // =====================================================

  async studentReport(
    req: Request,
    res: Response
  ) {

    try {

      const schoolId =
        (req as any).user.schoolId;

      const studentId =
        Number(
          req.params.studentId
        );

      const data =
        await this.service
          .studentReport(

            schoolId,

            studentId
          );

      res.json({

        success: true,

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
  // CLASS REPORT
  // =====================================================

  async classReport(
    req: Request,
    res: Response
  ) {

    try {

      const schoolId =
        (req as any).user.schoolId;

      const classId =
        Number(
          req.query.classId
        );

      const data =
        await this.service
          .classReport(

            schoolId,

            classId
          );

      res.json({

        success: true,

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
  // STATS
  // =====================================================

  // async stats(
  //   req: Request,
  //   res: Response
  // ) {

  //   try {

  //     const schoolId =
  //       (req as any).user.schoolId;

  //     const data =
  //       await this.service
  //         .stats(schoolId);

  //     res.json({

  //       success: true,

  //       data,
  //     });

  //   } catch (e: any) {

  //     res.status(400).json({

  //       success: false,

  //       message:
  //         e.message,
  //     });
  //   }
  // }

  async stats(
  req: Request,
  res: Response
) {

  try {

    const schoolId =
      (req as any).user.schoolId;

    const {
      startDate,
      endDate,
      classId,
      sectionId,
    } = req.query;

    const data =
      await this.service.stats(

        schoolId,

        startDate
          ? String(startDate)
          : undefined,

        endDate
          ? String(endDate)
          : undefined,

        classId
          ? Number(classId)
          : undefined,

        sectionId
          ? Number(sectionId)
          : undefined
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
  // LOCK ATTENDANCE
  // =====================================================

  async lockAttendance(
    req: Request,
    res: Response
  ) {

    try {

      const sessionId =
        Number(
          req.params.sessionId
        );

      const data =
        await this.service
          .lockAttendance(
            sessionId
          );

      res.json({

        success: true,

        message:
          "Attendance locked successfully",

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
new StudentAttendanceController();