import prisma from "../../config/prisma";
import {
  FeeStatus,
  PaymentTransactionStatus,
} from "../../generated/prisma";

import { PaymentRepository } from "./payment.repository";

const paymentRepository = new PaymentRepository();
import paymentReportRepository
  from "./paymentReport.repository.js";

export class PaymentService {

  // =====================================================
  // CREATE PAYMENT


// async createPayment(
//   data: any,
//   userId: number,
//   schoolId: number
// ) {
//   const {
//     studentFeeId,
//     amount,
//     paymentMethod,
//     transactionId,
//     referenceNo,
//     remarks,
//   } = data;

//   // =====================================================
//   // VALIDATION
//   // =====================================================

//   if (!studentFeeId) {
//     throw new Error("Student fee ID is required");
//   }

//   if (!amount || Number(amount) <= 0) {
//     throw new Error(
//       "Payment amount must be greater than 0"
//     );
//   }

//   if (!paymentMethod) {
//     throw new Error(
//       "Payment method is required"
//     );
//   }

//   if (!userId || Number.isNaN(Number(userId))) {
//     throw new Error(
//       "Valid user ID is required"
//     );
//   }

//   return prisma.$transaction(async (tx) => {

//     // =====================================================
//     // 1. FIND STUDENT FEE
//     // =====================================================

//     const studentFee =
//       await tx.studentFee.findFirst({
//         where: {
//           id: Number(studentFeeId),
//           schoolId,
//         },

//         include: {
//           student: true,
//           feeStructure: true,
//         },
//       });

//     if (!studentFee) {
//       throw new Error(
//         "Student fee not found"
//       );
//     }

//     // =====================================================
//     // 2. CHECK FEE STATUS
//     // =====================================================

//     if (studentFee.status === "PAID") {
//       throw new Error(
//         "This fee is already fully paid"
//       );
//     }

//     // =====================================================
//     // 3. PAYMENT AMOUNT VALIDATION
//     // =====================================================

//     const paymentAmount =
//       Number(amount);

//     if (
//       !Number.isFinite(paymentAmount) ||
//       paymentAmount <= 0
//     ) {
//       throw new Error(
//         "Payment amount must be greater than 0"
//       );
//     }

//     const totalAmount =
//       Number(studentFee.totalAmount) || 0;

//     const discount =
//       Number(studentFee.discount) || 0;

//     const paidAmount =
//       Number(studentFee.paidAmount) || 0;

//     // =====================================================
//     // ACTUAL PAYABLE AMOUNT
//     // =====================================================

//     const payableAmount =
//       Math.max(
//         totalAmount - discount,
//         0
//       );

//     // =====================================================
//     // ACTUAL CURRENT DUE
//     // =====================================================

//     const currentDue =
//       Math.max(
//         payableAmount - paidAmount,
//         0
//       );

//     // =====================================================
//     // PAYMENT CANNOT EXCEED DUE
//     // =====================================================

//     if (paymentAmount > currentDue) {
//       throw new Error(
//         `Payment amount cannot exceed due amount of ₹${currentDue}`
//       );
//     }

//     // =====================================================
//     // 4. GENERATE RECEIPT NUMBER
//     // =====================================================

//     const today = new Date();

//     const year =
//       today
//         .getFullYear()
//         .toString()
//         .slice(-2);

//     const month =
//       String(
//         today.getMonth() + 1
//       ).padStart(2, "0");

//     const day =
//       String(
//         today.getDate()
//       ).padStart(2, "0");

//     const prefix =
//       `RCP${year}${month}${day}`;

//     const lastReceipt =
//       await tx.paymentReceipt.findFirst({
//         where: {
//           schoolId,

//           receiptNo: {
//             startsWith: prefix,
//           },
//         },

//         orderBy: {
//           receiptNo: "desc",
//         },
//       });

//     let sequence = 1;

//     if (lastReceipt) {

//       const lastSequence =
//         parseInt(
//           lastReceipt.receiptNo.slice(-4),
//           10
//         );

//       if (
//         !Number.isNaN(lastSequence)
//       ) {
//         sequence =
//           lastSequence + 1;
//       }
//     }

//     const receiptNo =
//       `${prefix}${String(sequence).padStart(4, "0")}`;

//     // =====================================================
//     // 5. CREATE PAYMENT
//     // =====================================================

//     const payment =
//       await tx.payment.create({
//         data: {

//           schoolId,

//           // Student
//           studentId:
//             studentFee.studentId,

//           // Student Fee
//           studentFeeId:
//             Number(studentFeeId),

//           // Payment Amount
//           amount:
//             paymentAmount,

//           // Payment Method
//           paymentMethod,

//           // Payment Status
//           status:
//             PaymentTransactionStatus.SUCCESS,

//           // Transaction ID
//           transactionId:
//             transactionId || null,

//           // Reference Number
//           referenceNo:
//             referenceNo || null,

//           // Payment Date
//           paymentDate:
//             new Date(),

//           // Remarks
//           remarks:
//             remarks || null,

//           // Collected By
//           collectedBy:
//             Number(userId),
//         },
//       });

//     // =====================================================
//     // 6. CREATE PAYMENT RECEIPT
//     // =====================================================

//     const receipt =
//       await tx.paymentReceipt.create({
//         data: {

//           schoolId,

//           // Student
//           studentId:
//             studentFee.studentId,

//           // Student Fee
//           studentFeeId:
//             Number(studentFeeId),

//           // Link Payment
//           paymentId:
//             payment.id,

//           // Receipt Number
//           receiptNo,

//           // Receipt Amount
//           amount:
//             paymentAmount,

//           // Receipt Date
//           issuedAt:
//             new Date(),

//           // Payment Method
//           paymentMethod,

//           // Transaction ID
//           transactionId:
//             transactionId || null,

//           // Remarks
//           remarks:
//             remarks || null,

//           // Received By
//           receivedById:
//             Number(userId),

//           // Receipt Status
//           status:
//             PaymentTransactionStatus.SUCCESS,
//         },
//       });

//     // =====================================================
//     // 7. UPDATE STUDENT FEE
//     // =====================================================

//     const newPaidAmount =
//       paidAmount +
//       paymentAmount;

//     // =====================================================
//     // IMPORTANT
//     // Due is calculated AFTER DISCOUNT
//     // =====================================================

//     const newDueAmount =
//       Math.max(
//         payableAmount -
//           newPaidAmount,
//         0
//       );

//     // =====================================================
//     // DETERMINE FEE STATUS
//     // =====================================================

//     let newStatus:
//       | "PAID"
//       | "PARTIAL"
//       | "PENDING";

//     if (
//       newDueAmount <= 0
//     ) {

//       newStatus =
//         "PAID";

//     } else if (
//       newPaidAmount > 0
//     ) {

//       newStatus =
//         "PARTIAL";

//     } else {

//       newStatus =
//         "PENDING";
//     }

//     // =====================================================
//     // UPDATE STUDENT FEE
//     // =====================================================

//     await tx.studentFee.update({

//       where: {
//         id:
//           Number(studentFeeId),
//       },

//       data: {

//         paidAmount:
//           newPaidAmount,

//         dueAmount:
//           newDueAmount,

//         status:
//           newStatus,
//       },
//     });

//     // =====================================================
//     // 8. RETURN PAYMENT + RECEIPT
//     // =====================================================

//     return {
//       payment,
//       receipt,
//     };
//   });
// }
async createPayment(data: any, userId: number, schoolId: number) {
  const { studentFeeId, amount, paymentMethod, transactionId, referenceNo, remarks } = data;

  // Validation
  if (!studentFeeId) throw new Error("Student fee ID is required");
  if (!paymentMethod) throw new Error("Payment method is required");
  if (!userId || Number.isNaN(Number(userId))) throw new Error("Valid user ID is required");

  const paymentAmount = Number(amount);
  if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
    throw new Error("Payment amount must be greater than 0");
  }

