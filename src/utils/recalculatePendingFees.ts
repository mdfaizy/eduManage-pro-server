// import prisma from "../config/prisma.js";

// import { calculateFeeWithDiscounts } from "./feeCalculationWithDiscounts.js";

// export const recalculatePendingFees = async (
//   studentId: number,
//   options?: { onlyFeeHeadIds?: number[] }
// ) => {
//   // =========================
//   // STUDENT SCHOLARSHIP
//   // =========================

//   const studentScholarship =
//     await prisma.studentScholarship.findFirst({
//       where: {
//         studentId,
//         isActive: true,
//       },
//       include: {
//         scholarship: true,
//       },
//     });

//   // =========================
//   // FIND PENDING FEES
//   // =========================

//   const pendingFees = await prisma.studentFee.findMany({
//     where: {
//       studentId,
//       status: {
//         not: "PAID",
//       },
//     },
//     include: {
//       feeStructure: true,
//       items: true,
//     },
//   });

//   // =========================
//   // LOOP THROUGH FEES
//   // =========================

//   for (const fee of pendingFees) {
//     const grossAmount = Number(fee.totalAmount);

//     // ======================
//     // FETCH APPLICABLE DISCOUNTS
//     // ======================

//     // Get all feeHeadIds for this StudentFee
//     const feeHeadIds = fee.items.map((item: any) => item.feeHeadId);

//     // Filter by requested feeHeads if provided
//     const applicableFeeHeadIds = options?.onlyFeeHeadIds
//       ? feeHeadIds.filter((id: number) =>
//           options.onlyFeeHeadIds!.includes(id)
//         )
//       : feeHeadIds;

//     // Fetch all active discounts for this student that apply to these fee heads
//     const studentDiscounts =
//       await prisma.studentDiscount.findMany({
//         where: {
//           studentId,
//           feeHeadId: {
//             in: applicableFeeHeadIds,
//           },
//           isActive: true,
//         },
//       });

//     // ======================
//     // CALCULATE WITH DISCOUNTS
//     // ======================

//     const { totalDiscount, finalAmount } = calculateFeeWithDiscounts(
//       grossAmount,
//       studentScholarship?.scholarship,
//       studentDiscounts,
//       {
//         month: fee.month ?? undefined,
//         year: fee.year ?? undefined,
//       }
//     );

//     // ======================
//     // HANDLE ONE_TIME DISCOUNTS
//     // ======================

//     // Mark ONE_TIME discounts as applied
//     for (const discount of studentDiscounts) {
//       if (discount.applyType === "ONE_TIME" && !discount.appliedOn) {
//         await prisma.studentDiscount.update({
//           where: { id: discount.id },
//           data: { appliedOn: new Date() },
//         });
//       }
//     }

//     // ======================
//     // UPDATE FEE RECORD
//     // ======================

//     await prisma.studentFee.update({
//       where: {
//         id: fee.id,
//       },
//       data: {
//         discount: totalDiscount,

//         dueAmount: Math.max(
//           0,
//           finalAmount - Number(fee.paidAmount)
//         ),

//         status:
//           Number(fee.paidAmount) >= finalAmount
//             ? "PAID"
//             : Number(fee.paidAmount) > 0
//             ? "PARTIAL"
//             : "PENDING",
//       },
//     });
//   }
// };




// import prisma from "../config/prisma.js";
// import {
//   calculateFeeWithDiscounts,
// } from "./feeCalculationWithDiscounts.js";

// export const recalculatePendingFees = async (
//   studentId: number,
//   options?: {
//     onlyFeeHeadIds?: number[];
//   }
// ) => {
//   // =====================================================
//   // VALIDATE STUDENT
//   // =====================================================

//   if (
//     !Number.isInteger(studentId) ||
//     studentId <= 0
//   ) {
//     throw new Error("Invalid student ID");
//   }

//   // =====================================================
//   // STUDENT SCHOLARSHIP
//   // =====================================================

//   const studentScholarship =
//     await prisma.studentScholarship.findFirst({
//       where: {
//         studentId,
//         isActive: true,
//       },

//       include: {
//         scholarship: true,
//       },

