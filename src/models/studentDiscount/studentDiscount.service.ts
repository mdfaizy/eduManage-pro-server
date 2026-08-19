import repo from "./studentDiscount.repository.js";

import {
  recalculatePendingFees,
} from "../../utils/recalculatePendingFees.js";

class StudentDiscountService {
  // =====================================
  // CREATE
  // =====================================

  async create(data: any) {
    // =====================================
    // BASIC VALIDATION
    // =====================================

    if (!data.studentId) {
      throw new Error(
        "Student is required."
      );
    }

    if (!data.feeHeadId) {
      throw new Error(
        "Fee head is required."
      );
    }

    if (!data.type) {
      throw new Error(
        "Discount type is required."
      );
    }

    if (!data.applyType) {
      throw new Error(
        "Discount apply type is required."
      );
    }

    const studentId =
      Number(data.studentId);

    const feeHeadId =
      Number(data.feeHeadId);

    const schoolId =
      Number(data.schoolId);

    // =====================================
    // ID VALIDATION
    // =====================================

    if (
      !Number.isInteger(studentId) ||
      studentId <= 0
    ) {
      throw new Error(
        "Invalid student ID."
      );
    }

    if (
      !Number.isInteger(feeHeadId) ||
      feeHeadId <= 0
    ) {
      throw new Error(
        "Invalid fee head ID."
      );
    }

    if (
      !Number.isInteger(schoolId) ||
      schoolId <= 0
    ) {
      throw new Error(
        "Invalid school ID."
      );
    }

    // =====================================
    // CHECK STUDENT
    // =====================================

    const student =
      await repo.getStudentInSchool(
        studentId,
        schoolId
      );

    if (!student) {
      throw new Error(
        "Student not found."
      );
    }

    // =====================================
    // CHECK FEE HEAD
    // =====================================

    const feeHead =
      await repo.getFeeHeadInSchool(
        feeHeadId,
        schoolId
      );

    if (!feeHead) {
      throw new Error(
        "Fee head not found."
      );
    }

    // =====================================
    // AMOUNT VALIDATION
    // =====================================

    const amount =
      Number(data.amount);

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      throw new Error(
        "Discount amount must be greater than 0."
      );
    }

    // =====================================
    // TYPE VALIDATION
    // =====================================

    if (
      ![
        "FIXED",
        "PERCENTAGE",
      ].includes(data.type)
    ) {
      throw new Error(
        "Invalid discount type."
      );
    }

    // =====================================
    // APPLY TYPE VALIDATION
    // =====================================

    if (
      ![
        "ONE_TIME",
        "MONTHLY",
        "YEARLY",
      ].includes(data.applyType)
    ) {
      throw new Error(
        "Invalid discount apply type."
      );
    }

    // =====================================
    // PERCENTAGE VALIDATION
    // =====================================

    if (
      data.type === "PERCENTAGE" &&
      amount > 100
    ) {
      throw new Error(
        "Percentage discount cannot exceed 100."
      );
    }

    // =====================================
    // MONTHLY VALIDATION
    // =====================================

    let startMonth =
      data.startMonth;

    let endMonth =
      data.endMonth;

