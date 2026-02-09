import { Router } from "express";
import { GradeController } from "./grade.controller";
import { authMiddleware } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import {
  createGradeSchema,
  updateGradeSchema,
} from "./grade.validation";
const router = Router();
const controller = new GradeController();

router.post("/", authMiddleware,validate(createGradeSchema), controller.create);
router.get("/", authMiddleware, controller.getAll);
router.get("/:id", authMiddleware, controller.getById);
router.put("/:id", authMiddleware,  validate(updateGradeSchema),controller.update);
router.patch("/:id/toggle", authMiddleware, controller.toggle);
router.delete("/:id", authMiddleware, controller.delete);

export default router;
