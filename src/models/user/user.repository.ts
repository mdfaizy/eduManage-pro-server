// import prisma from "../../config/prisma.js";

// export class UserRepository {
//   async createUser(data: any) {
//     return prisma.user.create({ data });
//   }

//   async findById(id: number) {
//     return prisma.user.findUnique({
//       where: { id },
//       include: {
//         roles: { include: { role: true } },
//       },
//     });
//   }

//   async findAllBySchool(schoolId: number) {
//     return prisma.user.findMany({
//       where: { schoolId },
//       include: {
//         roles: { include: { role: true } },
//       },
//     });
//   }
// async findByRole(schoolId: number, roleName: string) {
//   return prisma.user.findMany({
//     where: {
//       schoolId,
//       roles: {
//         some: {
//           role: {
//             name: roleName,
//           },
//         },
//       },
//     },
//     include: {
//       roles: { include: { role: true } },
//     },
//   });
// }

//   async assignRole(userId: number, roleId: number) {
//     return prisma.userRole.create({
//       data: { userId, roleId },
//     });
//   }

  // async deleteUser(id: number) {
  //   return prisma.user.delete({ where: { id } });
  // }
 

//   async updateStatus(id: number, isActive: boolean) {
//     return prisma.user.update({
//       where: { id },
//       data: { isActive },
//     });
//   }
// }



// import prisma from "../../config/prisma.js";

// export class UserRepository {

//   // ================= CREATE =================
//   async createUser(data: any) {
//     return prisma.user.create({ data });
//   }

//   // ================= FIND =================
//   async findById(id: number) {
//     return prisma.user.findUnique({
//       where: { id },
//       include: {
//         school: true,
//         roles: { include: { role: true } },
//       },
//     });
//   }

//   async findByEmail(email: string) {
//     return prisma.user.findUnique({ where: { email } });
//   }

//   async findAllBySchool(schoolId: number) {
//     return prisma.user.findMany({
//       where: { schoolId },
//       include: { roles: { include: { role: true } } },
//       orderBy: { createdAt: "desc" },
//     });
//   }

//   async findByRole(schoolId: number, roleName: string) {
//     return prisma.user.findMany({
//       where: {
//         schoolId,
//         roles: {
//           some: {
//             role: { name: roleName },
//           },
//         },
//       },
//       include: { roles: { include: { role: true } } },
//     });
//   }

//   // ================= ROLE ASSIGN =================
//   async assignRole(userId: number, roleId: number) {
//     return prisma.userRole.upsert({
//       where: { userId_roleId: { userId, roleId } },
//       update: {},
//       create: { userId, roleId },
//     });
//   }

//   // ================= STATUS =================
//   async updateStatus(id: number, isActive: boolean) {
//     return prisma.user.update({
//       where: { id },
//       data: { isActive },
//     });
//   }

//   // ================= SAFE DELETE =================
//   async softDeleteUser(id: number) {
//     return prisma.user.update({
//       where: { id },
//       data: { isActive: false },
//     });
//   }

//   // ================= INVITE TOKEN LINK =================
//   async createSetPasswordToken(userId: number, tokenHash: string, expiresAt: Date) {
//     return prisma.token.create({
//       data: {
//         userId,
//         tokenHash,
//         type: "RESET_PASSWORD",
//         expiresAt,
//       },
//     });
//   }
// }



import { TokenType } from "@prisma/client";
import prisma from "../../config/prisma.js";

export class UserRepository {
  async createUser(data: any) {
    return prisma.user.create({ data });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        school: true,
        roles: { include: { role: true } },
      },
    });
  }

  async findAllBySchool(schoolId: number) {
    return prisma.user.findMany({
      where: { schoolId },
      include: { roles: { include: { role: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async findByRole(schoolId: number, roleName: string) {
    return prisma.user.findMany({
      where: {
        schoolId,
        roles: { some: { role: { name: roleName } } },
      },
      include: { roles: { include: { role: true } } },
    });
  }

  async assignRole(userId: number, roleId: number) {
    return prisma.userRole.upsert({
      where: { userId_roleId: { userId, roleId } },
      update: {},
      create: { userId, roleId },
    });
  }
 async deleteUser(id: number) {
    return prisma.user.delete({ where: { id } });
  }
  async updateStatus(id: number, isActive: boolean) {
    return prisma.user.update({ where: { id }, data: { isActive } });
  }

  async createToken(data: any) {
    return prisma.token.create({ data });
  }

  async findValidToken(tokenHash: string) {
    return prisma.token.findFirst({
      where: {
        tokenHash,
       type: TokenType.SET_PASSWORD,
        isUsed: false,
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });
  }
  async activateUser(userId: number, password: string, tokenId: number) {
  return prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        password,
        isActive: true,
        emailVerified: true,
      },
    }),
    prisma.token.update({
      where: { id: tokenId },
      data: { isUsed: true },
    }),
  ]);
}

}
