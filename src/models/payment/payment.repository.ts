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
// FIND BY ID + SCHOOL
// =====================================================

async findById(schoolId: number, id: number) {
  return prisma.paymentReceipt.findFirst({
    where: { id, schoolId },
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
  // FIND PAYMENTS
  // =====================================================
async findBySchool(schoolId: number, query: any = {}) {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;

  // WHERE Filters
  const where: any = { schoolId };

  if (query.startDate || query.endDate) {
    where.paymentDate = {};
    if (query.startDate) where.paymentDate.gte = new Date(`${query.startDate}T00:00:00`);
    if (query.endDate) where.paymentDate.lte = new Date(`${query.endDate}T23:59:59.999`);
  }

  if (query.paymentMethod && query.paymentMethod !== "ALL") {
    where.paymentMethod = query.paymentMethod;
  }

  if (query.status && query.status !== "ALL") {
    where.status = query.status;
  }

  if (query.classId) {
    where.studentFee = {
      ...(where.studentFee || {}),
      feeStructure: {
        ...(where.studentFee?.feeStructure || {}),
        classId: Number(query.classId),
      },
    };
  }

  if (query.academicYearId) {
    where.studentFee = {
      ...(where.studentFee || {}),
      feeStructure: {
        ...(where.studentFee?.feeStructure || {}),
        academicYearId: Number(query.academicYearId),
      },
    };
  }

  if (query.search?.trim()) {
    const search = query.search.trim();
    where.OR = [
      { referenceNo: { contains: search } },
      { transactionId: { contains: search } },
      { student: { firstName: { contains: search } } },
      { student: { lastName: { contains: search } } },
      { studentFee: { invoiceNo: { contains: search } } },
    ];
  }

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      include: {
        student: true,
        studentFee: {
          include: {
            student: true,
            feeStructure: {
              include: { class: true, academicYear: true },
            },
          },
        },
        collector: {
          select: { id: true, name: true, email: true },
        },
        receipts: true,
        refunds: true,
      },
      skip,
      take: limit,
      orderBy: { paymentDate: "desc" },
    }),
    prisma.payment.count({ where }),
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

async delete(schoolId: number, id: number) {
  return prisma.paymentReceipt.deleteMany({
    where: { id, schoolId },
  });
}


// =====================================================
// TOTAL PAID BY STUDENT FEE
// =====================================================

async getTotalAmountByStudentFee(studentFeeId: number) {
  return prisma.paymentReceipt.aggregate({
    where: {
      studentFeeId,
      status: PaymentTransactionStatus.SUCCESS,
    },
    _sum: { amount: true },
  });
}



///-----------------------------------------------------------------------------------------
// =====================================================
// SUMMARY
// =====================================================

async getPaymentSummary(schoolId: number, query: any = {}) {
  const paymentWhere: any = { schoolId };

  if (query.paymentMethod && query.paymentMethod !== "ALL") {
    paymentWhere.paymentMethod = query.paymentMethod;
  }

  if (query.status && query.status !== "ALL") {
    paymentWhere.status = query.status;
  }

  const studentFeeWhere: any = { schoolId };

  if (query.classId) {
    studentFeeWhere.feeStructure = { classId: Number(query.classId) };
  }

  if (query.academicYearId) {
    studentFeeWhere.feeStructure = {
      ...(studentFeeWhere.feeStructure || {}),
      academicYearId: Number(query.academicYearId),
    };
  }

  // Date Calculation Setup
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  const startOfWeek = new Date(startOfToday);
  const day = startOfWeek.getDay();
  const diff = day === 0 ? 6 : day - 1;
  startOfWeek.setDate(startOfWeek.getDate() - diff);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const dateFilter: any = {};
  if (query.startDate) dateFilter.gte = new Date(`${query.startDate}T00:00:00`);
  if (query.endDate) dateFilter.lte = new Date(`${query.endDate}T23:59:59.999`);

  if (dateFilter.gte || dateFilter.lte) {
    paymentWhere.paymentDate = dateFilter;
  }

  // Aggregations
  const [
    totalCollection,
    todayCollection,
    weekCollection,
    monthCollection,
    totalTransactions,
    totalFee,
    totalPaid,
    totalDue,
    totalDiscount,
    totalLateFee,
    totalStudents,
    overdueFee,
  ] = await Promise.all([
    prisma.paymentReceipt.aggregate({
      where: paymentWhere,
      _sum: { amount: true },
    }),
    prisma.paymentReceipt.aggregate({
      where: {
        ...paymentWhere,
        paymentDate: { gte: startOfToday, lt: startOfTomorrow },
      },
      _sum: { amount: true },
    }),
    prisma.paymentReceipt.aggregate({
      where: {
        ...paymentWhere,
        paymentDate: { gte: startOfWeek },
      },
      _sum: { amount: true },
    }),
    prisma.paymentReceipt.aggregate({
      where: {
        ...paymentWhere,
        paymentDate: { gte: startOfMonth },
      },
      _sum: { amount: true },
    }),
    prisma.paymentReceipt.count({ where: paymentWhere }),
    prisma.studentFee.aggregate({
      where: studentFeeWhere,
      _sum: { totalAmount: true },
    }),
    prisma.studentFee.aggregate({
      where: studentFeeWhere,
      _sum: { paidAmount: true },
    }),
    prisma.studentFee.aggregate({
      where: studentFeeWhere,
      _sum: { dueAmount: true },
    }),
    prisma.studentFee.aggregate({
      where: studentFeeWhere,
      _sum: { discount: true },
    }),
    prisma.studentFee.aggregate({
      where: studentFeeWhere,
      _sum: { lateFee: true },
    }),
    prisma.studentFee.findMany({
      where: studentFeeWhere,
      select: { studentId: true },
      distinct: ["studentId"],
    }),
    prisma.studentFee.aggregate({
      where: {
        ...studentFeeWhere,
        dueAmount: { gt: 0 },
        dueDate: { lt: now },
      },
      _sum: { dueAmount: true },
    }),
  ]);

  // Values Normalization
  const totalFeeAmount = Number(totalFee._sum.totalAmount || 0);
  const totalCollected = Number(totalCollection._sum.amount || 0);
  const totalPending = Number(totalDue._sum.dueAmount || 0);
  const totalDiscountAmount = Number(totalDiscount._sum.discount || 0);
  const totalLateFeeAmount = Number(totalLateFee._sum.lateFee || 0);
  const totalOverdue = Number(overdueFee._sum.dueAmount || 0);

  // Percentages Calculation
  const collectionRate =
    totalFeeAmount > 0
      ? Number(((totalCollected / totalFeeAmount) * 100).toFixed(2))
      : 0;

  const pendingRate =
    totalFeeAmount > 0
      ? Number(((totalPending / totalFeeAmount) * 100).toFixed(2))
      : 0;

  return {
    totalStudents: totalStudents.length,
    totalFeeAmount,
    totalCollected,
    totalPending,
    totalDiscount: totalDiscountAmount,
    totalOverdue,
    totalLateFee: totalLateFeeAmount,
    collectionRate,
    pendingRate,
    todayCollection: Number(todayCollection._sum.amount || 0),
    weekCollection: Number(weekCollection._sum.amount || 0),
    monthCollection: Number(monthCollection._sum.amount || 0),
    totalTransactions,
  };
}
// =====================================================
// METHOD SUMMARY
// =====================================================

async getPaymentMethodSummary(schoolId: number, query: any = {}) {
  const where: any = { schoolId };

  if (query.startDate || query.endDate) {
    where.paymentDate = {};
    if (query.startDate) where.paymentDate.gte = new Date(`${query.startDate}T00:00:00`);
    if (query.endDate) where.paymentDate.lte = new Date(`${query.endDate}T23:59:59.999`);
  }

  const result = await prisma.paymentReceipt.groupBy({
    by: ["paymentMethod"],
    where,
    _sum: { amount: true },
    _count: { _all: true },
  });

  return result.map((item: any) => ({
    method: item.paymentMethod,
    total: Number(item._sum.amount || 0),
    count: item._count._all,
  }));
}

// =====================================================
// DAILY COLLECTION
// =====================================================

async getDailyCollection(schoolId: number, query: any = {}) {
  const startDate = query.startDate
    ? new Date(`${query.startDate}T00:00:00`)
    : new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const endDate = query.endDate
    ? new Date(`${query.endDate}T23:59:59.999`)
    : new Date();

  const result: any[] = await prisma.$queryRaw`
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
// FIND BY RECEIPT + SCHOOL
// =====================================================

// async findByReceiptNo(schoolId: number, receiptNo: string) {
//   return prisma.paymentReceipt.findFirst({
//     where: { schoolId, receiptNo },
//     include: {
//       studentFee: {
//         include: {
//           student: true,
//           feeStructure: {
//             include: {
//               class: true,
//               academicYear: true,
//             },
//           },
//         },
//       },
//       receivedBy: true,
//     },
//   });
// }


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
// STUDENT-WISE FEE REPORT
// =====================================================

async getStudentFeeReport(
  schoolId: number,
  query: StudentFeeReportQuery = {}
) {
  // 1. STUDENT FEE WHERE
  const where: any = { schoolId };

  if (query.studentId) {
    where.studentId = Number(query.studentId);
  }

  if (query.classId) {
    where.feeStructure = {
      ...(where.feeStructure || {}),
      classId: Number(query.classId),
    };
  }

  if (query.academicYearId) {
    where.feeStructure = {
      ...(where.feeStructure || {}),
      academicYearId: Number(query.academicYearId),
    };
  }

  if (query.search) {
    const search = String(query.search).trim();
    where.student = {
      OR: [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { studentCode: { contains: search } },
        { admissionNo: { contains: search } },
      ],
    };
  }

  // DEBUG
  console.log("=================================");
  console.log("STUDENT FEE REPORT");
  console.log("QUERY:", query);
  console.log("WHERE:", JSON.stringify(where, null, 2));
  console.log("=================================");

  // 2. GET STUDENT FEES
  const studentFees = await prisma.studentFee.findMany({
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
    orderBy: { id: "desc" },
  });

  console.log("STUDENT FEES COUNT:", studentFees.length);

  const studentFeeIds = studentFees.map((fee) => fee.id);
  const hasDateFilter = Boolean(query.startDate || query.endDate);

  // 3. PAYMENT WHERE
  const paymentWhere: any = {
    schoolId,
    studentFeeId: { in: studentFeeIds },
    status: PaymentTransactionStatus.SUCCESS,
  };

  if (hasDateFilter) {
    paymentWhere.paymentDate = {};
    if (query.startDate) {
      paymentWhere.paymentDate.gte = new Date(`${query.startDate}T00:00:00`);
    }
    if (query.endDate) {
      paymentWhere.paymentDate.lte = new Date(`${query.endDate}T23:59:59.999`);
    }
  }

  if (query.paymentMethod) {
    paymentWhere.paymentMethod = String(query.paymentMethod).toUpperCase();
  }

  // 4. GET PAYMENTS
  const payments =
    studentFeeIds.length > 0
      ? await prisma.paymentReceipt.findMany({
          where: paymentWhere,
          orderBy: { paymentDate: "desc" },
          select: {
            id: true,
            studentFeeId: true,
            amount: true,
            receiptNo: true,
            paymentDate: true,
            paymentMethod: true,
          },
        })
      : [];

  // 5. GROUP PAYMENTS BY STUDENT FEE
  const paymentMap = new Map<number, any[]>();
  for (const payment of payments) {
    const existingPayments = paymentMap.get(payment.studentFeeId) || [];
    existingPayments.push(payment);
    paymentMap.set(payment.studentFeeId, existingPayments);
  }

  // 6. PROCESS EACH STUDENT FEE
  const studentMap = new Map<number, any>();

  for (const fee of studentFees) {
    const studentId = fee.studentId;
    const feePayments = paymentMap.get(fee.id) || [];

    if (hasDateFilter && feePayments.length === 0) {
      continue;
    }

    const paidInPeriod = feePayments.reduce(
      (total, payment) => total + Number(payment.amount || 0),
      0
    );

    const studentName = `${fee.student?.firstName || ""} ${
      fee.student?.lastName || ""
    }`.trim();

    if (!studentMap.has(studentId)) {
      studentMap.set(studentId, {
        studentId,
        studentName: studentName || "-",
        studentCode: fee.student?.studentCode || "",
        admissionNo: fee.student?.admissionNo || "",
        invoiceNo: "",
        receiptNo: feePayments[0]?.receiptNo || "",
        totalFee: 0,
        discount: 0,
        netPayable: 0,
        paidAmount: 0,
        paidInPeriod: 0,
        dueAmount: 0,
        lastPaymentDate: feePayments[0]?.paymentDate || null,
        paymentMethod: feePayments[0]?.paymentMethod || null,
        status: "PENDING",
      });
    }

    const student = studentMap.get(studentId);

    student.totalFee += Number(fee.totalAmount || 0);
    student.discount += Number(fee.discount || 0);
    student.paidAmount += Number(fee.paidAmount || 0);
    student.paidInPeriod += paidInPeriod;
    student.dueAmount += Number(fee.dueAmount || 0);

    const latestPayment = feePayments[0];
    if (latestPayment) {
      if (
        !student.lastPaymentDate ||
        new Date(latestPayment.paymentDate).getTime() >
          new Date(student.lastPaymentDate).getTime()
      ) {
        student.lastPaymentDate = latestPayment.paymentDate;
        student.receiptNo = latestPayment.receiptNo || "";
        student.paymentMethod = latestPayment.paymentMethod || null;
      }
    }
  }

  // 7. COMPUTE FINAL FIELDS
  let result = Array.from(studentMap.values()).map((student) => {
    student.netPayable = Math.max(
      0,
      Number(student.totalFee || 0) - Number(student.discount || 0)
    );

    let status = "PENDING";
    if (Number(student.dueAmount) <= 0) {
      status = "PAID";
    } else if (Number(student.paidAmount) > 0) {
      status = "PARTIAL";
    }

    return { ...student, status };
  });

  // 8. FILTER BY STATUS
  if (query.status) {
    const requestedStatus = String(query.status).toUpperCase();
    result = result.filter((student) => student.status === requestedStatus);
  }

  // 9. SORTING
  const allowedSortFields = [
    "studentName",
    "totalFee",
    "discount",
    "netPayable",
    "paidAmount",
    "paidInPeriod",
    "dueAmount",
    "lastPaymentDate",
  ];

  const requestedSort = String(query.sortBy || "studentName");
  const sortBy = allowedSortFields.includes(requestedSort)
    ? requestedSort
    : "studentName";
  const sortDirection =
    String(query.sortOrder).toLowerCase() === "desc" ? -1 : 1;

  result.sort((a, b) => {
    const valueA = a[sortBy];
    const valueB = b[sortBy];

    if (sortBy === "lastPaymentDate") {
      const dateA = valueA ? new Date(valueA).getTime() : 0;
      const dateB = valueB ? new Date(valueB).getTime() : 0;
      return (dateA - dateB) * sortDirection;
    }

    if (typeof valueA === "string" && typeof valueB === "string") {
      return valueA.localeCompare(valueB) * sortDirection;
    }

    return (Number(valueA || 0) - Number(valueB || 0)) * sortDirection;
  });

  // 10. PAGINATION
  const total = result.length;
  const page = Number(query.page) > 0 ? Number(query.page) : 1;
  const limit =
    Number(query.limit) > 0 ? Math.min(Number(query.limit), 100) : 25;
  const totalPages = total > 0 ? Math.ceil(total / limit) : 0;
  const startIndex = (page - 1) * limit;

  const data = result.slice(startIndex, startIndex + limit);

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



// =====================================================
// CREATE REFUND
// =====================================================

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

// =====================================================
// GET PAYMENT REFUNDS
// =====================================================

async getPaymentRefunds(paymentId: number, schoolId: number) {
  return prisma.refund.findMany({
    where: { paymentId, schoolId },
    orderBy: { createdAt: "desc" },
  });
}

// =====================================================
// CANCEL PAYMENT
// =====================================================

async cancelPayment(paymentId: number, schoolId: number) {
  return prisma.$transaction(async (tx) => {
    // 1. Find payment
    const payment = await tx.payment.findFirst({
      where: { id: paymentId, schoolId },
      include: { refunds: true },
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    // 2. Validate payment status
    if (payment.status === "CANCELLED") {
      throw new Error("Payment is already cancelled");
    }

    if (payment.status !== "SUCCESS") {
      throw new Error("Only successful payments can be cancelled");
    }

    // 3. Check for existing refunds
    const refundedAmount = payment.refunds.reduce((sum, refund) => {
      if (["COMPLETED", "APPROVED"].includes(refund.status)) {
        return sum + Number(refund.amount);
      }
      return sum;
    }, 0);

    if (refundedAmount > 0) {
      throw new Error("Payment cannot be cancelled because refund already exists");
    }

    // 4. Find student fee
    const studentFee = await tx.studentFee.findUnique({
      where: { id: payment.studentFeeId },
    });

    if (!studentFee) {
      throw new Error("Student fee not found");
    }

    // 5. Reverse payment amounts & update status
    const newPaidAmount = Math.max(
      0,
      Number(studentFee.paidAmount) - Number(payment.amount)
    );
    const newDueAmount = Number(studentFee.totalAmount) - newPaidAmount;

    let newStatus: "PAID" | "PARTIAL" | "PENDING" | "OVERDUE" = "PARTIAL";
    if (newPaidAmount <= 0) {
      newStatus = "PENDING";
    } else if (newPaidAmount >= Number(studentFee.totalAmount)) {
      newStatus = "PAID";
    }

    await tx.studentFee.update({
      where: { id: studentFee.id },
      data: {
        paidAmount: newPaidAmount,
        dueAmount: newDueAmount,
        status: newStatus,
      },
    });

    // 6. Update payment status
    return tx.payment.update({
      where: { id: payment.id },
      data: { status: "CANCELLED" },
    });
  });
}
  
}