// src/models/teacher/teacher.routes.ts
import { Router } from "express";
import { TeacherController } from "./teacher.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();
const controller = new TeacherController();

router.post("/", authMiddleware, (req, res) => controller.create(req, res));
router.get("/", authMiddleware, (req, res) => controller.getAll(req, res));
router.get("/:id", authMiddleware, (req, res) => controller.getOne(req, res));
router.patch("/:id", authMiddleware, (req, res) =>
  controller.update(req, res)
);

export default router;
