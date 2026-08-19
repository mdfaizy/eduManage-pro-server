import prisma from "../../config/prisma";
import { PaymentTransactionStatus,} from "../../generated/prisma";

interface StudentFeeReportQuery {
  page?: number | string;
  limit?: number | string;

  academicYearId?: number | string;
  classId?: number | string;
  studentId?: number | string;

  search?: string;

  startDate?: string;
  endDate?: string;

  status?: string;
  paymentMethod?: string;

  sortBy?: string;
  sortOrder?: string;
}


export class PaymentRepository {

  // =====================================================
  // FIND PAYMENTS
  // =====================================================

  // async findBySchool(
  //   schoolId: number,
  //   query: any = {}
  // ) {
  //   const page = Math.max(Number(query.page) || 1, 1);
  //   const limit = Math.min(
  //     Math.max(Number(query.limit) || 10, 1),
  //     100
  //   );

  //   const skip = (page - 1) * limit;

  //   const where: any = {
  //     schoolId,
  //   };

  //   // ---------------------------------------------------
  //   // DATE
  //   // ---------------------------------------------------

  //   if (query.startDate || query.endDate) {
  //     where.paymentDate = {};

  //     if (query.startDate) {
  //       where.paymentDate.gte =
  //         new Date(`${query.startDate}T00:00:00`);
  //     }

  //     if (query.endDate) {
  //       where.paymentDate.lte =
  //         new Date(`${query.endDate}T23:59:59.999`);
  //     }
  //   }

  //   // ---------------------------------------------------
  //   // PAYMENT METHOD
  //   // ---------------------------------------------------

  //   if (
  //     query.paymentMethod &&
  //     query.paymentMethod !== "ALL"
  //   ) {
  //     where.paymentMethod = query.paymentMethod;
  //   }

  //   // ---------------------------------------------------
  //   // PAYMENT STATUS
  //   // ---------------------------------------------------

  //   if (
  //     query.status &&
  //     query.status !== "ALL"
  //   ) {
  //     where.status = query.status;
  //   }

  //   // ---------------------------------------------------
  //   // CLASS
  //   // ---------------------------------------------------

  //   if (query.classId) {
  //     where.studentFee = {
  //       ...(where.studentFee || {}),
  //       feeStructure: {
  //         ...(where.studentFee?.feeStructure || {}),
  //         classId: Number(query.classId),
  //       },
  //     };
  //   }

  //   // ---------------------------------------------------
  //   // ACADEMIC YEAR
  //   // ---------------------------------------------------

  //   if (query.academicYearId) {
  //     where.studentFee = {
  //       ...(where.studentFee || {}),
  //       feeStructure: {
  //         ...(where.studentFee?.feeStructure || {}),
  //         academicYearId: Number(query.academicYearId),
  //       },
  //     };
  //   }

  //   // ---------------------------------------------------
  //   // SEARCH
  //   // ---------------------------------------------------

  //   if (query.search?.trim()) {
  //     const search = query.search.trim();

  //     where.OR = [
  //       {
  //         receiptNo: {
  //           contains: search,
  //         },
  //       },
  //       {
  //         transactionId: {
  //           contains: search,
  //         },
  //       },
  //       {
  //         studentFee: {
  //           student: {
  //             firstName: {
  //               contains: search,
  //             },
  //           },
  //         },
  //       },
  //       {
  //         studentFee: {
  //           student: {
  //             lastName: {
  //               contains: search,
  //             },
  //           },
  //         },
  //       },
  //     ];
  //   }

  //   const [payments, total] = await Promise.all([
  //     prisma.paymentReceipt.findMany({
  //       where,

  //       include: {
  //         studentFee: {
  //           include: {
  //             student: true,

  //             feeStructure: {
  //               include: {
  //                 class: true,
  //                 academicYear: true,
  //               },
  //             },
  //           },
  //         },

  //         receivedBy: {
  //           select: {
  //             id: true,
  //     name: true,
  //     email: true,
  //           },
  //         },
  //       },

  //       skip,
  //       take: limit,

  //       orderBy: {
  //         paymentDate: "desc",
  //       },
  //     }),

  //     prisma.paymentReceipt.count({
  //       where,
  //     }),
  //   ]);

  //   return {
  //     payments,
  //     pagination: {
  //       page,
  //       limit,
  //       total,
  //       totalPages: Math.ceil(total / limit),
  //     },
  //   };
  // }

