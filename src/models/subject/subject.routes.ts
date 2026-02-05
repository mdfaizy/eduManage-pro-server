import { Router } from "express";
import { SubjectController } from "./subject.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();
const controller = new SubjectController();

// router.get("/all", controller.getAll);      // for table
// router.post("/", controller.create);
// // router.get("/", controller.getByClass);    // for dropdown

// router.get("/", controller.getByClass);
// router.delete("/:id", controller.delete);


router.get("/all",authMiddleware, controller.getAll);   // ✅ FIRST
router.post("/",authMiddleware, controller.create);
router.patch("/:id", authMiddleware, controller.update);   // 🔥 ADD THIS
// router.get("/all",authMiddleware, controller.getByClass);  // ✅ AFTER
router.get("/", authMiddleware, controller.getByClass);

router.delete("/:id", controller.delete);


export default router;
