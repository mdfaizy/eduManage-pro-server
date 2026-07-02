export const calculateFee = (

  grossAmount: number,

  scholarship: any
) => {

  let discount = 0;

  // =========================
  // NO SCHOLARSHIP
  // =========================

  if (!scholarship) {

    return {

      grossAmount,

      discount: 0,

      finalAmount:
        grossAmount,
    };
  }

  // =========================
  // FIXED
  // =========================

  if (

    scholarship.type ===
    "FIXED"

  ) {

    discount =
      scholarship.amount;
  }

  // =========================
  // PERCENTAGE
  // =========================

  else {

    discount =

      (
        grossAmount *
        scholarship.amount
      ) / 100;
  }

  // =========================
  // PREVENT NEGATIVE
  // =========================

  if (

    discount >
    grossAmount

  ) {

    discount =
      grossAmount;
  }

  // =========================
  // FINAL
  // =========================

  const finalAmount =

    grossAmount -
    discount;

  return {

    grossAmount,

    discount,

    finalAmount,
  };
};