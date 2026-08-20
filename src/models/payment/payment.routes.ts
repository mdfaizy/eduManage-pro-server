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
router.post("/", PaymentController.createPayment);

// GET ALL PAYMENTS
router.get("/", PaymentController.getPayments);

// =====================================================
// REPORT / ANALYTICS
// =====================================================

// PAYMENT REPORT
router.get("/report", PaymentController.getPaymentReport);

// PAYMENT SUMMARY
router.get("/summary", PaymentController.getPaymentSummary);

// PAYMENT STATS
router.get("/stats", PaymentController.getPaymentStats);

// PAYMENT ANALYTICS
router.get("/analytics", PaymentController.getPaymentAnalytics);

// =====================================================
// PENDING / OVERDUE
// =====================================================

// PENDING PAYMENTS
router.get("/pending", PaymentController.getPendingPayments);

// OVERDUE PAYMENTS
router.get("/overdue", PaymentController.getOverduePayments);

// =====================================================
// STUDENT
// =====================================================

// GET STUDENT PAYMENTS
router.get("/student/:studentId", PaymentController.getStudentPayments);

// =====================================================
// PAYMENT REFUND
// =====================================================

// REFUND PAYMENT (POST /payments/:id/refund)
router.post("/:id/refund", PaymentController.refundPayment);

// GET PAYMENT REFUNDS (GET /payments/:id/refunds)
router.get("/:id/refunds", PaymentController.getPaymentRefunds);

// =====================================================
// PAYMENT CANCEL / REVERSAL
// =====================================================

// CANCEL / REVERSE PAYMENT (POST /payments/:id/cancel)
router.post("/:id/cancel", PaymentController.cancelPayment);

// =====================================================
// PAYMENT BY ID & PARAMS
// (Must remain after non-param routes to avoid route collisions)
// =====================================================

// GET PAYMENT BY ID
router.get("/:id", PaymentController.getPaymentById);

// UPDATE PAYMENT
router.put("/:id", PaymentController.updatePayment);

// DELETE PAYMENT
router.delete("/:id", PaymentController.deletePayment);

export default router;