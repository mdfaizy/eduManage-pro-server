// import prisma from "../config/prisma.js";
// import jwt from "jsonwebtoken";

// export const authMiddleware = async (req, res, next) => {
//   const auth = req.headers.authorization;

//   if (!auth) {
//     return res.status(401).json({ message: "Token missing" });
//   }

//   try {
//     const token = auth.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await prisma.user.findUnique({
//       where: { id: decoded.userId },
//       include: {
//         roles: {
//           include: {
//             role: {
//               include: {
//                 permissions: {
//                   include: { permission: true },
//                 },
//               },
//             },
//           },
//         },
//       },
//     });

//     if (!user || !user.isActive) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     req.user = {
//       userId: user.id,
//       schoolId: user.schoolId,
//       roles: user.roles.map(r => r.role.name),
//       permissions: user.roles.flatMap(r =>
//         r.role.permissions.map(p => p.permission.key)
//       ),
//     };

//     next();
//   } catch {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };



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
