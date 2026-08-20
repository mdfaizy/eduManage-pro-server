import {
  Request,
  Response,
} from "express";

import service from "./lateFeeWaiver.service.js";

class LateFeeWaiverController {

  // ==========================================
  // CREATE WAIVER
  // ==========================================

async create(
  req: Request,
  res: Response
) {
  try {

    const schoolId =
      Number(
        (req as any).user?.schoolId
      );

    const waivedBy =
      Number(
        (req as any).user?.userId
      );

    const studentFeeId =
      Number(
        req.body.studentFeeId
      );

    const amount =
      Number(
        req.body.amount
      );

    const reason =
      req.body.reason;

    if (
      !schoolId ||
      !waivedBy
    ) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const data =
      await service.create(
        schoolId,
        studentFeeId,
        amount,
        reason,
        waivedBy
      );

    return res.status(201).json({
      success: true,
      message:
        "Late fee waived successfully",
      data,
    });

  } catch (error: any) {

    console.error(
      "Late Fee Waiver Error:",
      error
    );

    return res.status(400).json({
      success: false,
      message:
        error?.message ||
        "Failed to waive late fee",
    });
  }
}
  // ==========================================
  // GET ALL
  // ==========================================

  async getAll(
    req: Request,
    res: Response
  ) {

    try {

      const schoolId =
        Number(
          (req as any).user?.schoolId
        );

      if (!schoolId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const data =
        await service.getAll(
          schoolId
        );

      return res.status(200).json({
        success: true,
        data,
      });

    } catch (error: any) {

      return res.status(500).json({
        success: false,
        message:
          error?.message ||
          "Failed to fetch late fee waivers",
      });
    }
  }

  // ==========================================
  // GET BY STUDENT FEE
  // ==========================================

  async getByStudentFee(
    req: Request,
    res: Response
  ) {

    try {

      const schoolId =
        Number(
          (req as any).user?.schoolId
        );

      const studentFeeId =
        Number(
          req.params.studentFeeId
        );

      if (!schoolId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (
        !Number.isInteger(
          studentFeeId
        ) ||
        studentFeeId <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid student fee ID",
        });
      }

      const data =
        await service.getByStudentFee(
          studentFeeId,
          schoolId
        );

      return res.status(200).json({
        success: true,
        data,
      });

    } catch (error: any) {

      return res.status(400).json({
        success: false,
        message:
          error?.message ||
          "Failed to fetch late fee waivers",
      });
    }
  }
}

export default new LateFeeWaiverController();