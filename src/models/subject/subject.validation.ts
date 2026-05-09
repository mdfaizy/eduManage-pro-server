import { z } from "zod";

/* ================= CREATE ================= */
// export const createSubjectSchema = z.object({
//   body: z.object({
//     name: z.string().min(2, "Name must be at least 2 characters"),
//     description: z.string().optional(),
//     maxMarks: z.coerce.number().optional(),   // ✅ FIX
//     passMarks: z.coerce.number().optional(),
//   })
// });

export const createSubjectSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),

  maxMarks: z.coerce.number().optional(),
  passMarks: z.coerce.number().optional(),
});

/* ================= UPDATE ================= */
export const updateSubjectSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "Invalid subject id"),
  }),

  body: createSubjectSchema
    .partial() // 🔥 MAIN CHEEZ
    .refine(
      (data) => Object.keys(data).length > 0,
      { message: "At least one field required" }
    )
    .refine(
      (data) =>
        data.passMarks === undefined ||
        data.maxMarks === undefined ||
        data.passMarks <= data.maxMarks,
      {
        message: "Pass marks cannot exceed max marks",
        path: ["passMarks"],
      }
    ),
});
/* ================= TOGGLE ================= */
export const toggleSubjectSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "Invalid subject id")
  })
});

/* ================= GET BY ID ================= */
export const getSubjectByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "Invalid subject id")
  })
});
