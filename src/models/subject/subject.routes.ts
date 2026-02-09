
// import { Router } from "express";
// import { SubjectController } from "./subject.controller";
// import { authMiddleware } from "../../middlewares/auth";

// // const router = Router();
// // const controller = new SubjectController();

// // router.post("/", authMiddleware, controller.create);
// // router.get("/all", authMiddleware, controller.getAll);
// // router.delete("/:id", authMiddleware, controller.delete);

// // export default router;


// // subject.routes.ts
// const router = Router();
// const controller = new SubjectController();

// router.post("/", authMiddleware, controller.create);
// router.get("/all", authMiddleware, controller.getAll);
// router.get("/:id", authMiddleware, controller.getById);

// router.patch("/:id", authMiddleware, controller.update);        // ✏️ EDIT
// router.patch("/:id/toggle", authMiddleware, controller.toggle); // 🔁 TOGGLE

// export default router;


import { Router } from "express";
import { SubjectController } from "./subject.controller";
import { authMiddleware } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import {
  createSubjectSchema,
  updateSubjectSchema,
  toggleSubjectSchema,
//   getSubjectByIdSchema
} from "./subject.validation";

const router = Router();
const controller = new SubjectController();

router.post(
    "/",
    authMiddleware,
    validate(createSubjectSchema),
    controller.create
);
router.get("/all", authMiddleware, controller.getAll);

router.get(
  "/:id",
  authMiddleware,
//   validate(getSubjectByIdSchema),
  controller.getById
);


router.patch(
  "/:id",
  authMiddleware,
  validate(updateSubjectSchema),
  controller.update
);

router.patch(
  "/:id/toggle",
  authMiddleware,
  validate(toggleSubjectSchema),
  controller.toggle
);

export default router;
