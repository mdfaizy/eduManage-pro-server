// =====================================================
// exam.routes.ts
// =====================================================

import { Router }
from "express";

import {
  authMiddleware,
} from "../../middlewares/auth.js";

import ExamController
from "./exam.controller.js";

const router = Router();

// =====================================================
// CREATE
// =====================================================

router.post(
  "/",
  authMiddleware,
  (req, res) =>
    ExamController.create(
      req,
      res
    )
);

// =====================================================
// GET ALL
// =====================================================

router.get(
  "/",
  authMiddleware,
  (req, res) =>
    ExamController.getAll(
      req,
      res
    )
);

// =====================================================
// GET BY ID
// =====================================================

router.get(
  "/:id",
  authMiddleware,
  (req, res) =>
    ExamController.getById(
      req,
      res
    )
);

// =====================================================
// UPDATE
// =====================================================

router.put(
  "/:id",
  authMiddleware,
  (req, res) =>
    ExamController.update(
      req,
      res
    )
);

// =====================================================
// DELETE
// =====================================================

router.delete(
  "/:id",
  authMiddleware,
  (req, res) =>
    ExamController.delete(
      req,
      res
    )
);

// =====================================================
// ADD SUBJECT
// =====================================================

router.post(
  "/subject",
  authMiddleware,
  (req, res) =>
    ExamController.addSubject(
      req,
      res
    )
);

// =====================================================
// ENTER MARKS
// =====================================================

router.post(
  "/marks",
  authMiddleware,
  (req, res) =>
    ExamController.enterMarks(
      req,
      res
    )
);

export default router;