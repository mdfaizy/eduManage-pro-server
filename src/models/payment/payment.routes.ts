// import { Router } from "express";
// import { PaymentController } from "./payment.controller";
// import { authMiddleware } from "../../middlewares/auth";



// const router = Router();

// // All routes require authentication
// router.use(authMiddleware);

// // CREATE
// router.post(
//   "/",
//  authMiddleware,
//   PaymentController.createPayment
// );

// // GET ALL
// router.get(
//   "/",
//   authMiddleware,
//   PaymentController.getPayments
// );

// // GET SUMMARY
// router.get(
//   "/summary",
//   authMiddleware,
//   PaymentController.getPaymentSummary
// );

// // GET STATS
// router.get(
//   "/stats",
//   authMiddleware,
//   PaymentController.getPaymentStats
// );

// // GET ANALYTICS
// router.get(
//   "/analytics",
//   authMiddleware,
//   PaymentController.getPaymentAnalytics
// );

// // GET PENDING PAYMENTS
// router.get(
//   "/pending",
//   authMiddleware,
//   PaymentController.getPendingPayments
// );

// // GET OVERDUE PAYMENTS
// router.get(
//   "/overdue",
//   authMiddleware,
//   PaymentController.getOverduePayments
// );

// // GET STUDENT PAYMENTS
// router.get(
//   "/student/:studentId",
//   authMiddleware,
//   PaymentController.getStudentPayments
// );

// // GET BY RECEIPT NO
// router.get(
//   "/receipt/:receiptNo",
// //   roleMiddleware([Role.ADMIN, Role.TEACHER, Role.ACCOUNTANT]),
// authMiddleware,
//   PaymentController.getPaymentByReceiptNo
// );

// // GET BY ID
// router.get(
//   "/:id",
// //   roleMiddleware([Role.ADMIN, Role.TEACHER, Role.ACCOUNTANT]),
//   PaymentController.getPaymentById
// );

// // DOWNLOAD RECEIPT
// router.get(
//   "/:id/download",
// //   roleMiddleware([Role.ADMIN, Role.TEACHER, Role.ACCOUNTANT, Role.PARENT]),
//   PaymentController.downloadReceipt
// );

// // UPDATE
// router.put(
//   "/:id",
// //   roleMiddleware([Role.ADMIN, Role.ACCOUNTANT]),
//   PaymentController.updatePayment
// );

// // DELETE
// router.delete(
//   "/:id",
// //   roleMiddleware([Role.ADMIN]),
//   PaymentController.deletePayment
// );

// export default router;

import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();

// All payment routes require authentication
router.use(authMiddleware);

// =====================================================
// PAYMENT CRUD
// =====================================================

// CREATE PAYMENT
router.post(
  "/",
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

router.get(
  "/pending",
  PaymentController.getPendingPayments
);

router.get(
  "/overdue",
  PaymentController.getOverduePayments
);

// =====================================================
// STUDENT
// =====================================================

router.get(
  "/student/:studentId",
  PaymentController.getStudentPayments
);

// =====================================================
// RECEIPT
// =====================================================

router.get(
  "/receipt/:receiptNo",
  PaymentController.getPaymentByReceiptNo
);

// =====================================================
// IMPORTANT:
// Specific routes above must come before /:id
// =====================================================

// GET BY ID
router.get(
  "/:id",
  PaymentController.getPaymentById
);

// DOWNLOAD RECEIPT
router.get(
  "/:id/download",
  PaymentController.downloadReceipt
);

// UPDATE
router.put(
  "/:id",
  PaymentController.updatePayment
);

// DELETE
router.delete(
  "/:id",
  PaymentController.deletePayment
);

export default router;