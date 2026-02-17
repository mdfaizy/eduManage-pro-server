import prisma from "../../config/prisma";

export class TimetableRepository {
  create(data: {
    schoolId: number;
    classId: number;
    sectionId: number;
    subjectId: number;
    teacherId: number;
    dayId: number;
    periodId: number;
    academicYearId: number;
  }) {
    return prisma.timetable.create({ data });
  }

  findAllBySchool(schoolId: number) {
    return prisma.timetable.findMany({
      where: { schoolId },
      include: {
        class: { select: { id: true, name: true } },
        section: { select: { id: true, name: true } },
        subject: { select: { id: true, name: true } },
        teacher: {
          include: {
            user: { select: { name: true } },
          },
        },
      },
    });
  }
getAllForAdmin(schoolId: number, academicYearId: number) {
  return prisma.timetable.findMany({
    where: {
      schoolId,
      academicYearId,
    },
    include: {
      class: { select: { name: true } },
      section: { select: { name: true } },
      subject: { select: { name: true } },
      teacher: {
        include: {
          user: { select: { name: true } },
        },
      },
      period: {
        include: {
          day: true,
        },
      },
    },
    orderBy: [
      { teacherId: "asc" },
      { periodId: "asc" },
    ],
  });
}

  getTeacherTimetable(teacherId: number, academicYearId: number) {
    return prisma.timetable.findMany({
      where: {
        teacherId,
        academicYearId,
      },
      include: {
        class: true,
        section: true,
        subject: true,
        teacher: {
          include: { user: true },
        },
      },
      orderBy: [{ dayId: "asc" }, { periodId: "asc" }],
    });
  }

  findTeacherConflict(
    teacherId: number,
    dayId: number,
    periodId: number,
    academicYearId: number
  ) {
    return prisma.timetable.findFirst({
      where: {
        teacherId,
        dayId,
        periodId,
        academicYearId,
      },
    });
  }

  findClassConflict(
    sectionId: number,
    dayId: number,
    periodId: number,
    academicYearId: number
  ) {
    return prisma.timetable.findFirst({
      where: {
        sectionId,
        dayId,
        periodId,
        academicYearId,
      },
    });
  }

  delete(id: number) {
    return prisma.timetable.delete({ where: { id } });
  }
}

