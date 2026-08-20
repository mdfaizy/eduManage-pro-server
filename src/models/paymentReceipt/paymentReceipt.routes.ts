import { Router } from "express";

import {
  authMiddleware,
} from "../../middlewares/auth";

import controller
  from "./paymentReceipt.controller.js";

const router = Router();

// =====================================================
// AUTH
// =====================================================

router.use(authMiddleware);

// =====================================================
// CREATE RECEIPT
// POST /payment-receipts
// =====================================================

router.post(
  "/",
  controller.create
);

// =====================================================
// GET BY RECEIPT NUMBER
// GET /payment-receipts/receipt/RCP2608200001
// =====================================================

router.get(
  "/receipt/:receiptNo",
  controller.getByReceiptNo
);

// =====================================================
// GET BY PAYMENT
// GET /payment-receipts/payment/15
// =====================================================

router.get(
  "/payment/:paymentId",
  controller.getByPayment
);

// =====================================================
// GET BY STUDENT FEE
// GET /payment-receipts/student-fee/34
// =====================================================

router.get(
  "/student-fee/:studentFeeId",
  controller.getByStudentFee
);

// =====================================================
// DOWNLOAD RECEIPT
// GET /payment-receipts/1/download
// =====================================================

router.get(
  "/:id/download",
  controller.downloadReceipt
);

// =====================================================
// GET ALL
// GET /payment-receipts
// =====================================================

router.get(
  "/",
  controller.getAll
);

// =====================================================
// GET ONE
// GET /payment-receipts/1
// =====================================================

router.get(
  "/:id",
  controller.getOne
);

export default router;