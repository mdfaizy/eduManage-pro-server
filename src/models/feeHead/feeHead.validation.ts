import { z }
from "zod";

export const createFeeHeadSchema =
  z.object({

    body: z.object({

      name:
        z.string()

          .trim()

          .min(
            2,
            "Name is required"
          ),

      description:
        z.string()
          .optional(),

      isOptional:
        z.boolean()
          .optional(),
    }),
  });