  async findBySchool(
  schoolId: number,
  query: any = {}
) {
  const page = Math.max(
    Number(query.page) || 1,
    1
  );

  const limit = Math.min(
    Math.max(Number(query.limit) || 10, 1),
    100
  );

  const skip = (page - 1) * limit;

  // =====================================================
  // WHERE
  // =====================================================

  const where: any = {
    schoolId,
  };

  // =====================================================
  // DATE FILTER
  // =====================================================

  if (query.startDate || query.endDate) {
    where.paymentDate = {};

    if (query.startDate) {
      where.paymentDate.gte = new Date(
        `${query.startDate}T00:00:00`
      );
    }

    if (query.endDate) {
      where.paymentDate.lte = new Date(
        `${query.endDate}T23:59:59.999`
      );
    }
  }

  // =====================================================
  // PAYMENT METHOD
  // =====================================================

  if (
    query.paymentMethod &&
    query.paymentMethod !== "ALL"
  ) {
    where.paymentMethod =
      query.paymentMethod;
  }

  // =====================================================
  // PAYMENT STATUS
  // =====================================================

  if (
    query.status &&
    query.status !== "ALL"
  ) {
    where.status = query.status;
  }

  // =====================================================
  // CLASS
  // =====================================================

  if (query.classId) {
    where.studentFee = {
      ...(where.studentFee || {}),

      feeStructure: {
        ...(where.studentFee?.feeStructure || {}),

        classId: Number(query.classId),
      },
    };
  }

  // =====================================================
  // ACADEMIC YEAR
  // =====================================================

  if (query.academicYearId) {
    where.studentFee = {
      ...(where.studentFee || {}),

      feeStructure: {
        ...(where.studentFee?.feeStructure || {}),

        academicYearId:
          Number(query.academicYearId),
      },
    };
  }

  // =====================================================
  // SEARCH
  // =====================================================

  if (query.search?.trim()) {
    const search =
      query.search.trim();

    where.OR = [
      // Payment reference number
      {
        referenceNo: {
          contains: search,
        },
      },

      // Gateway transaction ID
      {
        transactionId: {
          contains: search,
        },
      },

      // Student first name
      {
        student: {
          firstName: {
            contains: search,
          },
        },
      },

      // Student last name
      {
        student: {
          lastName: {
            contains: search,
          },
        },
      },

      // Invoice number
      {
        studentFee: {
          invoiceNo: {
            contains: search,
          },
        },
      },
    ];
  }

  // =====================================================
  // GET PAYMENTS
  // IMPORTANT:
  // Payment table se data lena hai
  // =====================================================

  const [payments, total] =
    await Promise.all([
      prisma.payment.findMany({
        where,

        include: {
          student: true,

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

          collector: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },

          receipts: true,

          refunds: true,
        },

        skip,
        take: limit,

        orderBy: {
          paymentDate: "desc",
        },
      }),

      // IMPORTANT:
      // Count bhi Payment table ka hoga
      prisma.payment.count({
        where,
      }),
    ]);

  // =====================================================
  // RESPONSE
  // =====================================================

