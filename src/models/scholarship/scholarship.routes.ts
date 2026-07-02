// import {
//   Router,
// } from "express";

// import {
//   authMiddleware,
// } from "../../middlewares/auth.js";

// import controller
// from "./scholarship.controller.js";

// const router =
//   Router();

// // =====================================
// // CREATE
// // =====================================

// router.post(
//   "/",
//   authMiddleware,
//   controller.create
// );

// // =====================================
// // GET ALL
// // =====================================

// router.get(
//   "/",
//   authMiddleware,
//   controller.getAll
// );

// // =====================================
// // GET ONE
// // =====================================

// router.get(
//   "/:id",
//   authMiddleware,
//   controller.getOne
// );

// // =====================================
// // UPDATE
// // =====================================

// router.put(
//   "/:id",
//   authMiddleware,
//   controller.update
// );

// // =====================================
// // DELETE
// // =====================================

// router.delete(
//   "/:id",
//   authMiddleware,
//   controller.delete
// );

// // =====================================
// // TOGGLE
// // =====================================

// router.patch(
//   "/toggle/:id",
//   authMiddleware,
//   controller.toggle
// );

// export default
// router;



import { Router } from "express";

import controller
from "./scholarship.controller.js";

import {
  authMiddleware,
} from "../../middlewares/auth.js";

import {
  validate,
} from "../../middlewares/validate.js";



const router = Router();

// =====================================================
// CREATE
// =====================================================

router.post(
  "/",
  authMiddleware,

  (req, res) =>
    controller.create(req, res)
);

// =====================================================
// DROPDOWN
// MUST COME BEFORE /:id
// =====================================================

router.get(
  "/dropdown",
  authMiddleware,
  (req, res) =>
    controller.dropdown(req, res)
);

// =====================================================
// GET ALL
// =====================================================

router.get(
  "/",
  authMiddleware,
  (req, res) =>
    controller.getAll(req, res)
);

// =====================================================
// GET ONE
// =====================================================

router.get(
  "/:id",
  authMiddleware,
  (req, res) =>
    controller.getOne(req, res)
);

// =====================================================
// UPDATE
// =====================================================

router.put(
  "/:id",
  authMiddleware,
  (req, res) =>
    controller.update(req, res)
);

// =====================================================
// DELETE
// =====================================================

router.delete(
  "/:id",
  authMiddleware,
  (req, res) =>
    controller.delete(req, res)
);

// =====================================================
// TOGGLE
// =====================================================

router.patch(
  "/toggle/:id",
  authMiddleware,
  (req, res) =>
    controller.toggle(req, res)
);

export default router;