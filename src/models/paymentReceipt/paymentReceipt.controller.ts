import { Request, Response } from "express";
import service from "./paymentReceipt.service.js";

class PaymentReceiptController {

  // =====================================================
  // CREATE RECEIPT
  // =====================================================

  async create(req: Request, res: Response) {
    try {
      const schoolId = Number((req as any).user?.schoolId);
      const receivedById = Number((req as any).user?.id);

      if (!schoolId) {
        return res.status(401).json({ success: false, message: "School ID not found" });
      }

      const paymentId = Number(req.body.paymentId);
      const studentFeeId = Number(req.body.studentFeeId);
      const studentId = Number(req.body.studentId);
      const amount = Number(req.body.amount);

      if (!Number.isInteger(paymentId) || paymentId <= 0) {
        return res.status(400).json({ success: false, message: "Valid paymentId is required" });
      }

      if (!Number.isInteger(studentFeeId) || studentFeeId <= 0) {
        return res.status(400).json({ success: false, message: "Valid studentFeeId is required" });
      }

      if (!Number.isInteger(studentId) || studentId <= 0) {
        return res.status(400).json({ success: false, message: "Valid studentId is required" });
      }

      if (!Number.isFinite(amount) || amount <= 0) {
        return res.status(400).json({ success: false, message: "Amount must be greater than 0" });
      }

      const data = await service.create({
        schoolId,
        paymentId,
        studentId,
        studentFeeId,
        receiptNo: req.body.receiptNo,
        amount,
        issuedAt: req.body.issuedAt ? new Date(req.body.issuedAt) : new Date(),
        paymentMethod: req.body.paymentMethod,
        transactionId: req.body.transactionId ?? null,
        remarks: req.body.remarks ?? null,
        receivedById,
        status: req.body.status,
      });

      return res.status(201).json({
        success: true,
        message: "Payment receipt created successfully",
        data,
      });
    } catch (error: any) {
      console.error("Create Payment Receipt Error:", error);
      return res.status(400).json({
        success: false,
        message: error?.message || "Failed to create payment receipt",
      });
    }
  }

  // =====================================================
  // GET ALL
  // =====================================================

  async getAll(req: Request, res: Response) {
    try {
      const schoolId = Number((req as any).user?.schoolId);

      if (!schoolId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const data = await service.getAll(schoolId);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error?.message || "Failed to fetch receipts",
      });
    }
  }

  // =====================================================
  // GET ONE
  // =====================================================

  async getOne(req: Request, res: Response) {
    try {
      const schoolId = Number((req as any).user?.schoolId);
      const id = Number(req.params.id);

      const data = await service.getOne(id, schoolId);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error?.message || "Receipt not found",
      });
    }
  }

  // =====================================================
  // GET BY RECEIPT NUMBER
  // =====================================================

  async getByReceiptNo(req: Request, res: Response) {
    try {
      const schoolId = Number((req as any).user?.schoolId);
      const receiptNo = req.params.receiptNo;

      const data = await service.getByReceiptNo(receiptNo, schoolId);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error?.message || "Receipt not found",
      });
    }
  }

  // =====================================================
  // GET BY PAYMENT
  // =====================================================

  async getByPayment(req: Request, res: Response) {
    try {
      const schoolId = Number((req as any).user?.schoolId);
      const paymentId = Number(req.params.paymentId);

      const data = await service.getByPayment(paymentId, schoolId);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error?.message || "Failed to fetch payment receipts",
      });
    }
  }

  // =====================================================
  // GET BY STUDENT FEE
  // =====================================================

  async getByStudentFee(req: Request, res: Response) {
    try {
      const schoolId = Number((req as any).user?.schoolId);
      const studentFeeId = Number(req.params.studentFeeId);

      const data = await service.getByStudentFee(studentFeeId, schoolId);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error?.message || "Failed to fetch student fee receipts",
      });
    }
  }

  // =====================================================
  // DOWNLOAD RECEIPT
  // =====================================================

  async downloadReceipt(req: Request, res: Response) {
    try {
      const schoolId = Number((req as any).user?.schoolId);
      const id = Number(req.params.id);

      if (!schoolId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ success: false, message: "Invalid receipt ID" });
      }

      const receipt = await service.getOne(id, schoolId);

      if (!receipt) {
        return res.status(404).json({ success: false, message: "Receipt not found" });
      }

      const studentName = receipt.studentFee?.student?.name || "Student";

      const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Payment Receipt ${receipt.receiptNo}</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 30px; }
    .receipt { width: 800px; margin: auto; background: white; padding: 35px; border: 1px solid #ddd; }
    .header { text-align: center; border-bottom: 2px solid #222; padding-bottom: 20px; margin-bottom: 25px; }
    .school-name { font-size: 28px; font-weight: bold; }
    .title { font-size: 20px; margin-top: 8px; }
    .receipt-number { margin-top: 10px; font-size: 14px; }
    .section { margin-top: 25px; }
    .section-title { font-size: 16px; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 12px; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 10px; border-bottom: 1px solid #eee; }
    td:first-child { font-weight: bold; width: 40%; }
    .amount { font-size: 24px; font-weight: bold; text-align: right; }
    .footer { margin-top: 50px; display: flex; justify-content: space-between; }
    @media print {
      body { background: white; padding: 0; }
      .receipt { border: none; }
    }
  </style>
</head>
<body>
<div class="receipt">
  <div class="header">
    <div class="school-name">School ERP</div>
    <div class="title">PAYMENT RECEIPT</div>
    <div class="receipt-number">Receipt No: <strong>${receipt.receiptNo}</strong></div>
  </div>
  <div class="section">
    <div class="section-title">Student Information</div>
    <table>
      <tr><td>Student</td><td>${studentName}</td></tr>
      <tr><td>Invoice No</td><td>${receipt.studentFee?.invoiceNo ?? "-"}</td></tr>
      <tr><td>Payment Date</td><td>${receipt.issuedAt ? new Date(receipt.issuedAt).toLocaleString() : "-"}</td></tr>
    </table>
  </div>
  <div class="section">
    <div class="section-title">Payment Information</div>
    <table>
      <tr><td>Payment Method</td><td>${receipt.paymentMethod ?? "-"}</td></tr>
      <tr><td>Transaction ID</td><td>${receipt.transactionId ?? "-"}</td></tr>
      <tr><td>Status</td><td>${receipt.status ?? "-"}</td></tr>
      <tr><td>Received By</td><td>${receipt.receivedBy?.name ?? "-"}</td></tr>
    </table>
  </div>
  <div class="section">
    <table>
      <tr>
        <td>Amount Paid</td>
        <td class="amount">₹${Number(receipt.amount).toFixed(2)}</td>
      </tr>
    </table>
  </div>
  <div class="footer">
    <div>This is a computer-generated receipt.<br />No signature is required.</div>
    <div>Authorized Signature</div>
  </div>
</div>
</body>
</html>
`;

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.status(200).send(html);
    } catch (error: any) {
      console.error("Download Receipt Error:", error);
      return res.status(500).json({
        success: false,
        message: error?.message || "Failed to generate receipt",
      });
    }
  }
}

export default new PaymentReceiptController();