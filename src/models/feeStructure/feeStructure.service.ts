// =====================================================
// studentFee.service.ts
// =====================================================

import repo
from "./feeStructure.repository";

class StudentFeeService {

  // =====================================
  // GENERATE
  // =====================================

  async generate(
    data: any
  ) {

    return repo.generate(
      data
    );
  }

  // =====================================
  // GET ALL
  // =====================================

  async getAll(
    schoolId: number
  ) {

    return repo.getAll(
      schoolId
    );
  }

  // =====================================
  // PAY FEE
  // =====================================

  async payFee(

    schoolId: number,

    payload: any
  ) {

    const fee =
      await repo.getById(

        payload.studentFeeId
      );

    if (!fee) {

      throw new Error(
        "Fee not found"
      );
    }

    // =================================
    // CALCULATE
    // =================================

    const paidAmount =

      fee.paidAmount +

      payload.amount;

    const dueAmount =

      fee.totalAmount -

      paidAmount;

    let status = "PENDING";

    if (dueAmount <= 0) {

      status = "PAID";

    } else if (

      paidAmount > 0

    ) {

      status = "PARTIAL";
    }

    // =================================
    // UPDATE FEE
    // =================================

    const updatedFee =
      await repo
        .updatePayment(

          fee.id,

          {

            paidAmount,

            dueAmount,

            status,
          }
        );

    // =================================
    // RECEIPT
    // =================================

    await repo
      .createReceipt({

        schoolId,

        studentFeeId:
          fee.id,

        receiptNo:
          `RCPT-${Date.now()}`,

        amount:
          payload.amount,

        paymentMethod:
          payload.paymentMethod,

        transactionId:
          payload.transactionId,

        remarks:
          payload.remarks,
      });

    return updatedFee;
  }

  // =====================================
  // STUDENT HISTORY
  // =====================================

  async getStudentHistory(

    schoolId: number,

    studentId: number
  ) {

    return repo
      .getStudentHistory(

        schoolId,

        studentId
      );
  }

  // =====================================
  // DUE FEES
  // =====================================

  async getDueFees(
    schoolId: number
  ) {

    return repo
      .getDueFees(
        schoolId
      );
  }
}

export default
new StudentFeeService();