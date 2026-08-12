// repositories/report.repository.ts

import prisma from "../../config/prisma";
import { FeeReportFilters } from "./report.types";
import {
  PaymentMethod,
  FeeStatus,
  PaymentTransactionStatus,
} from "../../generated/prisma";

import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";

// import { PaymentTransactionStatus } from "@prisma/client";
// Add MonthlyCollection interface
interface MonthlyCollection {
  month: string;
  year: number;
  totalAmount: number;
  collected: number;
  pending: number;
}

export class ReportRepository {
  // =====================================================
  // GET SUMMARY
  // =====================================================

    async getSummary(filters: FeeReportFilters) {
      const { schoolId, academicYearId, classId, studentId } = filters;

      const where: any = {
        schoolId,
        ...(studentId && { studentId })
      };

      if (academicYearId || classId) {
        where.feeStructure = {};
        if (academicYearId) where.feeStructure.academicYearId = academicYearId;
        if (classId) where.feeStructure.classId = classId;
      }

      const [totalStudents, feeData, overdueCount] = await Promise.all([
        // Student count is derived from the current academic enrolment record,
        // since Student itself has no classId/academicYearId.
        prisma.studentAcademicRecord.count({
          where: {
            schoolId,
            isCurrent: true,
            ...(classId && { classId }),
            ...(academicYearId && { academicYearId }),
            student: { isActive: true },
          },
        }),
        prisma.studentFee.aggregate({
          where,
          _sum: {
            totalAmount: true,
            paidAmount: true,
            dueAmount: true,
            discount: true,
            lateFee: true,
          },
          _count: true,
        }),
        prisma.studentFee.count({
          where: {
            ...where,
            status: FeeStatus.OVERDUE,
          },
        }),
      ]);

      const totalFeeAmount = Number(feeData._sum.totalAmount) || 0;
      const totalCollected = Number(feeData._sum.paidAmount) || 0;
      const totalPending = Number(feeData._sum.dueAmount) || 0;
      const totalDiscount = Number(feeData._sum.discount) || 0;
      const totalLateFee = Number(feeData._sum.lateFee) || 0;

      return {
        totalStudents,
        totalFeeAmount,
        totalCollected,
        totalPending,
        totalDiscount,
        totalLateFee,
        totalOverdue: overdueCount,
        collectionRate: totalFeeAmount > 0 ? (totalCollected / totalFeeAmount) * 100 : 0,
        pendingRate: totalFeeAmount > 0 ? (totalPending / totalFeeAmount) * 100 : 0,
      };
    }

  // =====================================================
  // CLASS WISE COLLECTION
  // =====================================================

  async getClassWiseCollection(filters: FeeReportFilters) {
    const { schoolId, academicYearId } = filters;

    const classes = await prisma.class.findMany({
      where: {
        schoolId,
        isActive: true
      },
      include: {
        // Class has no direct `students` relation - enrolment is tracked
        // via StudentAcademicRecord.
        academicRecords: {
          where: {
            isCurrent: true,
            ...(academicYearId && { academicYearId }),
            student: { isActive: true },
          },
          select: { id: true }
        },
        feeStructures: {
          where: academicYearId ? { academicYearId } : {},
          include: {
            studentFees: {
              where: { schoolId }
            }
          }
        }
      },
    });

    return classes.map((cls) => {
      const studentFees = cls.feeStructures.flatMap((fs) => fs.studentFees);
      const totalAmount = studentFees.reduce(
        (sum, fee) => sum + Number(fee.totalAmount),
        0
      );
      const collected = studentFees.reduce(
        (sum, fee) => sum + Number(fee.paidAmount),
        0
      );
      const pending = studentFees.reduce(
        (sum, fee) => sum + Number(fee.dueAmount),
        0
      );

      return {
        classId: cls.id,
        className: cls.name,
        totalStudents: cls.academicRecords.length,
        totalAmount,
        collected,
        pending,
        collectionRate: totalAmount > 0 ? (collected / totalAmount) * 100 : 0,
      };
    });
  }


  async exportReportData(filters: FeeReportFilters) {
  const report = await this.getFullReport(filters);

  return {
    summary: report.summary,
    classWiseData: report.classWise,
    feeHeadWiseData: report.feeHeadWise,
    monthlyData: report.monthlyCollection,
    studentData: report.studentReports.data,
    paymentHistory: report.paymentHistory.data,
  };
}

  // =====================================================
  // FEE HEAD WISE COLLECTION
  // =====================================================

