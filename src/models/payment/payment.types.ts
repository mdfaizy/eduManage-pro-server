import {
  PaymentMethod,
  PaymentTransactionStatus,
} from "@prisma/client";

// =====================================================
// CREATE PAYMENT
// =====================================================

export interface CreatePaymentDTO {
  studentId: number;

  studentFeeId: number;

  amount: number;

  paymentMethod: PaymentMethod;

  transactionId?: string;

  referenceNo?: string;

  paymentDate?: Date;

  remarks?: string;

  status?: PaymentTransactionStatus;
}

// =====================================================
// UPDATE PAYMENT
// =====================================================

export interface UpdatePaymentDTO {
  amount?: number;

  paymentMethod?: PaymentMethod;

  transactionId?: string;

  referenceNo?: string;

  paymentDate?: Date;

  remarks?: string;

  status?: PaymentTransactionStatus;
}