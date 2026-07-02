import prisma
from "../config/prisma.js";

import {
  calculateFee,
} from "./feeCalculation.js";

export const recalculatePendingFees =

  async (
    studentId: number
  ) => {

    // =========================
    // STUDENT SCHOLARSHIP
    // =========================

    const studentScholarship =

      await prisma
        .studentScholarship
        .findFirst({

          where: {

            studentId,

            isActive: true,
          },

          include: {

            scholarship: true,
          },
        });

    // =========================
    // FIND PENDING FEES
    // =========================

    const pendingFees =

      await prisma
        .studentFee
        .findMany({

          where: {

            studentId,

            status: {

              not: "PAID",
            },
          },

          include: {

            feeStructure: true,
          },
        });

    // =========================
    // LOOP
    // =========================

    for (const fee of pendingFees) {

      const grossAmount =

        fee.totalAmount;

      // =====================
      // CALCULATE
      // =====================

      const {

        discount,

        finalAmount,

      } = calculateFee(

        grossAmount,

        studentScholarship
          ?.scholarship
      );

      // =====================
      // UPDATE
      // =====================

      await prisma
        .studentFee
        .update({

          where: {

            id: fee.id,
          },

          data: {

            discount,

            dueAmount:
              finalAmount -
              fee.paidAmount,

            status:

              fee.paidAmount >=
              finalAmount

                ? "PAID"

                : fee.paidAmount > 0

                ? "PARTIAL"

                : "PENDING",
          },
        });
    }
  };