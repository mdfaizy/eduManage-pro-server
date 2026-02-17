import { Router } from "express";
import { TimetableController } from "./timetable.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();
const controller = new TimetableController();

// router.post("/", authMiddleware, controller.create);
router.post("/bulk", authMiddleware, controller.bulkCreate);

router.get("/", authMiddleware, controller.getAll);
router.get(
  "/admin-view",
  authMiddleware,
  controller.getAdminTimetable
);
router.get(
  "/my-timetable",
  authMiddleware,
  controller.getMyTimetable
);
router.delete("/:id", authMiddleware, controller.remove);

export default router;
