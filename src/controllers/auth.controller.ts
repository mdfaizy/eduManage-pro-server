import { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";
export const AuthController = {
  async registerSchool(req: Request, res: Response) {
    try {
      const result = await AuthService.registerSchool(req.body);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },
  async verifyEmail(req: Request, res: Response) {
    try {
      const result = await AuthService.verifyEmail(
        req.query.token as string
      );
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },
// ✅ LOGIN
async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const result = await AuthService.login(
      email,
      password,
      req.headers["user-agent"],
      req.ip
    );

    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ user: result.user });
  },
// ✅ REFRESH TOKEN
  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });

    const result = await AuthService.refresh(
      refreshToken,
      req.headers["user-agent"],
      req.ip
    );

    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.json({ message: "Refreshed" });
  },

  async logout(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) await AuthService.logout(refreshToken);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({ message: "Logged out" });
  },
};
