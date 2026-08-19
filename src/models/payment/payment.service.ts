import prisma from "../../config/prisma";
import {
  FeeStatus,
  PaymentTransactionStatus,
} from "../../generated/prisma";

import { PaymentRepository } from "./payment.repository";

const paymentRepository = new PaymentRepository();

export class PaymentService {

  // =====================================================
  // CREATE PAYMENT
  // =====================================================


  async createPayment(
    data: any,
    userId: number,
    schoolId: number
  ) {
    const {
      studentFeeId,
      amount,
      paymentMethod,
      transactionId,
      referenceNo,
      remarks,
    } = data;

    // =====================================================
    // VALIDATION
    // =====================================================

    if (!studentFeeId) {
      throw new Error("Student fee ID is required");
    }

    if (!amount || Number(amount) <= 0) {
      throw new Error(
        "Payment amount must be greater than 0"
      );
    }

    if (!paymentMethod) {
      throw new Error(
        "Payment method is required"
      );
    }

    if (!userId || Number.isNaN(Number(userId))) {
      throw new Error(
        "Valid user ID is required"
      );
    }

    return prisma.$transaction(async (tx) => {

      // =====================================================
      // 1. FIND STUDENT FEE
      // =====================================================

      const studentFee =
        await tx.studentFee.findFirst({
          where: {
            id: Number(studentFeeId),
            schoolId,
          },

          include: {
            student: true,
            feeStructure: true,
          },
        });

      if (!studentFee) {
        throw new Error(
          "Student fee not found"
        );
      }

      // =====================================================
      // 2. CHECK FEE STATUS
      // =====================================================

      if (studentFee.status === "PAID") {
        throw new Error(
          "This fee is already fully paid"
        );
      }

      // =====================================================
      // 3. PAYMENT AMOUNT VALIDATION
      // =====================================================

      const paymentAmount =
        Number(amount);

      const currentDue =
        Number(studentFee.dueAmount);

      if (paymentAmount > currentDue) {
        throw new Error(
          `Payment amount cannot exceed due amount of ₹${currentDue}`
        );
      }

      // =====================================================
      // 4. GENERATE RECEIPT NUMBER
      // =====================================================

      const today = new Date();

      const year =
        today
          .getFullYear()
          .toString()
          .slice(-2);

      const month =
        String(
          today.getMonth() + 1
        ).padStart(2, "0");

      const day =
        String(
          today.getDate()
        ).padStart(2, "0");

      const prefix =
        `RCP${year}${month}${day}`;

      const lastReceipt =
        await tx.paymentReceipt.findFirst({
          where: {
            schoolId,

            receiptNo: {
              startsWith: prefix,
            },
          },

          orderBy: {
            receiptNo: "desc",
          },
        });

      let sequence = 1;

      if (lastReceipt) {
        const lastSequence =
          parseInt(
            lastReceipt.receiptNo.slice(-4),
            10
          );

        if (!Number.isNaN(lastSequence)) {
          sequence =
            lastSequence + 1;
        }
      }

      const receiptNo =
        `${prefix}${String(sequence).padStart(4, "0")}`;

      // =====================================================
      // 5. CREATE PAYMENT
      // =====================================================

      const payment =
        await tx.payment.create({
          data: {
            schoolId,

            // Student ID from StudentFee
            studentId:
              studentFee.studentId,

            studentFeeId:
              Number(studentFeeId),

            amount:
              paymentAmount,

            paymentMethod,

            status:
              PaymentTransactionStatus.SUCCESS,

            transactionId:
              transactionId || null,

            referenceNo:
              referenceNo || null,

            paymentDate:
              new Date(),

            remarks:
              remarks || null,

            collectedBy:
              Number(userId),
          },
        });

      // =====================================================
      // 6. CREATE PAYMENT RECEIPT
      // =====================================================

      const receipt =
        await tx.paymentReceipt.create({
          data: {
            schoolId,

            // Student
            studentId:
              studentFee.studentId,

            // Student Fee
            studentFeeId:
              Number(studentFeeId),

            // IMPORTANT:
            // Link receipt with newly created Payment
            paymentId:payment.id,
            receiptNo,
            amount:paymentAmount,
            issuedAt:new Date(),
            paymentMethod,
            transactionId:transactionId || null,
            remarks:remarks || null,
            // Logged-in user
            receivedById: Number(userId),
            status:PaymentTransactionStatus.SUCCESS,
          },
        });

      // =====================================================
      // 7. UPDATE STUDENT FEE
      // =====================================================

      const currentPaidAmount =
        Number(
          studentFee.paidAmount
        );

      const totalAmount =
        Number(
          studentFee.totalAmount
        );

      const newPaidAmount =
        currentPaidAmount +
        paymentAmount;

      const newDueAmount =
        totalAmount -
        newPaidAmount;

      // IMPORTANT:
      // FeeStatus type-only issue fixed here.
      let newStatus:
        | "PAID"
        | "PARTIAL"
        | "PENDING";

      if (newDueAmount <= 0) {
        newStatus = "PAID";
      } else if (newPaidAmount > 0) {
        newStatus = "PARTIAL";
      } else {
        newStatus = "PENDING";
      }

      await tx.studentFee.update({
        where: {
          id:
            Number(studentFeeId),
        },

        data: {
          paidAmount:
            newPaidAmount,

          dueAmount:
            Math.max(
              newDueAmount,
              0
            ),

          status:
            newStatus,
        },
      });

      // =====================================================
      // 8. RETURN PAYMENT + RECEIPT
      // =====================================================

      return {
        payment,
        receipt,
      };
    });
  }

