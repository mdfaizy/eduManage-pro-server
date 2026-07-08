import prisma from "../../config/prisma.js";
import {
  calculateFee,
} from "../../utils/feeCalculation.js";
class StudentFeeRepository {

  // =====================================
  // GENERATE
  // =====================================a

  // =====================================
  // GENERATE
  // =====================================

  // async generate(
  //   data: any
  // ) {

  //   // =====================================
  //   // CHECK EXISTING MONTHLY FEE
  //   // =====================================

  //   const existing =

  //     await prisma
  //       .studentFee
  //       .findFirst({

  //         where: {

  //           studentId:
  //             data.studentId,

  //           feeStructureId:
  //             data.feeStructureId,

  //           month:
  //             data.month,

  //           year:
  //             data.year,
  //         },
  //       });

  //   if (existing) {

  //     throw new Error(
  //       "Fee already generated"
  //     );
  //   }

  //   // =====================================
  //   // STUDENT RECORD
  //   // =====================================

  //   const studentRecord =
  //     await prisma
  //       .studentAcademicRecord
  //       .findFirst({

  //         where: {

  //           studentId:
  //             data.studentId,

  //           isCurrent: true,
  //         },

  //         include: {

  //           transportRoute: true,
  //         },
  //       });

  //   if (!studentRecord) {

  //     throw new Error(
  //       "Student academic record not found"
  //     );
  //   }

  //   // =====================================
  //   // FEE STRUCTURE
  //   // =====================================

  //   const structure =
  //     await prisma
  //       .feeStructure
  //       .findUnique({

  //         where: {

  //           id:
  //             data.feeStructureId,
  //         },

  //         include: {

  //           items: {

  //             include: {

  //               feeHead: true,
  //             },
  //           },
  //         },
  //       });

  //   if (!structure) {

  //     throw new Error(
  //       "Fee structure not found"
  //     );
  //   }

  //   // =====================================
  //   // GENERATE ITEMS
  //   // =====================================

  //   let structureAmount = 0;

  //   const generatedItems: any[] = [];

  //   for (
  //     const item of structure.items
  //   ) {

  //     // =====================================
  //     // MONTHLY
  //     // =====================================

  //     if (
  //       item.frequency ===
  //       "MONTHLY"
  //     ) {

  //       structureAmount +=
  //         Number(item.amount);

  //       generatedItems.push(item);
  //     }

  //     // =====================================
  //     // YEARLY
  //     // =====================================

  //     if (
  //       item.frequency ===
  //       "YEARLY"
  //     ) {

  //       const yearlyExists =

  //         await prisma
  //           .studentFeeItem
  //           .findFirst({

  //             where: {

  //               feeHeadId:
  //                 item.feeHeadId,

  //               studentFee: {

  //                 studentId:
  //                   data.studentId,

  //                 year:
  //                   data.year,
  //               },
  //             },
  //           });

  //       if (!yearlyExists) {

  //         structureAmount +=
  //           Number(item.amount);

  //         generatedItems.push(item);
  //       }
  //     }

  //     // =====================================
  //     // ONE TIME
  //     // =====================================

  //     if (
  //       item.frequency ===
  //       "ONE_TIME"
  //     ) {

  //       const oneTimeExists =

  //         await prisma
  //           .studentFeeItem
  //           .findFirst({

  //             where: {

  //               feeHeadId:
  //                 item.feeHeadId,

  //               studentFee: {

  //                 studentId:
  //                   data.studentId,
  //               },
  //             },
  //           });

  //       if (!oneTimeExists) {

  //         structureAmount +=
  //           Number(item.amount);

  //         generatedItems.push(item);
  //       }
  //     }
  //   }

  //   // =====================================
  //   // TRANSPORT
  //   // =====================================

  //   const transportAmount =

  //     studentRecord
  //       ?.transportRoute
  //       ?.amount || 0;

  //   // =====================================
  //   // GROSS AMOUNT
  //   // =====================================