//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//   // =====================================================
//   // FIND NON-PAID FEES
//   // =====================================================

//   const pendingFees =
//     await prisma.studentFee.findMany({
//       where: {
//         studentId,
//         status: {
//           not: "PAID",
//         },
//       },

//       include: {
//         feeStructure: true,
//         items: true,
//       },

//       orderBy: {
//         id: "asc",
//       },
//     });

//   // =====================================================
//   // LOOP THROUGH FEES
//   // =====================================================

//   for (const fee of pendingFees) {
//     const grossAmount = Math.max(
//       0,
//       Number(fee.totalAmount) || 0
//     );

//     // ===================================================
//     // FEE ITEMS
//     // ===================================================

//     const feeItems = (
//       fee.items || []
//     ).map((item: any) => ({
//       feeHeadId: Number(
//         item.feeHeadId
//       ),
//       amount: Math.max(
//         0,
//         Number(item.amount) || 0
//       ),
//     }));

//     // ===================================================
//     // FEE HEAD IDS
//     // ===================================================

//     const feeHeadIds =
//       feeItems
//         .map(
//           (item) =>
//             item.feeHeadId
//         )
//         .filter(
//           (id) =>
//             Number.isInteger(id) &&
//             id > 0
//         );

//     if (
//       feeHeadIds.length === 0
//     ) {
//       const paidAmount = Math.max(
//         0,
//         Number(fee.paidAmount) || 0
//       );

//       const dueAmount = Math.max(
//         0,
//         grossAmount - paidAmount
//       );

//       const status =
//         paidAmount >= grossAmount
//           ? "PAID"
//           : paidAmount > 0
//           ? "PARTIAL"
//           : "PENDING";

//       await prisma.studentFee.update({
//         where: {
//           id: fee.id,
//         },

//         data: {
//           discount: 0,
//           dueAmount,
//           status,
//         },
//       });

//       continue;
//     }

//     // ===================================================
//     // FILTER AFFECTED FEE HEADS
//     // ===================================================

//     const applicableFeeHeadIds =
//       options?.onlyFeeHeadIds &&
//       options.onlyFeeHeadIds.length > 0
//         ? feeHeadIds.filter(
//             (id) =>
//               options.onlyFeeHeadIds!.includes(
//                 id
//               )
//           )
//         : feeHeadIds;

//     if (
//       applicableFeeHeadIds.length ===
//       0
//     ) {
//       continue;
//     }

//     // ===================================================
//     // FETCH ACTIVE STUDENT DISCOUNTS
//     // ===================================================

//     const studentDiscounts =
//       await prisma.studentDiscount.findMany({
//         where: {
//           studentId,

//           feeHeadId: {
//             in: applicableFeeHeadIds,
//           },

//           isActive: true,
//         },

//         orderBy: {
//           createdAt: "asc",
//         },
//       });

//     // ===================================================
//     // CALCULATE
//     // ===================================================

//     const {
//       totalDiscount,
//       finalAmount,
//       appliedDiscountIds,
//     } =
//       calculateFeeWithDiscounts(
//         grossAmount,
//         studentScholarship?.scholarship ??
//           null,
//         studentDiscounts,
//         {
//           month:
//             fee.month ??
//             undefined,

//           year:
//             fee.year ??
//             undefined,
//         },
//         feeItems
//       );

//     // ===================================================
//     // PAID AMOUNT
//     // ===================================================

//     const paidAmount = Math.max(
//       0,
//       Number(fee.paidAmount) || 0
//     );

//     // ===================================================
//     // FINAL DUE
//     // =====================================================

//     const dueAmount = Math.max(
//       0,
//       finalAmount - paidAmount
//     );

//     // ===================================================
//     // STATUS
//     // ===================================================

//     const status =
//       paidAmount >= finalAmount
//         ? "PAID"
//         : paidAmount > 0
//         ? "PARTIAL"
//         : "PENDING";

//     // ===================================================
//     // UPDATE STUDENT FEE
//     // ===================================================

//     await prisma.studentFee.update({
//       where: {
//         id: fee.id,
//       },

//       data: {
//         discount: totalDiscount,
//         dueAmount,
//         status,
//       },
//     });