  async getFeeHeadWiseCollection(filters: FeeReportFilters) {
    const { schoolId, academicYearId, classId } = filters;

    const studentFeeWhere: any = { schoolId };
    if (academicYearId || classId) {
      studentFeeWhere.feeStructure = {};
      if (academicYearId) studentFeeWhere.feeStructure.academicYearId = academicYearId;
      if (classId) studentFeeWhere.feeStructure.classId = classId;
    }

    const feeHeads = await prisma.feeHead.findMany({
      where: { schoolId, isActive: true },
      include: {
        studentFeeItems: {
          where: {
            studentFee: studentFeeWhere
          },
          include: {
            studentFee: {
              select: {
                paidAmount: true,
                totalAmount: true
              }
            }
          },
        },
      },
    });

    return feeHeads.map((head) => {
      const totalAmount = head.studentFeeItems.reduce(
        (sum, item) => sum + Number(item.amount),
        0
      );
      // Attribute each item's share of whatever has actually been paid on its
      // parent StudentFee, so PARTIAL payments contribute proportionally
      // instead of only fully PAID fees counting as collected.
      const collected = head.studentFeeItems.reduce((sum, item) => {
        const feeTotal = Number(item.studentFee.totalAmount);
        const feePaid = Number(item.studentFee.paidAmount);
        const paidRatio = feeTotal > 0 ? Math.min(feePaid / feeTotal, 1) : 0;
        return sum + Number(item.amount) * paidRatio;
      }, 0);

      return {
        feeHeadId: head.id,
        feeHeadName: head.name,
        totalAmount,
        collected,
        pending: totalAmount - collected,
        collectionRate: totalAmount > 0 ? (collected / totalAmount) * 100 : 0,
      };
    });
  }

  // =====================================================
  // MONTHLY COLLECTION
  // =====================================================

  async getMonthlyCollection(filters: FeeReportFilters) {
    const { schoolId, startDate, endDate } = filters;

    const year = startDate ? new Date(startDate).getFullYear() : new Date().getFullYear();

    const monthlyData: Record<string, MonthlyCollection> = {};

    // Initialize all months
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];

    months.forEach((month, index) => {
      const key = `${year}-${String(index + 1).padStart(2, '0')}`;
      monthlyData[key] = {
        month,
        year,
        totalAmount: 0,
        collected: 0,
        pending: 0,
      };
    });

    // Total billed / pending per month comes from the fee installments
    // themselves (StudentFee.month/year), not from payment receipts.
    const studentFees = await prisma.studentFee.findMany({
      where: { schoolId, year },
      select: { month: true, year: true, totalAmount: true, dueAmount: true },
    });

    studentFees.forEach((fee) => {
      if (!fee.month) return;
      const key = `${fee.year}-${String(fee.month).padStart(2, '0')}`;
      if (monthlyData[key]) {
        monthlyData[key].totalAmount += Number(fee.totalAmount);
        monthlyData[key].pending += Number(fee.dueAmount);
      }
    });

    // Actual money collected per month comes from successful receipts.
    const receiptWhere: any = {
      schoolId,
      status: PaymentTransactionStatus.SUCCESS,
    };

    if (startDate && endDate) {
      receiptWhere.paymentDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else {
      // Default to current year if no dates provided
      receiptWhere.paymentDate = {
        gte: new Date(year, 0, 1),
        lte: new Date(year, 11, 31),
      };
    }

    const receipts = await prisma.paymentReceipt.findMany({
      where: receiptWhere,
      select: {
        amount: true,
        paymentDate: true,
      },
      orderBy: { paymentDate: 'asc' },
    });

    receipts.forEach((receipt) => {
      const date = new Date(receipt.paymentDate);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (monthlyData[key]) {
        monthlyData[key].collected += receipt.amount;
      }
    });

    return Object.values(monthlyData);
  }

  // =====================================================
  // STUDENT FEE REPORTS
  // =====================================================

