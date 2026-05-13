import {
  Request,
  Response,
} from "express";

import service
from "./feeHead.service";

class FeeHeadController {

  // =====================================
  // CREATE
  // =====================================

  async create(
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
          .create({

            ...req.body,

            schoolId,
          });

      res.status(201)
        .json({

          success: true,

          message:
            "Fee head created successfully",

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
new FeeHeadController();