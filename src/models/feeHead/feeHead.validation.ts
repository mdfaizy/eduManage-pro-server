// import { z }
// from "zod";

// export const createFeeHeadSchema =
//   z.object({

//     body: z.object({

//       name:
//         z.string()

//           .trim()

//           .min(
//             2,
//             "Name is required"
//           ),

//       description:
//         z.string()
//           .optional(),

//       isOptional:
//         z.boolean()
//           .optional(),
//     }),
//   });

import { z } from "zod";

export const createFeeHeadSchema = z.object({

  name: z
    .string()
    .trim()
    .min(2, "Name required")
    .max(100),

  description:
    z.string()
    .max(500)
    .optional(),
});

export const updateFeeHeadSchema =
  createFeeHeadSchema.partial();