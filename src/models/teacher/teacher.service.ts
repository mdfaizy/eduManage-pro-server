// src/models/teacher/teacher.service.ts
import prisma from "../../config/prisma";
import { TeacherRepository } from "./teacher.repository";

export class TeacherService {
  private repo = new TeacherRepository();

  async createTeacher(userId: number, schoolId: number) {

    // 🔍 1. Check user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found. Create user first.");
    }

    // 🔒 2. School safety check (multi-tenant security)
    if (user.schoolId !== schoolId) {
      throw new Error("User does not belong to your school.");
    }

    // ❌ 3. Prevent duplicate teacher profile
    const existing = await prisma.teacher.findUnique({
      where: { userId },
    });

    if (existing) {
      throw new Error("Teacher profile already exists for this user.");
    }

    // ✅ 4. Create teacher
    return this.repo.create({ userId, schoolId });
  }

  async getTeachers(schoolId: number) {
    return this.repo.findAll(schoolId);
  }
 async getTeacher(id: number) {
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!teacher) throw new Error("Teacher not found");

    return teacher;
  }
 async updateTeacherUser(userId: number, name?: string, email?: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { name, email },
  });
}

}
