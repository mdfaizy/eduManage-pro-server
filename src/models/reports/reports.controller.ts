import { Request, Response } from "express";
import {
  ReportsService,
} from "./reports.service";

export class ReportsController {
  // =====================================================
  // PAYMENT REPORT
  // =====================================================

  static async getPaymentReport(
    req: Request,
    res: Response
  ) {
    try {
      // -------------------------------------------------
      // SCHOOL ID
      // -------------------------------------------------

      const schoolId =
        Number(
          (req as any).user?.schoolId
        );

      if (!schoolId) {
        return res.status(401).json({
          success: false,
          message:
            "School authentication required",
        });
      }

      // -------------------------------------------------
      // QUERY
      // -------------------------------------------------

      const {
        classId,
        sectionId,
        academicYearId,
        startDate,
        endDate,
      } = req.query;

      const query = {
        classId: classId
          ? Number(classId)
          : undefined,

        sectionId: sectionId
          ? Number(sectionId)
          : undefined,

        academicYearId:
          academicYearId
            ? Number(
                academicYearId
              )
            : undefined,

        startDate:
          startDate
            ? String(startDate)
            : undefined,

        endDate:
          endDate
            ? String(endDate)
            : undefined,
      };

      // -------------------------------------------------
      // DEBUG
      // -------------------------------------------------

      console.log(
        "================================="
      );

      console.log(
        "PAYMENT REPORT CONTROLLER"
      );

      console.log(
        "SCHOOL ID:",
        schoolId
      );

      console.log(
        "QUERY:",
        query
      );

      console.log(
        "================================="
      );

      // -------------------------------------------------
      // SERVICE
      // -------------------------------------------------

      const report =
        await ReportsService
          .getPaymentReport(
            schoolId,
            query
          );

      // -------------------------------------------------
      // RESPONSE
      // -------------------------------------------------

      return res.status(200).json({
        success: true,

        data: report,
      });
    } catch (error: any) {
      console.error(
        "Payment Report Error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          error?.message ||
          "Failed to generate payment report",
      });
    }
  }
}