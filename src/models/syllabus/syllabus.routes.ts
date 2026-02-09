import { Router } from "express";
import { SyllabusController } from "./syllabus.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();
const controller = new SyllabusController();

router.post("/", authMiddleware, controller.create);
router.get("/", authMiddleware, controller.getByClass);   // class syllabus
router.get("/all", authMiddleware, controller.getAll);   // admin table
router.delete("/:id", authMiddleware, controller.delete);

export default router;
