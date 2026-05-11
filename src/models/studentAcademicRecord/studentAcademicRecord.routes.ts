// import { Router }
// from "express";

// import StudentAcademicRecordController
// from "./studentAcademicRecord.controller.js";

// import { authMiddleware }
// from "../../middlewares/auth.js";

// const router = Router();

// // =====================================================
// // CURRENT
// // =====================================================

// router.get(
//   "/current/:studentId",
//   authMiddleware,
//   (req, res) =>
//     StudentAcademicRecordController.current(
//       req,
//       res
//     )
// );

// // =====================================================
// // HISTORY
// // =====================================================

// router.get(
//   "/history/:studentId",
//   authMiddleware,
//   (req, res) =>
//     StudentAcademicRecordController.history(
//       req,
//       res
//     )
// );

// // =====================================================
// // PROMOTE
// // =====================================================

// router.post(
//   "/promote",
//   authMiddleware,
//   (req, res) =>
//     StudentAcademicRecordController.promote(
//       req,
//       res
//     )
// );

// export default router;


import { Router }from "express";

import StudentAcademicRecordController from "./studentAcademicRecord.controller.js";

import { authMiddleware } from "../../middlewares/auth.js";

const router = Router();

// =====================================================
// CURRENT
// =====================================================

router.get(
  "/current/:studentId", authMiddleware,  (req, res) =>StudentAcademicRecordController.current(req,res));

// =====================================================
// HISTORY
// =====================================================

router.get(
  "/history/:studentId",
  authMiddleware,
  (req, res) =>
    StudentAcademicRecordController.history(
      req,
      res
    )
);

// =====================================================
// SINGLE PROMOTION
// =====================================================

router.post(
  "/promote",
  authMiddleware,
  (req, res) =>
    StudentAcademicRecordController.promote(
      req,
      res
    )
);

// =====================================================
// BULK PROMOTION
// =====================================================

router.post(
  "/bulk-promote",
  authMiddleware,
  (req, res) =>
    StudentAcademicRecordController.bulkPromote(
      req,
      res
    )
);


// =====================================================
// GET STUDENTS
// =====================================================

router.get(
  "/promotion-students",
  authMiddleware,
  (req, res) =>
    StudentAcademicRecordController
      .getPromotionStudents(
        req,
        res
      )
);

router.get(
  "/records",
  authMiddleware,
  (req, res) =>
    StudentAcademicRecordController
      .getAllRecords(req, res)
);
router.post("/revert-promotion",authMiddleware,(req, res) =>StudentAcademicRecordController.revertPromotion(
        req,res));
export default router;

