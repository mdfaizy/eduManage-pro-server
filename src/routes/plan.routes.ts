import { Router } from "express";
import { PlanController } from "../controllers/plan.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.post("/", authMiddleware, PlanController.create);
router.get("/", authMiddleware, PlanController.list);
router.post("/activate", authMiddleware, PlanController.activateTrial);

export default router;
