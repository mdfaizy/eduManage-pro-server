import {
 PaymentTransactionStatus,
} from "../../generated/prisma";

import prisma from "../../config/prisma";

export interface PaymentReportQuery {
  classId?: number;
  sectionId?: number;
  academicYearId?: number;
  startDate?: string;
  endDate?: string;
}

export class ReportsRepository {
  // =====================================================
  // STUDENT FEE PAYMENT REPORT
  // =====================================================

  static async getStudentFeePaymentReport(
    schoolId: number,
    query: PaymentReportQuery = {}
  ) {
    // ---------------------------------------------------
    // STUDENT FEE FILTER
    // ---------------------------------------------------
    const where: any = {schoolId,};
    // ---------------------------------------------------
    // CLASS
    // ---------------------------------------------------
    if (query.classId) {
      where.feeStructure = {
        ...(where.feeStructure || {}),
        classId: Number(query.classId),
      };
    }

    // ---------------------------------------------------
    // ACADEMIC YEAR
    // ---------------------------------------------------

    if (query.academicYearId) {
      where.feeStructure = {
        ...(where.feeStructure || {}),
        academicYearId: Number(
          query.academicYearId
        ),
      };
    }

    // ---------------------------------------------------
    // DEBUG
    // ---------------------------------------------------

    console.log("=================================");

    console.log("STUDENT FEE REPORT QUERY");

    console.log("QUERY:", query);

    console.log(
      "WHERE:",
      JSON.stringify(
        where,
        null,
        2
      )
    );

    console.log("=================================");

    // ---------------------------------------------------
    // GET STUDENT FEES
    // ---------------------------------------------------

    const studentFees =await prisma.studentFee.findMany({
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
    // ---------------------------------------------------
    // GROUP STUDENTS
    // ---------------------------------------------------
    const studentMap =new Map<number, any>();
    // ===================================================
    // LOOP STUDENT FEES
    // ===================================================
    for (const fee of studentFees) {
      const studentId =fee.studentId;
      // -------------------------------------------------
      // PAYMENT FILTER
      // -------------------------------------------------
      const paymentWhere: any = {
        schoolId,

        studentFeeId:
          fee.id,

        status:
          PaymentTransactionStatus.SUCCESS,
      };

      // -------------------------------------------------
      // START DATE
      // -------------------------------------------------

      if (query.startDate) {
        paymentWhere.paymentDate = {
          ...(paymentWhere.paymentDate || {}),

          gte: new Date(
            `${query.startDate}T00:00:00`
          ),
        };
      }

      // -------------------------------------------------
      // END DATE
      // -------------------------------------------------

      if (query.endDate) {
        paymentWhere.paymentDate = {
          ...(paymentWhere.paymentDate || {}),

          lte: new Date(
            `${query.endDate}T23:59:59.999`
          ),
        };
      }

      // -------------------------------------------------
      // GET PAYMENTS IN SELECTED PERIOD
      // -------------------------------------------------

      const payments =
        await prisma.paymentReceipt.findMany({
          where: paymentWhere,

          orderBy: {
            paymentDate: "desc",
          },

          select: {
            amount: true,
            receiptNo: true,
            paymentDate: true,
          },
        });

      // -------------------------------------------------
      // IF DATE FILTER IS SELECTED AND NO PAYMENT
      // THEN DON'T SHOW STUDENT
      // -------------------------------------------------

      if (
        (query.startDate ||
          query.endDate) &&
        payments.length === 0
      ) {
        continue;
      }

      // -------------------------------------------------
      // PAID IN SELECTED PERIOD
      // -------------------------------------------------

      const paidInPeriod =
        payments.reduce(
          (sum, payment) =>
            sum +
            Number(
              payment.amount || 0
            ),
          0
        );

      // -------------------------------------------------
      // CREATE STUDENT
      // -------------------------------------------------

      if (!studentMap.has(studentId)) {
        studentMap.set(
          studentId,
          {
            studentId,

            studentName:
              `${fee.student?.firstName || ""} ${
                fee.student?.lastName || ""
              }`.trim(),

            studentCode:
              fee.student?.studentCode || "",

            admissionNo:
              fee.student?.admissionNo || "",

            classId:
              fee.feeStructure?.classId || null,

            className:
              fee.feeStructure?.class?.name || "",

            academicYearId:
              fee.feeStructure
                ?.academicYearId || null,

            academicYearName:
              fee.feeStructure
                ?.academicYear?.name || "",

            totalFee: 0,

            discount: 0,

            // Total paid till now
            paidAmount: 0,

            // Paid only in selected period
            paidInPeriod: 0,

            // Current outstanding
            dueAmount: 0,

            invoiceNo:
              payments[0]?.receiptNo || "",

            lastPaymentDate:
              payments[0]?.paymentDate ||
              null,

            status: "PENDING",
          }
        );
      }

      const student =
        studentMap.get(studentId);

      // -------------------------------------------------
      // TOTAL FEE
      // -------------------------------------------------

      student.totalFee += Number(
        fee.totalAmount || 0
      );

      // -------------------------------------------------
      // DISCOUNT
      // -------------------------------------------------

      student.discount += Number(
        fee.discount || 0
      );

      // -------------------------------------------------
      // TOTAL PAID TILL NOW
      // -------------------------------------------------

      student.paidAmount += Number(
        fee.paidAmount || 0
      );

      // -------------------------------------------------
      // PAID IN SELECTED DATE RANGE
      // -------------------------------------------------

      student.paidInPeriod +=
        paidInPeriod;

      // -------------------------------------------------
      // CURRENT DUE
      // -------------------------------------------------

      student.dueAmount += Number(
        fee.dueAmount || 0
      );

      // -------------------------------------------------
      // LAST PAYMENT
      // -------------------------------------------------

      if (payments[0]) {
        const latestPayment =
          payments[0];

        if (
          !student.lastPaymentDate ||
          new Date(
            latestPayment.paymentDate
          ) >
            new Date(
              student.lastPaymentDate
            )
        ) {
          student.lastPaymentDate =
            latestPayment.paymentDate;

          student.invoiceNo =
            latestPayment.receiptNo || "";
        }
      }
    }

    // ===================================================
    // FINAL RESULT
    // ===================================================

    const students =
      Array.from(
        studentMap.values()
      ).map((student) => {
        let status = "PENDING";

        if (
          student.dueAmount <= 0
        ) {
          status = "PAID";
        } else if (
          student.paidAmount > 0
        ) {
          status = "PARTIAL";
        }

        return {
          ...student,
          status,
        };
      });

    // ===================================================
    // SUMMARY
    // ===================================================

    const summary =
      students.reduce(
        (acc, student) => {
          acc.totalStudents += 1;

          acc.totalFee += Number(
            student.totalFee || 0
          );

          acc.paidInPeriod += Number(
            student.paidInPeriod || 0
          );

          acc.totalDue += Number(
            student.dueAmount || 0
          );

          acc.totalDiscount += Number(
            student.discount || 0
          );

          return acc;
        },
        {
          totalStudents: 0,
          totalFee: 0,
          paidInPeriod: 0,
          totalDue: 0,
          totalDiscount: 0,
        }
      );

    // ===================================================
    // FINAL LOG
    // ===================================================

    console.log(
      "================================="
    );

    console.log(
      "FINAL REPORT COUNT:",
      students.length
    );

    console.log(
      "FINAL REPORT:",
      students
    );

    console.log(
      "REPORT SUMMARY:",
      summary
    );

    console.log(
      "================================="
    );

    return {
      students,
      summary,
    };
  }
}