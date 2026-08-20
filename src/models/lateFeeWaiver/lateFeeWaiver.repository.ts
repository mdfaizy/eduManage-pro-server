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

      // ======================================
      // FIND STUDENT FEE
      // ======================================

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
      // VALIDATE AMOUNT
      // ======================================

      if (
        !Number.isFinite(data.amount) ||
        data.amount <= 0
      ) {
        throw new Error(
          "Waiver amount must be greater than 0"
        );
      }

      // ======================================
      // CURRENT LATE FEE
      // ======================================

      const currentLateFee =
        Number(studentFee.lateFee || 0);

      if (currentLateFee <= 0) {
        throw new Error(
          "No late fee is available for waiver"
        );
      }

      // ======================================
      // GET ALREADY WAIVED AMOUNT
      // ======================================

      const existingWaivers =
        await tx.lateFeeWaiver.aggregate({
          where: {
            studentFeeId:
              data.studentFeeId,

            schoolId:
              data.schoolId,
          },

          _sum: {
            amount: true,
          },
        });

      const alreadyWaived =
        Number(
          existingWaivers._sum.amount || 0
        );

      // ======================================
      // REMAINING LATE FEE
      // ======================================

      const remainingLateFee =
        Math.max(
          0,
          currentLateFee -
            alreadyWaived
        );

      if (remainingLateFee <= 0) {
        throw new Error(
          "No late fee is available for waiver"
        );
      }

      // ======================================
      // MAXIMUM WAIVER CHECK
      // ======================================

      if (
        data.amount >
        remainingLateFee
      ) {
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
            schoolId:
              data.schoolId,

            studentFeeId:
              data.studentFeeId,

            amount:
              data.amount,

            reason:
              data.reason,

            waivedBy:
              data.waivedBy,
          },
        });

      // ======================================
      // TOTAL WAIVED
      // ======================================

      const totalWaived =
        alreadyWaived +
        data.amount;

      // ======================================
      // CALCULATE PAYABLE
      // ======================================

      const totalAmount =
        Number(
          studentFee.totalAmount
        );

      const discount =
        Number(
          studentFee.discount || 0
        );

      const lateFee =
        Number(
          studentFee.lateFee || 0
        );

      const paidAmount =
        Number(
          studentFee.paidAmount || 0
        );

      const payableAmount =
        Math.max(
          0,
          totalAmount -
            discount +
            lateFee -
            totalWaived
        );

      // ======================================
      // CALCULATE DUE AMOUNT
      // ======================================

      const dueAmount =
        Math.max(
          0,
          payableAmount -
            paidAmount
        );

      // ======================================
      // CALCULATE STATUS
      // ======================================

      let status:
        | "PAID"
        | "PARTIAL"
        | "PENDING"
        | "OVERDUE";

      if (
        paidAmount >=
        payableAmount
      ) {
        status = "PAID";

      } else if (
        paidAmount > 0
      ) {
        status = "PARTIAL";

      } else {
        status = "PENDING";
      }

      // ======================================
      // UPDATE STUDENT FEE
      // ======================================

      await tx.studentFee.update({
        where: {
          id: studentFee.id,
        },

        data: {
          dueAmount,
          status,
        },
      });

      // ======================================
      // RETURN WAIVER
      // ======================================

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
        waivedAt: "desc",
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
        waivedAt: "desc",
      },
    });
  }
}

export default new LateFeeWaiverRepository();