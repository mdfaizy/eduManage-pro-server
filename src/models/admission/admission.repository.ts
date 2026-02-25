import prisma from "../../config/prisma.js";

export class AdmissionRepository {
  async create(data: any) {
    return prisma.admission.create({ data });
  }

  async findActive(studentId: number, academicYear: string) {
    return prisma.admission.findFirst({
      where: {
        studentId,
        academicYear,
        status: "ACTIVE",
      },
    });
  }

  async findByStudent(studentId: number) {
    return prisma.admission.findMany({
      where: { studentId },
      orderBy: { createdAt: "desc" },
    });
  }
}