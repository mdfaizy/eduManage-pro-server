import {
  PaymentMethod,
} from "@prisma/client";

export interface CreatePaymentReceiptDTO {
  schoolId: number;
  paymentId: number;
  studentFeeId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId?: string | null;
  referenceNo?: string | null;
  receivedById?: number | null;
  receiptDate?: Date;
}

export interface GetPaymentReceiptDTO {
  schoolId: number;
  receiptNo?: string;
  paymentId?: number;
}