import { Router, Request, Response } from "express";
import PermissionController from "./permission.controller.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { authorizePermissions } from "../../middlewares/permission.middleware.js";
// import { ROUTES_CONSTANT } from "../constants/RouteConstant.js";

const router = Router();

/**
 * =========================
 * PERMISSION MANAGEMENT
 * =========================
 */

// ✅ CREATE PERMISSION (SUPER_ADMIN only)
router.post(
  "/", //ROUTES_CONSTANT.PRIVILEGES.CREATE,
  authMiddleware,
  // authorizePermissions(["CREATE_PERMISSION"]),
  (req: Request, res: Response) =>
    PermissionController.createPermission(req, res)
);

// ✅ GET ALL
router.get(
  // ROUTES_CONSTANT.PRIVILEGES.GET_ALL,
  "/",   
  authMiddleware,
  // authorizePermissions(["VIEW_PERMISSION"]),
  (req, res) => PermissionController.getAllPermissions(req, res)
);

// ✅ GET / UPDATE / DELETE BY ID
router
  .route('/:id') //ROUTES_CONSTANT.PRIVILEGES.BY_ID
  .get(
    authMiddleware,
    // authorizePermissions(["VIEW_PERMISSION"]),
    (req, res) => PermissionController.getPermissionById(req, res)
  )
  .put(
    authMiddleware,
    authorizePermissions(["UPDATE_PERMISSION"]),
    (req, res) => PermissionController.updatePermissionById(req, res)
  )
  .delete(
    authMiddleware,
    authorizePermissions(["DELETE_PERMISSION"]),
    (req, res) => PermissionController.deletePermissionById(req, res)
  );

export default router;
