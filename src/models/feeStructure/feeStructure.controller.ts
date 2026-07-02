import {Request,Response,} from "express";
import service from "./feeStructure.service.js";
class FeeStructureController {
  // =====================================
  // CREATE
  // =====================================
  async create(req: Request,
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

  // =====================================
  // UPDATE
  // =====================================

async update(
  req: Request,
  res: Response
) {

  try {

    const schoolId =
      (req as any)
        .user
        .schoolId;

    const data =
      await service.update(

        Number(
          req.params.id
        ),

        schoolId,

        req.body
      );

    res.json({

      success: true,

      message:
        "Fee structure updated successfully",

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

  // =====================================
  // DELETE
  // =====================================

async delete(
  req: Request,
  res: Response
) {

  try {

    const schoolId =
      (req as any)
        .user
        .schoolId;

    await service.delete(

      Number(
        req.params.id
      ),

      schoolId
    );

    res.json({

      success: true,

      message:
        "Fee structure deleted successfully",
    });

  } catch (e: any) {

    res.status(400).json({

      success: false,

      message:
        e.message,
    });
  }
}

async getOne(
  req: Request,
  res: Response
) {

  try {

    const schoolId =
      (req as any)
        .user
        .schoolId;

    const data =
      await service.getOne(

        Number(
          req.params.id
        ),

        schoolId
      );

    res.status(200).json({

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

  // =====================================
  // TOGGLE STATUS
  // =====================================

async toggle(
  req: Request,
  res: Response
) {

  try {

    const schoolId =
      (req as any)
        .user
        .schoolId;

    const data =
      await service.toggle(

        Number(
          req.params.id
        ),

        schoolId,

        req.body.isActive
      );

    res.status(200).json({

      success: true,

      message:
        "Fee structure status updated",

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
new FeeStructureController();