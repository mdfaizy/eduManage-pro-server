import {
  Router,
} from "express";

import controller
from "./feeStructure.controller.js";

import {authMiddleware}
from "../../middlewares/auth.js";
import {
  createFeeStructureSchema,
  updateFeeStructureSchema,
} from "./feeStructure.validation.js";
import {
  validate,
} from "../../middlewares/validate.js";
const router =
  Router();

// =====================================
// CREATE
// =====================================

router.post(
  "/",
  authMiddleware,
  validate(createFeeStructureSchema),
  controller.create
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
// UPDATE
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
router.get(
  "/:id",
  authMiddleware,
  controller.getOne
);
router.patch(
  "/toggle/:id",
  authMiddleware,
  controller.toggle
);

export default
router;