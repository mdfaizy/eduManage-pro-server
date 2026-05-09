// import { Router } from "express";
// import AdmissionController from "./admission.controller.js";
// import { authMiddleware } from "../../middlewares/auth.js";

// const router = Router();

// router.post("/", authMiddleware, (req, res) =>
//   AdmissionController.apply(req, res)
// );

// router.get("/", authMiddleware, (req, res) =>
//   AdmissionController.list(req, res)
// );
// router.get("/:id", authMiddleware, (req, res) =>
//   AdmissionController.view(req, res)
// );
// router.patch("/:id", authMiddleware, (req, res) =>
//   AdmissionController.update(req, res)
// );
// router.patch("/:id/approve", authMiddleware, (req, res) =>
//   AdmissionController.approve(req, res)
// );

// router.patch("/:id/reject", authMiddleware, (req, res) =>
//   AdmissionController.reject(req, res)
// );

// export default router;

import { Router } from "express";

import AdmissionController
from "./admission.controller.js";

import { authMiddleware }
from "../../middlewares/auth.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  (req, res) =>
    AdmissionController.apply(req, res)
);

router.get(
  "/",
  authMiddleware,
  (req, res) =>
    AdmissionController.list(req, res)
);

router.get( "/:id", authMiddleware, (req, res) => AdmissionController.view(req, res) );
router.patch( "/:id", authMiddleware, (req, res) => AdmissionController.update(req, res) );
router.patch(
  "/:id/approve",
  authMiddleware,
  (req, res) =>
    AdmissionController.approve(req, res)
);

router.patch( "/:id/reject", authMiddleware, (req, res) => AdmissionController.reject(req, res) );

export default router;