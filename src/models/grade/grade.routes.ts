import { Router } from "express";
import { GradeController } from "./grade.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();
const controller = new GradeController();

router.post("/", authMiddleware, controller.create);
router.get("/", authMiddleware, controller.getAll);
router.delete("/:id", authMiddleware, controller.delete);

export default router;
