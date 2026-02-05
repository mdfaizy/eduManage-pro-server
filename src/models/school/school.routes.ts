import { Router } from "express";
import { SchoolController } from "../../controllers/school.controller.js";

const router = Router();

router.get("/", SchoolController.listSchools);
router.get("/:id", SchoolController.getSchool);

export default router;
