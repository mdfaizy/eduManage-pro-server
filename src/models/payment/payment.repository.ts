import prisma from "../../config/prisma";
import { PaymentMethod } from "@prisma/client";

export class PaymentRepository {
  // CREATE
  create(data: any) {
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

  createMany(data: any[]) {
    return prisma.paymentReceipt.createMany({
      data,
      skipDuplicates: true,
    });
  }

  // FIND
  findBySchool(schoolId: number, query?: any) {
    const { page = 1, limit = 10, startDate, endDate, paymentMethod, status } = query || {};
    const skip = (page - 1) * limit;

    const where: any = { schoolId };

    if (paymentMethod) where.paymentMethod = paymentMethod;
    if (status) where.status = status;
    if (startDate || endDate) {
      where.paymentDate = {};
      if (startDate) where.paymentDate.gte = new Date(startDate);
      if (endDate) where.paymentDate.lte = new Date(endDate);
    }

    return prisma.paymentReceipt.findMany({
      where,
      include: {
        studentFee: {
          include: {
            student: true,
            feeStructure: true,
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
      orderBy: { createdAt: "desc" },
    });
  }

  findByStudent(studentId: number) {
    return prisma.paymentReceipt.findMany({
      where: {
        studentFee: {
          studentId,
        },
      },
      include: {
        studentFee: {
          include: {
            feeStructure: true,
          },
        },
        receivedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { paymentDate: "desc" },
    });
  }

  findByStudentFee(studentFeeId: number) {
    return prisma.paymentReceipt.findMany({
      where: { studentFeeId },
      orderBy: { paymentDate: "desc" },
    });
  }

  findById(id: number) {
    return prisma.paymentReceipt.findUnique({
      where: { id },
      include: {
        studentFee: {
          include: {
            student: true,
            feeStructure: {
              include: {
                items: {
                  include: {
                    feeHead: true,
                  },
                },
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
            email: true,
            firstName: true,
            lastName: true,
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

  findByReceiptNo(receiptNo: string) {
    return prisma.paymentReceipt.findUnique({
      where: { receiptNo },
      include: {
        studentFee: {
          include: {
            student: true,
          },
        },
        receivedBy: true,
      },
    });
  }

  // UPDATE
  update(id: number, data: any) {
    return prisma.paymentReceipt.update({
      where: { id },
      data,
      include: {
        studentFee: {
          include: {
            student: true,
          },
        },
        receivedBy: true,
      },
    });
  }

  // DELETE
  delete(id: number) {
    return prisma.paymentReceipt.delete({
      where: { id },
    });
  }

  deleteByStudentFee(studentFeeId: number) {
    return prisma.paymentReceipt.deleteMany({
      where: { studentFeeId },
    });
  }

  deleteBySchool(schoolId: number) {
    return prisma.paymentReceipt.deleteMany({
      where: { schoolId },
    });
  }

  // COUNT
  countBySchool(schoolId: number, query?: any) {
    const { startDate, endDate, paymentMethod, status } = query || {};
    const where: any = { schoolId };

    if (paymentMethod) where.paymentMethod = paymentMethod;
    if (status) where.status = status;
    if (startDate || endDate) {
      where.paymentDate = {};
      if (startDate) where.paymentDate.gte = new Date(startDate);
      if (endDate) where.paymentDate.lte = new Date(endDate);
    }

    return prisma.paymentReceipt.count({ where });
  }

  countByStudent(studentId: number) {
    return prisma.paymentReceipt.count({
      where: {
        studentFee: {
          studentId,
        },
      },
    });
  }

  // AGGREGATE
  getTotalAmountBySchool(schoolId: number, query?: any) {
    const { startDate, endDate, paymentMethod, status } = query || {};
    const where: any = { schoolId };

    if (paymentMethod) where.paymentMethod = paymentMethod;
    if (status) where.status = status;
    if (startDate || endDate) {
      where.paymentDate = {};
      if (startDate) where.paymentDate.gte = new Date(startDate);
      if (endDate) where.paymentDate.lte = new Date(endDate);
    }

    return prisma.paymentReceipt.aggregate({
      where,
      _sum: { amount: true },
    });
  }

  getTotalAmountByStudent(studentId: number) {
    return prisma.paymentReceipt.aggregate({
      where: {
        studentFee: {
          studentId,
        },
        status: PaymentTransactionStatus.SUCCESS,
      },
      _sum: { amount: true },
    });
  }

  getTotalAmountByStudentFee(studentFeeId: number) {
    return prisma.paymentReceipt.aggregate({
      where: {
        studentFeeId,
        status: PaymentTransactionStatus.SUCCESS,
      },
      _sum: { amount: true },
    });
  }

  // SUMMARY
  getPaymentSummary(schoolId: number, studentId?: number) {
    const where: any = { schoolId };
    if (studentId) {
      where.studentFee = { studentId };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

    return Promise.all([
      prisma.paymentReceipt.aggregate({
        where,
        _sum: { amount: true },
      }),
      prisma.paymentReceipt.aggregate({
        where: {
          ...where,
          paymentDate: { gte: today },
        },
        _sum: { amount: true },
      }),
      prisma.paymentReceipt.aggregate({
        where: {
          ...where,
          paymentDate: { gte: firstDayOfMonth },
        },
        _sum: { amount: true },
      }),
      prisma.paymentReceipt.aggregate({
        where: {
          ...where,
          paymentDate: { gte: firstDayOfYear },
        },
        _sum: { amount: true },
      }),
    ]).then(([total, todayTotal, monthTotal, yearTotal]) => ({
      total: total._sum.amount || 0,
      today: todayTotal._sum.amount || 0,
      month: monthTotal._sum.amount || 0,
      year: yearTotal._sum.amount || 0,
    }));
  }

  // GROUP BY
  groupByPaymentMethod(schoolId: number, startDate?: Date, endDate?: Date) {
    const where: any = { schoolId };
    if (startDate && endDate) {
      where.paymentDate = {
        gte: startDate,
        lte: endDate,
      };
    }

    return prisma.paymentReceipt.groupBy({
      by: ['paymentMethod'],
      where,
      _sum: {
        amount: true,
      },
      _count: true,
    });
  }

  groupByStatus(schoolId: number, startDate?: Date, endDate?: Date) {
    const where: any = { schoolId };
    if (startDate && endDate) {
      where.paymentDate = {
        gte: startDate,
        lte: endDate,
      };
    }

    return prisma.paymentReceipt.groupBy({
      by: ['status'],
      where,
      _sum: {
        amount: true,
      },
      _count: true,
    });
  }

  groupByDate(schoolId: number, startDate: Date, endDate: Date) {
    return prisma.$queryRaw`
      SELECT 
        DATE(payment_date) as date,
        SUM(amount) as total,
        COUNT(*) as count
      FROM payment_receipts
      WHERE school_id = ${schoolId}
        AND payment_date BETWEEN ${startDate} AND ${endDate}
      GROUP BY DATE(payment_date)
      ORDER BY date ASC
    `;
  }

  // ⭐ NEW — generate receipt number
  generateReceiptNumber(schoolId: number): Promise<string> {
    const prefix = 'RCP';
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return prisma.paymentReceipt
      .findFirst({
        where: {
          receiptNo: {
            startsWith: `${prefix}${year}${month}${day}`,
          },
        },
        orderBy: {
          receiptNo: 'desc',
        },
      })
      .then((lastReceipt) => {
        let sequence = 1;
        if (lastReceipt) {
          const lastSeq = parseInt(lastReceipt.receiptNo.slice(-4));
          sequence = lastSeq + 1;
        }
        return `${prefix}${year}${month}${day}${String(sequence).padStart(4, '0')}`;
      });
  }

  // ⭐ NEW — find duplicate receipt
  findDuplicateReceipt(
    schoolId: number,
    studentFeeId: number,
    amount: number,
    paymentDate: Date
  ) {
    return prisma.paymentReceipt.findFirst({
      where: {
        schoolId,
        studentFeeId,
        amount,
        paymentDate: {
          gte: new Date(paymentDate.setHours(0, 0, 0, 0)),
          lte: new Date(paymentDate.setHours(23, 59, 59, 999)),
        },
      },
    });
  }

  // ⭐ NEW — get pending payments
  getPendingPayments(schoolId: number, studentId?: number) {
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
      orderBy: { dueDate: 'asc' },
    });
  }

  // ⭐ NEW — get overdue payments
  getOverduePayments(schoolId: number, studentId?: number) {
    const where: any = {
      schoolId,
      status: FeeStatus.OVERDUE,
      dueDate: {
        lt: new Date(),
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
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  // ⭐ NEW — update student fee after payment
  updateStudentFeeAfterPayment(studentFeeId: number, paidAmount: number) {
    return prisma.$transaction(async (tx: any) => {
      const studentFee = await tx.studentFee.findUnique({
        where: { id: studentFeeId },
      });

      if (!studentFee) {
        throw new Error('Student fee not found');
      }

      const newPaidAmount = studentFee.paidAmount.toNumber() + paidAmount;
      const newDueAmount = studentFee.totalAmount.toNumber() - newPaidAmount;

      let status: FeeStatus;
      if (newDueAmount <= 0) {
        status = FeeStatus.PAID;
      } else if (newPaidAmount > 0) {
        status = FeeStatus.PARTIAL;
      } else {
        status = FeeStatus.PENDING;
      }

      return tx.studentFee.update({
        where: { id: studentFeeId },
        data: {
          paidAmount: newPaidAmount,
          dueAmount: newDueAmount,
          status,
        },
      });
    });
  }

  // ⭐ NEW — get payment statistics
  getPaymentStats(schoolId: number, academicYearId?: number) {
    const where: any = { schoolId };
    if (academicYearId) {
      where.studentFee = {
        feeStructure: {
          academicYearId,
        },
      };
    }

    return Promise.all([
      prisma.paymentReceipt.count({ where }),
      prisma.paymentReceipt.aggregate({
        where,
        _sum: { amount: true },
      }),
      prisma.paymentReceipt.groupBy({
        by: ['status'],
        where,
        _count: true,
      }),
      prisma.paymentReceipt.groupBy({
        by: ['paymentMethod'],
        where,
        _sum: { amount: true },
      }),
    ]).then(([totalCount, totalAmount, statusCounts, methodTotals]) => ({
      totalReceipts: totalCount,
      totalAmount: totalAmount._sum.amount || 0,
      statusCounts: statusCounts.map((s: any) => ({
        status: s.status,
        count: s._count,
      })),
      methodTotals: methodTotals.map((m: any) => ({
        method: m.paymentMethod,
        total: m._sum.amount || 0,
      })),
    }));
  }
}