  // =====================================================
  // GET PAYMENTS
  // =====================================================

  async getPayments(
    schoolId: number,
    query?: any
  ) {
    return paymentRepository.findBySchool(
      schoolId,
      query
    );
  }

  // =====================================================
  // PAYMENT REPORT
  // =====================================================


  async getPaymentReport(
    schoolId: number,
    query: any = {}
  ) {
    const [
      studentFeeReport,
      summary,
      methodSummary,
      dailyCollection,
    ] = await Promise.all([

      // STUDENT-WISE FEE REPORT
      paymentRepository.getStudentFeeReport(
        schoolId,
        query
      ),

      // SUMMARY
      paymentRepository.getPaymentSummary(
        schoolId,
        query
      ),

      // PAYMENT METHOD SUMMARY
      paymentRepository.getPaymentMethodSummary(
        schoolId,
        query
      ),

      // DAILY COLLECTION
      paymentRepository.getDailyCollection(
        schoolId,
        query
      ),
    ]);

    console.log("=================================");
    console.log("PAYMENT REPORT SERVICE");
    console.log("QUERY:", query);
    console.log(
      "STUDENT REPORT LENGTH:",
      studentFeeReport.length
    );
    console.log(
      "STUDENT REPORT:",
      studentFeeReport
    );
    console.log("=================================");

    return {
      summary,

      methodSummary,

      dailyCollection,

      // IMPORTANT
      // ClassPaymentReport yahi data read karega
      payments: studentFeeReport,

      pagination: {
        page: Number(query.page) || 1,
        limit: Number(query.limit) || 1000,
        total: studentFeeReport.length,
        totalPages:
          studentFeeReport.length > 0 ? 1 : 0,
      },
    };
  }

  // =====================================================
  // SUMMARY
  // =====================================================

  async getPaymentSummary(
    schoolId: number,
    query?: any
  ) {
    return paymentRepository.getPaymentSummary(
      schoolId,
      query
    );
  }

  // =====================================================
  // BY ID
  // =====================================================

  async getPaymentById(
    schoolId: number,
    id: number
  ) {
    const payment =
      await paymentRepository.findById(
        schoolId,
        id
      );

    if (!payment) {
      throw new Error(
        `Payment receipt with ID ${id} not found`
      );
    }

    return payment;
  }

