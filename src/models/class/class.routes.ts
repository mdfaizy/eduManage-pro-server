import { Router } from "express";

import { ClassController }
from "./class.controller";

import { authMiddleware }
from "../../middlewares/auth";

const router = Router();

const controller =
  new ClassController();

// =========================================
// CREATE
// =========================================

router.post(
  "/",
  authMiddleware,
  controller.create
);

// =========================================
// GET ALL
// =========================================

router.get(
  "/",
  authMiddleware,
  controller.getAll
);

// =========================================
// ACTIVE CLASSES
// =========================================

router.get(
  "/active",
  authMiddleware,
  async (req, res) => {

    req.query.active = "true";

    return controller.getAll(req, res);
  }
);

// =========================================
// GET ONE
// =========================================

router.get(
  "/:id",
  authMiddleware,
  controller.getOne
);

// =========================================
// UPDATE
// =========================================

router.patch(
  "/:id",
  authMiddleware,
  controller.update
);

// =========================================
// DELETE
// =========================================

router.delete(
  "/:id",
  authMiddleware,
  controller.delete
);

export default router;