import { Router } from "express";
import { StudentController } from "./student.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();
const controller = new StudentController();

router.post("/admit", authMiddleware, (req, res) =>
  controller.admit(req, res)
);

export default router;
