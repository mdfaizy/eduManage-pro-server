import { Router }
from "express";

import {
  authMiddleware,
} from "../../middlewares/auth.js";

import controller
from "./studentFee.controller.js";

const router = Router();

////////////////////////////////////////////////////////
// GENERATE FEE
////////////////////////////////////////////////////////

router.post(

  "/generate",

  authMiddleware,

  (req, res) =>
    controller.generate(
      req,
      res
    )
);
////////////////////////////////////////////////////////
// GET ALL FEES
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

////////////////////////////////////////////////////////
// GET STUDENT HISTORY
////////////////////////////////////////////////////////

router.get("/student/:studentId",
  authMiddleware,
  (req, res) =>controller
      .getStudentHistory(
        req,res)
);

////////////////////////////////////////////////////////
// GET DUE FEES
////////////////////////////////////////////////////////

router.get("/due",authMiddleware,(req, res) =>controller.getDueFees(
        req,res)
);

export default router;