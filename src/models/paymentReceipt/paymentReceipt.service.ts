import repository from "./paymentReceipt.repository.js";
import { CreatePaymentReceiptDTO } from "./paymentReceipt.types.js";

class PaymentReceiptService {

  // =====================================================
  // CREATE RECEIPT
  // =====================================================

  async create(data: CreatePaymentReceiptDTO) {
    if (!Number.isInteger(data.schoolId) || data.schoolId <= 0) {
      throw new Error("Invalid school ID");
    }

    if (!Number.isInteger(data.paymentId) || data.paymentId <= 0) {
      throw new Error("Invalid payment ID");
    }

    if (!Number.isInteger(data.studentFeeId) || data.studentFeeId <= 0) {
      throw new Error("Invalid student fee ID");
    }

    if (!Number.isFinite(data.amount) || data.amount <= 0) {
      throw new Error("Receipt amount must be greater than 0");
    }

    const payment = await repository.getPayment(data.paymentId, data.schoolId);

    if (!payment) {
      throw new Error("Payment not found");
    }

    if (payment.status === "CANCELLED" || payment.status === "REFUNDED") {
      throw new Error("Receipt cannot be generated for cancelled/refunded payment");
    }

    const paymentAmount = Number(payment.amount);

    if (Math.abs(paymentAmount - data.amount) > 0.01) {
      throw new Error("Receipt amount must match payment amount");
    }

    const existingReceipt = await repository.findByPayment(data.paymentId, data.schoolId);

    if (existingReceipt) {
      throw new Error("Receipt already exists for this payment");
    }

    return repository.create(data);
  }

  // =====================================================
  // GET ALL
  // =====================================================

  async getAll(schoolId: number) {
    if (!schoolId) {
      throw new Error("Invalid school ID");
    }

    return repository.getAll(schoolId);
  }

  // =====================================================
  // GET ONE
  // =====================================================

  async getOne(id: number, schoolId: number) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("Invalid receipt ID");
    }

    const receipt = await repository.getOne(id, schoolId);

    if (!receipt) {
      throw new Error("Receipt not found");
    }

    return receipt;
  }

  // =====================================================
  // GET BY RECEIPT NUMBER
  // =====================================================

  // async getByReceiptNo(receiptNo: string, schoolId: number) {
  //   if (!receiptNo?.trim()) {
  //     throw new Error("Receipt number is required");
  //   }

  //   const receipt = await repository.findByReceiptNo(receiptNo.trim(), schoolId);

  //   if (!receipt) {
  //     throw new Error("Receipt not found");
  //   }

  //   return receipt;
  // }


    // =====================================================
  // BY RECEIPT
  // =====================================================

async getByReceiptNo(schoolId: number, receiptNo: string) {
  const payment = await repository.findByReceiptNo(schoolId, receiptNo);

  if (!payment) {
    throw new Error(`Payment receipt ${receiptNo} not found`);
  }

  return payment;
}
  // =====================================================
  // GET BY PAYMENT
  // =====================================================

  async getByPayment(paymentId: number, schoolId: number) {
    if (!Number.isInteger(paymentId) || paymentId <= 0) {
      throw new Error("Invalid payment ID");
    }

    return repository.getByPayment(paymentId, schoolId);
  }

  // =====================================================
  // GET BY STUDENT FEE
  // =====================================================

  async getByStudentFee(studentFeeId: number, schoolId: number) {
    if (!Number.isInteger(studentFeeId) || studentFeeId <= 0) {
      throw new Error("Invalid student fee ID");
    }

    return repository.getByStudentFee(studentFeeId, schoolId);
  }
}

export default new PaymentReceiptService();