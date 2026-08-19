
// import { Router } from "express";
// import { PaymentController } from "./payment.controller";
// import { authMiddleware } from "../../middlewares/auth";

// const router = Router();

// // All payment routes require authentication
// router.use(authMiddleware);

// // =====================================================
// // PAYMENT CRUD
// // =====================================================

// // CREATE PAYMENT
// router.post(
//   "/",
//   PaymentController.createPayment
// );

// // GET ALL PAYMENTS
// router.get(
//   "/",
//   PaymentController.getPayments
// );

// // =====================================================
// // REPORT / ANALYTICS
// // =====================================================

// // PAYMENT REPORT
// router.get(
//   "/report",
//   PaymentController.getPaymentReport
// );

// // PAYMENT SUMMARY
// router.get(
//   "/summary",
//   PaymentController.getPaymentSummary
// );

// // PAYMENT STATS
// router.get(
//   "/stats",
//   PaymentController.getPaymentStats
// );

// // PAYMENT ANALYTICS
// router.get(
//   "/analytics",
//   PaymentController.getPaymentAnalytics
// );

// // =====================================================
// // PENDING / OVERDUE
// // =====================================================

// router.get(
//   "/pending",
//   PaymentController.getPendingPayments
// );

// router.get(
//   "/overdue",
//   PaymentController.getOverduePayments
// );

// // =====================================================
// // STUDENT
// // =====================================================

// router.get(
//   "/student/:studentId",
//   PaymentController.getStudentPayments
// );

// // =====================================================
// // RECEIPT
// // =====================================================

// router.get(
//   "/receipt/:receiptNo",
//   PaymentController.getPaymentByReceiptNo
// );

// // =====================================================
// // IMPORTANT:
// // Specific routes above must come before /:id
// // =====================================================

// // GET BY ID
// router.get(
//   "/:id",
//   PaymentController.getPaymentById
// );

// // DOWNLOAD RECEIPT
// router.get(
//   "/:id/download",
//   PaymentController.downloadReceipt
// );

// // UPDATE
// router.put(
//   "/:id",
//   PaymentController.updatePayment
// );

// // DELETE
// router.delete(
//   "/:id",
//   PaymentController.deletePayment
// );

// export default router;


import { Router } from "express";

import { PaymentController } from "./payment.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();

// =====================================================
// AUTHENTICATION
// =====================================================

router.use(authMiddleware);

// =====================================================
// PAYMENT CRUD
// =====================================================

// CREATE PAYMENT
router.post(
  "/",
  // authMiddleware,
  PaymentController.createPayment
);

// GET ALL PAYMENTS
router.get(
  "/",
  PaymentController.getPayments
);

// =====================================================
// REPORT / ANALYTICS
// =====================================================

// PAYMENT REPORT
router.get(
  "/report",
  PaymentController.getPaymentReport
);

// PAYMENT SUMMARY
router.get(
  "/summary",
  PaymentController.getPaymentSummary
);

// PAYMENT STATS
router.get(
  "/stats",
  PaymentController.getPaymentStats
);

// PAYMENT ANALYTICS
router.get(
  "/analytics",
  PaymentController.getPaymentAnalytics
);

// =====================================================
// PENDING / OVERDUE
// =====================================================

// PENDING PAYMENTS
router.get(
  "/pending",
  PaymentController.getPendingPayments
);

// OVERDUE PAYMENTS
router.get(
  "/overdue",
  PaymentController.getOverduePayments
);

// =====================================================
// STUDENT
// =====================================================

// GET STUDENT PAYMENTS
router.get(
  "/student/:studentId",
  PaymentController.getStudentPayments
);

// =====================================================
// RECEIPT
// =====================================================

// GET PAYMENT BY RECEIPT NUMBER
router.get(
  "/receipt/:receiptNo",
  PaymentController.getPaymentByReceiptNo
);

// =====================================================
// PAYMENT REFUND
// =====================================================

// REFUND PAYMENT
// Example:
// POST /payments/15/refund
router.post(
  "/:id/refund",
  PaymentController.refundPayment
);

// GET PAYMENT REFUNDS
// Example:
// GET /payments/15/refunds
router.get(
  "/:id/refunds",
  PaymentController.getPaymentRefunds
);

// =====================================================
// PAYMENT CANCEL / REVERSAL
// =====================================================

// CANCEL / REVERSE PAYMENT
// Example:
// POST /payments/15/cancel
router.post(
  "/:id/cancel",
  PaymentController.cancelPayment
);

// =====================================================
// PAYMENT BY ID
// IMPORTANT:
// Keep this AFTER all specific routes
// =====================================================

// GET PAYMENT BY ID
router.get(
  "/:id",
  PaymentController.getPaymentById
);

// DOWNLOAD RECEIPT
router.get(
  "/:id/download",
  PaymentController.downloadReceipt
);

// UPDATE PAYMENT
router.put(
  "/:id",
  PaymentController.updatePayment
);

// DELETE PAYMENT
router.delete(
  "/:id",
  PaymentController.deletePayment
);

export default router;