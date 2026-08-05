import { PaymentRepository } from "./payment.repository";


export class PaymentService {
  private paymentRepository: PaymentRepository;

  constructor() {
    this.paymentRepository = new PaymentRepository();
  }

  // CREATE
  async createPayment(data: any, userId: number) {
    const { studentFeeId, amount, paymentMethod, transactionId, remarks } = data;

    // Check if student fee exists
    const studentFee = await prisma.studentFee.findUnique({
      where: { id: studentFeeId },
      include: {
        student: {
          include: {
            school: true,
          },
        },
      },
    });

    if (!studentFee) {
      throw new Error("Student fee not found");
    }

    if (studentFee.status === FeeStatus.PAID) {
      throw new Error("This fee is already fully paid");
    }

    if (amount <= 0) {
      throw new Error("Payment amount must be greater than 0");
    }

    if (amount > studentFee.dueAmount.toNumber()) {
      throw new Error(`Payment amount cannot exceed due amount of ${studentFee.dueAmount}`);
    }

    // Generate receipt number
    const receiptNo = await this.paymentRepository.generateReceiptNumber(
      studentFee.schoolId
    );

    // Create payment receipt
    const paymentReceipt = await this.paymentRepository.create({
      schoolId: studentFee.schoolId,
      studentFeeId,
      receiptNo,
      amount,
      paymentMethod,
      transactionId,
      remarks,
      receivedById: userId,
      paymentDate: new Date(),
      status: PaymentTransactionStatus.SUCCESS,
    });

    // Update student fee
    await this.paymentRepository.updateStudentFeeAfterPayment(studentFeeId, amount);

    return paymentReceipt;
  }

  // FIND
  async getPayments(schoolId: number, query?: any) {
    return this.paymentRepository.findBySchool(schoolId, query);
  }

  async getPaymentById(id: number) {
    const payment = await this.paymentRepository.findById(id);
    if (!payment) {
      throw new Error(`Payment receipt with ID ${id} not found`);
    }
    return payment;
  }

  async getPaymentByReceiptNo(receiptNo: string) {
    const payment = await this.paymentRepository.findByReceiptNo(receiptNo);
    if (!payment) {
      throw new Error(`Payment receipt with number ${receiptNo} not found`);
    }
    return payment;
  }

  async getStudentPayments(studentId: number) {
    return this.paymentRepository.findByStudent(studentId);
  }

  async getStudentFeePayments(studentFeeId: number) {
    return this.paymentRepository.findByStudentFee(studentFeeId);
  }

  // SUMMARY
  async getPaymentSummary(schoolId: number, studentId?: number) {
    return this.paymentRepository.getPaymentSummary(schoolId, studentId);
  }

  async getPaymentStats(schoolId: number, academicYearId?: number) {
    return this.paymentRepository.getPaymentStats(schoolId, academicYearId);
  }

  // ANALYTICS
  async getPaymentAnalytics(
    schoolId: number,
    startDate: string,
    endDate: string
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("Invalid date format");
    }

    if (start > end) {
      throw new Error("Start date must be before end date");
    }

    const [dailyData, methodData, statusData] = await Promise.all([
      this.paymentRepository.groupByDate(schoolId, start, end),
      this.paymentRepository.groupByPaymentMethod(schoolId, start, end),
      this.paymentRepository.groupByStatus(schoolId, start, end),
    ]);

    return {
      daily: dailyData,
      byMethod: methodData,
      byStatus: statusData,
    };
  }

  // PENDING & OVERDUE
  async getPendingPayments(schoolId: number, studentId?: number) {
    return this.paymentRepository.getPendingPayments(schoolId, studentId);
  }

  async getOverduePayments(schoolId: number, studentId?: number) {
    return this.paymentRepository.getOverduePayments(schoolId, studentId);
  }

  // UPDATE
  async updatePayment(id: number, data: any) {
    const payment = await this.getPaymentById(id);

    if (payment.status === PaymentTransactionStatus.SUCCESS) {
      throw new Error("Cannot update a successful payment receipt");
    }

    return this.paymentRepository.update(id, data);
  }

  // DELETE
  async deletePayment(id: number) {
    const payment = await this.getPaymentById(id);

    if (payment.status === PaymentTransactionStatus.SUCCESS) {
      throw new Error("Cannot delete a successful payment receipt");
    }

    const deleted = await this.paymentRepository.delete(id);

    // Recalculate student fee
    const totalPaid = await this.paymentRepository.getTotalAmountByStudentFee(
      payment.studentFeeId
    );

    const studentFee = await prisma.studentFee.findUnique({
      where: { id: payment.studentFeeId },
    });

    if (studentFee) {
      const paidAmount = totalPaid._sum.amount || 0;
      const dueAmount = studentFee.totalAmount.toNumber() - paidAmount;

      let status: FeeStatus;
      if (dueAmount <= 0) {
        status = FeeStatus.PAID;
      } else if (paidAmount > 0) {
        status = FeeStatus.PARTIAL;
      } else {
        status = FeeStatus.PENDING;
      }

      await prisma.studentFee.update({
        where: { id: payment.studentFeeId },
        data: {
          paidAmount,
          dueAmount,
          status,
        },
      });
    }

    return { message: "Payment receipt deleted successfully" };
  }

  // DOWNLOAD
  async downloadReceipt(id: number) {
    const receipt = await this.getPaymentById(id);
    return {
      receipt,
      html: this.generateReceiptHTML(receipt),
    };
  }

  private generateReceiptHTML(receipt: any): string {
    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .receipt { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .title { font-size: 24px; font-weight: bold; }
            .content { margin: 20px 0; }
            .row { display: flex; justify-content: space-between; padding: 8px 0; }
            .label { font-weight: bold; }
            .footer { border-top: 2px solid #333; padding-top: 10px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <div class="title">PAYMENT RECEIPT</div>
              <div>Receipt #: ${receipt.receiptNo}</div>
              <div>Date: ${new Date(receipt.paymentDate).toLocaleDateString()}</div>
            </div>
            <div class="content">
              <div class="row">
                <span class="label">Student:</span>
                <span>${receipt.studentFee.student.firstName} ${receipt.studentFee.student.lastName}</span>
              </div>
              <div class="row">
                <span class="label">Class:</span>
                <span>${receipt.studentFee.feeStructure.class?.name || 'N/A'}</span>
              </div>
              <div class="row">
                <span class="label">Amount:</span>
                <span>₹${receipt.amount.toFixed(2)}</span>
              </div>
              <div class="row">
                <span class="label">Payment Method:</span>
                <span>${receipt.paymentMethod}</span>
              </div>
              ${receipt.transactionId ? `
                <div class="row">
                  <span class="label">Transaction ID:</span>
                  <span>${receipt.transactionId}</span>
                </div>
              ` : ''}
              ${receipt.remarks ? `
                <div class="row">
                  <span class="label">Remarks:</span>
                  <span>${receipt.remarks}</span>
                </div>
              ` : ''}
            </div>
            <div class="footer">
              <div>Thank you for your payment!</div>
              <div style="font-size: 12px; color: #666;">This is a computer-generated receipt.</div>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}