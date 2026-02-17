import { Router } from "express";
import { AcademicYearController } from "./academicYear.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();
const controller = new AcademicYearController();

router.post("/", authMiddleware ,controller.create);
router.get("/",authMiddleware , controller.getAll);
router.get("/active",authMiddleware , controller.getActive);
router.get("/:id", authMiddleware ,controller.getById);
router.put("/:id", authMiddleware ,controller.update);
router.patch("/:id", authMiddleware ,controller.patch);
router.patch("/:id/toggle",authMiddleware , controller.setActive);
router.delete("/:id", authMiddleware ,controller.delete);

export default router;
