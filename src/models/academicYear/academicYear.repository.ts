import prisma from "../../config/prisma";

export class AcademicYearRepository {
  create(data: any) {
    return prisma.academicYear.create({ data });
  }

  findAll(schoolId: number) {
    return prisma.academicYear.findMany({
      where: { schoolId },
      orderBy: { startDate: "desc" },
    });
  }

  findById(id: number) {
    return prisma.academicYear.findUnique({
      where: { id },
    });
  }

  async setActive(id: number, schoolId: number) {
    // 🔥 first deactivate all
    await prisma.academicYear.updateMany({
      where: { schoolId },
      data: { isActive: false },
    });

    // 🔥 activate selected
    return prisma.academicYear.update({
      where: { id },
      data: { isActive: true },
    });
  }

  update(id: number, data: any) {
    return prisma.academicYear.update({
      where: { id },
      data,
    });
  }

  delete(id: number) {
    return prisma.academicYear.delete({
      where: { id },
    });
  }

  getActive(schoolId: number) {
    return prisma.academicYear.findFirst({
      where: { schoolId, isActive: true },
    });
  }
}
