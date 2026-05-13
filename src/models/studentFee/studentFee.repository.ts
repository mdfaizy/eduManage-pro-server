// =====================================================
// studentFee.repository.ts
// =====================================================

import prisma
from "../../config/prisma.js";

class StudentFeeRepository {

  // =====================================
  // GENERATE
  // =====================================

  async generate(
    data: any
  ) {

    return prisma
      .studentFee
      .create({

        data,

        include: {

          student: true,

          feeStructure: true,

          receipts: true,
        },
      });
  }

  // =====================================
  // PAY FEE
  // =====================================

  async payFee(
    data: any
  ) {

    const fee =
      await prisma
        .studentFee
        .findUnique({

          where: {
            id:
              data.studentFeeId,
          },
        });

    if (!fee) {

      throw new Error(
        "Fee not found"
      );
    }

    const newPaid =

      fee.paidAmount +
      data.amount;

    const newDue =

      fee.totalAmount -
      newPaid;

    const status =

      newDue <= 0

        ? "PAID"

        : "PARTIAL";

    // UPDATE FEE

    const updatedFee =
      await prisma
        .studentFee
        .update({

          where: {
            id: fee.id,
          },

          data: {

            paidAmount:
              newPaid,

            dueAmount:
              newDue,

            status,
          },
        });

    // RECEIPT

    await prisma
      .paymentReceipt
      .create({

        data: {

          schoolId:
            fee.schoolId,

          studentFeeId:
            fee.id,

          amount:
            data.amount,

          paymentMethod:
            data.paymentMethod,

          transactionId:
            data.transactionId,

          remarks:
            data.remarks,

          paymentDate:
            new Date(),

          receiptNo:
            `REC-${Date.now()}`
        },
      });

    return updatedFee;
  }

  // =====================================
  // GET ALL
  // =====================================

  async getAll(
    schoolId: number
  ) {

    return prisma
      .studentFee
      .findMany({

        where: {
          schoolId,
        },

        include: {

          student: true,

          feeStructure: true,

          receipts: true,
        },

        orderBy: {

          createdAt:
            "desc",
        },
      });
  }

  // =====================================
  // STUDENT HISTORY
  // =====================================

  async getStudentHistory(
    studentId: number
  ) {

    return prisma
      .studentFee
      .findMany({

        where: {
          studentId,
        },

        include: {

          receipts: true,

          feeStructure: true,
        },

        orderBy: {

          createdAt:
            "desc",
        },
      });
  }

  // =====================================
  // DUE FEES
  // =====================================

  async getDueFees(
    schoolId: number
  ) {

    return prisma
      .studentFee
      .findMany({

        where: {

          schoolId,

          dueAmount: {

            gt: 0,
          },
        },

        include: {

          student: true,

          feeStructure: true,
        },
      });
  }
}

export default
new StudentFeeRepository();