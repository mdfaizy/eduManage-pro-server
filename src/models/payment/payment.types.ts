// payment.types.ts

import {
  PaymentMethod,
  PaymentTransactionStatus,
} from "@prisma/client";

export interface CreatePaymentDTO {
  schoolId: number;
  studentFeeId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  remarks?: string;
  receivedById?: number;
  paymentDate?: Date;
  status?: PaymentTransactionStatus;
}

export interface UpdatePaymentDTO {
  amount?: number;
  paymentMethod?: PaymentMethod;
  transactionId?: string;
  remarks?: string;
  receivedById?: number;
  paymentDate?: Date;
  status?: PaymentTransactionStatus;
}