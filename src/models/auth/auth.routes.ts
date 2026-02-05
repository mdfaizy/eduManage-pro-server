    import { Router } from "express";
    import { AuthController } from "./auth.controller.js";
import { authMiddleware } from "../../middlewares/auth.js";
    const router = Router();
    router.post("/register-school", AuthController.registerSchool);
    router.get("/verify-email", AuthController.verifyEmail);

    router.post("/login", AuthController.login);
    // router.post("/refresh",authMiddleware, AuthController.refresh);
    router.post("/refresh", AuthController.refresh);

    router.post("/logout", AuthController.logout);
router.get("/me", authMiddleware, AuthController.me);
    router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);

    export default router;
