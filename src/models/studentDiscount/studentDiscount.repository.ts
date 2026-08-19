import prisma from "../../config/prisma.js";

class StudentDiscountRepository {
  // =====================================
  // VALIDATION HELPERS
  // =====================================

  async getStudentInSchool(
    studentId: number,
    schoolId: number
  ) {
    return prisma.student.findFirst({
      where: {
        id: studentId,
        schoolId,
      },
    });
  }


  // =====================================
// BULK UPDATE + CREATE
// =====================================

// async bulkUpdate(
//   schoolId: number,
//   studentId: number,
//   discounts: any[]
// ) {
//   return prisma.$transaction(async (tx) => {
//     const results = [];

//     for (const discount of discounts) {
//       const id = discount.id
//         ? Number(discount.id)
//         : null;

//       const feeHeadId = Number(
//         discount.feeHeadId
//       );

//       const amount = Number(
//         discount.amount
//       );

//       const type = discount.type;
//       const applyType = discount.applyType;

//       // =====================================
//       // BASIC VALIDATION
//       // =====================================

//       if (!feeHeadId) {
//         throw new Error(
//           "Fee head is required."
//         );
//       }

//       if (!Number.isFinite(amount) || amount < 0) {
//         throw new Error(
//           "Invalid discount amount."
//         );
//       }

//       if (!type) {
//         throw new Error(
//           "Discount type is required."
//         );
//       }

//       if (!applyType) {
//         throw new Error(
//           "Discount apply type is required."
//         );
//       }

//       // =====================================
//       // FEE HEAD CHECK
//       // =====================================

//       const feeHead =
//         await tx.feeHead.findFirst({
//           where: {
//             id: feeHeadId,
//             schoolId,
//             isActive: true,
//           },
//         });

//       if (!feeHead) {
//         throw new Error(
//           `Fee head ${feeHeadId} not found.`
//         );
//       }

//       // =====================================
//       // IF ID EXISTS → UPDATE
//       // =====================================

//       if (id) {
//         // First make sure this discount
//         // belongs to same school + student

//         const existing =
//           await tx.studentDiscount.findFirst({
//             where: {
//               id,
//               schoolId,
//               studentId,
//             },
//           });

//         if (!existing) {
//           throw new Error(
//             `Discount ID ${id} not found for this student.`
//           );
//         }

        
//         const updated =
//           await tx.studentDiscount.update({
//             where: {
//               id,
//             },

//             data: {
//               feeHeadId,
//               type,
//               amount,
//               applyType,

//               // Optional fields
//               ...(discount.startMonth !== undefined
//                 ? {
//                     startMonth:
//                       discount.startMonth,
//                   }
//                 : {}),

//               ...(discount.endMonth !== undefined
//                 ? {
//                     endMonth:
//                       discount.endMonth,
//                   }
//                 : {}),

//               ...(discount.appliedOn !== undefined
//                 ? {
//                     appliedOn:
//                       discount.appliedOn,
//                   }
//                 : {}),

//               ...(discount.remarks !== undefined
//                 ? {
//                     remarks:
//                       discount.remarks,
//                   }
//                 : {}),

//               isActive: true,
//             },

//             include: {
//               student: true,
//               feeHead: true,
//             },
//           });

//         results.push(updated);

//         continue;
//       }

//       // =====================================
//       // NO ID → CREATE NEW DISCOUNT
//       // =====================================

//       const created =
//         await tx.studentDiscount.create({
//           data: {
//             schoolId,
//             studentId,
//             feeHeadId,
//             type,
//             amount,
//             applyType,

//             startMonth:
//               discount.startMonth ?? null,

//             endMonth:
//               discount.endMonth ?? null,

//             // appliedOn:
//             //   discount.appliedOn ?? null,
//             appliedOn: null,

//             remarks:
//               discount.remarks ?? null,

//             isActive: true,
//           },

//           include: {
//             student: true,
//             feeHead: true,
//           },
//         });

//       results.push(created);
//     }

//     return results;
//   });
// }

async bulkUpdate(
    schoolId: number,
    studentId: number,
    discounts: any[]
  ) {
    return prisma.$transaction(async (tx) => {
      const results: any[] = [];

      // ===================================================
      // PROCESS EACH DISCOUNT
      // ===================================================

      for (const discount of discounts) {
        const id =
          discount.id !== undefined &&
          discount.id !== null &&
          Number(discount.id) > 0
            ? Number(discount.id)
            : null;

        const feeHeadId =
          Number(discount.feeHeadId);

        const amount =
          Number(discount.amount);

        const type =
          discount.type;

        const applyType =
          discount.applyType;

        // =================================================
        // BASIC VALIDATION
        // =================================================

        if (
          !Number.isInteger(feeHeadId) ||
          feeHeadId <= 0
        ) {
          throw new Error(
            "Fee head is required."
          );
        }

        if (
          !Number.isFinite(amount) ||
          amount < 0
        ) {
          throw new Error(
            "Invalid discount amount."
          );
        }

        if (!type) {
          throw new Error(
            "Discount type is required."
          );
        }

        if (!applyType) {
          throw new Error(
            "Discount apply type is required."
          );
        }

        // =================================================
        // TYPE VALIDATION
        // =================================================

        if (
          ![
            "FIXED",
            "PERCENTAGE",
          ].includes(type)
        ) {
          throw new Error(
            "Invalid discount type."
          );
        }

        // =================================================
        // APPLY TYPE VALIDATION
        // =================================================

        if (
          ![
            "ONE_TIME",
            "MONTHLY",
            "YEARLY",
          ].includes(applyType)
        ) {
          throw new Error(
            "Invalid discount apply type."
          );
        }

        // =================================================
        // PERCENTAGE VALIDATION
        // =================================================

        if (
          type === "PERCENTAGE" &&
          amount > 100
        ) {
          throw new Error(
            "Percentage discount cannot exceed 100%."
          );
        }

        // =================================================
        // MONTH VALIDATION
        // =================================================

        if (
          applyType === "MONTHLY"
        ) {
          const startMonth =
            Number(
              discount.startMonth
            );

          const endMonth =
            Number(
              discount.endMonth
            );

          if (
            !Number.isInteger(
              startMonth
            ) ||
            !Number.isInteger(
              endMonth
            )
          ) {
            throw new Error(
              "Start month and End month are required for monthly discount."
            );
          }

          if (
            startMonth < 1 ||
            startMonth > 12 ||
            endMonth < 1 ||
            endMonth > 12
          ) {
            throw new Error(
              "Month must be between 1 and 12."
            );
          }

          if (
            startMonth > endMonth
          ) {
            throw new Error(
              "Start month cannot be greater than End month."
            );
          }
        }

        // =================================================
        // FEE HEAD CHECK
        // =================================================

        const feeHead =
          await tx.feeHead.findFirst({
            where: {
              id: feeHeadId,
              schoolId,
              isActive: true,
            },
          });

        if (!feeHead) {
          throw new Error(
            `Fee head ${feeHeadId} not found.`
          );
        }

        // =================================================
        // EXISTING DISCOUNT → UPDATE
        // =================================================

        if (id) {
          // -----------------------------------------------
          // CHECK OWNERSHIP
          // -----------------------------------------------

          const existing =
            await tx.studentDiscount.findFirst({
              where: {
                id,
                schoolId,
                studentId,
              },
            });

          if (!existing) {
            throw new Error(
              `Discount ID ${id} not found for this student.`
            );
          }

          // -----------------------------------------------
          // IMPORTANT
          //
          // ONE_TIME / YEARLY discount already has
          // appliedOn.
          //
          // If user edits it, we need to allow the
          // discount to be calculated again.
          // -----------------------------------------------

          const shouldResetAppliedOn =
            existing.applyType ===
              "ONE_TIME" ||
            existing.applyType ===
              "YEARLY" ||
            applyType ===
              "ONE_TIME" ||
            applyType ===
              "YEARLY";

          // -----------------------------------------------
          // UPDATE
          // -----------------------------------------------

          const updated =
            await tx.studentDiscount.update({
              where: {
                id,
              },

              data: {
                // -----------------------------
                // BASIC FIELDS
                // -----------------------------

                feeHeadId,

                type,

                amount,

                applyType,

                // -----------------------------
                // MONTHS
                // -----------------------------

                startMonth:
                  discount.startMonth !==
                  undefined
                    ? discount.startMonth
                    : existing.startMonth,

                endMonth:
                  discount.endMonth !==
                  undefined
                    ? discount.endMonth
                    : existing.endMonth,

                // -----------------------------
                // IMPORTANT
                // -----------------------------
                //
                // DO NOT take appliedOn from
                // frontend while editing.
                //
                // ONE_TIME / YEARLY edit:
                // appliedOn = null
                //
                // Monthly:
                // existing appliedOn is preserved
                //
                ...(shouldResetAppliedOn
                  ? {
                      appliedOn: null,
                    }
                  : {}),

                // -----------------------------
                // REMARKS
                // -----------------------------

                remarks:
                  discount.remarks !==
                  undefined
                    ? discount.remarks
                    : existing.remarks,

                // -----------------------------
                // ACTIVE
                // -----------------------------

                isActive: true,
              },

              include: {
                student: true,
                feeHead: true,
              },
            });

          results.push(
            updated
          );

          continue;
        }

        // =================================================
        // NO ID → CREATE NEW DISCOUNT
        // =================================================

        const created =
          await tx.studentDiscount.create({
            data: {
              schoolId,

              studentId,

              feeHeadId,

              type,

              amount,

              applyType,

              // -----------------------------------------
              // MONTHLY
              // -----------------------------------------

              startMonth:
                applyType ===
                "MONTHLY"
                  ? Number(
                      discount.startMonth
                    )
                  : null,

              endMonth:
                applyType ===
                "MONTHLY"
                  ? Number(
                      discount.endMonth
                    )
                  : null,

              // -----------------------------------------
              // IMPORTANT
              //
              // New ONE_TIME / YEARLY discount should
              // initially NOT be marked as applied.
              // -----------------------------------------

              appliedOn: null,

              // -----------------------------------------
              // REMARKS
              // -----------------------------------------

              remarks:
                discount.remarks ??
                null,

              // -----------------------------------------
              // ACTIVE
              // -----------------------------------------

              isActive: true,
            },

            include: {
              student: true,
              feeHead: true,
            },
          });

        results.push(
          created
        );
      }

      // =================================================
      // RETURN
      // =================================================

      return results;
    });
  }

// =====================================
// GET APPLICABLE FEE
// =====================================

async getApplicableFee(
  studentId: number,
  feeHeadId: number,
  schoolId: number
) {
  // -------------------------------------
  // 1. Get student
  // -------------------------------------

  const student = await prisma.student.findFirst({
    where: {
      id: studentId,
      schoolId,
    },
  });

  if (!student) {
    throw new Error("Student not found.");
  }

  // -------------------------------------
  // 2. Get student's current academic record
  // -------------------------------------

  const academicRecord =
    await prisma.studentAcademicRecord.findFirst({
      where: {
        studentId,
        schoolId,
        // isActive: true,
        isCurrent: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  if (!academicRecord) {
    throw new Error(
      "Student academic record not found."
    );
  }

  // -------------------------------------
  // 3. Find Fee Structure Item
  // -------------------------------------

  const feeItem =
    await prisma.feeStructureItem.findFirst({
      where: {
        feeHeadId,

        feeStructure: {
          schoolId,

          classId:
            academicRecord.classId,

          academicYearId:
            academicRecord.academicYearId,

          isActive: true,
        },
      },

      include: {
        feeHead: true,

        feeStructure: true,
      },
    });

  if (!feeItem) {
    throw new Error(
      "Fee structure not found for this student and fee head."
    );
  }

  // -------------------------------------
  // 4. Get existing active discounts
  // -------------------------------------

  const existingDiscounts =
    await prisma.studentDiscount.findMany({
      where: {
        studentId,
        schoolId,
        feeHeadId,
        isActive: true,
      },
    });

  // -------------------------------------
  // 5. Calculate existing discount
  // -------------------------------------

  let existingDiscountAmount = 0;

  for (const discount of existingDiscounts) {
    existingDiscountAmount +=
      Number(discount.amount || 0);
  }

  // -------------------------------------
  // 6. Actual fee
  // -------------------------------------

  const feeAmount =
    Number(feeItem.amount || 0);

  // -------------------------------------
  // 7. Remaining discount
  // -------------------------------------

  const remainingDiscount = Math.max(
    feeAmount - existingDiscountAmount,
    0
  );

  // -------------------------------------
  // 8. Return
  // -------------------------------------

  return {
    studentId,

    feeHeadId,

    feeHeadName:
      feeItem.feeHead.name,

    feeAmount,

    frequency:
      feeItem.frequency,

    existingDiscount:
      existingDiscountAmount,

    maximumDiscount:
      remainingDiscount,

    remainingAmount:
      remainingDiscount,
  };
}



  async getByStudent(
  studentId: number,
  schoolId: number
) {
  return prisma.studentDiscount.findMany({
    where: {
      studentId,
      schoolId,
    },

    include: {
      student: true,
      feeHead: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}

  async getFeeHeadInSchool(
    feeHeadId: number,
    schoolId: number
  ) {
    return prisma.feeHead.findFirst({
      where: {
        id: feeHeadId,
        schoolId,
      },
    });
  }

  // =====================================
  // CREATE
  // =====================================

  async create(data: any) {
    return prisma.studentDiscount.create({
      data,
      include: {
        student: true,
        feeHead: true,
      },
    });
  }

  // =====================================
  // CREATE BULK
  // =====================================

  async createBulk(
    schoolId: number,
    studentId: number,
    discounts: any[]
  ) {
    return prisma.$transaction(async (tx) => {
      const created = [];

      for (const discount of discounts) {
        const record =
          await tx.studentDiscount.create({
            data: {
              ...discount,
              schoolId,
              studentId,
            },
            include: {
              student: true,
              feeHead: true,
            },
          });

        created.push(record);
      }

      return created;
    });
  }

  // =====================================
  // DUPLICATE CHECK
  // =====================================

  async findExisting(
    schoolId: number,
    studentId: number,
    feeHeadId: number,
    applyType: string
  ) {
    return prisma.studentDiscount.findFirst({
      where: {
        schoolId,
        studentId,
        feeHeadId,
        applyType,
        isActive: true,
      },  
    });
  }

  // =====================================
  // GET ALL
  // =====================================

  async getAll(schoolId: number) {
    return prisma.studentDiscount.findMany({
      where: {
        schoolId,
      },

      include: {
        student: true,
        feeHead: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // =====================================
  // GET ONE
  // =====================================

  async getOne(
    id: number,
    schoolId: number
  ) {
    return prisma.studentDiscount.findFirst({
      where: {
        id,
        schoolId,
      },

      include: {
        student: true,
        feeHead: true,
      },
    });
  }

  // =====================================
  // UPDATE
  // =====================================

  async update(
    id: number,
    schoolId: number,
    data: any
  ) {
    // School validation is already done
    // through getOne() in service.

    return prisma.studentDiscount.update({
      where: {
        id,
      },

      data,

      include: {
        student: true,
        feeHead: true,
      },
    });
  }

  // =====================================
  // DELETE
  // =====================================

  async delete(
    id: number,
    schoolId: number
  ) {
    // School validation is already done
    // through getOne() in service.

    return prisma.studentDiscount.delete({
      where: {
        id,
      },
    });
  }

  // =====================================
  // TOGGLE
  // =====================================

  async toggle(
    id: number,
    schoolId: number,
    isActive: boolean
  ) {
    return prisma.studentDiscount.update({
      where: {
        id,
      },

      data: {
        isActive,
      },

      include: {
        student: true,
        feeHead: true,
      },
    });
  }

  // =====================================
  // GET APPLICABLE DISCOUNTS
  // =====================================

  async getApplicableDiscounts(
    studentId: number,
    feeHeadIds: number[]
  ) {
    if (feeHeadIds.length === 0) {
      return [];
    }

    return prisma.studentDiscount.findMany({
      where: {
        studentId,

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
}

export default new StudentDiscountRepository();






