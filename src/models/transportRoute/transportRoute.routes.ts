import {
  Router,
} from "express";

import controller
from "./transportRoute.controller.js";

import {
  authMiddleware,
} from "../../middlewares/auth.js";

const router =
  Router();

// CREATE

router.post(
  "/",
  authMiddleware,
  controller.create
);

// GET ALL

router.get(
  "/",
  authMiddleware,
  controller.getAll
);

// GET ONE

router.get(
  "/:id",
  authMiddleware,
  controller.getOne
);

// UPDATE

router.put(
  "/:id",
  authMiddleware,
  controller.update
);

// DELETE

router.delete(
  "/:id",
  authMiddleware,
  controller.delete
);

// TOGGLE

router.patch(
  "/toggle/:id",
  authMiddleware,
  controller.toggle
);

export default
router;