  //   const grossAmount =

  //     structureAmount +
  //     transportAmount;

  //   // =====================================
  //   // SCHOLARSHIP
  //   // =====================================

  //   const studentScholarship =
  //     await prisma
  //       .studentScholarship
  //       .findFirst({

  //         where: {

  //           studentId:
  //             data.studentId,

  //           isActive: true,
  //         },

  //         include: {

  //           scholarship: true,
  //         },
  //       });

  //   // =====================================
  //   // FINAL CALCULATION
  //   // =====================================

  //   const {

  //     grossAmount:
  //       finalGrossAmount,

  //     discount,

  //     finalAmount,

  //   } = calculateFee(

  //     grossAmount,

  //     studentScholarship
  //       ?.scholarship
  //   );

  //   // =====================================
  //   // CREATE STUDENT FEE
  //   // =====================================

  //   return prisma
  //     .$transaction(
  //       async (tx) => {

  //         return tx
  //           .studentFee
  //           .create({

  //             data: {

  //               schoolId:
  //                 data.schoolId,

  //               studentId:
  //                 data.studentId,

  //               feeStructureId:
  //                 data.feeStructureId,

  //               month:
  //                 data.month,

  //               year:
  //                 data.year,

  //               dueDate:
  //                 data.dueDate,

  //               // =====================================
  //               // ORIGINAL TOTAL
  //               // =====================================

  //               totalAmount:
  //                 finalGrossAmount,

  //               // =====================================
  //               // SCHOLARSHIP DISCOUNT
  //               // =====================================

  //               discount,

  //               // =====================================
  //               // FINAL PAYABLE
  //               // =====================================

  //               dueAmount:
  //                 finalAmount,

  //               paidAmount: 0,

  //               status:
  //                 "PENDING",

  //               invoiceNo:
  //                 `INV-${Date.now()}`,

  //               // =====================================
  //               // FEE ITEMS
  //               // =====================================

  //               items: {

  //                 create:
  //                   generatedItems.map(
  //                     (item: any) => ({

  //                       feeHeadId:
  //                         item.feeHeadId,

  //                       amount:
  //                         item.amount,

  //                       frequency:
  //                         item.frequency,
  //                     })
  //                   ),
  //               },
  //             },

  //             include: {

  //               student: true,

  //               feeStructure: true,

  //               receipts: true,

  //               items: {

  //                 include: {

  //                   feeHead: true,
  //                 },
  //               },
  //             },
  //           });
  //       }
  //     );
  // }

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
console.log("========== GENERATE FEE ==========");
console.log(data);
    // =====================================
    // CHECK EXISTING
    // =====================================

    const existing =

