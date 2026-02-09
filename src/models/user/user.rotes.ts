import { Router } from "express";
import UserController from "./user.controller.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { authorizePermissions } from "../../middlewares/permission.middleware.js";

const router = Router();

router.post(
  "/users",
  authMiddleware,
  // authorizePermissions(["CREATE_USER"]),
  (req, res) => UserController.createUser(req, res)
);
router.post("/set-password", (req, res) =>
  UserController.setPassword(req, res)
);


router.get(
  "/",
  authMiddleware,
  // authorizePermissions(["VIEW_USER"]),
  (req, res) => UserController.getUsers(req, res)
);

router.get(
  "/:id",
  authMiddleware,
  // authorizePermissions(["VIEW_USER"]),
  (req, res) => UserController.getUser(req, res)
);

router.post(
  "/users/assign-role",
  authMiddleware,
  authorizePermissions(["ASSIGN_ROLE"]),
  (req, res) => UserController.assignRole(req, res)
);
router.patch(
  "/:id/status",
  authMiddleware,
  // authorizePermissions(["UPDATE_USER"]),
  (req, res) => UserController.updateUserStatus(req, res)
);

router.delete(
  "/:id",
  authMiddleware,
  // authorizePermissions(["DELETE_USER"]),
  (req, res) => UserController.deleteUser(req, res)
);


router.get(
  "/:id/permissions",
  authMiddleware,
  (req, res) => UserController.getUserPermissions(req, res)
);

router.post(
  "/:id/permissions/grant",
  authMiddleware,
  // authorizePermissions(["ASSIGN_PERMISSION"]),
  (req, res) => UserController.grantPermission(req, res)
);

router.post(
  "/:id/permissions/revoke",
  authMiddleware,
  // authorizePermissions(["ASSIGN_PERMISSION"]),
  (req, res) => UserController.revokePermission(req, res)
);

export default router;