//     // ===================================================
//     // MARK ACTUALLY APPLIED ONE_TIME DISCOUNTS
//     // ===================================================

//     if (
//       appliedDiscountIds.length > 0
//     ) {
//       const appliedDiscounts =
//         studentDiscounts.filter(
//           (discount: any) =>
//             appliedDiscountIds.includes(
//               Number(discount.id)
//             )
//         );

//       for (const discount of appliedDiscounts) {
//         // =============================================
//         // ONE_TIME
//         // =============================================

//         if (
//           discount.applyType ===
//           "ONE_TIME"
//         ) {
//           if (!discount.appliedOn) {
//             await prisma.studentDiscount.update({
//               where: {
//                 id: discount.id,
//               },

//               data: {
//                 appliedOn:
//                   new Date(),
//               },
//             });
//           }
//         }

//         // =============================================
//         // YEARLY
//         // =============================================

//         if (
//           discount.applyType ===
//           "YEARLY"
//         ) {
//           if (!discount.appliedOn) {
//             await prisma.studentDiscount.update({
//               where: {
//                 id: discount.id,
//               },

//               data: {
//                 appliedOn:
//                   new Date(),
//               },
//             });
//           }
//         }
//       }
//     }
//   }
// };


import prisma from "../config/prisma.js";
import {
  calculateFeeWithDiscounts,
} from "./feeCalculationWithDiscounts.js";