  // =====================================================
  // BY RECEIPT
  // =====================================================

  async getPaymentByReceiptNo(
    schoolId: number,
    receiptNo: string
  ) {
    const payment =
      await paymentRepository.findByReceiptNo(
        schoolId,
        receiptNo
      );

    if (!payment) {
      throw new Error(
        `Payment receipt ${receiptNo} not found`
      );
    }

    return payment;
  }

  // =====================================================
  // STUDENT PAYMENTS
  // =====================================================

  async getStudentPayments(
    schoolId: number,
    studentId: number
  ) {
    return paymentRepository.findByStudent(
      schoolId,
      studentId
    );
  }

  // =====================================================
  // ANALYTICS
  // =====================================================

  async getPaymentAnalytics(
    schoolId: number,
    query: any = {}
  ) {
    const [
      methodSummary,
      dailyCollection,
    ] = await Promise.all([
      paymentRepository.getPaymentMethodSummary(
        schoolId,
        query
      ),

      paymentRepository.getDailyCollection(
        schoolId,
        query
      ),
    ]);

    return {
      methodSummary,
      dailyCollection,
    };
  }

  // =====================================================
  // UPDATE
  // =====================================================

  async updatePayment(
    schoolId: number,
    id: number,
    data: any
  ) {
    const payment =
      await this.getPaymentById(
        schoolId,
        id
      );

    if (
      payment.status ===
      PaymentTransactionStatus.SUCCESS
    ) {
      throw new Error(
        "Successful payment cannot be directly updated"
      );
    }

    const result =
      await paymentRepository.update(
        schoolId,
        id,
        data
      );

    if (!result.count) {
      throw new Error(
        "Payment not found"
      );
    }

    return this.getPaymentById(
      schoolId,
      id
    );
  }

  // =====================================================
  // DELETE
  // =====================================================

  async deletePayment(
    schoolId: number,
    id: number
  ) {
    const payment =
      await this.getPaymentById(
        schoolId,
        id
      );

    if (
      payment.status ===
      PaymentTransactionStatus.SUCCESS
    ) {
      throw new Error(
        "Successful payment cannot be deleted"
      );
    }

    const result =
      await paymentRepository.delete(
        schoolId,
        id
      );

    if (!result.count) {
      throw new Error(
        "Payment not found"
      );
    }

    return {
      message:
        "Payment deleted successfully",
    };
  }

  // =====================================================
  // PENDING
  // =====================================================

