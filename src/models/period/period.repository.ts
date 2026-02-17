import prisma from "../../config/prisma";

export class PeriodRepository {
  create(data: any) {
    return prisma.period.create({ data });
  }

  createMany(data: any[]) {
    return prisma.period.createMany({
      data,
      skipDuplicates: true,
    });
  }

  findBySchool(schoolId: number, academicYearId: number) {
    return prisma.period.findMany({
      where: { schoolId, academicYearId },
      orderBy: [
        { dayId: "asc" },
        { periodNumber: "asc" },
      ],
    });
  }

  deleteBySchoolYear(schoolId: number, academicYearId: number) {
    return prisma.period.deleteMany({
      where: { schoolId, academicYearId },
    });
  }

  findById(id: number) {
    return prisma.period.findUnique({
      where: { id },
    });
  }

  delete(id: number) {
    return prisma.period.delete({
      where: { id },
    });
  }

  // ⭐ NEW — duplicate check
  findDuplicatePeriod(
    schoolId: number,
    academicYearId: number,
    dayId: number,
    periodNumber: number
  ) {
    return prisma.period.findFirst({
      where: {
        schoolId,
        academicYearId,
        dayId,
        periodNumber,
      },
    });
  }

  // ⭐ NEW — count by day
  countByDay(
    schoolId: number,
    academicYearId: number,
    dayId: number
  ) {
    return prisma.period.count({
      where: {
        schoolId,
        academicYearId,
        dayId,
      },
    });
  }
}
