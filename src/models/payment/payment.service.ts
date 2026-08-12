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
      remarks,
    } = data;

    if (!studentFeeId) {
      throw new Error(
        "Student fee ID is required"
      );
    }

    if (!amount || Number(amount) <= 0) {
      throw new Error(
        "Payment amount must be greater than 0"
      );
    }

    return prisma.$transaction(
      async (tx) => {

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

        if (
          studentFee.status === FeeStatus.PAID
        ) {
          throw new Error(
            "This fee is already fully paid"
          );
        }

        const paymentAmount =
          Number(amount);

        const currentDue =
          Number(
            studentFee.dueAmount
          );

        if (paymentAmount > currentDue) {
          throw new Error(
            `Payment amount cannot exceed due amount of ${currentDue}`
          );
        }

        // ---------------------------------------------
        // Generate receipt number
        // ---------------------------------------------

        const today = new Date();

        const year =
          today.getFullYear()
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

          sequence =
            lastSequence + 1;
        }

        const receiptNo =
          `${prefix}${String(sequence).padStart(4, "0")}`;

        // ---------------------------------------------
        // Create payment
        // ---------------------------------------------

        const payment =
          await tx.paymentReceipt.create({
            data: {
              schoolId,
              studentFeeId:
                Number(studentFeeId),

              receiptNo,

              amount: paymentAmount,

              paymentMethod,

              transactionId:
                transactionId || null,

              remarks:
                remarks || null,

              receivedById: userId,

              paymentDate: new Date(),

              status:
                PaymentTransactionStatus.SUCCESS,
            },

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

        // ---------------------------------------------
        // Update Student Fee
        // ---------------------------------------------

        const newPaidAmount =
          Number(
            studentFee.paidAmount
          ) + paymentAmount;

        const newDueAmount =
          Number(
            studentFee.totalAmount
          ) - newPaidAmount;

        let newStatus:
          | FeeStatus.PAID
          | FeeStatus.PARTIAL
          | FeeStatus.PENDING;

        if (newDueAmount <= 0) {
          newStatus =
            FeeStatus.PAID;
        } else if (
          newPaidAmount > 0
        ) {
          newStatus =
            FeeStatus.PARTIAL;
        } else {
          newStatus =
            FeeStatus.PENDING;
        }

        await tx.studentFee.update({
          where: {
            id: Number(studentFeeId),
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

        return payment;
      }
    );
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
      paymentResult,
      summary,
      methodSummary,
      dailyCollection,
    ] = await Promise.all([

      paymentRepository.findBySchool(
        schoolId,
        query
      ),

      paymentRepository.getPaymentSummary(
        schoolId,
        query
      ),

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
      summary,

      methodSummary,

      dailyCollection,

      payments:
        paymentResult.payments,

      pagination:
        paymentResult.pagination,
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

              ${
                receipt.transactionId
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

              ${
                receipt.remarks
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
}