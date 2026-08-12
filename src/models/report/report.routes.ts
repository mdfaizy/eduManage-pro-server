// routes/report.routes.ts

import { Router } from "express";
import { ReportController } from "./report.controller";
import { authMiddleware } from "../../middlewares/auth";
import { authorizePermissions } from "../../middlewares/permission.middleware";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// =====================================================
// REPORT ROUTES
// =====================================================

// GET - Full Report
router.get(
  "/",
  ReportController.getReport
);

// GET - Summary
router.get(
  "/summary",
  ReportController.getSummary
);

// GET - Class Wise Collection
router.get(
  "/class-wise",
  ReportController.getClassWise
);

// GET - Fee Head Wise Collection
router.get(
  "/fee-head-wise",
  ReportController.getFeeHeadWise
);

// GET - Monthly Collection
router.get(
  "/monthly",
  ReportController.getMonthlyCollection
);

// GET - Student Reports
router.get(
  "/students",
  ReportController.getStudentReports
);

// GET - Payment History
router.get(
  "/payments",
  authMiddleware,
  // authorizePermissions(["VIEW_REPORT"]),
  ReportController.getPaymentHistory
);

// =====================================================
// EXPORT ROUTES
// =====================================================

// GET - Export Excel
router.get(
  "/export/excel",
  // authorizePermissions(["EXPORT_REPORT"]),
  authMiddleware, 
  ReportController.exportExcel
);

// GET - Export CSV
router.get(
  "/export/csv",
  authorizePermissions(["EXPORT_REPORT"]),
  ReportController.exportCSV
);

// GET - Generate PDF
router.get(
  "/export/pdf",
  authorizePermissions(["EXPORT_REPORT"]),
  ReportController.generatePDF
);

export default router;
