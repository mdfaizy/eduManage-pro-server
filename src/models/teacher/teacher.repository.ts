// src/models/teacher/teacher.repository.ts
import prisma from "../../config/prisma";

export class TeacherRepository {
  async create(data: { userId: number; schoolId: number }) {
    return prisma.teacher.create({ data });
  }

  async findAll(schoolId: number) {
    return prisma.teacher.findMany({
      where: { schoolId },
      include: {
        user: { select: { name: true, email: true, isActive: true } },
      },
      orderBy: { id: "desc" },
    });
  }

  async findById(id: number) {
    return prisma.teacher.findUnique({
      where: { id },
      include: { user: true },
    });
  }
   update(id: number, data: { name?: string; email?: string }) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }
}
