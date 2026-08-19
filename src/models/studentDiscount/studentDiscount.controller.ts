import {
  Request,
  Response,
} from "express";

import service from "./studentDiscount.service.js";

class StudentDiscountController {
  // =====================================
  // CREATE
  // =====================================

  async create(
    req: Request,
    res: Response
  ) {
    try {
      const schoolId =
        (req as any).user.schoolId;

      const data =
        await service.create({
          ...req.body,
          schoolId,
        });

      return res.status(201).json({
        success: true,
        message:
          "Student discount added successfully.",
        data,
      });
    } catch (e: any) {
      console.error(
        "Create Student Discount Error:",
        e
      );

      return res.status(400).json({
        success: false,
        message:
          e?.message ||
          "Failed to create student discount.",
      });
    }
  }

  // =====================================
// GET APPLICABLE FEE
// =====================================

async getApplicableFee(
  req: Request,
  res: Response
) {
  try {
    const schoolId =
      (req as any).user?.schoolId;

    if (!schoolId) {
      return res.status(401).json({
        success: false,
        message: "School ID not found.",
      });
    }

    const studentId =
      Number(req.query.studentId);

    const feeHeadId =
      Number(req.query.feeHeadId);

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message:
          "studentId is required.",
      });
    }

    if (!feeHeadId) {
      return res.status(400).json({
        success: false,
        message:
          "feeHeadId is required.",
      });
    }

    const data =
      await service.getApplicableFee(
        studentId,
        feeHeadId,
        schoolId
      );

    return res.status(200).json({
      success: true,
      data,
    });

  } catch (e: any) {
    console.error(
      "Get Applicable Fee Error:",
      e
    );

    return res.status(400).json({
      success: false,
      message:
        e?.message ||
        "Failed to get applicable fee.",
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
        (req as any).user.schoolId;

      const data =
        await service.getAll(
          schoolId
        );

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (e: any) {
      console.error(
        "Get Student Discounts Error:",
        e
      );

      return res.status(500).json({
        success: false,
        message:
          e?.message ||
          "Failed to fetch student discounts.",
      });
    }
  }

  // =====================================
  // GET ONE
  // =====================================

  async getOne(
    req: Request,
    res: Response
  ) {
    try {
      const schoolId =
        (req as any).user.schoolId;

      const id =
        Number(req.params.id);

      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid discount ID.",
        });
      }

      const data =
        await service.getOne(
          id,
          schoolId
        );

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (e: any) {
      console.error(
        "Get Student Discount Error:",
        e
      );

      return res.status(404).json({
        success: false,
        message:
          e?.message ||
          "Discount not found.",
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
        (req as any).user.schoolId;

      const id =
        Number(req.params.id);

      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid discount ID.",
        });
      }

      const data =
        await service.update(
          id,
          schoolId,
          req.body
        );

      return res.status(200).json({
        success: true,
        message:
          "Student discount updated successfully.",
        data,
      });
    } catch (e: any) {
      console.error(
        "Update Student Discount Error:",
        e
      );

      return res.status(400).json({
        success: false,
        message:
          e?.message ||
          "Failed to update student discount.",
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
        (req as any).user.schoolId;

      const id =
        Number(req.params.id);

      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid discount ID.",
        });
      }

      await service.delete(
        id,
        schoolId
      );

      return res.status(200).json({
        success: true,
        message:
          "Student discount deleted successfully.",
      });
    } catch (e: any) {
      console.error(
        "Delete Student Discount Error:",
        e
      );

      return res.status(400).json({
        success: false,
        message:
          e?.message ||
          "Failed to delete student discount.",
      });
    }
  }

  // =====================================
  // TOGGLE
  // =====================================

  async toggle(
    req: Request,
    res: Response
  ) {
    try {
      const schoolId =
        (req as any).user.schoolId;

      const id =
        Number(req.params.id);

      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid discount ID.",
        });
      }

      if (
        typeof req.body.isActive !==
        "boolean"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "isActive must be a boolean.",
        });
      }

      const data =
        await service.toggle(
          id,
          schoolId,
          req.body.isActive
        );

      return res.status(200).json({
        success: true,
        message:
          "Student discount status updated.",
        data,
      });
    } catch (e: any) {
      console.error(
        "Toggle Student Discount Error:",
        e
      );

      return res.status(400).json({
        success: false,
        message:
          e?.message ||
          "Failed to update student discount status.",
      });
    }
  }


  async getByStudent(
  req: Request,
  res: Response
) {
  try {
    const schoolId = Number(
      (req as any).user.schoolId
    );

    const studentId = Number(
      req.params.studentId
    );

    if (!Number.isInteger(studentId) || studentId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const data =
      await service.getByStudent(
        studentId,
        schoolId
      );

    return res.status(200).json({
      success: true,
      data,
    });

  } catch (error: any) {
    console.error(
      "Get Student Discount Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Failed to load student discounts",
    });
  }
}

// =====================================
// BULK UPDATE + CREATE
// =====================================

async bulkUpdate(
  req: Request,
  res: Response
) {
  try {
    const schoolId =
      Number(
        (req as any).user?.schoolId
      );

    const studentId =
      Number(req.body.studentId);

    const discounts =
      req.body.discounts;

    if (
      !Number.isInteger(studentId) ||
      studentId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid studentId is required.",
      });
    }

    if (!Array.isArray(discounts)) {
      return res.status(400).json({
        success: false,
        message:
          "discounts must be an array.",
      });
    }

    const data =
      await service.bulkUpdate(
        schoolId,
        studentId,
        discounts
      );

    return res.status(200).json({
      success: true,
      message:
        "Student discounts saved successfully.",
      data,
    });
  } catch (error: any) {
    console.error(
      "Bulk Student Discount Error:",
      error
    );

    return res.status(400).json({
      success: false,
      message:
        error?.message ||
        "Failed to save student discounts.",
    });
  }
}
}

export default new StudentDiscountController();