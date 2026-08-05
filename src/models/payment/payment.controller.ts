import { Request, Response } from "express";
import { PaymentService } from "./payment.service";

const paymentService = new PaymentService();

export class PaymentController {
  // CREATE
  static async createPayment(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const payment = await paymentService.createPayment(req.body, userId);
      res.status(201).json(payment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // FIND ALL
  static async getPayments(req: Request, res: Response) {
    try {
      const schoolId = req.user?.schoolId;

if (!schoolId) {
  return res.status(401).json({
    error: "Unauthorized",
  });
}

      const payments = await paymentService.getPayments(schoolId, req.query);
      res.json(payments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // FIND ONE
  static async getPaymentById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const payment = await paymentService.getPaymentById(id);
      res.json(payment);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  // FIND BY RECEIPT NO
  static async getPaymentByReceiptNo(req: Request, res: Response) {
    try {
      const { receiptNo } = req.params;
      const payment = await paymentService.getPaymentByReceiptNo(receiptNo);
      res.json(payment);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  // GET STUDENT PAYMENTS
  static async getStudentPayments(req: Request, res: Response) {
    try {
      const studentId = parseInt(req.params.studentId);
      const payments = await paymentService.getStudentPayments(studentId);
      res.json(payments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET PAYMENT SUMMARY
  static async getPaymentSummary(req: Request, res: Response) {
    try {
      const schoolId = parseInt(req.query.schoolId as string);
      const studentId = req.query.studentId ? parseInt(req.query.studentId as string) : undefined;

      if (!schoolId) {
        return res.status(400).json({ error: "School ID is required" });
      }

      const summary = await paymentService.getPaymentSummary(schoolId, studentId);
      res.json(summary);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET PAYMENT STATS
  static async getPaymentStats(req: Request, res: Response) {
    try {
      const schoolId = parseInt(req.query.schoolId as string);
      const academicYearId = req.query.academicYearId ? parseInt(req.query.academicYearId as string) : undefined;

      if (!schoolId) {
        return res.status(400).json({ error: "School ID is required" });
      }

      const stats = await paymentService.getPaymentStats(schoolId, academicYearId);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET PAYMENT ANALYTICS
  static async getPaymentAnalytics(req: Request, res: Response) {
    try {
      const schoolId = parseInt(req.query.schoolId as string);
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;

      if (!schoolId || !startDate || !endDate) {
        return res.status(400).json({ error: "School ID, startDate, and endDate are required" });
      }

      const analytics = await paymentService.getPaymentAnalytics(schoolId, startDate, endDate);
      res.json(analytics);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET PENDING PAYMENTS
  static async getPendingPayments(req: Request, res: Response) {
    try {
      const schoolId = parseInt(req.query.schoolId as string);
      const studentId = req.query.studentId ? parseInt(req.query.studentId as string) : undefined;

      if (!schoolId) {
        return res.status(400).json({ error: "School ID is required" });
      }

      const pending = await paymentService.getPendingPayments(schoolId, studentId);
      res.json(pending);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET OVERDUE PAYMENTS
  static async getOverduePayments(req: Request, res: Response) {
    try {
      const schoolId = parseInt(req.query.schoolId as string);
      const studentId = req.query.studentId ? parseInt(req.query.studentId as string) : undefined;

      if (!schoolId) {
        return res.status(400).json({ error: "School ID is required" });
      }

      const overdue = await paymentService.getOverduePayments(schoolId, studentId);
      res.json(overdue);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // UPDATE
  static async updatePayment(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const payment = await paymentService.updatePayment(id, req.body);
      res.json(payment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // DELETE
  static async deletePayment(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const result = await paymentService.deletePayment(id);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // DOWNLOAD RECEIPT
  static async downloadReceipt(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const result = await paymentService.downloadReceipt(id);
      res.json(result);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}