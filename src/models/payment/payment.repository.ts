import prisma from "../../config/prisma";
import {
  FeeStatus,
 PaymentTransactionStatus,
} from "../../generated/prisma";

export class PaymentRepository {

  // =====================================================
  // FIND PAYMENTS
  // =====================================================

  async findBySchool(
    schoolId: number,
    query: any = {}
  ) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(
      Math.max(Number(query.limit) || 10, 1),
      100
    );

    const skip = (page - 1) * limit;

    const where: any = {
      schoolId,
    };

    // ---------------------------------------------------
    // DATE
    // ---------------------------------------------------

    if (query.startDate || query.endDate) {
      where.paymentDate = {};

      if (query.startDate) {
        where.paymentDate.gte =
          new Date(`${query.startDate}T00:00:00`);
      }

      if (query.endDate) {
        where.paymentDate.lte =
          new Date(`${query.endDate}T23:59:59.999`);
      }
    }

    // ---------------------------------------------------
    // PAYMENT METHOD
    // ---------------------------------------------------

    if (
      query.paymentMethod &&
      query.paymentMethod !== "ALL"
    ) {
      where.paymentMethod = query.paymentMethod;
    }

    // ---------------------------------------------------
    // PAYMENT STATUS
    // ---------------------------------------------------

    if (
      query.status &&
      query.status !== "ALL"
    ) {
      where.status = query.status;
    }

    // ---------------------------------------------------
    // CLASS
    // ---------------------------------------------------

    if (query.classId) {
      where.studentFee = {
        ...(where.studentFee || {}),
        feeStructure: {
          ...(where.studentFee?.feeStructure || {}),
          classId: Number(query.classId),
        },
      };
    }

    // ---------------------------------------------------
    // ACADEMIC YEAR
    // ---------------------------------------------------

    if (query.academicYearId) {
      where.studentFee = {
        ...(where.studentFee || {}),
        feeStructure: {
          ...(where.studentFee?.feeStructure || {}),
          academicYearId: Number(query.academicYearId),
        },
      };
    }

    // ---------------------------------------------------
    // SEARCH
    // ---------------------------------------------------

    if (query.search?.trim()) {
      const search = query.search.trim();

      where.OR = [
        {
          receiptNo: {
            contains: search,
          },
        },
        {
          transactionId: {
            contains: search,
          },
        },
        {
          studentFee: {
            student: {
              firstName: {
                contains: search,
              },
            },
          },
        },
        {
          studentFee: {
            student: {
              lastName: {
                contains: search,
              },
            },
          },
        },
      ];
    }

