import { Router } from "express";
import UserController from "./user.controller.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { authorizePermissions } from "../../middlewares/permission.middleware.js";

const router = Router();

// ✅ CREATE USER
router.post("/", authMiddleware, (req, res) => UserController.createUser(req, res));

// ✅ SET PASSWORD
router.post("/set-password", UserController.setPassword);

// ✅ ⭐⭐⭐ MAIN LIST (PAGINATED — IMPORTANT)
router.get(
  "/",
  authMiddleware,
  (req, res) =>
  UserController.getUsersPaginated(req, res)
);

// ✅ USER PERMISSIONS (specific first)
router.get(
  "/:id/permissions",
  authMiddleware,
  UserController.getUserPermissions
);

// ✅ SINGLE USER
router.get(
  "/:id",
  authMiddleware,
  
  (req, res) => UserController.getUser(req, res)
);
router.patch(
  "/:id",
  authMiddleware,
  (req, res) => UserController.updateUser(req, res)
);

// ✅ STATUS UPDATE
router.patch(
  "/:id/status",
  authMiddleware,
  (req, res) => UserController.updateUserStatus(req, res)
  // UserController.updateUserStatus
);

// ✅ DELETE
router.delete(
  "/:id",
  authMiddleware,
  (req, res) => UserController.deleteUser(req, res)
  
);

// ✅ ASSIGN ROLE
router.post(
  "/assign-role",
  authMiddleware,
  authorizePermissions(["ASSIGN_ROLE"]),
  
  (req, res) => UserController.assignRole(req, res)
);

// ✅ PERMISSION GRANT
router.post(
  "/:id/permissions/grant",
  authMiddleware,
  (req, res) => UserController.grantPermission(req, res)
  
);

// ✅ PERMISSION REVOKE
router.post(
  "/:id/permissions/revoke",
  authMiddleware,
  (req, res) => UserController.revokePermission(req, res)
);

export default router;