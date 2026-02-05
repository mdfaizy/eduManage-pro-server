import { Router, Request, Response } from "express";
import RoleController from "./role.controller.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { authorizePermissions } from "../../middlewares/permission.middleware.js";
// import { ROUTES_CONSTANT } from "../constants/RouteConstant.js";

const router = Router();

/**
 * =========================
 * ROLE MANAGEMENT ROUTES
 * =========================
 */

/**
 * ✅ CREATE ROLE (School Admin)
 */
router.post(
  // ROUTES_CONSTANT.ROLES.BASE, // e.g. /roles
  '/',
  authMiddleware,
  // authorizePermissions(["CREATE_ROLE"]),
  
  (req: Request, res: Response) =>
    RoleController.createRole(req, res)
);

/**
 * ✅ UPDATE ROLE
 */
router.put(
  `roles/:id`, // /roles/:id
  authMiddleware,
  authorizePermissions(["UPDATE_ROLE"]),

  (req: Request, res: Response) =>
    RoleController.updateRole(req, res)
);

/**
 * ✅ GET ALL ROLES (School scoped)
 */
router.get(
  '/', // /roles
  authMiddleware,
  // authorizePermissions(["VIEW_ROLE"]),
  (req: Request, res: Response) =>
    RoleController.getAllRoles(req, res)
);

/**
 * ✅ GET ROLE BY ID
 */
router.get(
  `/:id`,
  authMiddleware,
  // authorizePermissions(["VIEW_ROLE"]),
  (req: Request, res: Response) =>
    RoleController.getRoleById(req, res)
);

/**
 * ✅ DELETE ROLE
 */
router.delete(
  `roles/:id`,
  authMiddleware,
  authorizePermissions(["DELETE_ROLE"]),
  (req: Request, res: Response) =>
    RoleController.deleteRole(req, res)
);

/**
 * ✅ ASSIGN PERMISSIONS TO ROLE
 */
router.post(
  `/assign-permissions`,
  authMiddleware,
  // authorizePermissions(["ASSIGN_PERMISSION"]),
 
  (req: Request, res: Response) =>
    RoleController.assignPermissions(req, res)
);

export default router;
