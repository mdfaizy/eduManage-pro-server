import prisma from "../../config/prisma.js";

export class StudentRepository {
  async create(data: any) {
    return prisma.student.create({ data });
  }

  async findAll(schoolId: number) {
    return prisma.student.findMany({
      where: { schoolId, isDeleted: false },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: number, schoolId: number) {
    return prisma.student.findFirst({
      where: { id, schoolId, isDeleted: false },
    });
  }

  async update(id: number, data: any) {
    return prisma.student.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: number) {
    return prisma.student.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}