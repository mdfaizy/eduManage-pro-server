// import { Router } from "express";
// import StudentController from "./student.controller.js";
// import { authMiddleware } from "../../middlewares/auth.js";

// const router = Router();


// router.get("/", authMiddleware, (req, res) =>
//   StudentController.getStudents(req, res)
// );
// router.get("/:id", authMiddleware, (req, res) =>
//   StudentController.getStudent(req, res)
// );
// router.post(
//   "/enable-login",
//   authMiddleware,
//   (req, res) => StudentController.enableLogin(req, res)
// );
// router.patch("/:id", authMiddleware, (req, res) =>
//   StudentController.updateStudent(req, res)
// );
// router.post(
//   "/link-parent",
//   authMiddleware,
//   (req, res) => StudentController.linkParent(req, res)
// );
// router.patch(
//   "/:id/status",
//   authMiddleware,
//   (req, res) => StudentController.updateStudentStatus(req, res)
// );

// router.delete("/:id", authMiddleware, (req, res) =>
//   StudentController.deleteStudent(req, res)
// );

// export default router;

import { Router } from "express";

import StudentController
from "./student.controller.js";

import { authMiddleware }
from "../../middlewares/auth.js";

const router = Router();

// =====================================================
// LIST
// =====================================================

router.get(
  "/",
  authMiddleware,
  (req, res) =>
    StudentController.getStudents(
      req,
      res
    )
);

// =====================================================
// SINGLE
// =====================================================

router.get(
  "/:id",
  authMiddleware,
  (req, res) =>
    StudentController.getStudent(
      req,
      res
    )
);

// =====================================================
// ENABLE LOGIN
// =====================================================

router.post(
  "/enable-login",
  authMiddleware,
  (req, res) =>
    StudentController.enableLogin(
      req,
      res
    )
);

// =====================================================
// LINK PARENT
// =====================================================

router.post(
  "/link-parent",
  authMiddleware,
  (req, res) =>
    StudentController.enableParentLogin(
      req,
      res
    )
);

// =====================================================
// UPDATE
// =====================================================

router.patch(
  "/:id",
  authMiddleware,
  (req, res) =>
    StudentController.updateStudent(
      req,
      res
    )
);

// =====================================================
// STATUS
// =====================================================

router.patch(
  "/:id/status",
  authMiddleware,
  (req, res) =>
    StudentController.updateStudentStatus(
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
    StudentController.deleteStudent(
      req,
      res
    )
);

export default router;