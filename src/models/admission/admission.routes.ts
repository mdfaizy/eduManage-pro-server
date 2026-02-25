import { Router } from "express";
import AdmissionController from "./admission.controller.js";
import { authMiddleware } from "../../middlewares/auth.js";

const router = Router();

router.post("/", authMiddleware, (req, res) =>
  AdmissionController.createAdmission(req, res)
);

router.get("/:studentId", authMiddleware, (req, res) =>
  AdmissionController.getStudentAdmissions(req, res)
);

export default router;