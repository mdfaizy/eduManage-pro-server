

// =====================================================
// feeCalculationWithDiscounts.ts
// =====================================================

interface FeeItem {
  feeHeadId: number;
  amount: number;
}

interface FeeCalculationContext {
  month?: number;
  year?: number;
}

interface DiscountCalculationResult {
  grossAmount: number;
  scholarshipDiscount: number;
  studentDiscount: number;
  totalDiscount: number;
  finalAmount: number;
  appliedDiscountIds: number[];
}

// =====================================================
// CALCULATE FEE WITH SCHOLARSHIP + STUDENT DISCOUNTS
// =====================================================

export const calculateFeeWithDiscounts = (
  grossAmount: number,
  scholarship: any,
  studentDiscounts: any[] = [],
  context: FeeCalculationContext = {},
  feeItems: FeeItem[] = []
): DiscountCalculationResult => {
  const safeGrossAmount = Math.max(
    0,
    Number(grossAmount) || 0
  );

  let scholarshipDiscount = 0;
  let studentDiscount = 0;

  const appliedDiscountIds: number[] = [];

  // =====================================================
  // SCHOLARSHIP
  // =====================================================

  if (scholarship) {
    const scholarshipAmount =
      Number(scholarship.amount) || 0;

    if (scholarship.type === "FIXED") {
      scholarshipDiscount =
        scholarshipAmount;
    } else if (
      scholarship.type === "PERCENTAGE"
    ) {
      scholarshipDiscount =
        (safeGrossAmount *
          scholarshipAmount) /
        100;
    }
  }

  // Scholarship cannot exceed gross fee
  scholarshipDiscount = Math.min(
    Math.max(0, scholarshipDiscount),
    safeGrossAmount
  );

  // =====================================================
  // STUDENT DISCOUNTS
  // =====================================================

  for (const discount of studentDiscounts) {
    if (!discount) {
      continue;
    }

    // ---------------------------------------------------
    // INACTIVE
    // ---------------------------------------------------

    if (!discount.isActive) {
      continue;
    }

    // ---------------------------------------------------
    // ONE TIME
    // ---------------------------------------------------

    if (discount.applyType === "ONE_TIME") {
      if (discount.appliedOn) {
        continue;
      }
    }

    // ---------------------------------------------------
    // MONTHLY
    // ---------------------------------------------------

    if (discount.applyType === "MONTHLY") {
      if (
        context.month === undefined ||
        discount.startMonth == null ||
        discount.endMonth == null
      ) {
        continue;
      }

      const month =
        Number(context.month);

      const startMonth =
        Number(discount.startMonth);

      const endMonth =
        Number(discount.endMonth);

      if (
        !Number.isInteger(month) ||
        !Number.isInteger(startMonth) ||
        !Number.isInteger(endMonth)
      ) {
        continue;
      }

      if (
        month < startMonth ||
        month > endMonth
      ) {
        continue;
      }
    }

    // ---------------------------------------------------
    // YEARLY
    // ---------------------------------------------------

    if (discount.applyType === "YEARLY") {
      if (
        discount.appliedOn &&
        context.year !== undefined
      ) {
        const appliedYear =
          new Date(
            discount.appliedOn
          ).getFullYear();

        if (
          appliedYear ===
          Number(context.year)
        ) {
          continue;
        }
      }
    }

    // ---------------------------------------------------
    // FIND FEE HEAD AMOUNT
    // ---------------------------------------------------

    let discountBaseAmount =
      safeGrossAmount;

    if (
      discount.feeHeadId != null &&
      feeItems.length > 0
    ) {
      const feeItem =
        feeItems.find(
          (item) =>
            Number(item.feeHeadId) ===
            Number(discount.feeHeadId)
        );

      // Discount is fee-head specific.
      // If that fee head isn't part of this StudentFee,
      // this discount does not apply.
      if (!feeItem) {
        continue;
      }

      discountBaseAmount = Math.max(
        0,
        Number(feeItem.amount) || 0
      );
    }

    // ---------------------------------------------------
    // CALCULATE DISCOUNT AMOUNT
    // ---------------------------------------------------

    const requestedAmount =
      Number(discount.amount) || 0;

    if (
      !Number.isFinite(
        requestedAmount
      ) ||
      requestedAmount <= 0
    ) {
      continue;
    }

    let discountAmount = 0;

    if (
      discount.type === "FIXED"
    ) {
      discountAmount =
        requestedAmount;
    } else if (
      discount.type ===
      "PERCENTAGE"
    ) {
      discountAmount =
        (discountBaseAmount *
          requestedAmount) /
        100;
    } else {
      continue;
    }

    // ---------------------------------------------------
    // NEVER DISCOUNT MORE THAN FEE HEAD
    // ---------------------------------------------------

    discountAmount = Math.min(
      Math.max(0, discountAmount),
      discountBaseAmount
    );

    if (discountAmount <= 0) {
      continue;
    }

    studentDiscount +=
      discountAmount;

    if (
      discount.id != null
    ) {
      appliedDiscountIds.push(
        Number(discount.id)
      );
    }
  }

  // =====================================================
  // TOTAL DISCOUNT
  // =====================================================

  const totalDiscount = Math.min(
    safeGrossAmount,
    Math.max(
      0,
      scholarshipDiscount +
        studentDiscount
    )
  );

  // =====================================================
  // FINAL AMOUNT
  // =====================================================

  const finalAmount = Math.max(
    0,
    safeGrossAmount -
      totalDiscount
  );

  return {
    grossAmount: safeGrossAmount,
    scholarshipDiscount,
    studentDiscount,
    totalDiscount,
    finalAmount,
    appliedDiscountIds,
  };
};

// =====================================================
// LEGACY calculateFee
// =====================================================

export const calculateFee = (
  grossAmount: number,
  scholarship: any
) => {
  const result =
    calculateFeeWithDiscounts(
      grossAmount,
      scholarship,
      [],
      {}
    );

  return {
    grossAmount:
      result.grossAmount,

    discount:
      result.totalDiscount,

    finalAmount:
      result.finalAmount,
  };
};