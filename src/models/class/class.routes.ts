import { Router } from "express";
import { ClassController } from "./class.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();
const controller = new ClassController();

router.post("/", authMiddleware,controller.create);
router.get("/",  authMiddleware, controller.getAll);
router.get("/:id", authMiddleware, controller.getOne);

router.patch("/:id", authMiddleware, controller.update);

router.delete("/:id", authMiddleware,controller.delete);

export default router;
