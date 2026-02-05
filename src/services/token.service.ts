// import prisma from "../config/prisma.js";
// import { JWTService } from "./jwt.service.js";

// import { TokenUtil } from "../utils/token.util.js";
// import { TokenRepository } from "../repositories/token.repository.js";

// export class TokenService {
//   private tokenRepo = new TokenRepository();

//   // 🔑 LOGIN TOKENS
//   async generateUserTokens(user: any, userAgent?: string, ip?: string) {
//     const accessToken = JWTService.generateAccessToken(
//       {
//         ownerType: "USER",
//         ownerId: user.id,
//         role: user.role.name,
//         permissions: user.role.privileges?.map((p: any) => p.name) || [],
//       },
//       "15m"
//     );

//     const refreshToken = TokenUtil.generate();
//     const tokenHash = TokenUtil.hash(refreshToken);

//     await this.tokenRepo.create({
//       userId: user.id,
//       tokenHash,
//       type: "REFRESH",
//       expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//       userAgent,
//       ipAddress: ip,
//     });

//     return { accessToken, refreshToken };
//   }

//   // 🔄 REFRESH FLOW (SECURE)
//   async refreshTokens(oldRefreshToken: string, userAgent?: string, ip?: string) {
//     const tokenHash = TokenUtil.hash(oldRefreshToken);

//     return prisma.$transaction(async (tx) => {
//       const stored = await tx.token.findFirst({
//         where: { tokenHash, type: "REFRESH" },
//       });

//       if (!stored || stored.isRevoked || stored.expiresAt < new Date()) {
//         throw new Error("Unauthorized");
//       }

//       // 🚨 REUSE ATTACK
//       if (stored.isUsed) {
//         await tx.token.updateMany({
//           where: { userId: stored.userId, type: "REFRESH" },
//           data: { isRevoked: true },
//         });
//         throw new Error("Session hijacked. Please login again.");
//       }

//       // Mark old used
//       await tx.token.update({
//         where: { id: stored.id },
//         data: { isUsed: true },
//       });

//       // New token
//       const newRefreshToken = TokenUtil.generate();
//       const newHash = TokenUtil.hash(newRefreshToken);

//       await tx.token.create({
//         data: {
//           userId: stored.userId,
//           tokenHash: newHash,
//           type: "REFRESH",
//           expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//           userAgent,
//           ipAddress: ip,
//         },
//       });

//       const accessToken = JWTService.generateAccessToken(
//         { ownerType: "USER", ownerId: stored.userId },
//         "15m"
//       );

//       return { accessToken, refreshToken: newRefreshToken };
//     });
//   }

//   // 🚪 LOGOUT SINGLE DEVICE
//   async logout(refreshToken: string) {
//     const tokenHash = TokenUtil.hash(refreshToken);
//     await prisma.token.updateMany({
//       where: { tokenHash },
//       data: { isRevoked: true },
//     });
//   }

//   // 🚪 LOGOUT ALL DEVICES
//   async logoutAll(userId: number) {
//     await this.tokenRepo.revokeAllUserTokens(userId);
//   }
// }
