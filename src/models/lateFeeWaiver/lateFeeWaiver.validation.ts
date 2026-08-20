import { z } from "zod";

export const createLateFeeWaiverSchema =
  z.object({

    studentFeeId:
      z.number()
        .int()
        .positive(),

    amount:
      z.number()
        .finite()
        .positive(),

    reason:
      z.string()
        .trim()
        .min(
          3,
          "Waiver reason is required"
        )
        .max(500),
  });