export const recalculatePendingFees = async (
  studentId: number,
  options?: {
    onlyFeeHeadIds?: number[];
  }
) => {
  // =====================================================
  // VALIDATE STUDENT
  // =====================================================

  if (
    !Number.isInteger(studentId) ||
    studentId <= 0
  ) {
    throw new Error("Invalid student ID");
  }

  // =====================================================
  // STUDENT SCHOLARSHIP
  // =====================================================

  const studentScholarship =
    await prisma.studentScholarship.findFirst({
      where: {
        studentId,
        isActive: true,
      },

      include: {
        scholarship: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  // =====================================================
  // FIND NON-PAID FEES
  // =====================================================

 const pendingFees =
  await prisma.studentFee.findMany({
    where: {
      studentId,
      status: {
        not: "PAID",
      },
    },

    include: {
      feeStructure: {
        include: {
          items: true,
        },
      },
      items: true,
    },

    orderBy: {
      id: "asc",
    },
  });

  // =====================================================
  // LOOP THROUGH FEES
  // =====================================================

  for (const fee of pendingFees) {
    const grossAmount = Math.max(
      0,
      Number(fee.totalAmount) || 0
    );

    // ===================================================
    // FEE ITEMS
    // ===================================================

    // const feeItems = (
    //   fee.items || []
    // ).map((item: any) => ({
    //   feeHeadId: Number(
    //     item.feeHeadId
    //   ),
    //   amount: Math.max(
    //     0,
    //     Number(item.amount) || 0
    //   ),
    // }));

    // ===================================================
// FEE ITEMS
// ===================================================

// Prefer generated StudentFee items.
// If StudentFee has no items, use FeeStructure items.
const sourceItems =
  fee.items && fee.items.length > 0
    ? fee.items
    : fee.feeStructure?.items || [];

const feeItems = sourceItems
  .map((item: any) => ({
    feeHeadId: Number(item.feeHeadId),
    amount: Math.max(
      0,
      Number(item.amount) || 0
    ),
  }))
  .filter(
    (item: any) =>
      Number.isInteger(item.feeHeadId) &&
      item.feeHeadId > 0
  );

    // ===================================================
    // FEE HEAD IDS
    // ===================================================

    const feeHeadIds =
      feeItems
        .map(
          (item) =>
            item.feeHeadId
        )
        .filter(
          (id) =>
            Number.isInteger(id) &&
            id > 0
        );

    if (
      feeHeadIds.length === 0
    ) {
      const paidAmount = Math.max(
        0,
        Number(fee.paidAmount) || 0
      );

      const dueAmount = Math.max(
        0,
        grossAmount - paidAmount
      );

      const status =
        paidAmount >= grossAmount
          ? "PAID"
          : paidAmount > 0
          ? "PARTIAL"
          : "PENDING";

      await prisma.studentFee.update({
        where: {
          id: fee.id,
        },

        data: {
          discount: 0,
          dueAmount,
          status,
        },
      });

      continue;
    }

    // ===================================================
    // FILTER AFFECTED FEE HEADS
    // ===================================================

    // const applicableFeeHeadIds =
    //   options?.onlyFeeHeadIds &&
    //   options.onlyFeeHeadIds.length > 0
    //     ? feeHeadIds.filter(
    //         (id) =>
    //           options.onlyFeeHeadIds!.includes(
    //             id
    //           )
    //       )
    //     : feeHeadIds;

    // if (
    //   applicableFeeHeadIds.length ===
    //   0
    // ) {
    //   continue;
    // }

    const affectedFeeHeadIds =
  options?.onlyFeeHeadIds &&
  options.onlyFeeHeadIds.length > 0
    ? options.onlyFeeHeadIds
    : null;

// Agar specific feeHead ke discount ko update kiya gaya hai,
// aur current StudentFee mein wo feeHead nahi hai,
// to is StudentFee ko skip karo.
if (
  affectedFeeHeadIds &&
  !feeHeadIds.some((id) =>
    affectedFeeHeadIds.includes(id)
  )
) {
  continue;
}

    // ===================================================
    // FETCH ACTIVE STUDENT DISCOUNTS
    // ===================================================

    // const studentDiscounts =
    //   await prisma.studentDiscount.findMany({
    //     where: {
    //       studentId,

    //       feeHeadId: {
    //         in: applicableFeeHeadIds,
    //       },

    //       isActive: true,
    //     },

    //     orderBy: {
    //       createdAt: "asc",
    //     },
    //   });

    const studentDiscounts =
  await prisma.studentDiscount.findMany({
    where: {
      studentId,

      // Current StudentFee ke ALL fee heads ke
      // active discounts fetch honge.
      feeHeadId: {
        in: feeHeadIds,
      },

      isActive: true,
    },

    orderBy: {
      createdAt: "asc",
    },
  });

    // ===================================================
    // CALCULATE
    // ===================================================

    const {
      totalDiscount,
      finalAmount,
      appliedDiscountIds,
    } =
      calculateFeeWithDiscounts(
        grossAmount,
        studentScholarship?.scholarship ??
          null,
        studentDiscounts,
        {
          month:
            fee.month ??
            undefined,

          year:
            fee.year ??
            undefined,
        },
        feeItems
      );

    // ===================================================
    // PAID AMOUNT
    // ===================================================

    const paidAmount = Math.max(
      0,
      Number(fee.paidAmount) || 0
    );

    // ===================================================
    // FINAL DUE
    // =====================================================

    const dueAmount = Math.max(
      0,
      finalAmount - paidAmount
    );

    // ===================================================
    // STATUS
    // ===================================================

    const status =
      paidAmount >= finalAmount
        ? "PAID"
        : paidAmount > 0
        ? "PARTIAL"
        : "PENDING";

    // ===================================================
    // UPDATE STUDENT FEE
    // ===================================================

    await prisma.studentFee.update({
      where: {
        id: fee.id,
      },

      data: {
        discount: totalDiscount,
        dueAmount,
        status,
      },
    });

    // ===================================================
    // MARK ACTUALLY APPLIED ONE_TIME DISCOUNTS
    // ===================================================

    if (
      appliedDiscountIds.length > 0
    ) {
      const appliedDiscounts =
        studentDiscounts.filter(
          (discount: any) =>
            appliedDiscountIds.includes(
              Number(discount.id)
            )
        );

      for (const discount of appliedDiscounts) {
        // =============================================
        // ONE_TIME
        // =============================================

        if (
          discount.applyType ===
          "ONE_TIME"
        ) {
          if (!discount.appliedOn) {
            await prisma.studentDiscount.update({
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

        // =============================================
        // YEARLY
        // =============================================

        if (
          discount.applyType ===
          "YEARLY"
        ) {
          if (!discount.appliedOn) {
            await prisma.studentDiscount.update({
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
      }
    }
  }
};