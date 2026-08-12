// types/report.types.ts

import { FeeStatus, PaymentMethod, PaymentTransactionStatus } from "../../generated/prisma";

export interface FeeReportFilters {
  schoolId: number;
  academicYearId?: number;
  classId?: number;
  studentId?: number;
  feeHeadId?: number;
  startDate?: string;
  endDate?: string;
  status?: FeeStatus | 'ALL';
  paymentMethod?: PaymentMethod | 'ALL';
  page?: number;
  limit?: number;
}

export interface FeeReportSummary {
  totalStudents: number;
  totalFeeAmount: number;
  totalCollected: number;
  totalPending: number;
  totalDiscount: number;
  totalLateFee: number;
  totalOverdue: number;
  collectionRate: number;
  pendingRate: number;
}

export interface ClassWiseCollection {
  classId: number;
  className: string;
  totalStudents: number;
  totalAmount: number;
  collected: number;
  pending: number;
  collectionRate: number;
}

export interface FeeHeadWiseCollection {
  feeHeadId: number;
  feeHeadName: string;
  totalAmount: number;
  collected: number;
  pending: number;
  collectionRate: number;
}

export interface MonthlyCollection {
  month: string;
  year: number;
  totalAmount: number;
  collected: number;
  pending: number;
}

export interface StudentFeeReport {
  studentId: number;
  studentName: string;
  admissionNo: string;
  classId?: number;
  className: string;
  totalFee: number;
  paidAmount: number;
  pendingAmount: number;
  discount: number;
  lateFee: number;
  status: FeeStatus;
  dueDate: Date;
  lastPaymentDate: Date | null;
  lastPaymentAmount: number;
  invoiceNo: string | null;
}

export interface PaymentHistoryReport {
  id: number;
  date: Date;
  receiptNo: string;
  studentName: string;
  admissionNo: string;
  className: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId: string | null;
  status: PaymentTransactionStatus;
  remarks: string | null;
  receivedBy: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FeeReportData {
  summary: FeeReportSummary;
  classWise: ClassWiseCollection[];
  feeHeadWise: FeeHeadWiseCollection[];
  monthlyCollection: MonthlyCollection[];
  studentReports: {
    data: StudentFeeReport[];
    pagination: PaginationMeta;
  };
  paymentHistory: {
    data: PaymentHistoryReport[];
    pagination: PaginationMeta;
  };
}