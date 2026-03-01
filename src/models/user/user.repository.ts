import { TokenType } from "@prisma/client";
import prisma from "../../config/prisma.js";

export class UserRepository {
  async createUser(data: any) {
    return prisma.user.create({ data });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }
async updateUser(id: number, data: any) {
  return prisma.user.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
  });
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

  // async findAllBySchool(schoolId: number) {
  //   return prisma.user.findMany({
  //     where: { schoolId, isDeleted: false, },
  //     include: { roles: { include: { role: true } } },
  //     orderBy: { createdAt: "desc" },
  //   });
  // }

 async findAllBySchool(
  schoolId: number,
  page = 1,
  limit = 10,
  search?: string,
  role?: string
) {
  const skip = (page - 1) * limit;

  const where: any = {
    schoolId,
    isDeleted: false,
  };

  // 🔍 search support (FIXED)
 // 🔍 search support (MYSQL SAFE)
if (search?.trim()) {
  const keyword = search.trim();

  where.OR = [
    { name: { contains: keyword } },
    { email: { contains: keyword } },
  ];
}

  // 🎭 role filter (⭐ VERY IMPORTANT)
  if (role) {
    where.roles = {
      some: {
        role: {
          name: role.toUpperCase(),
        },
      },
    };
  }

  const [data, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      include: {
        roles: { include: { role: true } },
        teacher: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

  // user.repository.ts
async softDelete(id: number) {
  return prisma.user.update({
    where: { id },
    data: {
      isDeleted: true,
      isActive: false,
    },
  });
}
  // async findByRole(schoolId: number, roleName: string) {
  //   return prisma.user.findMany({
  //     where: {
  //       schoolId,
  //       roles: { some: { role: { name: roleName } } },
  //     },
  //     include: { roles: { include: { role: true } } },
  //   });
  // }

async findByRole(schoolId: number, roleName: string) {
  return prisma.user.findMany({
    where: {
      schoolId,
      roles: {
        some: {
          role: {
            name: roleName.toUpperCase(), // 👈 normalize
          },
        },
      },
    },
    include: {
      roles: { include: { role: true } },
    },
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
