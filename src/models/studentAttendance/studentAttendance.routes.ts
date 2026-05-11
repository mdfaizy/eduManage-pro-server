// studentAttendance.routes.ts

import { Router }from "express";
import {authMiddleware,} from "../../middlewares/auth.js";

import StudentAttendanceController from "./studentAttendance.controller.js";
const router = Router();
// =====================================================
// GET STUDENTS
// =====================================================
router.get("/students",authMiddleware,(req, res) =>
    StudentAttendanceController.getStudents(
        req,res));
// =====================================================
// MARK ATTENDANCE
// =====================================================

router.post("/mark",authMiddleware,
  (req, res) =>StudentAttendanceController
      .markAttendance(
        req,res));
// =====================================================
// DAILY ATTENDANCE
// =====================================================

router.get(
  "/daily",

  authMiddleware,

  (req, res) =>

    StudentAttendanceController
      .dailyAttendance(
        req,
        res
      )
);
router.get(

  "/monthly-report",

  authMiddleware,

  (req, res) =>

    StudentAttendanceController
      .monthlyReport(
        req,
        res
      )
);
router.get(

  "/student/:studentId",

  authMiddleware,

  (req, res) =>

    StudentAttendanceController
      .studentReport(
        req,
        res
      )
);
router.get(

  "/class-report",

  authMiddleware,

  (req, res) =>

    StudentAttendanceController
      .classReport(
        req,
        res
      )
);
router.get(

  "/stats",

  authMiddleware,

  (req, res) =>

    StudentAttendanceController
      .stats(
        req,
        res
      )
);
router.put(

  "/lock/:sessionId",

  authMiddleware,

  (req, res) =>

    StudentAttendanceController
      .lockAttendance(
        req,
        res
      )
);
router.put(
  "/update",

  authMiddleware,

  (req, res) =>

    StudentAttendanceController
      .updateAttendance(
        req,
        res
      )
);

export default router;