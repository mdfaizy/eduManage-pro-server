// controllers/report.controller.ts

import { Request, Response } from "express";
import { ReportService } from "./report.service";
import { FeeReportFilters } from "./report.types";

const reportService = new ReportService();

export class ReportController {
  // =====================================================
  // GET FULL REPORT
  // =====================================================

  static async getReport(req: Request, res: Response) {
    try {
      const filters: FeeReportFilters = {
        schoolId: parseInt(req.query.schoolId as string),
        academicYearId: req.query.academicYearId ? parseInt(req.query.academicYearId as string) : undefined,
        classId: req.query.classId ? parseInt(req.query.classId as string) : undefined,
        studentId: req.query.studentId ? parseInt(req.query.studentId as string) : undefined,
        feeHeadId: req.query.feeHeadId ? parseInt(req.query.feeHeadId as string) : undefined,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        status: req.query.status as any,
        paymentMethod: req.query.paymentMethod as any,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      };

      const report = await reportService.getReport(filters);
      res.json({
        success: true,
        data: report,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // =====================================================
  // GET SUMMARY
  // =====================================================

  static async getSummary(req: Request, res: Response) {
    try {
      const filters: FeeReportFilters = {
        schoolId: parseInt(req.query.schoolId as string),
        academicYearId: req.query.academicYearId ? parseInt(req.query.academicYearId as string) : undefined,
        classId: req.query.classId ? parseInt(req.query.classId as string) : undefined,
        studentId: req.query.studentId ? parseInt(req.query.studentId as string) : undefined,
      };

      const summary = await reportService.getSummary(filters);
      res.json({
        success: true,
        data: summary,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // =====================================================
  // GET CLASS WISE
  // =====================================================

  static async getClassWise(req: Request, res: Response) {
    try {
      const filters: FeeReportFilters = {
        schoolId: parseInt(req.query.schoolId as string),
        academicYearId: req.query.academicYearId ? parseInt(req.query.academicYearId as string) : undefined,
      };

      const data = await reportService.getClassWise(filters);
      res.json({
        success: true,
        data,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // =====================================================
  // GET FEE HEAD WISE
  // =====================================================

  static async getFeeHeadWise(req: Request, res: Response) {
    try {
      const filters: FeeReportFilters = {
        schoolId: parseInt(req.query.schoolId as string),
        academicYearId: req.query.academicYearId ? parseInt(req.query.academicYearId as string) : undefined,
        classId: req.query.classId ? parseInt(req.query.classId as string) : undefined,
      };

      const data = await reportService.getFeeHeadWise(filters);
      res.json({
        success: true,
        data,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // =====================================================
  // GET MONTHLY COLLECTION
  // =====================================================

  static async getMonthlyCollection(req: Request, res: Response) {
    try {
      const filters: FeeReportFilters = {
        schoolId: parseInt(req.query.schoolId as string),
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
      };

      const data = await reportService.getMonthlyCollection(filters);
      res.json({
        success: true,
        data,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // =====================================================
  // GET STUDENT REPORTS
  // =====================================================

  static async getStudentReports(req: Request, res: Response) {
    try {
      const filters: FeeReportFilters = {
        schoolId: parseInt(req.query.schoolId as string),
        academicYearId: req.query.academicYearId ? parseInt(req.query.academicYearId as string) : undefined,
        classId: req.query.classId ? parseInt(req.query.classId as string) : undefined,
        studentId: req.query.studentId ? parseInt(req.query.studentId as string) : undefined,
        status: req.query.status as any,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      };

      const data = await reportService.getStudentReports(filters);
      res.json({
        success: true,
        data,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // =====================================================
  // GET PAYMENT HISTORY
  // =====================================================

  static async getPaymentHistory(req: Request, res: Response) {
    try {
      const filters: FeeReportFilters = {
        schoolId: parseInt(req.query.schoolId as string),
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        paymentMethod: req.query.paymentMethod as any,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      };

      const data = await reportService.getPaymentHistory(filters);
      res.json({
        success: true,
        data,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // =====================================================
  // EXPORT EXCEL
  // =====================================================

  static async exportExcel(req: Request, res: Response) {
    try {
      const filters: FeeReportFilters = {
        schoolId: parseInt(req.query.schoolId as string),
        academicYearId: req.query.academicYearId ? parseInt(req.query.academicYearId as string) : undefined,
        classId: req.query.classId ? parseInt(req.query.classId as string) : undefined,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        status: req.query.status as any,
        paymentMethod: req.query.paymentMethod as any,
      };

      const excelBuffer = await reportService.exportToExcel(filters);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=fee-report-${Date.now()}.xlsx`);
      res.send(excelBuffer);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // =====================================================
  // EXPORT CSV
  // =====================================================

  static async exportCSV(req: Request, res: Response) {
    try {
      const filters: FeeReportFilters = {
        schoolId: parseInt(req.query.schoolId as string),
        academicYearId: req.query.academicYearId ? parseInt(req.query.academicYearId as string) : undefined,
        classId: req.query.classId ? parseInt(req.query.classId as string) : undefined,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        status: req.query.status as any,
        paymentMethod: req.query.paymentMethod as any,
      };

      const csvData = await reportService.exportToCSV(filters);

      const headers = Array.from(
        new Set(csvData.flatMap((row: any) => Object.keys(row)))
      );
      const csvRows = [
        headers.join(','),
        ...csvData.map((row: any) =>
          headers.map(h => `"${row[h] !== undefined && row[h] !== null ? row[h] : ''}"`).join(',')
        )
      ];
      const csvString = csvRows.join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=fee-report-${Date.now()}.csv`);
      res.send(csvString);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // =====================================================
  // GENERATE PDF
  // =====================================================

  static async generatePDF(req: Request, res: Response) {
    try {
      const filters: FeeReportFilters = {
        schoolId: parseInt(req.query.schoolId as string),
        academicYearId: req.query.academicYearId ? parseInt(req.query.academicYearId as string) : undefined,
        classId: req.query.classId ? parseInt(req.query.classId as string) : undefined,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        status: req.query.status as any,
        paymentMethod: req.query.paymentMethod as any,
      };

      const result = await reportService.generatePDF(filters);

      res.setHeader('Content-Type', 'text/html');
      res.send(result.html);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}