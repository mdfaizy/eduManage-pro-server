import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("🔥 ERROR:", err);

  // ✅ Normal Error
  if (err instanceof Error) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }

  // ✅ Plain object / null prototype error
  if (typeof err === "object" && err !== null) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Unknown error occurred",
  });
}
