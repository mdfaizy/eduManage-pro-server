import { z } from "zod";

const feeStructureItemSchema = z.object({
  feeHeadId: z.coerce
    .number()
    .int()
    .positive("Fee head is required"),

  amount: z.coerce
    .number()
    .finite("Amount must be a valid number")
    .positive("Amount must be greater than 0"),

  frequency: z.enum([
    "MONTHLY",
    "YEARLY",
    "ONE_TIME",
  ]),
});

export const createFeeStructureSchema = z.object({
  academicYearId: z.coerce
    .number()
    .int()
    .positive("Academic year is required"),

  classId: z.coerce
    .number()
    .int()
    .positive("Class is required"),

  name: z
    .string()
    .trim()
    .min(2, "Fee structure name is required")
    .max(100),

  dueDay: z.coerce
    .number()
    .int()
    .min(1, "Due day must be between 1 and 31")
    .max(31, "Due day must be between 1 and 31"),

  items: z
    .array(feeStructureItemSchema)
    .min(1, "At least one fee head is required"),
});

export const updateFeeStructureSchema =
  createFeeStructureSchema.partial().extend({
    items: z
      .array(feeStructureItemSchema)
      .min(1, "At least one fee head is required")
      .optional(),
  });