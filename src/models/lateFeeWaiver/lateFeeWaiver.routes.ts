import { Router } from "express";

import controller
  from "./lateFeeWaiver.controller.js";

import {
  authMiddleware,
} from "../../middlewares/auth.js";

import {
  validate,
} from "../../middlewares/validate.js";

import {
  createLateFeeWaiverSchema,
} from "./lateFeeWaiver.validation.js";

const router = Router();

// ==========================================
// CREATE WAIVER
// ==========================================

router.post(
  "/",
  authMiddleware,
  validate(createLateFeeWaiverSchema),
  controller.create
);

// ==========================================
// GET BY STUDENT FEE
// IMPORTANT: BEFORE /
// ==========================================

router.get(
  "/student-fee/:studentFeeId",
  authMiddleware,
  controller.getByStudentFee
);

// ==========================================
// GET ALL
// ==========================================

router.get(
  "/",
  authMiddleware,
  controller.getAll
);

export default router;