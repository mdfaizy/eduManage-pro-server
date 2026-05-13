import { Router }
from "express";

import controller
from "./feeHead.controller.js";

import {
  authMiddleware,
} from "../../middlewares/auth.js";

import {
  validate,
} from "../../middlewares/validate.js";

import {
  createFeeHeadSchema,
} from "./feeHead.validation.js";

const router = Router();

////////////////////////////////////////////////////////
// CREATE
////////////////////////////////////////////////////////

router.post(

  "/",

  authMiddleware,

  validate(
    createFeeHeadSchema
  ),

  (req, res) =>
    controller.create(
      req,
      res
    )
);

////////////////////////////////////////////////////////
// GET ALL
////////////////////////////////////////////////////////

router.get(

  "/",

  authMiddleware,

  (req, res) =>
    controller.getAll(
      req,
      res
    )
);

export default router;