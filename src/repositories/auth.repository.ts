import prisma from "../config/prisma.js";

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
  createRefreshToken(userId: number, token: string, expiresAt: Date) {
    return prisma.token.create({
      data: {
        userId,
        token,
        type: "REFRESH",
        expiresAt,
      },
    });
  },
};
