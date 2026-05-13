// =====================================================
// studentFee.repository.ts
// =====================================================

import prisma
from "../../config/prisma.js";

class StudentFeeRepository {

  // =====================================
  // GENERATE FEE
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
        },
      });
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

          createdAt: "desc",
        },
      });
  }

  // =====================================
  // GET BY ID
  // =====================================

  async getById(
    id: number
  ) {

    return prisma
      .studentFee
      .findUnique({

        where: { id },

        include: {

          student: true,

          feeStructure: true,

          receipts: true,
        },
      });
  }

  // =====================================
  // UPDATE PAYMENT
  // =====================================

  async updatePayment(

    id: number,

    data: any
  ) {

    return prisma
      .studentFee
      .update({

        where: { id },

        data,
      });
  }

  // =====================================
  // CREATE RECEIPT
  // =====================================

  async createReceipt(
    data: any
  ) {

    return prisma
      .paymentReceipt
      .create({

        data,
      });
  }

  // =====================================
  // STUDENT HISTORY
  // =====================================

  async getStudentHistory(

    schoolId: number,

    studentId: number
  ) {

    return prisma
      .studentFee
      .findMany({

        where: {

          schoolId,

          studentId,
        },

        include: {

          feeStructure: true,

          receipts: true,
        },

        orderBy: {

          createdAt: "desc",
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