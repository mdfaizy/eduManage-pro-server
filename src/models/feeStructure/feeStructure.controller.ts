import {
  Request,
  Response,
} from "express";

import service
from "./feeStructure.service.js";

class FeeStructureController {

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
        await service.create({

          ...req.body,

          schoolId,
        });

      res.status(201).json({

        success: true,

        message:
          "Fee structure created successfully",

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
        await service.getAll(
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
}

export default
new FeeStructureController();