import { Router } from "express";
import { ClassTeacherController } from "./classTeacher.controller";

const router = Router();
const controller = new ClassTeacherController();

router.post("/", controller.assign);
router.get("/", controller.getByClass);
router.delete("/:id", controller.remove);

export default router;
