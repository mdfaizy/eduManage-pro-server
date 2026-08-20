import prisma from "../../config/prisma.js";
import { CreatePaymentReceiptDTO } from "./paymentReceipt.types.js";

const defaultIncludes = {
  payment: true,
  studentFee: true,
  receivedBy: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
};

class PaymentReceiptRepository {



    // =====================================================
  // GET ONE RECEIPT
  // =====================================================

  async getOne(id: number, schoolId: number) {
    return prisma.paymentReceipt.findFirst({
      where: { id, schoolId },
      include: defaultIncludes,
    });
  }


    // =====================================================
  // GET ALL RECEIPTS
  // =====================================================

  async getAll(schoolId: number) {
    return prisma.paymentReceipt.findMany({
      where: { schoolId },
      include: defaultIncludes,
      orderBy: { issuedAt: "desc" },
    });
  }

    // =====================================================
  // FIND BY RECEIPT NUMBER
  // =====================================================

  // async findByReceiptNo(receiptNo: string, schoolId: number) {
  //   return prisma.paymentReceipt.findFirst({
  //     where: { receiptNo, schoolId },
  //     include: defaultIncludes,
  //   });
  // }
  async findByReceiptNo(schoolId: number, receiptNo: string) {
  return prisma.paymentReceipt.findFirst({
    where: { schoolId, receiptNo },
    include: {
      studentFee: {
        include: {
          student: true,
          feeStructure: {
            include: {
              class: true,
              academicYear: true,
            },
          },
        },
      },
      receivedBy: true,
    },
  });
}



  // =====================================================
  // GET RECEIPTS BY PAYMENT
  // =====================================================

  async getByPayment(paymentId: number, schoolId: number) {
    return prisma.paymentReceipt.findMany({
      where: { paymentId, schoolId },
      include: defaultIncludes,
      orderBy: { issuedAt: "desc" },
    });
  }

 // =====================================================
  // GET RECEIPTS BY STUDENT FEE
  // =====================================================

  async getByStudentFee(studentFeeId: number, schoolId: number) {
    return prisma.paymentReceipt.findMany({
      where: { studentFeeId, schoolId },
      include: defaultIncludes,
      orderBy: { issuedAt: "desc" },
    });
  }


  
  // =====================================================
  // CREATE RECEIPT
  // =====================================================

  async create(data: CreatePaymentReceiptDTO) {
    return prisma.paymentReceipt.create({
      data: {
        schoolId: data.schoolId,
        paymentId: data.paymentId,
        studentId: data.studentId,
        studentFeeId: data.studentFeeId,
        receiptNo: data.receiptNo,
        amount: data.amount,
        issuedAt: data.issuedAt ?? new Date(),
        paymentMethod: data.paymentMethod,
        transactionId: data.transactionId ?? null,
        remarks: data.remarks ?? null,
        receivedById: data.receivedById ?? null,
        status: data.status,
      },
    });
  }

  // =====================================================
  // FIND PAYMENT
  // Used to verify that payment exists
  // =====================================================

  async getPayment(paymentId: number, schoolId: number) {
    return prisma.payment.findFirst({
      where: { id: paymentId, schoolId },
    });
  }

  // =====================================================
  // CHECK EXISTING RECEIPT
  // One payment should have one receipt
  // =====================================================

  async findByPayment(paymentId: number, schoolId: number) {
    return prisma.paymentReceipt.findFirst({
      where: { paymentId, schoolId },
    });
  } 
}

export default new PaymentReceiptRepository();