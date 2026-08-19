import prisma from "../../config/prisma.js";
import {
  calculateFeeWithDiscounts,
} from "../../utils/feeCalculationWithDiscounts.js";
class StudentFeeRepository {

  // =====================================
  // GENERATE
  // =====================================

  async generate(
    data: any
  ) {

    return prisma.$transaction(

      async (tx) => {

        return this
          .generateWithTransaction(

            tx,

            data
          );
      }
    );
  }
  // =====================================
  // GENERATE WITH TRANSACTION
  // =====================================
  async generateWithTransaction(
    tx: any,
    data: any
  ) {
    // =====================================
    // CHECK EXISTING
    // =====================================

    const existing =
      await tx.studentFee.findFirst({
        where: {
          studentId: data.studentId,
          feeStructureId: data.feeStructureId,
          month: data.month,
          year: data.year,
        },
      });

    if (existing) {
      throw new Error(
        "Fee already generated"
      );
    }

    // =====================================
    // FEE STRUCTURE
    // =====================================

    const structure =
      await tx.feeStructure.findUnique({
        where: {
          id: data.feeStructureId,
        },

        include: {
          items: true,
        },
      });

    if (!structure) {
      throw new Error(
        "Fee structure not found"
      );
    }

    // =====================================
    // CALCULATE FEE ITEMS
    // =====================================

    let total = 0;

    const generatedItems: any[] = [];

    for (const item of structure.items) {
      // =====================================
      // MONTHLY
      // =====================================

      if (
        item.frequency === "MONTHLY"
      ) {
        total +=
          Number(item.amount) || 0;

        generatedItems.push(item);
      }

      // =====================================
      // YEARLY
      // =====================================

      if (
        item.frequency === "YEARLY"
      ) {
        const exists =
          await tx.studentFeeItem.findFirst({
            where: {
              feeHeadId:
                item.feeHeadId,

              studentFee: {
                studentId:
                  data.studentId,

                year:
                  data.year,
              },
            },
          });

        if (!exists) {
          total +=
            Number(item.amount) || 0;

          generatedItems.push(item);
        }
      }

      // =====================================
      // ONE TIME
      // =====================================

      if (
        item.frequency === "ONE_TIME"
      ) {
        const exists =
          await tx.studentFeeItem.findFirst({
            where: {
              feeHeadId:
                item.feeHeadId,

              studentFee: {
                studentId:
                  data.studentId,
              },
            },
          });

        if (!exists) {
          total +=
            Number(item.amount) || 0;

          generatedItems.push(item);
        }
      }
    }

    // =====================================
    // SCHOLARSHIP
    // =====================================

    const studentScholarship =
      await tx.studentScholarship.findFirst({
        where: {
          studentId:
            data.studentId,

          isActive: true,
        },

        include: {
          scholarship: true,
        },
      });

    // =====================================
    // FEE HEAD IDS
    // =====================================

    const feeHeadIds =
      generatedItems
        .map(
          (item: any) =>
            Number(item.feeHeadId)
        )
        .filter(
          (id: number) =>
            Number.isInteger(id) &&
            id > 0
        );

    // =====================================
    // FEE ITEMS
    // =====================================
    // These items are passed to the discount
    // calculator so fee-head-specific
    // discounts use the correct fee amount.

    const feeItems =
      generatedItems.map(
        (item: any) => ({
          feeHeadId:
            Number(item.feeHeadId),

          amount: Math.max(
            0,
            Number(item.amount) || 0
          ),
        })
      );

    // =====================================
    // STUDENT DISCOUNTS
    // =====================================

    let studentDiscounts: any[] = [];

    if (feeHeadIds.length > 0) {
      studentDiscounts =
        await tx.studentDiscount.findMany({
          where: {
            studentId:
              data.studentId,

            feeHeadId: {
              in: feeHeadIds,
            },

            isActive: true,
          },

          orderBy: {
            createdAt: "asc",
          },
        });
    }

    // =====================================
    // CALCULATE
    // SCHOLARSHIP + STUDENT DISCOUNTS
    // =====================================

    const {
      totalDiscount,
      finalAmount,
      appliedDiscountIds,
    } =
      calculateFeeWithDiscounts(
        total,

        studentScholarship
          ?.scholarship ?? null,

        studentDiscounts,

        {
          month:
            data.month,

          year:
            data.year,
        },

        feeItems
      );

    // =====================================
    // MARK ONLY ACTUALLY APPLIED
    // ONE_TIME DISCOUNTS
    // =====================================

    for (
      const discount of studentDiscounts
    ) {
      if (
        discount.applyType ===
        "ONE_TIME" &&

        appliedDiscountIds.includes(
          Number(discount.id)
        ) &&

        !discount.appliedOn
      ) {
        await tx.studentDiscount.update({
          where: {
            id: discount.id,
          },

          data: {
            appliedOn:
              new Date(),
          },
        });
      }
    }

    // =====================================
    // CREATE STUDENT FEE
    // =====================================

    return tx.studentFee.create({
      data: {
        // ===================================
        // BASIC DETAILS
        // ===================================

        schoolId:
          data.schoolId,

        studentId:
          data.studentId,

        feeStructureId:
          data.feeStructureId,

        month:
          data.month,

        year:
          data.year,

        // ===================================
        // AMOUNTS
        // ===================================

        // Original fee amount
        totalAmount:
          total,

        // No payment at generation time
        paidAmount:
          0,

        // Final amount after discounts
        dueAmount:
          finalAmount,

        // Late fee initially zero
        lateFee:
          0,

        // Total scholarship +
        // student discount
        discount:
          totalDiscount,

        // ===================================
        // STATUS
        // ===================================

        status:
          "PENDING",

        // ===================================
        // DUE DATE
        // ===================================

        dueDate:
          data.dueDate,

        // ===================================
        // INVOICE
        // ===================================

        invoiceNo:
          `INV-${Date.now()}`,

        // ===================================
        // FEE ITEMS
        // ===================================

        items: {
          create:
            generatedItems.map(
              (item: any) => ({
                feeHeadId:
                  item.feeHeadId,

                amount:
                  Number(item.amount) || 0,

                frequency:
                  item.frequency,
              })
            ),
        },
      },
      include: {
        student: true,

        feeStructure: true,

        items: {
          include: {
            feeHead: true,
          },
        },
      },
    });
  }

