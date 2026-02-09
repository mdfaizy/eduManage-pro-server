import { z } from "zod";

/* ================= CREATE ================= */
export const createSubjectSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
  })
});

/* ================= UPDATE ================= */
export const updateSubjectSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "Invalid subject id")
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().max(255).optional()
  }).refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field required" }
  )
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
