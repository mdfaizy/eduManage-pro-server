import { Router } from "express";

import {
  ReportsController,
} from "./reports.controller";

import {
  authMiddleware,
} from "../../middlewares/auth";

const router =
  Router();

// =====================================================
// AUTHENTICATION
// =====================================================

router.use(authMiddleware);

// =====================================================
// PAYMENT REPORT
// =====================================================

router.get(
  "/payment",
  ReportsController.getPaymentReport
);

export default router;