    if (
      data.applyType === "MONTHLY"
    ) {
      if (
        startMonth === undefined ||
        startMonth === null ||
        endMonth === undefined ||
        endMonth === null
      ) {
        throw new Error(
          "Start month and End month are required."
        );
      }

      startMonth =
        Number(startMonth);

      endMonth =
        Number(endMonth);

      if (
        !Number.isInteger(startMonth) ||
        !Number.isInteger(endMonth)
      ) {
        throw new Error(
          "Month must be a valid integer."
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

    // =====================================
    // DUPLICATE CHECK
    // =====================================

    const existing =
      await repo.findExisting(
        schoolId,
        studentId,
        feeHeadId,
        data.applyType
      );

    if (existing) {
      throw new Error(
        "Discount already exists for this student and fee head."
      );
    }

    // =====================================
    // CREATE DISCOUNT
    // =====================================

    const discount =
      await repo.create({
        ...data,

        schoolId,
        studentId,
        feeHeadId,
        amount,

        ...(data.applyType === "MONTHLY"
          ? {
              startMonth,
              endMonth,
            }
          : {
              startMonth: null,
              endMonth: null,
            }),
      });

    // =====================================
    // RECALCULATE EXISTING PENDING FEES
    // =====================================

    await recalculatePendingFees(
      studentId,
      {
        onlyFeeHeadIds: [
          feeHeadId,
        ],
      }
    );

    return discount;
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
  // GET ONE
  // =====================================

  async getOne(
    id: number,
    schoolId: number
  ) {
    const record =
      await repo.getOne(
        id,
        schoolId
      );

    if (!record) {
      throw new Error(
        "Discount not found."
      );
    }

    return record;
  }

  // =====================================
  // UPDATE
  // =====================================

  async update(
    id: number,
    schoolId: number,
    data: any
  ) {
    // =====================================
    // EXISTING RECORD
    // =====================================

    const record =
      await repo.getOne(
        id,
        schoolId
      );

    if (!record) {
      throw new Error(
        "Discount not found."
      );
    }

    // =====================================
    // STUDENT ID
    // =====================================

    const studentId =
      Number(
        data.studentId ??
          record.studentId
      );

    // =====================================
    // FEE HEAD ID
    // =====================================

    const feeHeadId =
      Number(
        data.feeHeadId ??
          record.feeHeadId
      );

    // =====================================
    // TYPE
    // =====================================

    const type =
      data.type ??
      record.type;

    // =====================================
    // APPLY TYPE
    // =====================================

    const applyType =
      data.applyType ??
      record.applyType;

    // =====================================
    // AMOUNT
    // =====================================

    const amount =
      data.amount !== undefined
        ? Number(data.amount)
        : Number(record.amount);

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      throw new Error(
        "Discount amount must be greater than 0."
      );
    }

    // =====================================
    // TYPE VALIDATION
    // =====================================

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

    // =====================================
    // APPLY TYPE VALIDATION
    // =====================================

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

    // =====================================
    // PERCENTAGE VALIDATION
    // =====================================

    if (
      type === "PERCENTAGE" &&
      amount > 100
    ) {
      throw new Error(
        "Percentage discount cannot exceed 100."
      );
    }

    // =====================================
    // MONTH VALIDATION
    // =====================================

    let startMonth =
      data.startMonth ??
      record.startMonth;

    let endMonth =
      data.endMonth ??
      record.endMonth;

    if (
      applyType === "MONTHLY"
    ) {
      if (
        startMonth === undefined ||
        startMonth === null ||
        endMonth === undefined ||
        endMonth === null
      ) {
        throw new Error(
          "Start month and End month are required."
        );
      }

      startMonth =
        Number(startMonth);

      endMonth =
        Number(endMonth);

      if (
        !Number.isInteger(startMonth) ||
        !Number.isInteger(endMonth)
      ) {
        throw new Error(
          "Month must be a valid integer."
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
    } else {
      startMonth = null;
      endMonth = null;
    }

    // =====================================
    // CHECK STUDENT
    // =====================================

    const student =
      await repo.getStudentInSchool(
        studentId,
        schoolId
      );

    if (!student) {
      throw new Error(
        "Student not found."
      );
    }

    // =====================================
    // CHECK FEE HEAD
    // =====================================

    const feeHead =
      await repo.getFeeHeadInSchool(
        feeHeadId,
        schoolId
      );

    if (!feeHead) {
      throw new Error(
        "Fee head not found."
      );
    }

    // =====================================
    // UPDATE
    // =====================================

    const discount =
      await repo.update(
        id,
        schoolId,
        {
          ...data,

          schoolId,
          studentId,
          feeHeadId,
          type,
          applyType,
          amount,
          startMonth,
          endMonth,
        }
      );

    // =====================================
    // RECALCULATE ALL PENDING FEES
    // =====================================

    await recalculatePendingFees(
      studentId
    );

    return discount;
  }

  // =====================================
  // DELETE
  // =====================================

  async delete(
    id: number,
    schoolId: number
  ) {
    const record =
      await repo.getOne(
        id,
        schoolId
      );

    if (!record) {
      throw new Error(
        "Discount not found."
      );
    }

    const studentId =
      Number(record.studentId);

    const deleted =
      await repo.delete(
        id,
        schoolId
      );

    await recalculatePendingFees(
      studentId
    );

    return deleted;
  }

  // =====================================
  // TOGGLE
  // =====================================

  async toggle(
    id: number,
    schoolId: number,
    isActive: boolean
  ) {
    const record =
      await repo.getOne(
        id,
        schoolId
      );

    if (!record) {
      throw new Error(
        "Discount not found."
      );
    }

    if (
      typeof isActive !==
      "boolean"
    ) {
      throw new Error(
        "isActive must be a boolean."
      );
    }

    const discount =
      await repo.toggle(
        id,
        schoolId,
        isActive
      );

    await recalculatePendingFees(
      Number(record.studentId)
    );

    return discount;
  }

  // =====================================
  // GET BY STUDENT
  // =====================================

  async getByStudent(
    studentId: number,
    schoolId: number
  ) {
    const student =
      await repo.getStudentInSchool(
        studentId,
        schoolId
      );

    if (!student) {
      throw new Error(
        "Student not found in this school"
      );
    }

    return repo.getByStudent(
      studentId,
      schoolId
    );
  }

  // =====================================
  // GET APPLICABLE FEE
  // =====================================

  async getApplicableFee(
    studentId: number,
    feeHeadId: number,
    schoolId: number
  ) {
    if (!studentId) {
      throw new Error(
        "Student ID is required."
      );
    }

    if (!feeHeadId) {
      throw new Error(
        "Fee Head ID is required."
      );
    }

    return repo.getApplicableFee(
      Number(studentId),
      Number(feeHeadId),
      Number(schoolId)
    );
  }

  // =====================================
  // BULK UPDATE + CREATE
  // =====================================

// async bulkUpdate(
//   schoolId: number,
//   studentId: number,
//   discounts: any[]
// ) {
//   // =====================================
//   // STUDENT CHECK
//   // =====================================

//   const student =
//     await repo.getStudentInSchool(
//       studentId,
//       schoolId
//     );

//   if (!student) {
//     throw new Error(
//       "Student not found."
//     );
//   }

//   // =====================================
//   // EMPTY CHECK
//   // =====================================

//   if (
//     !Array.isArray(discounts) ||
//     discounts.length === 0
//   ) {
//     throw new Error(
//       "At least one discount is required."
//     );
//   }

//   // =====================================
//   // VALIDATE EACH ROW
//   // =====================================

//   for (const discount of discounts) {
//     const amount =
//       Number(discount.amount);

//     if (
//       !Number.isFinite(amount) ||
//       amount < 0
//     ) {
//       throw new Error(
//         "Discount amount must be a valid positive number."
//       );
//     }

//     if (!discount.feeHeadId) {
//       throw new Error(
//         "Fee head is required."
//       );
//     }

//     if (!discount.type) {
//       throw new Error(
//         "Discount type is required."
//       );
//     }

//     if (!discount.applyType) {
//       throw new Error(
//         "Discount apply type is required."
//       );
//     }

//     if (
//       ![
//         "FIXED",
//         "PERCENTAGE",
//       ].includes(discount.type)
//     ) {
//       throw new Error(
//         "Invalid discount type."
//       );
//     }

//     if (
//       ![
//         "ONE_TIME",
//         "MONTHLY",
//         "YEARLY",
//       ].includes(discount.applyType)
//     ) {
//       throw new Error(
//         "Invalid discount apply type."
//       );
//     }

//     if (
//       discount.type === "PERCENTAGE" &&
//       amount > 100
//     ) {
//       throw new Error(
//         "Percentage discount cannot exceed 100%."
//       );
//     }

//     // =====================================
//     // MONTHLY VALIDATION
//     // =====================================

//     if (
//       discount.applyType === "MONTHLY"
//     ) {
//       const startMonth =
//         Number(discount.startMonth);

//       const endMonth =
//         Number(discount.endMonth);

//       if (
//         !Number.isInteger(startMonth) ||
//         !Number.isInteger(endMonth)
//       ) {
//         throw new Error(
//           "Start month and End month are required for monthly discount."
//         );
//       }

//       if (
//         startMonth < 1 ||
//         startMonth > 12 ||
//         endMonth < 1 ||
//         endMonth > 12
//       ) {
//         throw new Error(
//           "Month must be between 1 and 12."
//         );
//       }

//       if (
//         startMonth > endMonth
//       ) {
//         throw new Error(
//           "Start month cannot be greater than End month."
//         );
//       }
//     }
//   }

//   // =====================================
//   // AFFECTED FEE HEAD IDS
//   // =====================================

//   const affectedFeeHeadIds = [
//     ...new Set(
//       discounts
//         .map(
//           (discount: any) =>
//             Number(discount.feeHeadId)
//         )
//         .filter(
//           (id: number) =>
//             Number.isInteger(id) &&
//             id > 0
//         )
//     ),
//   ];

//   // =====================================
//   // SAVE DISCOUNTS
//   // =====================================

//   const result =
//     await repo.bulkUpdate(
//       schoolId,
//       studentId,
//       discounts
//     );

//   // =====================================
//   // RECALCULATE EXISTING PENDING FEES
//   // =====================================

//   if (
//     affectedFeeHeadIds.length > 0
//   ) {
//     await recalculatePendingFees(
//       studentId,
//       {
//         onlyFeeHeadIds:
//           affectedFeeHeadIds,
//       }
//     );
//   }

//   return result;
// }

async bulkUpdate(
  schoolId: number,
  studentId: number,
  discounts: any[]
) {
  // existing student check
  const student =
    await repo.getStudentInSchool(
      studentId,
      schoolId
    );

  if (!student) {
    throw new Error("Student not found.");
  }

  if (
    !Array.isArray(discounts) ||
    discounts.length === 0
  ) {
    throw new Error(
      "At least one discount is required."
    );
  }

  // ==========================================
  // VALIDATE DISCOUNTS BEFORE DB SAVE
  // ==========================================

  for (const discount of discounts) {

    const feeHeadId =
      Number(discount.feeHeadId);

    const amount =
      Number(discount.amount);

    if (!Number.isFinite(amount) || amount < 0) {
      throw new Error(
        "Discount amount must be a valid positive number."
      );
    }

    if (!feeHeadId) {
      throw new Error("Fee head is required.");
    }

    // ========================================
    // GET APPLICABLE FEE
    // ========================================

    const applicable =
      await repo.getApplicableFee(
        studentId,
        feeHeadId,
        schoolId
      );

    if (!applicable) {
      throw new Error(
        `No applicable fee found for fee head ${feeHeadId}.`
      );
    }

    const maximumDiscount =
      Number(applicable.maximumDiscount);

    // ========================================
    // FIXED DISCOUNT LIMIT
    // ========================================

    if (
      discount.type === "FIXED" &&
      amount > maximumDiscount
    ) {
      throw new Error(
        `${applicable.feeHeadName}: Fixed discount cannot exceed the remaining applicable fee (₹${maximumDiscount}).`
      );
    }

    // ========================================
    // PERCENTAGE LIMIT
    // ========================================

    if (
      discount.type === "PERCENTAGE" &&
      amount > 100
    ) {
      throw new Error(
        `${applicable.feeHeadName}: Percentage discount cannot exceed 100%.`
      );
    }
  }

  // ==========================================
  // ONLY AFTER ALL VALIDATION PASSES
  // SAVE TO DB
  // ==========================================

  const result =
    await repo.bulkUpdate(
      schoolId,
      studentId,
      discounts
    );

  // ==========================================
  // RECALCULATE
  // ==========================================

  const affectedFeeHeadIds = [
    ...new Set(
      discounts
        .map((discount: any) =>
          Number(discount.feeHeadId)
        )
        .filter(
          (id: number) =>
            Number.isInteger(id) && id > 0
        )
    ),
  ];

  await recalculatePendingFees(
    studentId,
    {
      onlyFeeHeadIds:
        affectedFeeHeadIds,
    }
  );

  return result;
}
}

export default new StudentDiscountService();