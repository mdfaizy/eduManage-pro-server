import {
  Request,
  Response,
} from "express";

import service
from "./studentFee.service";

class StudentFeeController {

  // =====================================
  // GENERATE FEE
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
            "Fee generated successfully",

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

      const receivedById =
        (req as any)
          .user
          .id;

      const data =
        await service
          .payFee({

            ...req.body,

            schoolId,

            receivedById,
          });

      res.status(200)
        .json({

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
  // GET ALL FEES
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

      res.status(200)
        .json({

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
  // GET STUDENT HISTORY
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

      res.status(200)
        .json({

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
  // GET DUE FEES
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

      res.status(200)
        .json({

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