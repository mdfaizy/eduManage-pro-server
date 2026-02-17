// src/models/teacher/teacher.service.ts
import prisma from "../../config/prisma";
import { TeacherRepository } from "./teacher.repository";

export class TeacherService {
  private repo = new TeacherRepository();

  // async createTeacher(userId: number, schoolId: number) {

  //   // 🔍 1. Check user exists
  //   const user = await prisma.user.findUnique({
  //     where: { id: userId },
  //   });

  //   if (!user) {
  //     throw new Error("User not found. Create user first.");
  //   }

  //   // 🔒 2. School safety check (multi-tenant security)
  //   if (user.schoolId !== schoolId) {
  //     throw new Error("User does not belong to your school.");
  //   }

  //   // ❌ 3. Prevent duplicate teacher profile
  //   const existing = await prisma.teacher.findUnique({
  //     where: { userId },
  //   });

  //   if (existing) {
  //     throw new Error("Teacher profile already exists for this user.");
  //   }

  //   // ✅ 4. Create teacher
  //   return this.repo.create({ userId, schoolId });
  // }

   private async generateTeacherCode(schoolId: number) {
    const year = new Date().getFullYear(); // 2024

    const count = await prisma.teacher.count({
      where: {
        schoolId,
        createdAt: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`),
        },
      },
    });

    const next = count + 1;

    return `SCH${schoolId}-${year}-TCH-${String(next).padStart(3, "0")}`;
  }
  // async createTeacher(userId: number, schoolId: number) {
  //   // 1️⃣ Validate user
  //   const user = await prisma.user.findUnique({
  //     where: { id: userId },
  //     include: {
  //       roles: { include: { role: true } },
  //       teacher: true,
  //     },
  //   });

  //   if (!user) {
  //     throw { statusCode: 404, message: "User not found" };
  //   }

  //   // 2️⃣ Same school check
  //   if (user.schoolId !== schoolId) {
  //     throw {
  //       statusCode: 403,
  //       message: "User does not belong to this school",
  //     };
  //   }

  //   // 3️⃣ Role check (dynamic & safe)
  //   const hasTeacherRole = user.roles.some(
  //     r => r.role.name.toUpperCase() === "TEACHER"
  //   );

  //   if (!hasTeacherRole) {
  //     throw {
  //       statusCode: 400,
  //       message: "User does not have TEACHER role",
  //     };
  //   }

  //   // 4️⃣ Duplicate teacher protection
  //   if (user.teacher) {
  //     throw {
  //       statusCode: 409,
  //       message: "Teacher profile already exists",
  //     };
  //   }

  //   // 5️⃣ Create teacher profile
  //   return this.repo.create({
  //     userId,
  //     schoolId,
  //   });
  // }


  async createTeacher(
    userId: number,
    schoolId: number,
    payload: {
      phone?: string;
      gender?: string;
      joiningDate?: string;
      qualification?: string;
    }
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: { include: { role: true } },
        teacher: true,
      },
    });

    if (!user) throw { statusCode: 404, message: "User not found" };
    if (user.schoolId !== schoolId)
      throw { statusCode: 403, message: "Invalid school" };

    const isTeacher = user.roles.some(
      r => r.role.name === "TEACHER"
    );
    if (!isTeacher)
      throw { statusCode: 400, message: "User is not TEACHER" };

    if (user.teacher)
      throw { statusCode: 409, message: "Teacher already exists" };

    const teacherCode = await this.generateTeacherCode(schoolId);

    return this.repo.create({
      userId,
      schoolId,
      teacherCode,
      phone: payload.phone,
      gender: payload.gender,
      joiningDate: payload.joiningDate
        ? new Date(payload.joiningDate)
        : undefined,
      qualification: payload.qualification,
    });
  }


  async getTeachers(schoolId: number) {
    return this.repo.findAllBySchool(schoolId);
  }

  // async getTeachers(schoolId: number) {
  //   return this.repo.findAll(schoolId);
  // }
//  async getTeacher(id: number) {
//     const teacher = await prisma.teacher.findUnique({
//       where: { id },
//       include: { user: true },
//     });

//     if (!teacher) throw new Error("Teacher not found");

//     return teacher;
//   }

async getTeacher(id: number) {
  const teacher = await prisma.teacher.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          isActive: true,
        },
      },
    },
  });

  if (!teacher) {
    throw new Error("Teacher not found");
  }

  return teacher;
}

async updateTeacher(
  teacherId: number,
  userData: {
    name?: string;
    email?: string;
  },
  teacherData: {
    phone?: string;
    gender?: string;
    qualification?: string;
    joiningDate?: string;
  }
) {
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
  });

  if (!teacher) {
    throw { statusCode: 404, message: "Teacher not found" };
  }

  // 🔹 Update USER (name/email)
  if (userData.name || userData.email) {
    await prisma.user.update({
      where: { id: teacher.userId },
      data: {
        ...(userData.name && { name: userData.name }),
        ...(userData.email && { email: userData.email }),
      },
    });
  }

  // 🔹 Update TEACHER profile
  const updatedTeacher = await prisma.teacher.update({
    where: { id: teacherId },
    data: {
      ...(teacherData.phone && { phone: teacherData.phone }),
      ...(teacherData.gender && { gender: teacherData.gender }),
      ...(teacherData.qualification && {
        qualification: teacherData.qualification,
      }),
      ...(teacherData.joiningDate && {
        joiningDate: new Date(teacherData.joiningDate),
      }),
    },
    include: {
      user: {
        select: { name: true, email: true, isActive: true },
      },
    },
  });

  return updatedTeacher;
}

async toggleTeacherStatus(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found");

  return prisma.user.update({
    where: { id: userId },
    data: {
      isActive: !user.isActive, // 🔥 toggle
    },
  });
}


}