  return prisma.$transaction(async (tx) => {
    // 1. Find Student Fee
    const studentFee = await tx.studentFee.findFirst({
      where: { id: Number(studentFeeId), schoolId },
      include: { student: true, feeStructure: true },
    });

    if (!studentFee) throw new Error("Student fee not found");
    if (studentFee.status === "PAID") throw new Error("This fee is already fully paid");

    // 2. Calculate Payable & Due Amounts
    const totalAmount = Number(studentFee.totalAmount) || 0;
    const discount = Number(studentFee.discount) || 0;
    const paidAmount = Number(studentFee.paidAmount) || 0;

    const payableAmount = Math.max(totalAmount - discount, 0);
    const currentDue = Math.max(payableAmount - paidAmount, 0);

    if (paymentAmount > currentDue) {
      throw new Error(`Payment amount cannot exceed due amount of ₹${currentDue}`);
    }

    // 3. Generate Receipt Number
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const prefix = `RCP${year}${month}${day}`;

    const lastReceipt = await tx.paymentReceipt.findFirst({
      where: { schoolId, receiptNo: { startsWith: prefix } },
      orderBy: { receiptNo: "desc" },
    });

    let sequence = 1;
    if (lastReceipt) {
      const lastSequence = parseInt(lastReceipt.receiptNo.slice(-4), 10);
      if (!Number.isNaN(lastSequence)) sequence = lastSequence + 1;
    }

    const receiptNo = `${prefix}${String(sequence).padStart(4, "0")}`;

    // 4. Create Payment
    const payment = await tx.payment.create({
      data: {
        schoolId,
        studentId: studentFee.studentId,
        studentFeeId: Number(studentFeeId),
        amount: paymentAmount,
        paymentMethod,
        status: PaymentTransactionStatus.SUCCESS,
        transactionId: transactionId || null,
        referenceNo: referenceNo || null,
        paymentDate: new Date(),
        remarks: remarks || null,
        collectedBy: Number(userId),
      },
    });

    // 5. Create Payment Receipt
    const receipt = await tx.paymentReceipt.create({
      data: {
        schoolId,
        studentId: studentFee.studentId,
        studentFeeId: Number(studentFeeId),
        paymentId: payment.id,
        receiptNo,
        amount: paymentAmount,
        issuedAt: new Date(),
        paymentMethod,
        transactionId: transactionId || null,
        remarks: remarks || null,
        receivedById: Number(userId),
        status: PaymentTransactionStatus.SUCCESS,
      },
    });

    // 6. Update Student Fee Status
    const newPaidAmount = paidAmount + paymentAmount;
    const newDueAmount = Math.max(payableAmount - newPaidAmount, 0);

    const newStatus =
      newDueAmount <= 0 ? "PAID" : newPaidAmount > 0 ? "PARTIAL" : "PENDING";

    await tx.studentFee.update({
      where: { id: Number(studentFeeId) },
      data: {
        paidAmount: newPaidAmount,
        dueAmount: newDueAmount,
        status: newStatus,
      },
    });

    return { payment, receipt };
  });
}
  // =====================================================
  // GET PAYMENTS
  // =====================================================