    const [payments, total] = await Promise.all([
      prisma.paymentReceipt.findMany({
        where,

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

          receivedBy: {
            select: {
              id: true,
      name: true,
      email: true,
            },
          },
        },

        skip,
        take: limit,

        orderBy: {
          paymentDate: "desc",
        },
      }),

      prisma.paymentReceipt.count({
        where,
      }),
    ]);

    return {
      payments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // =====================================================
  // SUMMARY
  // =====================================================

async getPaymentSummary(
  schoolId: number,
  query: any = {}
) {
  /**
   * ---------------------------------------------------------
   * PAYMENT RECEIPT FILTER
   * ---------------------------------------------------------
   */
  const paymentWhere: any = {
    schoolId,
  };

  // Payment method filter
  if (
    query.paymentMethod &&
    query.paymentMethod !== "ALL"
  ) {
    paymentWhere.paymentMethod = query.paymentMethod;
  }

  // Payment status filter
  if (
    query.status &&
    query.status !== "ALL"
  ) {
    paymentWhere.status = query.status;
  }

  /**
   * ---------------------------------------------------------
   * STUDENT FEE FILTER
   * Class + Academic Year
   * ---------------------------------------------------------
   */
  const studentFeeWhere: any = {
    schoolId,
  };

  if (query.classId) {
    studentFeeWhere.feeStructure = {
      classId: Number(query.classId),
    };
  }

  if (query.academicYearId) {
    studentFeeWhere.feeStructure = {
      ...(studentFeeWhere.feeStructure || {}),
      academicYearId: Number(query.academicYearId),
    };
  }

  /**
   * ---------------------------------------------------------
   * DATE RANGE
   * ---------------------------------------------------------
   */

  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(
    startOfTomorrow.getDate() + 1
  );

  // Monday = start of week
  const startOfWeek = new Date(startOfToday);
  const day = startOfWeek.getDay();

  const diff = day === 0 ? 6 : day - 1;

  startOfWeek.setDate(
    startOfWeek.getDate() - diff
  );

  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const startOfYear = new Date(
    now.getFullYear(),
    0,
    1
  );

  /**
   * ---------------------------------------------------------
   * OPTIONAL REPORT DATE FILTER
   * ---------------------------------------------------------
   */

  const dateFilter: any = {};

  if (query.startDate) {
    dateFilter.gte = new Date(
      `${query.startDate}T00:00:00`
    );
  }

  if (query.endDate) {
    dateFilter.lte = new Date(
      `${query.endDate}T23:59:59.999`
    );
  }

  if (
    dateFilter.gte ||
    dateFilter.lte
  ) {
    paymentWhere.paymentDate = dateFilter;
  }

  /**
   * ---------------------------------------------------------
   * PAYMENT COLLECTION DATA
   * ---------------------------------------------------------
   */

  const [
    totalCollection,
    todayCollection,
    weekCollection,
    monthCollection,
    totalTransactions,
  ] = await Promise.all([
    // Total collection
    prisma.paymentReceipt.aggregate({
      where: paymentWhere,
      _sum: {
        amount: true,
      },
    }),

    // Today's collection
    prisma.paymentReceipt.aggregate({
      where: {
        ...paymentWhere,
        paymentDate: {
          gte: startOfToday,
          lt: startOfTomorrow,
        },
      },
      _sum: {
        amount: true,
      },
    }),

    // This week's collection
    prisma.paymentReceipt.aggregate({
      where: {
        ...paymentWhere,
        paymentDate: {
          gte: startOfWeek,
        },
      },
      _sum: {
        amount: true,
      },
    }),

    // This month's collection
    prisma.paymentReceipt.aggregate({
      where: {
        ...paymentWhere,
        paymentDate: {
          gte: startOfMonth,
        },
      },
      _sum: {
        amount: true,
      },
    }),

    // Total receipts
    prisma.paymentReceipt.count({
      where: paymentWhere,
    }),
  ]);

  /**
   * ---------------------------------------------------------
   * STUDENT FEE DATA
   * ---------------------------------------------------------
   */

  const [
    totalFee,
    totalPaid,
    totalDue,
    totalDiscount,
    totalLateFee,
    totalStudents,
    overdueFee,
  ] = await Promise.all([
    // Total assigned fee
    prisma.studentFee.aggregate({
      where: studentFeeWhere,
      _sum: {
        totalAmount: true,
      },
    }),

    // Total paid
    prisma.studentFee.aggregate({
      where: studentFeeWhere,
      _sum: {
        paidAmount: true,
      },
    }),

    // Total pending/due
    prisma.studentFee.aggregate({
      where: studentFeeWhere,
      _sum: {
        dueAmount: true,
      },
    }),

    // Total discount
    prisma.studentFee.aggregate({
      where: studentFeeWhere,
      _sum: {
        discount: true,
      },
    }),

    // Total late fee
    prisma.studentFee.aggregate({
      where: studentFeeWhere,
      _sum: {
        lateFee: true,
      },
    }),

    // Unique students having fee records
    prisma.studentFee.findMany({
      where: studentFeeWhere,
      select: {
        studentId: true,
      },
      distinct: ["studentId"],
    }),

    // Overdue amount
    prisma.studentFee.aggregate({
      where: {
        ...studentFeeWhere,
        dueAmount: {
          gt: 0,
        },
        dueDate: {
          lt: now,
        },
      },
      _sum: {
        dueAmount: true,
      },
    }),
  ]);

  /**
   * ---------------------------------------------------------
   * NORMALIZE VALUES
   * ---------------------------------------------------------
   */

  const totalFeeAmount = Number(
    totalFee._sum.totalAmount || 0
  );

  const totalCollected = Number(
    totalCollection._sum.amount || 0
  );

  const totalPending = Number(
    totalDue._sum.dueAmount || 0
  );

  const totalDiscountAmount = Number(
    totalDiscount._sum.discount || 0
  );

  const totalLateFeeAmount = Number(
    totalLateFee._sum.lateFee || 0
  );

  const totalOverdue = Number(
    overdueFee._sum.dueAmount || 0
  );

  /**
   * ---------------------------------------------------------
   * PERCENTAGES
   * ---------------------------------------------------------
   */

  const collectionRate =
    totalFeeAmount > 0
      ? Number(
          (
            (totalCollected /
              totalFeeAmount) *
            100
          ).toFixed(2)
        )
      : 0;

  const pendingRate =
    totalFeeAmount > 0
      ? Number(
          (
            (totalPending /
              totalFeeAmount) *
            100
          ).toFixed(2)
        )
      : 0;

  /**
   * ---------------------------------------------------------
   * FINAL RESPONSE
   * ---------------------------------------------------------
   */

  return {
    totalStudents:
      totalStudents.length,

    totalFeeAmount,

    totalCollected,

    totalPending,

    totalDiscount:
      totalDiscountAmount,

    totalOverdue,

    totalLateFee:
      totalLateFeeAmount,

    collectionRate,

    pendingRate,

    todayCollection:
      Number(
        todayCollection._sum.amount || 0
      ),

    weekCollection:
      Number(
        weekCollection._sum.amount || 0
      ),

    monthCollection:
      Number(
        monthCollection._sum.amount || 0
      ),

    totalTransactions,
  };
}

  // =====================================================
  // METHOD SUMMARY
  // =====================================================

  async getPaymentMethodSummary(
    schoolId: number,
    query: any = {}
  ) {
    const where: any = {
      schoolId,
    };

    if (query.startDate || query.endDate) {
      where.paymentDate = {};

      if (query.startDate) {
        where.paymentDate.gte =
          new Date(`${query.startDate}T00:00:00`);
      }

      if (query.endDate) {
        where.paymentDate.lte =
          new Date(`${query.endDate}T23:59:59.999`);
      }
    }

    const result =
      await prisma.paymentReceipt.groupBy({
        by: ["paymentMethod"],

        where,

        _sum: {
          amount: true,
        },

        _count: {
          _all: true,
        },
      });

    return result.map((item: any) => ({
      method: item.paymentMethod,

      total: Number(
        item._sum.amount || 0
      ),

      count: item._count._all,
    }));
  }

  // =====================================================
  // DAILY COLLECTION
  // =====================================================

 async getDailyCollection(
  schoolId: number,
  query: any = {}
) {
  const startDate = query.startDate
    ? new Date(`${query.startDate}T00:00:00`)
    : new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      );

  const endDate = query.endDate
    ? new Date(`${query.endDate}T23:59:59.999`)
    : new Date();

  const result = await prisma.$queryRaw`
    SELECT
      DATE(paymentDate) AS date,
      SUM(amount) AS total,
      COUNT(*) AS count
    FROM paymentreceipt
    WHERE schoolId = ${schoolId}
      AND paymentDate BETWEEN ${startDate} AND ${endDate}
    GROUP BY DATE(paymentDate)
    ORDER BY date ASC
  `;

  return result.map((item: any) => ({
    date: item.date,
    total: Number(item.total || 0),
    count: Number(item.count || 0),
  }));
}

  // =====================================================
  // FIND BY ID + SCHOOL
  // =====================================================

  async findById(
    schoolId: number,
    id: number
  ) {
    return prisma.paymentReceipt.findFirst({
      where: {
        id,
        schoolId,
      },

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

            items: {
              include: {
                feeHead: true,
              },
            },
          },
        },

        receivedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        school: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  // =====================================================
  // FIND BY RECEIPT + SCHOOL
  // =====================================================

  async findByReceiptNo(
    schoolId: number,
    receiptNo: string
  ) {
    return prisma.paymentReceipt.findFirst({
      where: {
        schoolId,
        receiptNo,
      },

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
  // STUDENT PAYMENTS
  // =====================================================

  async findByStudent(
    schoolId: number,
    studentId: number
  ) {
    return prisma.paymentReceipt.findMany({
      where: {
        schoolId,

        studentFee: {
          studentId,
        },
      },

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

      orderBy: {
        paymentDate: "desc",
      },
    });
  }

  // =====================================================
  // CREATE PAYMENT
  // =====================================================

  async create(
    data: any
  ) {
    return prisma.paymentReceipt.create({
      data,

      include: {
        studentFee: {
          include: {
            student: true,
            feeStructure: true,
          },
        },

        receivedBy: true,
      },
    });
  }

  // =====================================================
  // UPDATE
  // =====================================================

  async update(
    schoolId: number,
    id: number,
    data: any
  ) {
    return prisma.paymentReceipt.updateMany({
      where: {
        id,
        schoolId,
      },

      data,
    });
  }

  // =====================================================
  // DELETE
  // =====================================================

  async delete(
    schoolId: number,
    id: number
  ) {
    return prisma.paymentReceipt.deleteMany({
      where: {
        id,
        schoolId,
      },
    });
  }

  // =====================================================
  // TOTAL PAID BY STUDENT FEE
  // =====================================================

  async getTotalAmountByStudentFee(
    studentFeeId: number
  ) {
    return prisma.paymentReceipt.aggregate({
      where: {
        studentFeeId,
        status: PaymentTransactionStatus.SUCCESS,
      },

      _sum: {
        amount: true,
      },
    });
  }
}