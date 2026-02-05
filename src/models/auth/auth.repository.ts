import prisma from "../../config/prisma.js";
import { TokenUtil } from "../../utils/token.util.js";
import { TokenType } from "@prisma/client";
export const AuthRepository = {
  createSchool(tx: any, data: any) {
    return tx.school.create({ data });
  },

  createUser(tx: any, data: any) {
    return tx.user.create({ data });
  },

 findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: { school: true },
  });
},
async create(tx: any, data: any) {
    return tx.token.create({ data });
  },

 async findValid(token: string, type: TokenType) {
  return prisma.token.findFirst({
    where: {
      tokenHash: TokenUtil.hash(token), // ✅ only here
      type,
      isUsed: false,
      isRevoked: false,
      expiresAt: { gt: new Date() },
    },
    include: { user: true },
  });
},

  async markUsed(id: number) {
    return prisma.token.update({
      where: { id },
      data: { isUsed: true },
    });
  },

  async revokeAllUserTokens(userId: number) {
    return prisma.token.updateMany({
      where: { userId },
      data: { isRevoked: true },
    });
  },


  
  createRefreshToken(userId: number, token: string, expiresAt: Date) {
    return prisma.token.create({
      data: {
        userId,
        tokenHash: TokenUtil.hash(token),
        type: "REFRESH",
        expiresAt,
      },
    });
  },
};
