// =====================================================
// studentFee.routes.ts
// =====================================================

import { Router }
from "express";

import {
  authMiddleware,
} from "../../middlewares/auth.js";

import controller
from "./feeStructure.controller";

const router = Router();

// =====================================
// GENERATE
// =====================================

router.post(
  "/generate",

  authMiddleware,

  (req, res) =>
    controller.generate(
      req,
      res
    )
);

// =====================================
// PAY
// =====================================

router.post(
  "/pay",

  authMiddleware,

  (req, res) =>
    controller.payFee(
      req,
      res
    )
);

// =====================================
// GET ALL
// =====================================

router.get(
  "/",

  authMiddleware,

  (req, res) =>
    controller.getAll(
      req,
      res
    )
);

// =====================================
// STUDENT HISTORY
// =====================================

router.get(
  "/student/:studentId",

  authMiddleware,

  (req, res) =>
    controller
      .getStudentHistory(
        req,
        res
      )
);

// =====================================
// DUE FEES
// =====================================

router.get(
  "/due",

  authMiddleware,

  (req, res) =>
    controller.getDueFees(
      req,
      res
    )
);

export default router;