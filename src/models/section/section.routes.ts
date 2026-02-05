import { Router } from "express";
import { SectionController } from "./section.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();
const controller = new SectionController();

router.post("/", authMiddleware,controller.create);
router.get("/",authMiddleware, controller.getByClass);
router.get("/:id", authMiddleware, controller.getOne);
router.patch("/:id", authMiddleware, controller.update);
router.delete("/:id", controller.delete);

export default router;
