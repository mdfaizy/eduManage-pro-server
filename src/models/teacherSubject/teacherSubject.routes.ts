import { Router } from "express";
import { TeacherSubjectController } from "./teacherSubject.controller";

const router = Router();
const controller = new TeacherSubjectController();

router.post("/", controller.assign);
router.get("/", controller.getAll); 
router.get("/teacher/:teacherId", controller.getByTeacher);
router.delete("/:id", controller.remove);

export default router;
