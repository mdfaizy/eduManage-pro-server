import { Router } from "express";

import {
  authMiddleware,
} from "../../middlewares/auth.js";

import controller from "./studentDiscount.controller.js";

const router = Router();

// =====================================
// CREATE
// =====================================

router.post(
  "/",
  authMiddleware,
  controller.create
);

// =====================================
// GET BY STUDENT
// =====================================

router.get(
  "/student/:studentId",
  authMiddleware,
  controller.getByStudent
);

// =====================================
// APPLICABLE FEE
// IMPORTANT: BEFORE /:id
// =====================================

router.get(
  "/applicable-fee",
  authMiddleware,
  controller.getApplicableFee
);

// =====================================
// BULK UPDATE + CREATE
// IMPORTANT: BEFORE /:id
// =====================================

router.put(
  "/bulk",
  authMiddleware,
  controller.bulkUpdate
);

// =====================================
// GET ALL
// =====================================

router.get(
  "/",
  authMiddleware,
  controller.getAll
);

// =====================================
// GET ONE
// =====================================

router.get(
  "/:id",
  authMiddleware,
  controller.getOne
);

// =====================================
// UPDATE ONE
// =====================================

router.put(
  "/:id",
  authMiddleware,
  controller.update
);

// =====================================
// DELETE
// =====================================

router.delete(
  "/:id",
  authMiddleware,
  controller.delete
);

// =====================================
// TOGGLE
// =====================================

router.patch(
  "/toggle/:id",
  authMiddleware,
  controller.toggle
);

export default router;