  return {
    payments,

    pagination: {
      page,
      limit,
      total,
      totalPages:
        Math.ceil(total / limit),
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
// =====================================================
// STUDENT-WISE FEE REPORT
// =====================================================

async getStudentFeeReport(
    schoolId: number,
    query: StudentFeeReportQuery = {}
  ) {
    // ===================================================
    // 1. STUDENT FEE WHERE
    // ===================================================

    const where: any = {
      schoolId,
    };

    // ===================================================
    // 2. STUDENT FILTER
    // ===================================================

    if (query.studentId) {
      where.studentId = Number(
        query.studentId
      );
    }

    // ===================================================
    // 3. CLASS FILTER
    // ===================================================

    if (query.classId) {
      where.feeStructure = {
        ...(where.feeStructure || {}),

        classId: Number(
          query.classId
        ),
      };
    }

    // ===================================================
    // 4. ACADEMIC YEAR FILTER
    // ===================================================

    if (query.academicYearId) {
      where.feeStructure = {
        ...(where.feeStructure || {}),

        academicYearId: Number(
          query.academicYearId
        ),
      };
    }

    // ===================================================
    // 5. STUDENT SEARCH
    //
    // Search by:
    // - firstName
    // - lastName
    // - studentCode
    // - admissionNo
    // ===================================================

    if (query.search) {
      const search =
        String(query.search).trim();

      where.student = {
        OR: [
          {
            firstName: {
              contains: search,
            },
          },

          {
            lastName: {
              contains: search,
            },
          },

          {
            studentCode: {
              contains: search,
            },
          },

          {
            admissionNo: {
              contains: search,
            },
          },
        ],
      };
    }

    // ===================================================
    // DEBUG
    // ===================================================

    console.log(
      "================================="
    );

    console.log(
      "STUDENT FEE REPORT"
    );

    console.log(
      "QUERY:",
      query
    );

    console.log(
      "WHERE:",
      JSON.stringify(
        where,
        null,
        2
      )
    );

    console.log(
      "================================="
    );

    // ===================================================
    // 6. GET STUDENT FEES
    // ===================================================

    const studentFees =
      await prisma.studentFee.findMany({
        where,

        include: {
          student: true,

          feeStructure: {
            include: {
              class: true,
              academicYear: true,
            },
          },
        },

        orderBy: {
          id: "desc",
        },
      });

    console.log(
      "STUDENT FEES COUNT:",
      studentFees.length
    );

    // ===================================================
    // 7. STUDENT FEE IDS
    // ===================================================

    const studentFeeIds =
      studentFees.map(
        (fee) => fee.id
      );

    // ===================================================
    // 8. DATE FILTER CHECK
    // ===================================================

    const hasDateFilter =
      Boolean(
        query.startDate ||
        query.endDate
      );

    // ===================================================
    // 9. PAYMENT WHERE
    // ===================================================

    const paymentWhere: any = {
      schoolId,

      studentFeeId: {
        in: studentFeeIds,
      },

      status:
        PaymentTransactionStatus.SUCCESS,
    };

    // ===================================================
    // 10. PAYMENT DATE FILTER
    // ===================================================

    if (hasDateFilter) {
      paymentWhere.paymentDate = {};

      if (query.startDate) {
        paymentWhere.paymentDate.gte =
          new Date(
            `${query.startDate}T00:00:00`
          );
      }

      if (query.endDate) {
        paymentWhere.paymentDate.lte =
          new Date(
            `${query.endDate}T23:59:59.999`
          );
      }
    }

    // ===================================================
    // 11. PAYMENT METHOD FILTER
    // ===================================================

    if (query.paymentMethod) {
      paymentWhere.paymentMethod =
        String(
          query.paymentMethod
        ).toUpperCase();
    }

    // ===================================================
    // 12. GET PAYMENTS
    //
    // IMPORTANT:
    // Pehle aap loop ke andar payment query
    // kar rahe the.
    //
    // Ab ek hi query mein saare payments.
    // ===================================================

    const payments =
      studentFeeIds.length > 0
        ? await prisma.paymentReceipt.findMany(
            {
              where: paymentWhere,

              orderBy: {
                paymentDate: "desc",
              },

              select: {
                id: true,

                studentFeeId: true,

                amount: true,

                receiptNo: true,

                paymentDate: true,

                paymentMethod: true,
              },
            }
          )
        : [];

    // ===================================================
    // 13. GROUP PAYMENTS BY STUDENT FEE
    // ===================================================

    const paymentMap =
      new Map<
        number,
        any[]
      >();

    for (const payment of payments) {
      const existingPayments =
        paymentMap.get(
          payment.studentFeeId
        ) || [];

      existingPayments.push(
        payment
      );

      paymentMap.set(
        payment.studentFeeId,
        existingPayments
      );
    }

    // ===================================================
    // 14. GROUP RESULT BY STUDENT
    // ===================================================

    const studentMap =
      new Map<
        number,
        any
      >();

    // ===================================================
    // 15. PROCESS EACH STUDENT FEE
    // ===================================================

    for (const fee of studentFees) {
      const studentId =
        fee.studentId;

      // -------------------------------------------------
      // PAYMENTS FOR THIS FEE
      // -------------------------------------------------

      const feePayments =
        paymentMap.get(
          fee.id
        ) || [];

      // -------------------------------------------------
      // DATE FILTER BEHAVIOR
      //
      // Date filter hai:
      // payment nahi hua → student hide
      //
      // Date filter nahi hai:
      // payment ₹0 bhi ho → student show
      // -------------------------------------------------

      if (
        hasDateFilter &&
        feePayments.length === 0
      ) {
        continue;
      }

      // =================================================
      // 16. PAID IN SELECTED PERIOD
      // =================================================

      const paidInPeriod =
        feePayments.reduce(
          (
            total,
            payment
          ) => {
            return (
              total +
              Number(
                payment.amount || 0
              )
            );
          },
          0
        );

      // =================================================
      // 17. STUDENT NAME
      // =================================================

      const studentName =
        `${fee.student?.firstName || ""} ${
          fee.student?.lastName || ""
        }`.trim();

      // =================================================
      // 18. CREATE STUDENT ENTRY
      // =================================================

      if (
        !studentMap.has(
          studentId
        )
      ) {
        studentMap.set(
          studentId,
          {
            studentId,

            studentName:
              studentName || "-",

            studentCode:
              fee.student
                ?.studentCode ||
              "",

            admissionNo:
              fee.student
                ?.admissionNo ||
              "",

            // -----------------------------------------
            // Invoice
            // -----------------------------------------

            invoiceNo: "",

            // -----------------------------------------
            // Receipt
            // -----------------------------------------

            receiptNo:
              feePayments[0]
                ?.receiptNo ||
              "",

            // -----------------------------------------
            // Fee
            // -----------------------------------------

            totalFee: 0,

            discount: 0,

            netPayable: 0,

            // -----------------------------------------
            // Payment
            // -----------------------------------------

            paidAmount: 0,

            paidInPeriod: 0,

            dueAmount: 0,

            // -----------------------------------------
            // Last payment
            // -----------------------------------------

            lastPaymentDate:
              feePayments[0]
                ?.paymentDate ||
              null,

            paymentMethod:
              feePayments[0]
                ?.paymentMethod ||
              null,

            status:
              "PENDING",
          }
        );
      }

      // =================================================
      // 19. GET STUDENT
      // =================================================

      const student =
        studentMap.get(
          studentId
        );

      // =================================================
      // 20. TOTAL FEE
      // =================================================

      student.totalFee +=
        Number(
          fee.totalAmount || 0
        );

      // =================================================
      // 21. DISCOUNT
      // =================================================

      student.discount +=
        Number(
          fee.discount || 0
        );

      // =================================================
      // 22. TOTAL PAID TILL NOW
      // =================================================

      student.paidAmount +=
        Number(
          fee.paidAmount || 0
        );

      // =================================================
      // 23. PAID IN SELECTED PERIOD
      // =================================================

      student.paidInPeriod +=
        paidInPeriod;

      // =================================================
      // 24. CURRENT DUE
      // =================================================

      student.dueAmount +=
        Number(
          fee.dueAmount || 0
        );

      // =================================================
      // 25. LATEST PAYMENT
      // =================================================

      const latestPayment =
        feePayments[0];

      if (latestPayment) {
        if (
          !student.lastPaymentDate ||
          new Date(
            latestPayment.paymentDate
          ).getTime() >
            new Date(
              student.lastPaymentDate
            ).getTime()
        ) {
          student.lastPaymentDate =
            latestPayment.paymentDate;

          student.receiptNo =
            latestPayment.receiptNo ||
            "";

          student.paymentMethod =
            latestPayment.paymentMethod ||
            null;
        }
      }
    }

    // ===================================================
    // 26. FINAL RESULT
    // ===================================================

    let result =
      Array.from(
        studentMap.values()
      ).map(
        (student) => {
          // -------------------------------------------
          // NET PAYABLE
          // -------------------------------------------

          student.netPayable =
            Math.max(
              0,

              Number(
                student.totalFee || 0
              ) -
                Number(
                  student.discount || 0
                )
            );

          // -------------------------------------------
          // STATUS
          // -------------------------------------------

          let status =
            "PENDING";

          if (
            Number(
              student.dueAmount
            ) <= 0
          ) {
            status = "PAID";
          } else if (
            Number(
              student.paidAmount
            ) > 0
          ) {
            status =
              "PARTIAL";
          }

          return {
            ...student,
            status,
          };
        }
      );

    // ===================================================
    // 27. STATUS FILTER
    // ===================================================

    if (query.status) {
      const requestedStatus =
        String(
          query.status
        ).toUpperCase();

      result =
        result.filter(
          (student) =>
            student.status ===
            requestedStatus
        );
    }

    // ===================================================
    // 28. SORTING
    // ===================================================

    const allowedSortFields =
      [
        "studentName",
        "totalFee",
        "discount",
        "netPayable",
        "paidAmount",
        "paidInPeriod",
        "dueAmount",
        "lastPaymentDate",
      ];

    const requestedSort =
      String(
        query.sortBy ||
          "studentName"
      );

    const sortBy =
      allowedSortFields.includes(
        requestedSort
      )
        ? requestedSort
        : "studentName";

    const sortDirection =
      String(
        query.sortOrder
      ).toLowerCase() ===
      "desc"
        ? -1
        : 1;

    result.sort(
      (a, b) => {
        const valueA =
          a[sortBy];

        const valueB =
          b[sortBy];

        // ---------------------------------------------
        // DATE SORT
        // ---------------------------------------------

        if (
          sortBy ===
          "lastPaymentDate"
        ) {
          const dateA =
            valueA
              ? new Date(
                  valueA
                ).getTime()
              : 0;

          const dateB =
            valueB
              ? new Date(
                  valueB
                ).getTime()
              : 0;

          return (
            (dateA - dateB) *
            sortDirection
          );
        }

        // ---------------------------------------------
        // STRING SORT
        // ---------------------------------------------

        if (
          typeof valueA ===
            "string" &&
          typeof valueB ===
            "string"
        ) {
          return (
            valueA.localeCompare(
              valueB
            ) *
            sortDirection
          );
        }
        return (
          (Number(valueA || 0) -
            Number(valueB || 0)) *sortDirection);
      }
    );

    // ===================================================
    // 29. TOTAL
    // ===================================================

    const total = result.length;
    // ===================================================
    // 30. PAGINATION
    // ===================================================

    const page =Number(query.page) > 0? Number(query.page): 1;

    const limit =Number(query.limit) > 0? Math.min(Number(query.limit),100): 25;

    const totalPages =total > 0
        ? Math.ceil(
            total / limit
          )
        : 0;

    const startIndex =
      (page - 1) *
      limit;

    const data =
      result.slice(
        startIndex,
        startIndex +
          limit
      );

    // ===================================================
    // 31. FINAL RESPONSE
    // ===================================================

    return {
      data,

      pagination: {
        page,

        limit,

        total,

        totalPages,
      },
    };
  }


  async createRefund(data: {
  schoolId: number;
  paymentId: number;
  studentId: number;
  studentFeeId: number;
  amount: number;
  reason?: string;
  referenceNo?: string;
  refundedBy?: number;
}) {
  return prisma.refund.create({
    data: {
      schoolId: data.schoolId,
      paymentId: data.paymentId,
      studentId: data.studentId,
      studentFeeId: data.studentFeeId,
      amount: data.amount,
      reason: data.reason,
      referenceNo: data.referenceNo,
      refundedBy: data.refundedBy,
      status: "COMPLETED",
    },
  });
}


async getPaymentRefunds(
  paymentId: number,
  schoolId: number
) {
  return prisma.refund.findMany({
    where: {
      paymentId,
      schoolId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

async cancelPayment(
  paymentId: number,
  schoolId: number
) {
  return prisma.$transaction(async (tx) => {

    // 1. Payment find
    const payment = await tx.payment.findFirst({
      where: {
        id: paymentId,
        schoolId,
      },
      include: {
        refunds: true,
      },
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    // 2. Already cancelled
    if (payment.status === "CANCELLED") {
      throw new Error(
        "Payment is already cancelled"
      );
    }

    // 3. Only SUCCESS can be cancelled
    if (payment.status !== "SUCCESS") {
      throw new Error(
        "Only successful payments can be cancelled"
      );
    }

    // 4. Refund check
    const refundedAmount =
      payment.refunds.reduce(
        (sum, refund) => {
          if (
            refund.status === "COMPLETED" ||
            refund.status === "APPROVED"
          ) {
            return (
              sum + Number(refund.amount)
            );
          }

          return sum;
        },
        0
      );

    if (refundedAmount > 0) {
      throw new Error(
        "Payment cannot be cancelled because refund already exists"
      );
    }

    // 5. StudentFee find
    const studentFee =
      await tx.studentFee.findUnique({
        where: {
          id: payment.studentFeeId,
        },
      });

    if (!studentFee) {
      throw new Error(
        "Student fee not found"
      );
    }

    // 6. Reverse payment amount
    const newPaidAmount = Math.max(
      0,
      Number(studentFee.paidAmount) -
        Number(payment.amount)
    );

    const newDueAmount =
      Number(studentFee.totalAmount) -
      newPaidAmount;

    // 7. Calculate fee status
    let newStatus:
      | "PAID"
      | "PARTIAL"
      | "PENDING"
      | "OVERDUE";

    if (newPaidAmount <= 0) {
      newStatus = "PENDING";
    } else if (
      newPaidAmount >=
      Number(studentFee.totalAmount)
    ) {
      newStatus = "PAID";
    } else {
      newStatus = "PARTIAL";
    }

    // 8. Update StudentFee
    await tx.studentFee.update({
      where: {
        id: studentFee.id,
      },
      data: {
        paidAmount: newPaidAmount,
        dueAmount: newDueAmount,
        status: newStatus,
      },
    });

    // 9. Cancel Payment
    const updatedPayment =
      await tx.payment.update({
        where: {
          id: payment.id,
        },
        data: {
          status: "CANCELLED",
        },
      });

    return updatedPayment;
  });
}
  
}