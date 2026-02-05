import prisma from "../../config/prisma";

export class TimetableRepository {

  create(data: any) {
    return prisma.timetable.create({ data });
  }

  teacherBusy(teacherId: number, day: string, period: number) {
    return prisma.timetable.findFirst({ where: { teacherId, day, period } });
  }

  sectionBusy(sectionId: number, day: string, period: number) {
    return prisma.timetable.findFirst({ where: { sectionId, day, period } });
  }

  getBySection(sectionId: number) {
    return prisma.timetable.findMany({
      where: { sectionId },
      include: { subject: true },
    });
  }
}
