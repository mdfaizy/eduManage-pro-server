import prisma from "../../config/prisma.js";
import { CreateLateFeeWaiverDTO } from "./lateFeeWaiver.types.js";

class LateFeeWaiverRepository {

  // ==========================================
  // FIND STUDENT FEE
  // ==========================================

  async getStudentFee(
    studentFeeId: number,
    schoolId: number
  ) {
    return prisma.studentFee.findFirst({
      where: {
        id: studentFeeId,
        schoolId,
      },
    });
  }

  // ==========================================
  // CREATE WAIVER
  // ==========================================

  async create(
    data: CreateLateFeeWaiverDTO
  ) {
    return prisma.$transaction(async (tx) => {

      const studentFee =
        await tx.studentFee.findFirst({
          where: {
            id: data.studentFeeId,
            schoolId: data.schoolId,
          },
        });

      if (!studentFee) {
        throw new Error(
          "Student fee not found"
        );
      }

      // ======================================
      // CHECK AVAILABLE LATE FEE
      // ======================================

      const currentLateFee =
        Number(studentFee.lateFee || 0);

      const alreadyWaived =
        Number(studentFee.lateFeeWaived || 0);

      const remainingLateFee =
        currentLateFee - alreadyWaived;

      if (data.amount > remainingLateFee) {
        throw new Error(
          `Maximum waiver amount is ₹${remainingLateFee}`
        );
      }

      // ======================================
      // CREATE WAIVER
      // ======================================

      const waiver =
        await tx.lateFeeWaiver.create({
          data: {
            schoolId: data.schoolId,
            studentFeeId: data.studentFeeId,
            amount: data.amount,
            reason: data.reason,
            waivedBy: data.waivedBy,
          },
        });

      // ======================================
      // UPDATE STUDENT FEE
      // ======================================

      const newLateFeeWaived =
        alreadyWaived + data.amount;

      // Original payable calculation
      const totalAmount =
        Number(studentFee.totalAmount);

      const discount =
        Number(studentFee.discount || 0);

      const lateFee =
        Number(studentFee.lateFee || 0);

      const paidAmount =
        Number(studentFee.paidAmount || 0);

      const payableAmount =
        totalAmount -
        discount +
        lateFee -
        newLateFeeWaived;

      const dueAmount =
        Math.max(
          0,
          payableAmount - paidAmount
        );

      let status:
        | "PAID"
        | "PARTIAL"
        | "PENDING"
        | "OVERDUE";

      if (paidAmount <= 0) {
        status = "PENDING";
      } else if (
        paidAmount >= payableAmount
      ) {
        status = "PAID";
      } else {
        status = "PARTIAL";
      }

      await tx.studentFee.update({
        where: {
          id: studentFee.id,
        },

        data: {
          lateFeeWaived:
            newLateFeeWaived,

          dueAmount,

          status,
        },
      });

      return waiver;
    });
  }

  // ==========================================
  // GET ALL WAIVERS
  // ==========================================

  async getAll(
    schoolId: number
  ) {
    return prisma.lateFeeWaiver.findMany({
      where: {
        schoolId,
      },

      include: {
        studentFee: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // ==========================================
  // GET BY STUDENT FEE
  // ==========================================

  async getByStudentFee(
    studentFeeId: number,
    schoolId: number
  ) {
    return prisma.lateFeeWaiver.findMany({
      where: {
        studentFeeId,
        schoolId,
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }
}

export default new LateFeeWaiverRepository();