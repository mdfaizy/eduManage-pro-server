import { Router } from "express";

import {
  authMiddleware,
} from "../../middlewares/auth.js";

import controller from "./studentDiscount.controller.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  controller.create
);

router.get(
  "/",
  authMiddleware,
  controller.getAll
);

router.get(
  "/:id",
  authMiddleware,
  controller.getOne
);

router.put(
  "/:id",
  authMiddleware,
  controller.update
);

router.delete(
  "/:id",
  authMiddleware,
  controller.delete
);

router.patch(
  "/toggle/:id",
  authMiddleware,
  controller.toggle
);

export default router;