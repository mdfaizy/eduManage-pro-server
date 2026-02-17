import { JWTService } from "../services/jwt.service.js";

export function authMiddleware(req: any, res: any, next: any) {
  
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  console.log("Cookies:", req.cookies);

  try {
    req.user = JWTService.verify(token);
    next();
  } catch {
    res.status(401).json({ message: "Token expired" });
  }
}
