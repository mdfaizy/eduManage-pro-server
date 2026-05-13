// =====================================================
// studentFee.controller.ts
// models/studentFee/studentFee.controller.ts
// =====================================================

import {
  Request,
  Response,
} from "express";

import service
from "./studentFee.service";

class StudentFeeController {

  // =====================================
  // GENERATE
  // =====================================

  async generate(
    req: Request,
    res: Response
  ) {

    try {

      const schoolId =
        (req as any)
          .user
          .schoolId;

      const data =
        await service
          .generate({

            ...req.body,

            schoolId,

            dueDate:
              new Date(
                req.body
                  .dueDate
              ),
          });

      res.status(201)
        .json({

          success: true,

          message:
            "Student fee generated",

          data,
        });

    } catch (e: any) {

      res.status(400)
        .json({

          success: false,

          message:
            e.message,
        });
    }
  }

  // =====================================
  // PAY FEE
  // =====================================

  async payFee(
    req: Request,
    res: Response
  ) {

    try {

      const schoolId =
        (req as any)
          .user
          .schoolId;

      const data =
        await service
          .payFee({

            ...req.body,

            schoolId,
          });

      res.json({

        success: true,

        message:
          "Fee paid successfully",

        data,
      });

    } catch (e: any) {

      res.status(400)
        .json({

          success: false,

          message:
            e.message,
        });
    }
  }

  // =====================================
  // GET ALL
  // =====================================

  async getAll(
    req: Request,
    res: Response
  ) {

    try {

      const schoolId =
        (req as any)
          .user
          .schoolId;

      const data =
        await service
          .getAll(
            schoolId
          );

      res.json({

        success: true,

        data,
      });

    } catch (e: any) {

      res.status(500)
        .json({

          success: false,

          message:
            e.message,
        });
    }
  }

  // =====================================
  // STUDENT HISTORY
  // =====================================

  async getStudentHistory(
    req: Request,
    res: Response
  ) {

    try {

      const studentId =
        Number(
          req.params
            .studentId
        );

      const data =
        await service
          .getStudentHistory(
            studentId
          );

      res.json({

        success: true,

        data,
      });

    } catch (e: any) {

      res.status(500)
        .json({

          success: false,

          message:
            e.message,
        });
    }
  }

  // =====================================
  // DUE FEES
  // =====================================

  async getDueFees(
    req: Request,
    res: Response
  ) {

    try {

      const schoolId =
        (req as any)
          .user
          .schoolId;

      const data =
        await service
          .getDueFees(
            schoolId
          );

      res.json({

        success: true,

        data,
      });

    } catch (e: any) {

      res.status(500)
        .json({

          success: false,

          message:
            e.message,
        });
    }
  }
}

export default
new StudentFeeController();