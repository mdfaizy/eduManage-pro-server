// // payment.types.ts

// import {
//   PaymentMethod,
//   PaymentTransactionStatus,
// } from "@prisma/client";

// export interface CreatePaymentDTO {
//   schoolId: number;
//   studentFeeId: number;
//   amount: number;
//   paymentMethod: PaymentMethod;
//   transactionId?: string;
//   remarks?: string;
//   receivedById?: number;
//   paymentDate?: Date;
//   status?: PaymentTransactionStatus;
// }

// export interface UpdatePaymentDTO {
//   amount?: number;
//   paymentMethod?: PaymentMethod;
//   transactionId?: string;
//   remarks?: string;
//   receivedById?: number;
//   paymentDate?: Date;
//   status?: PaymentTransactionStatus;
// }


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


export interface RefundPaymentDTO {
  paymentId: number;
  amount: number;
  reason?: string;
  referenceNo?: string;
}