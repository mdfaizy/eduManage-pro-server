import { Request, Response } from "express";
import { PaymentService } from "./payment.service";

const paymentService = new PaymentService();

export class PaymentController {

  // =====================================================
  // CREATE
  // =====================================================

  static async createPayment(req: Request, res: Response) {
    try {
      // const userId = req.user?.id;
      // const schoolId = req.user?.schoolId;

      console.log("PAYMENT USER:", req.user);

      // ✅ correct
      const userId = req.user?.userId;
      const schoolId = req.user?.schoolId;

      console.log("USER ID:", userId);
      console.log("SCHOOL ID:", schoolId);

      if (!userId || !schoolId) {
        return res.status(401).json({
          error: "Unauthorized",
        });
      }

      const payment = await paymentService.createPayment(
        req.body,
        userId,
        schoolId
      );

      return res.status(201).json(payment);
    } catch (error: any) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  // =====================================================
  // GET ALL
  // =====================================================

  static async getPayments(req: Request, res: Response) {
    try {
      const schoolId = req.user?.schoolId;

      if (!schoolId) {
        return res.status(401).json({
          error: "Unauthorized",
        });
      }

      const payments = await paymentService.getPayments(
        schoolId,
        req.query
      );

      return res.json(payments);
    } catch (error: any) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }

  // =====================================================
  // PAYMENT REPORT
  // =====================================================

  static async getPaymentReport(req: Request, res: Response) {
    try {
      const schoolId = req.user?.schoolId;

      if (!schoolId) {
        return res.status(401).json({
          error: "Unauthorized",
        });
      }

      const report = await paymentService.getPaymentReport(
        schoolId,
        req.query
      );

      return res.json(report);
    } catch (error: any) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }

  // =====================================================
  // SUMMARY
  // =====================================================

  static async getPaymentSummary(req: Request, res: Response) {
    try {
      const schoolId = req.user?.schoolId;

      if (!schoolId) {
        return res.status(401).json({
          error: "Unauthorized",
        });
      }

      const summary = await paymentService.getPaymentSummary(
        schoolId,
        req.query
      );

      return res.json(summary);
    } catch (error: any) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }

  // =====================================================
  // STATS
  // =====================================================

  static async getPaymentStats(req: Request, res: Response) {
    try {
      const schoolId = req.user?.schoolId;

      if (!schoolId) {
        return res.status(401).json({
          error: "Unauthorized",
        });
      }

      const academicYearId = req.query.academicYearId
        ? Number(req.query.academicYearId)
        : undefined;

      const stats = await paymentService.getPaymentStats(
        schoolId,
        academicYearId
      );

      return res.json(stats);
    } catch (error: any) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }

  // =====================================================
  // ANALYTICS
  // =====================================================

  static async getPaymentAnalytics(req: Request, res: Response) {
    try {
      const schoolId = req.user?.schoolId;

      if (!schoolId) {
        return res.status(401).json({
          error: "Unauthorized",
        });
      }

      const analytics = await paymentService.getPaymentAnalytics(
        schoolId,
        req.query
      );

      return res.json(analytics);
    } catch (error: any) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  // =====================================================
  // STUDENT PAYMENTS
  // =====================================================

  static async getStudentPayments(req: Request, res: Response) {
    try {
      const schoolId = req.user?.schoolId;
      const studentId = Number(req.params.studentId);

      if (!schoolId) {
        return res.status(401).json({
          error: "Unauthorized",
        });
      }

      if (!studentId) {
        return res.status(400).json({
          error: "Invalid student ID",
        });
      }

      const payments = await paymentService.getStudentPayments(
        schoolId,
        studentId
      );

      return res.json(payments);
    } catch (error: any) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }

  // =====================================================
  // PAYMENT BY RECEIPT
  // =====================================================

  static async getPaymentByReceiptNo(req: Request, res: Response) {
    try {
      const schoolId = req.user?.schoolId;
      const { receiptNo } = req.params;

      if (!schoolId) {
        return res.status(401).json({
          error: "Unauthorized",
        });
      }

      const payment =
        await paymentService.getPaymentByReceiptNo(
          schoolId,
          receiptNo
        );

      return res.json(payment);
    } catch (error: any) {
      return res.status(404).json({
        error: error.message,
      });
    }
  }

  // =====================================================
  // PAYMENT BY ID
  // =====================================================

  static async getPaymentById(req: Request, res: Response) {
    try {
      const schoolId = req.user?.schoolId;
      const id = Number(req.params.id);

      if (!schoolId) {
        return res.status(401).json({
          error: "Unauthorized",
        });
      }

      const payment =
        await paymentService.getPaymentById(
          schoolId,
          id
        );

      return res.json(payment);
    } catch (error: any) {
      return res.status(404).json({
        error: error.message,
      });
    }
  }

  // =====================================================
  // PENDING
  // =====================================================

  static async getPendingPayments(req: Request, res: Response) {
    try {
      const schoolId = req.user?.schoolId;

      if (!schoolId) {
        return res.status(401).json({
          error: "Unauthorized",
        });
      }

      const studentId = req.query.studentId
        ? Number(req.query.studentId)
        : undefined;

      const pending =
        await paymentService.getPendingPayments(
          schoolId,
          studentId
        );

      return res.json(pending);
    } catch (error: any) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }

  // =====================================================
  // OVERDUE
  // =====================================================

  static async getOverduePayments(req: Request, res: Response) {
    try {
      const schoolId = req.user?.schoolId;

      if (!schoolId) {
        return res.status(401).json({
          error: "Unauthorized",
        });
      }

      const studentId = req.query.studentId
        ? Number(req.query.studentId)
        : undefined;

      const overdue =
        await paymentService.getOverduePayments(
          schoolId,
          studentId
        );

      return res.json(overdue);
    } catch (error: any) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }

  // =====================================================
  // UPDATE
  // =====================================================

  static async updatePayment(req: Request, res: Response) {
    try {
      const schoolId = req.user?.schoolId;
      const id = Number(req.params.id);

      if (!schoolId) {
        return res.status(401).json({
          error: "Unauthorized",
        });
      }

      const payment =
        await paymentService.updatePayment(
          schoolId,
          id,
          req.body
        );

      return res.json(payment);
    } catch (error: any) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  // =====================================================
  // DELETE
  // =====================================================

  static async deletePayment(req: Request, res: Response) {
    try {
      const schoolId = req.user?.schoolId;
      const id = Number(req.params.id);

      if (!schoolId) {
        return res.status(401).json({
          error: "Unauthorized",
        });
      }

      const result =
        await paymentService.deletePayment(
          schoolId,
          id
        );

      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  // =====================================================
  // DOWNLOAD RECEIPT
  // =====================================================

  static async downloadReceipt(req: Request, res: Response) {
    try {
      const schoolId = req.user?.schoolId;
      const id = Number(req.params.id);

      if (!schoolId) {
        return res.status(401).json({
          error: "Unauthorized",
        });
      }

      const result =
        await paymentService.downloadReceipt(
          schoolId,
          id
        );

      return res.json(result);
    } catch (error: any) {
      return res.status(404).json({
        error: error.message,
      });
    }
  }



  static async getPaymentRefunds(
    req: Request,
    res: Response
  ) {
    try {
      const paymentId = Number(req.params.id);

      if (!paymentId || Number.isNaN(paymentId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid payment id",
        });
      }

      const schoolId = Number(
        req.user?.schoolId
      );

      if (!schoolId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const refunds =
        await paymentService.getPaymentRefunds(
          paymentId,
          schoolId
        );

      return res.status(200).json({
        success: true,
        data: refunds,
      });

    } catch (error: any) {
      console.error(
        "Get Payment Refunds Error:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error?.message ||
          "Failed to get payment refunds",
      });
    }
  }
  // static async refundPayment(req: Request, res: Response) {
  //   try {
  //     const paymentId = Number(req.params.id);

  //     if (!paymentId || Number.isNaN(paymentId)) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Invalid payment id",
  //       });
  //     }

  //     const { amount, reason, referenceNo } = req.body;

  //     if (amount === undefined || amount === null || amount === "") {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Refund amount is required",
  //       });
  //     }

  //     const refundAmount = Number(amount);

  //     if (!Number.isFinite(refundAmount) || refundAmount <= 0) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Refund amount must be greater than zero",
  //       });
  //     }

  //     const schoolId = Number(req.user.schoolId);
  //     // const refundedBy = Number(req.user.userId);
  //     const refundedBy = Number(req.user?.id);

  //     const result = await paymentService.refundPayment(
  //       paymentId,
  //       schoolId,
  //       refundAmount,
  //       reason,
  //       referenceNo,
  //       refundedBy
  //     );

  //     return res.status(200).json({
  //       success: true,
  //       message: "Payment refunded successfully",
  //       data: result,
  //     });
  //   } catch (error: any) {
  //     console.error("Refund Payment Error:", error);

  //     return res.status(400).json({
  //       success: false,
  //       message: error.message || "Failed to refund payment",
  //     });
  //   }
  // }

  static async refundPayment(req: Request, res: Response) {
  try {
    const paymentId = Number(req.params.id);

    const schoolId = req.user?.schoolId;
    // const refundedBy = req.user?.id;
    const refundedBy = req.user?.userId;

    if (!schoolId || !refundedBy) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const amount = Number(req.body.amount);

    const reason =
      req.body.reason || undefined;

    const referenceNo =
      req.body.referenceNo || undefined;

    // ✅ ADD THIS
    const refundMethod =
      req.body.refundMethod;

    if (!refundMethod) {
      return res.status(400).json({
        success: false,
        message: "refundMethod is required",
      });
    }

    const refund =
      await paymentService.refundPayment(
        paymentId,
        schoolId,
        amount,
        reason,
        referenceNo,

        // ✅ ADD/PASS THIS
        refundMethod,

        refundedBy
      );

    return res.status(201).json({
      success: true,
      data: refund,
    });

  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}
  static async cancelPayment(
    req: Request,
    res: Response
  ) {
    try {
      const paymentId = Number(
        req.params.id
      );

      if (
        !paymentId ||
        Number.isNaN(paymentId)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid payment id",
        });
      }

      const schoolId = Number(
        req.user?.schoolId
      );

      if (!schoolId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result =
        await paymentService.cancelPayment(
          paymentId,
          schoolId
        );

      return res.status(200).json({
        success: true,
        message: "Payment cancelled successfully",
        data: result,
      });

    } catch (error: any) {
      console.error(
        "Cancel Payment Error:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error?.message ||
          "Payment cancellation failed",
      });
    }
  }
}