  async getPendingPayments(
    schoolId: number,
    studentId?: number
  ) {
    const where: any = {
      schoolId,

      status: {
        in: [
          FeeStatus.PENDING,
          FeeStatus.PARTIAL,
          FeeStatus.OVERDUE,
        ],
      },
    };

    if (studentId) {
      where.studentId =
        studentId;
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

      orderBy: {
        dueDate: "asc",
      },
    });
  }

  // =====================================================
  // OVERDUE
  // =====================================================

  async getOverduePayments(
    schoolId: number,
    studentId?: number
  ) {
    const where: any = {
      schoolId,

      status:
        FeeStatus.OVERDUE,

      dueDate: {
        lt: new Date(),
      },
    };

    if (studentId) {
      where.studentId =
        studentId;
    }

    return prisma.studentFee.findMany({
      where,

      include: {
        student: true,
        feeStructure: true,
      },

      orderBy: {
        dueDate: "asc",
      },
    });
  }

  // =====================================================
  // DOWNLOAD RECEIPT
  // =====================================================

  async downloadReceipt(
    schoolId: number,
    id: number
  ) {
    const receipt =
      await this.getPaymentById(
        schoolId,
        id
      );

    return {
      receipt,
      html:
        this.generateReceiptHTML(
          receipt
        ),
    };
  }

  // =====================================================
  // RECEIPT HTML
  // =====================================================

  private generateReceiptHTML(
    receipt: any
  ): string {

    const student =
      receipt.studentFee?.student;

    const className =
      receipt.studentFee
        ?.feeStructure
        ?.class
        ?.name || "N/A";

    return `
      <html>
        <head>
          <title>
            Payment Receipt ${receipt.receiptNo}
          </title>

          <style>
            body {
              font-family: Arial, sans-serif;
              background: #f5f5f5;
              padding: 30px;
            }

            .receipt {
              max-width: 650px;
              margin: auto;
              background: white;
              padding: 35px;
              border-radius: 8px;
            }

            .header {
              text-align: center;
              border-bottom: 2px solid #222;
              padding-bottom: 20px;
            }

            .title {
              font-size: 24px;
              font-weight: bold;
            }

            .row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #eee;
            }

            .label {
              font-weight: bold;
            }

            .footer {
              margin-top: 25px;
              padding-top: 15px;
              border-top: 2px solid #222;
              text-align: center;
            }
          </style>
        </head>

        <body>

          <div class="receipt">

            <div class="header">

              <div class="title">
                PAYMENT RECEIPT
              </div>

              <div>
                Receipt #: ${receipt.receiptNo}
              </div>

              <div>
                Date:
                ${new Date(
      receipt.paymentDate
    ).toLocaleDateString()}
              </div>

            </div>

            <div class="content">

              <div class="row">
                <span class="label">
                  Student
                </span>

                <span>
                  ${student?.firstName || ""}
                  ${student?.lastName || ""}
                </span>
              </div>

              <div class="row">
                <span class="label">
                  Class
                </span>

                <span>
                  ${className}
                </span>
              </div>

              <div class="row">
                <span class="label">
                  Amount
                </span>

                <span>
                  ₹${Number(
      receipt.amount
    ).toFixed(2)}
                </span>
              </div>

              <div class="row">
                <span class="label">
                  Payment Method
                </span>

                <span>
                  ${receipt.paymentMethod}
                </span>
              </div>

              ${receipt.transactionId
        ? `
                    <div class="row">
                      <span class="label">
                        Transaction ID
                      </span>

                      <span>
                        ${receipt.transactionId}
                      </span>
                    </div>
                  `
        : ""
      }

              ${receipt.remarks
        ? `
                    <div class="row">
                      <span class="label">
                        Remarks
                      </span>

                      <span>
                        ${receipt.remarks}
                      </span>
                    </div>
                  `
        : ""
      }

            </div>

            <div class="footer">
              <div>
                Thank you for your payment!
              </div>

              <div>
                This is a computer-generated receipt.
              </div>
            </div>

          </div>

        </body>
      </html>
    `;
  }


  async refundPayment(
    paymentId: number,
    schoolId: number,
    amount: number,
    reason: string | undefined,
    referenceNo: string | undefined,
    refundMethod: PaymentMethod,
    refundedBy: number
  ) {
    return prisma.$transaction(async (tx) => {
      // ==========================================
      // 1. PAYMENT FIND
      // ==========================================
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

      if (payment.status !== "SUCCESS") {
        throw new Error(
          "Only successful payments can be refunded"
        );
      }

      // ==========================================
      // 2. ALREADY REFUNDED AMOUNT
      // ==========================================
      const alreadyRefunded = payment.refunds.reduce(
        (sum, refund) => sum + Number(refund.amount),
        0
      );

      const refundableAmount =
        Number(payment.amount) - alreadyRefunded;

      if (amount <= 0) {
        throw new Error(
          "Refund amount must be greater than zero"
        );
      }

      if (amount > refundableAmount) {
        throw new Error(
          `Maximum refundable amount is ₹${refundableAmount}`
        );
      }

      // ==========================================
      // 3. CREATE REFUND
      // ==========================================
//       const refund = await tx.refund.create({
//         data: {
//           school: {
//             connect: {
//               id: schoolId,
//             },
//           },

//           payment: {
//             connect: {
//               id: payment.id,
//             },
//           },

//           student: {
//             connect: {
//               id: payment.studentId,
//             },
//           },

//           studentFee: {
//             connect: {
//               id: payment.studentFeeId,
//             },
//           },

//           amount,

//           reason: reason ?? "Payment refund",

//           // Refund model me referenceNo nahi hai
//           transactionId: referenceNo,

//           refundMethod,

//           // refundedBy,

//           refundedUser: {
//   connect: {
//     id: refundedBy,
//   },
// },
//           status: "COMPLETED",

//           refundDate: new Date(),
//         },
//       });

      const refund = await tx.refund.create({
        data: {
          school: {
            connect: {
              id: schoolId,
            },
          },

          payment: {
            connect: {
              id: payment.id,
            },
          },

          student: {
            connect: {
              id: payment.studentId,
            },
          },

          studentFee: {
            connect: {
              id: payment.studentFeeId,
            },
          },

          amount,

          reason: reason ?? "Payment refund",

          transactionId: referenceNo,

          refundMethod,

          refundedUser: {
            connect: {
              id: refundedBy,
            },
          },

          status: "COMPLETED",

          refundDate: new Date(),
        },
      });

      // ==========================================
      // UPDATE PAYMENT REFUND STATUS
      // ==========================================

      const totalRefunded =
        alreadyRefunded + amount;

      const newPaymentStatus =
        totalRefunded >= Number(payment.amount)
          ? PaymentTransactionStatus.REFUNDED
          : PaymentTransactionStatus.PARTIALLY_REFUNDED;

      await tx.payment.update({
        where: {
          id: payment.id,
        },
        data: {
          status: newPaymentStatus,
        },
      });

      // ==========================================
      // GET STUDENT FEE
      // ==========================================

      // const studentFee =
      //   await tx.studentFee.findUnique({
      //     where: {
      //       id: payment.studentFeeId,
      //     },
      //   });
      // ==========================================
      // 4. GET STUDENT FEE
      // ==========================================
      const studentFee = await tx.studentFee.findUnique({
        where: {
          id: payment.studentFeeId,
        },
      });

      if (!studentFee) {
        throw new Error("Student fee not found");
      }

      // ==========================================
      // 5. CALCULATE NEW PAID AMOUNT
      // ==========================================
      const newPaidAmount =
        Number(studentFee.paidAmount) - amount;

      if (newPaidAmount < 0) {
        throw new Error(
          "Refund amount exceeds paid amount"
        );
      }

      // ==========================================
      // 6. CALCULATE NEW DUE AMOUNT
      // ==========================================
      const payableAmount =
        Number(studentFee.totalAmount) -
        Number(studentFee.discount) +
        Number(studentFee.lateFee);

      const newDueAmount =
        payableAmount - newPaidAmount;

      // ==========================================
      // 7. CALCULATE STATUS
      // ==========================================
      let newStatus:
        | "PAID"
        | "PARTIAL"
        | "PENDING"
        | "OVERDUE";

      if (newPaidAmount <= 0) {
        newStatus = "PENDING";
      } else if (
        newPaidAmount >= payableAmount
      ) {
        newStatus = "PAID";
      } else {
        newStatus = "PARTIAL";
      }

      // ==========================================
      // 8. UPDATE STUDENT FEE
      // ==========================================
      await tx.studentFee.update({
        where: {
          id: studentFee.id,
        },
        data: {
          paidAmount: newPaidAmount,
          dueAmount: Math.max(0, newDueAmount),
          status: newStatus,
        },
      });

      // ==========================================
      // 9. RETURN REFUND
      // ==========================================
      return refund;
    });
  }
  async getPaymentRefunds(
    paymentId: number,
    schoolId: number
  ) {
    const payment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        schoolId,
      },
      select: {
        id: true,
      },
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    return prisma.refund.findMany({
      where: {
        paymentId: payment.id,
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
    return paymentRepository.cancelPayment(
      paymentId,
      schoolId
    );
  }
}