async getPayments(schoolId: number, query?: any) {
  return paymentRepository.findBySchool(schoolId, query);
}

  // =====================================================
  // PAYMENT REPORT
  // =====================================================


 async getPaymentReport(schoolId: number, query: any = {}) {
  const [studentFeeReport, summary, methodSummary, dailyCollection] = await Promise.all([
    paymentRepository.getStudentFeeReport(schoolId, query),
    paymentRepository.getPaymentSummary(schoolId, query),
    paymentRepository.getPaymentMethodSummary(schoolId, query),
    paymentRepository.getDailyCollection(schoolId, query),
  ]);

  console.log("=================================");
  console.log("PAYMENT REPORT SERVICE");
  console.log("QUERY:", query);
  console.log("STUDENT REPORT LENGTH:", studentFeeReport.length);
  console.log("STUDENT REPORT:", studentFeeReport);
  console.log("=================================");

  return {
    summary,
    methodSummary,
    dailyCollection,
    payments: studentFeeReport,
    pagination: {
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 1000,
      total: studentFeeReport.length,
      totalPages: studentFeeReport.length > 0 ? 1 : 0,
    },
  };
}

  // =====================================================
  // SUMMARY
  // =====================================================

  async getPaymentSummary(
    schoolId: number,
    query?: any
  ) {
    return paymentRepository.getPaymentSummary(
      schoolId,
      query
    );
  }

  // // =====================================================
  // // BY ID
  // // =====================================================