  async getStudentFeeReports(filters: FeeReportFilters) {
    const { schoolId, academicYearId, classId, status, studentId, page, limit } = filters;

    const where: any = { schoolId };

    if (academicYearId || classId) {
      where.feeStructure = {};
      if (academicYearId) where.feeStructure.academicYearId = academicYearId;
      if (classId) where.feeStructure.classId = classId;
    }

    if (studentId) {
      where.studentId = studentId;
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    // Pagination only kicks in when a limit is explicitly requested (normal
    // browsing). Exports call this without a limit and expect every record.
    const paginate = limit !== undefined;
    const currentPage = Number(page || 1);
    const pageSize = paginate ? Number(limit) : undefined;

    const [studentFees, total] = await Promise.all([
      prisma.studentFee.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              name: true,
              academicRecords: {
                where: { isCurrent: true },
                select: { admissionNo: true },
                take: 1,
              },
            }
          },
          feeStructure: {
            include: {
              class: {
                select: {
                  id: true,
                  name: true,
                }
              },
            },
          },
          receipts: {
            where: {
              status: PaymentTransactionStatus.SUCCESS,
            },
            orderBy: { paymentDate: 'desc' },
            take: 1,
            select: {
              paymentDate: true,
              amount: true,
            }
          },
        },
        ...(paginate ? { skip: (currentPage - 1) * (pageSize as number), take: pageSize } : {}),
        orderBy: [
          { student: { name: 'asc' } },
        ],
      }),
      prisma.studentFee.count({ where }),
    ]);

    const data = studentFees.map((fee) => ({
      studentId: fee.studentId,
      studentName: fee.student.name,
      admissionNo: fee.student.academicRecords[0]?.admissionNo || 'N/A',
      classId: fee.feeStructure.class?.id,
      className: fee.feeStructure.class?.name || 'N/A',
      totalFee: Number(fee.totalAmount),
      paidAmount: Number(fee.paidAmount),
      pendingAmount: Number(fee.dueAmount),
      discount: Number(fee.discount),
      lateFee: Number(fee.lateFee),
      status: fee.status,
      dueDate: fee.dueDate,
      lastPaymentDate: fee.receipts[0]?.paymentDate || null,
      lastPaymentAmount: fee.receipts[0]?.amount || 0,
      invoiceNo: fee.invoiceNo,
    }));

    return {
      data,
      pagination: {
        total,
        page: paginate ? currentPage : 1,
        limit: paginate ? (pageSize as number) : total,
        totalPages: paginate ? Math.ceil(total / (pageSize as number)) : 1,
      },
    };
  }

  // =====================================================
  // PAYMENT HISTORY
  // =====================================================

  async getPaymentHistory(filters: FeeReportFilters) {
    const { schoolId, startDate, endDate, paymentMethod, page, limit } = filters;

    const where: any = {
      schoolId,
      status: PaymentTransactionStatus.SUCCESS,
    };

    if (startDate && endDate) {
      where.paymentDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    if (paymentMethod && paymentMethod !== 'ALL') {
      where.paymentMethod = paymentMethod;
    }

    const paginate = limit !== undefined;
    const currentPage = Number(page || 1);
    const pageSize = paginate ? Number(limit) : undefined;

    const [receipts, total] = await Promise.all([
      prisma.paymentReceipt.findMany({
        where,
        include: {
          studentFee: {
            include: {
              student: {
                select: {
                  name: true,
                  academicRecords: {
                    where: { isCurrent: true },
                    select: { admissionNo: true },
                    take: 1,
                  },
                }
              },
              feeStructure: {
                include: {
                  class: {
                    select: {
                      name: true,
                    }
                  },
                },
              },
            },
          },
          receivedBy: {
            select: {
              name: true,
              email: true,
            }
          },
        },
        ...(paginate ? { skip: (currentPage - 1) * (pageSize as number), take: pageSize } : {}),
        orderBy: { paymentDate: 'desc' },
      }),
      prisma.paymentReceipt.count({ where }),
    ]);

    const data = receipts.map((receipt) => ({
      id: receipt.id,
      date: receipt.paymentDate,
      receiptNo: receipt.receiptNo,
      studentName: receipt.studentFee.student.name,
      admissionNo: receipt.studentFee.student.academicRecords[0]?.admissionNo || 'N/A',
      className: receipt.studentFee.feeStructure.class?.name || 'N/A',
      amount: receipt.amount,
      paymentMethod: receipt.paymentMethod,
      transactionId: receipt.transactionId,
      status: receipt.status,
      remarks: receipt.remarks,
      receivedBy: receipt.receivedBy?.name || 'System',
    }));

    return {
      data,
      pagination: {
        total,
        page: paginate ? currentPage : 1,
        limit: paginate ? (pageSize as number) : total,
        totalPages: paginate ? Math.ceil(total / (pageSize as number)) : 1,
      },
    };
  }

  // =====================================================
  // GET FULL REPORT
  // =====================================================

  async getFullReport(filters: FeeReportFilters) {
    const [
      summary,
      classWise,
      feeHeadWise,
      monthlyCollection,
      studentReports,
      paymentHistory,
    ] = await Promise.all([
      this.getSummary(filters),
      this.getClassWiseCollection(filters),
      this.getFeeHeadWiseCollection(filters),
      this.getMonthlyCollection(filters),
      this.getStudentFeeReports(filters),
      this.getPaymentHistory(filters),
    ]);

    return {
      summary,
      classWise,
      feeHeadWise,
      monthlyCollection,
      studentReports,
      paymentHistory,
    };
  }
}
