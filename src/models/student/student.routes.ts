import { Router } from "express";
import StudentController from "./student.controller.js";
import { authMiddleware } from "../../middlewares/auth.js";

const router = Router();

router.post("/", authMiddleware, (req, res) =>
  StudentController.createStudent(req, res)
);

router.get("/", authMiddleware, (req, res) =>
  StudentController.getStudents(req, res)
);
router.get(
  "/my-children",
  authMiddleware,
  (req, res) => StudentController.getMyChildren(req, res)
);

router.get("/:id", authMiddleware, (req, res) =>
  StudentController.getStudent(req, res)
);

router.patch("/:id", authMiddleware, (req, res) =>
  StudentController.updateStudent(req, res)
);
router.post(
  "/link-parent",
  authMiddleware,
  (req, res) => StudentController.linkParent(req, res)
);
router.patch("/:id/status", authMiddleware, (req, res) =>
  StudentController.toggleStatus(req, res)
);

router.delete("/:id", authMiddleware, (req, res) =>
  StudentController.deleteStudent(req, res)
);

export default router;