async getPaymentById(schoolId: number, id: number) {
  const payment = await paymentRepository.findById(schoolId, id);

  if (!payment) {
    throw new Error(`Payment receipt with ID ${id} not found`);
  }

  return payment;
}
//   // =====================================================
//   // BY RECEIPT
//   // =====================================================

// async getPaymentByReceiptNo(schoolId: number, receiptNo: string) {
//   const payment = await paymentRepository.findByReceiptNo(schoolId, receiptNo);

//   if (!payment) {
//     throw new Error(`Payment receipt ${receiptNo} not found`);
//   }

//   return payment;
// }

  // =====================================================
  // STUDENT PAYMENTS
  // =====================================================

async getPaymentStats(
  schoolId: number,
  academicYearId?: number
) {
  return paymentReportRepository.getPaymentStats(
    schoolId,
    academicYearId
  );
}
  async getStudentPayments(
    schoolId: number,
    studentId: number
  ) {
    return paymentRepository.findByStudent(
      schoolId,
      studentId
    );
  }

// =====================================================
// ANALYTICS
// =====================================================

async getPaymentAnalytics(schoolId: number, query: any = {}) {
  const [methodSummary, dailyCollection] = await Promise.all([
    paymentRepository.getPaymentMethodSummary(schoolId, query),
    paymentRepository.getDailyCollection(schoolId, query),
  ]);

  return {
    methodSummary,
    dailyCollection,
  };
}

// =====================================================
// UPDATE
// =====================================================

async updatePayment(schoolId: number, id: number, data: any) {
  const payment = await this.getPaymentById(schoolId, id);

  if (payment.status === PaymentTransactionStatus.SUCCESS) {
    throw new Error("Successful payment cannot be directly updated");
  }

  const result = await paymentRepository.update(schoolId, id, data);

  if (!result.count) {
    throw new Error("Payment not found");
  }

  return this.getPaymentById(schoolId, id);
}
  // =====================================================
// DELETE
// =====================================================

async deletePayment(schoolId: number, id: number) {
  const payment = await this.getPaymentById(schoolId, id);

  if (payment.status === PaymentTransactionStatus.SUCCESS) {
    throw new Error("Successful payment cannot be deleted");
  }

  const result = await paymentRepository.delete(schoolId, id);

  if (!result.count) {
    throw new Error("Payment not found");
  }

  return { message: "Payment deleted successfully" };
}

// =====================================================
// PENDING
// =====================================================

async getPendingPayments(schoolId: number, studentId?: number) {
  const where: any = {
    schoolId,
    status: {
      in: [FeeStatus.PENDING, FeeStatus.PARTIAL, FeeStatus.OVERDUE],
    },
  };

  if (studentId) {
    where.studentId = studentId;
  }

  return prisma.studentFee.findMany({
    where,
    include: {
      student: true,
      feeStructure: true,
      items: {
        include: {
          feeHead: true,
        },
      },
    },
    orderBy: { dueDate: "asc" },
  });
}
// =====================================================
// OVERDUE
// =====================================================

