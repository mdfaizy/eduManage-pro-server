import { Router } from "express";
import { PeriodController } from "./period.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();
const controller = new PeriodController();

router.post("/", authMiddleware, controller.create);
router.post("/bulk", authMiddleware, controller.bulkCreate);
router.get("/", authMiddleware, controller.getAll);
router.delete("/:id", authMiddleware, controller.remove);

export default router;
