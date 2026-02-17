import { Router } from "express";
import { ClassTeacherController } from "./classTeacher.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();
const controller = new ClassTeacherController();
router.post("/", authMiddleware, controller.assign);
router.get("/", authMiddleware, controller.get);
router.delete("/:id", authMiddleware, controller.remove);


export default router;