async getOverduePayments(schoolId: number, studentId?: number) {
  const where: any = {
    schoolId,
    status: FeeStatus.OVERDUE,
    dueDate: { lt: new Date() },
  };

  if (studentId) {
    where.studentId = studentId;
  }

  return prisma.studentFee.findMany({
    where,
    include: {
      student: true,
      feeStructure: true,
    },
    orderBy: { dueDate: "asc" },
  });
}

async refundPayment(
  paymentId: number,
  schoolId: number,
  amount: number,
  reason: string | undefined,
  referenceNo: string | undefined,
  refundMethod: PaymentMethod,
  refundedBy: number
) {
  return prisma.$transaction(async (tx) => {
    // 1. Find Payment
    const payment = await tx.payment.findFirst({
      where: { id: paymentId, schoolId },
      include: { refunds: true },
    });

    if (!payment) throw new Error("Payment not found");
    if (payment.status !== "SUCCESS") {
      throw new Error("Only successful payments can be refunded");
    }

    // 2. Calculate Refundable Amount
    const alreadyRefunded = payment.refunds.reduce(
      (sum, refund) => sum + Number(refund.amount),
      0
    );
    const refundableAmount = Number(payment.amount) - alreadyRefunded;

    if (amount <= 0) {
      throw new Error("Refund amount must be greater than zero");
    }
    if (amount > refundableAmount) {
      throw new Error(`Maximum refundable amount is ₹${refundableAmount}`);
    }

    // 3. Create Refund Record
    const refund = await tx.refund.create({
      data: {
        school: { connect: { id: schoolId } },
        payment: { connect: { id: payment.id } },
        student: { connect: { id: payment.studentId } },
        studentFee: { connect: { id: payment.studentFeeId } },
        amount,
        reason: reason ?? "Payment refund",
        transactionId: referenceNo,
        refundMethod,
        refundedUser: { connect: { id: refundedBy } },
        status: "COMPLETED",
        refundDate: new Date(),
      },
    });

    // 4. Update Payment Status
    const totalRefunded = alreadyRefunded + amount;
    const newPaymentStatus =
      totalRefunded >= Number(payment.amount)
        ? PaymentTransactionStatus.REFUNDED
        : PaymentTransactionStatus.PARTIALLY_REFUNDED;

    await tx.payment.update({
      where: { id: payment.id },
      data: { status: newPaymentStatus },
    });

    // 5. Find & Update Student Fee
    const studentFee = await tx.studentFee.findUnique({
      where: { id: payment.studentFeeId },
    });

    if (!studentFee) throw new Error("Student fee not found");

    const newPaidAmount = Number(studentFee.paidAmount) - amount;
    if (newPaidAmount < 0) {
      throw new Error("Refund amount exceeds paid amount");
    }

    const payableAmount =
      Number(studentFee.totalAmount) -
      Number(studentFee.discount) +
      Number(studentFee.lateFee);

    const newDueAmount = payableAmount - newPaidAmount;

    let newStatus: "PAID" | "PARTIAL" | "PENDING" | "OVERDUE";
    if (newPaidAmount <= 0) {
      newStatus = "PENDING";
    } else if (newPaidAmount >= payableAmount) {
      newStatus = "PAID";
    } else {
      newStatus = "PARTIAL";
    }

    await tx.studentFee.update({
      where: { id: studentFee.id },
      data: {
        paidAmount: newPaidAmount,
        dueAmount: Math.max(0, newDueAmount),
        status: newStatus,
      },
    });

    return refund;
  });
}

async getPaymentRefunds(paymentId: number, schoolId: number) {
  const payment = await prisma.payment.findFirst({
    where: { id: paymentId, schoolId },
    select: { id: true },
  });

  if (!payment) throw new Error("Payment not found");

  return prisma.refund.findMany({
    where: { paymentId: payment.id, schoolId },
    orderBy: { createdAt: "desc" },
  });
}
async cancelPayment(paymentId: number, schoolId: number) {
  return paymentRepository.cancelPayment(paymentId, schoolId);
}
}