  async getStudentFeeForPayment(
    studentFeeId: number,
    schoolId: number
  ) {
    return prisma.studentFee.findFirst({
      where: {
        id: studentFeeId,
        schoolId,
      },
      include: {
        student: true,
        items: true,
        feeStructure: true,
      },
    });
  }
  // =====================================
  // PAY FEE
  // =====================================

  //   async payFee(data: any) {

  //     return prisma.$transaction(
  //       async (tx) => {

  //         const fee =
  //           await tx.studentFee.findUnique({

  //             where: {
  //               id:
  //                 data.studentFeeId,
  //             },
  //           });

  //         if (!fee) {

  //           throw new Error(
  //             "Fee not found"
  //           );
  //         }

  //         // SCHOOL SECURITY

  //         if (
  //           fee.schoolId !==
  //           data.schoolId
  //         ) {

  //           throw new Error(
  //             "Unauthorized access"
  //           );
  //         }

  //         // OVERPAYMENT BLOCK

  //         if (

  //           data.amount >

  //           fee.dueAmount

  //         ) {

  //           throw new Error(
  //             "Amount exceeds due amount"
  //           );
  //         }

  //         const newPaid =
  //   Number(fee.paidAmount) +
  //   Number(data.amount);

  //         // const newDue =

  //         //   fee.totalAmount -
  //         //   newPaid;
  //        const newDue =
  //   Math.max(
  //     0,
  //     Number(fee.totalAmount) -
  //       Number(fee.discount) -
  //       newPaid
  //   );

  //         let status: any =
  //           "PENDING";

  //         // if (newDue <= 0) {

  //         //   status = "PAID";

  //         // } else if (
  //         //   newPaid > 0
  //         // ) {

  //         //   status = "PARTIAL";
  //         // }
  //     const payableAmount =
  //   Number(fee.totalAmount) -
  //   Number(fee.discount);

  // if (newPaid >= payableAmount) {

  //   status = "PAID";

  // } else if (newPaid > 0) {

  //   status = "PARTIAL";

  // } else {

  //   status = "PENDING";
  // }

  //         // UPDATE FEE

  //         const updatedFee =
  //           await tx.studentFee.update({

  //             where: {
  //               id: fee.id,
  //             },

  //             data: {

  //               paidAmount:
  //                 newPaid,

  //               dueAmount:
  //                 newDue,

  //               status,
  //             },
  //           });

  //         // CREATE RECEIPT

  //         await tx.paymentReceipt.create({

  //           data: {

  //             schoolId:
  //               fee.schoolId,

  //             studentFeeId:
  //               fee.id,

  //             amount:
  //               data.amount,

  //             paymentMethod:
  //               data.paymentMethod,

  //             transactionId:
  //               data.transactionId,

  //             remarks:
  //               data.remarks,

  //             paymentDate:
  //               new Date(),

  //             receiptNo:
  //               `REC-${Date.now()}`,

  //             receivedById:
  //               data.receivedById,
  //           },
  //         });

  //         return updatedFee;
  //       }
  //     );
  //   }

  // =====================================
  // GET ALL
  // =====================================

  async getAll(
    schoolId: number
  ) {

    return prisma.studentFee.findMany({

      where: {
        schoolId,
      },

      // include: {

      //   student: true,

      //   feeStructure: true,

      //   receipts: true,
      // },

      include: {
        student: true,
        feeStructure: true,
        receipts: true,

        items: {
          include: {
            feeHead: true,
          },
        },
      },
      orderBy: {

        createdAt:
          "desc",
      },
    });
  }

  // =====================================
  // STUDENT HISTORY
  // =====================================

  async getStudentHistory(
    schoolId: number,
    studentId: number
  ) {
    return prisma.studentFee.findMany({
      where: {
        studentId,
        schoolId,
      },
      include: {
        receipts: true,
        feeStructure: true,
        items: {
          include: {
            feeHead: true,
          },
        },
        student: true,
      },

      orderBy: {
        createdAt:
          "desc",
      },
    });
  }
  // =====================================
  // DUE FEES
  // =====================================
  async getDueFees(
    schoolId: number
  ) {
    return prisma.studentFee.findMany({
      where: {
        schoolId,
        dueAmount: {
          gt: 0,
        },
      },
      include: {
        student: true,
        feeStructure: true,
      },
    });
  }
}

export default
  new StudentFeeRepository();