      await tx
        .studentFee
        .findFirst({

          where: {

            studentId:
              data.studentId,

            feeStructureId:
              data.feeStructureId,

            month:
              data.month,

            year:
              data.year,
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
      await tx
        .feeStructure
        .findUnique({

          where: {

            id:
              data.feeStructureId,
          },

          include: {

            items: true,
          },
        });
console.log("========== STRUCTURE ==========");
console.log(structure);

console.log("========== ITEMS ==========");
console.log(structure?.items);
    if (!structure) {

      throw new Error(
        "Fee structure not found"
      );
    }

    // =====================================
    // CALCULATE
    // =====================================

    let total = 0;

    const generatedItems: any[] = [];

    for (
      const item of structure.items
    ) {

      // MONTHLY

      if (
        item.frequency ===
        "MONTHLY"
      ) {

        total +=
          Number(item.amount);

        generatedItems.push(item);
      }

      // YEARLY

      if (
        item.frequency ===
        "YEARLY"
      ) {

        const exists =

          await tx
            .studentFeeItem
            .findFirst({

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
            Number(item.amount);

          generatedItems.push(item);
        }
      }

      // ONE TIME

      if (
        item.frequency ===
        "ONE_TIME"
      ) {

        const exists =

          await tx
            .studentFeeItem
            .findFirst({

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
            Number(item.amount);

          generatedItems.push(item);
        }
      }
    }

    console.log("TOTAL =", total);

    // =====================================
// SCHOLARSHIP
// =====================================

const studentScholarship =
  await tx.studentScholarship.findFirst({
    where: {
      studentId: data.studentId,
      isActive: true,
    },
    include: {
      scholarship: true,
    },
  });
console.log("========== SCHOLARSHIP ==========");
console.log(studentScholarship);
const {
  discount,
  finalAmount,
} = calculateFee(
  total,
  studentScholarship?.scholarship
);
console.log("Discount =", discount);
console.log("Final Amount =", finalAmount);
    // =====================================
    // CREATE
    // =====================================
console.log("Creating Student Fee...");
    return tx
      .studentFee
      .create({

        data: {

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

          totalAmount: total,

          paidAmount: 0,

          // dueAmount:
          //   total,
          dueAmount: finalAmount,

          lateFee: 0,

          // discount: 0,
          discount: discount,

          status:
            "PENDING",

          dueDate:
            data.dueDate,

          invoiceNo:
            `INV-${Date.now()}`,

          // =====================================
          // ITEMS
          // =====================================

          items: {

            create:
              generatedItems.map(
                (item: any) => ({

                  feeHeadId:
                    item.feeHeadId,

                  amount:
                    item.amount,

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

  // =====================================
  // PAY FEE
  // =====================================

  async payFee(data: any) {

    return prisma.$transaction(
      async (tx) => {

        const fee =
          await tx.studentFee.findUnique({

            where: {
              id:
                data.studentFeeId,
            },
          });

        if (!fee) {

          throw new Error(
            "Fee not found"
          );
        }

        // SCHOOL SECURITY

        if (
          fee.schoolId !==
          data.schoolId
        ) {

          throw new Error(
            "Unauthorized access"
          );
        }

        // OVERPAYMENT BLOCK

        if (

          data.amount >

          fee.dueAmount

        ) {

          throw new Error(
            "Amount exceeds due amount"
          );
        }

        const newPaid =
  Number(fee.paidAmount) +
  Number(data.amount);

        // const newDue =

        //   fee.totalAmount -
        //   newPaid;
       const newDue =
  Math.max(
    0,
    Number(fee.totalAmount) -
      Number(fee.discount) -
      newPaid
  );

        let status: any =
          "PENDING";

        // if (newDue <= 0) {

        //   status = "PAID";

        // } else if (
        //   newPaid > 0
        // ) {

        //   status = "PARTIAL";
        // }
    const payableAmount =
  Number(fee.totalAmount) -
  Number(fee.discount);

if (newPaid >= payableAmount) {

  status = "PAID";

} else if (newPaid > 0) {

  status = "PARTIAL";

} else {

  status = "PENDING";
}

        // UPDATE FEE

        const updatedFee =
          await tx.studentFee.update({

            where: {
              id: fee.id,
            },

            data: {

              paidAmount:
                newPaid,

              dueAmount:
                newDue,

              status,
            },
          });

        // CREATE RECEIPT

        await tx.paymentReceipt.create({

          data: {

            schoolId:
              fee.schoolId,

            studentFeeId:
              fee.id,

            amount:
              data.amount,

            paymentMethod:
              data.paymentMethod,

            transactionId:
              data.transactionId,

            remarks:
              data.remarks,

            paymentDate:
              new Date(),

            receiptNo:
              `REC-${Date.now()}`,

            receivedById:
              data.receivedById,
          },
        });

        return updatedFee;
      }
    );
  }

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
    studentId: number
  ) {

    return prisma.studentFee.findMany({

      where: {
        studentId,
      },

      // include: {

      //   receipts: true,

      //   feeStructure: true,
      // },

      include: {
        receipts: true,
        feeStructure: true,

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