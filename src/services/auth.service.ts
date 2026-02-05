

import bcrypt from "bcryptjs";
import crypto from "crypto";
import prisma from "../config/prisma.js";
import { hashPassword } from "../utils/password.js";
import { sendEmail } from "../utils/sendEmail.js";
import { TokenRepository } from "../repositories/token.repository.js";
import { AuthRepository } from "../repositories/auth.repository.js";
import { SchoolService } from "../models/school/school.service.js";
import { JWTService } from "./jwt.service.js";
import { TokenUtil } from "../utils/token.util.js";

export const AuthService = {
async registerSchool(payload: any) {
  
  // 🔴 Check existing school
  const existingSchool = await prisma.school.findUnique({
    where: { email: payload.schoolEmail.toLowerCase() },
  });
  if (existingSchool) {
    throw new Error("School email already registered");
  }

  // 🔴 Check existing admin
  const existingAdmin = await prisma.user.findUnique({
    where: { email: payload.adminEmail.toLowerCase() },
  });
  if (existingAdmin) {
    throw new Error("Admin email already registered");
  }
  return prisma.$transaction(async (tx) => {

    // 1️⃣ Create school
    const school = await AuthRepository.createSchool(tx, {
      name: payload.schoolName,
      email: payload.schoolEmail.toLowerCase(),
    });

    // 2️⃣ Create admin user
    const admin = await AuthRepository.createUser(tx, {
      name: payload.adminName,
      email: payload.adminEmail.toLowerCase(),
      password: await hashPassword(payload.password),
      schoolId: school.id,
      isActive: false,
      emailVerified: false,
    });

    // 🔥 3️⃣ CREATE / GET SCHOOL_ADMIN ROLE
    const schoolAdminRole = await tx.role.upsert({
      where: {
        name_schoolId: {
          name: "SCHOOL_ADMIN",
          schoolId: school.id,
        },
      },
      update: {},
      create: {
        name: "SCHOOL_ADMIN",
        schoolId: school.id,
      },
    });

    // 🔥 4️⃣ ASSIGN ROLE TO ADMIN USER
    await tx.userRole.create({
      data: {
        userId: admin.id,
        roleId: schoolAdminRole.id,
      },
    });

    // 5️⃣ Email verification token
    const token = crypto.randomUUID();

    await TokenRepository.create(tx, {
      userId: admin.id,
      token,
      type: "VERIFY_EMAIL",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await sendEmail({
      email: admin.email,
      subject: "Verify your email",
      html: `<a href="${process.env.FRONTEND_URL}/verify-email?token=${token}">
               Verify Email</a>`,
    });

    return {
      message: "School registered. Admin role assigned. Verify email.",
    };
  });
},  
  async verifyEmail(token: string) {
    const record = await TokenRepository.findValid(token);
    if (!record) throw new Error("Invalid or expired token");

    await SchoolService.activateSchoolAndUser(
      record.user.id,
      record.user.schoolId
    );

    await TokenRepository.markUsed(record.id);

    return { message: "Email verified successfully" };
  },

// ✅ LOGIN (FINAL)
async login(email: string, password: string, ua?: string, ip?: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        school: true,
        roles: {
          include: {
            role: {
              include: {
                permissions: { include: { permission: true } },
              },
            },
          },
        },
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password)))
      throw new Error("Invalid credentials");

    if (!user.isActive) throw new Error("User disabled");
    if (user.school.status !== "ACTIVE") throw new Error("School inactive");

    const roles = user.roles.map((ur) => ur.role.name);
    const permissions = user.roles.flatMap((ur) =>
      ur.role.permissions.map((rp) => rp.permission.key)
    );

    const accessToken = JWTService.generateAccessToken({
      userId: user.id,
      schoolId: user.schoolId,
      roles,
      permissions,
    });

    const refreshToken = TokenUtil.generate();

    await prisma.token.create({
      data: {
        userId: user.id,
        tokenHash: TokenUtil.hash(refreshToken),
        type: "REFRESH",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userAgent: ua,
        ipAddress: ip,
      },
    });

    return { accessToken, refreshToken, user };
},
// ✅ REFRESH (FINAL)
async refresh(oldToken: string, ua?: string, ip?: string) {
    const tokenHash = TokenUtil.hash(oldToken);
    return prisma.$transaction(async (tx) => {
      const stored = await tx.token.findFirst({
        where: { tokenHash, type: "REFRESH" },
      });
      if (!stored || stored.isRevoked || stored.expiresAt < new Date())
        throw new Error("Unauthorized");
      if (stored.isUsed) {
        await tx.token.updateMany({
          where: { userId: stored.userId },
          data: { isRevoked: true },
        });
        throw new Error("Session hijack detected");
      }
      await tx.token.update({ where: { id: stored.id }, data: { isUsed: true } });
      const newRefresh = TokenUtil.generate();
      await tx.token.create({
        data: {
          userId: stored.userId,
          tokenHash: TokenUtil.hash(newRefresh),
          type: "REFRESH",
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          userAgent: ua,
          ipAddress: ip,
        },
      });
      const user = await tx.user.findUnique({
        where: { id: stored.userId },
        include: { roles: { include: { role: true } } },
      });
      const accessToken = JWTService.generateAccessToken({
        userId: user!.id,
        schoolId: user!.schoolId,
        roles: user!.roles.map((r) => r.role.name),
        permissions: [],
      });
      return { accessToken, refreshToken: newRefresh };
    });
  },
  async logout(refreshToken: string) {
    await prisma.token.updateMany({
      where: { tokenHash: TokenUtil.hash(refreshToken) },
      data: { isRevoked: true },
    });
  },
};
