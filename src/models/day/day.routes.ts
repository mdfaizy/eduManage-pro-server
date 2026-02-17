import { Router } from "express";
import { createDay, getDaysBySchool } from "./day.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();

router.post("/create", authMiddleware,createDay);
router.get("/", authMiddleware, getDaysBySchool);
// router.get("/school/:schoolId",authMiddleware, getDaysBySchool);


export default router;
