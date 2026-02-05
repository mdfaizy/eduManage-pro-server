// import prisma from "../config/prisma.js";
// export const TokenRepository = {
//   create(tx: any, data: any) {
//     return tx.token.create({
//       data,
//     });
//   },

//   findValid(token: string) {
//     return prisma.token.findFirst({
//       where: {
//         token,
//         isUsed: false,
//         expiresAt: { gt: new Date() },
//       },
//       include: { user: true },
//     });
//   },

//   markUsed(id: number) {
//     return prisma.token.update({
//       where: { id },
//       data: { isUsed: true },
//     });
//   },
// };


// import prisma from "../config/prisma.js";

// export class TokenRepository {
//   create(data: any) {
//     return prisma.token.create({ data });
//   }

//   findByHash(tokenHash: string) {
//     return prisma.token.findFirst({
//       where: { tokenHash, type: "REFRESH" },
//     });
//   }

//   markUsed(id: number) {
//     return prisma.token.update({
//       where: { id },
//       data: { isUsed: true },
//     });
//   }

//   revokeAll(userId: number) {
//     return prisma.token.updateMany({
//       where: { userId, type: "REFRESH" },
//       data: { isRevoked: true },
//     });
//   }
// }


import prisma from "../config/prisma.js";

export class TokenRepository {
  create(data: any) {
    return prisma.token.create({ data });
  }

  revokeAllUserTokens(userId: number) {
    return prisma.token.updateMany({
      where: { userId },
      data: { isRevoked: true },
    });
  }
}
