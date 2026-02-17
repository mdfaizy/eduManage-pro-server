import prisma from "../../config/prisma";
import { TimetableRepository } from "./timetable.repository";

export class TimetableService {
  private repo = new TimetableRepository();

  /* =====================================================
     BULK CREATE (SaaS SAFE)
  ===================================================== */
  async bulkCreate(data: any) {
    const {
      schoolId,
      classId,
      sectionId,
      academicYearId,
      schedule,
    } = data;

    if (!schoolId) {
      throw new Error("SchoolId missing");
    }

    if (!schedule?.length) {
      throw new Error("Schedule is empty");
    }

    return await prisma.$transaction(async (tx) => {
      /* ---------------- DELETE OLD (SCOPED) ---------------- */
      await tx.timetable.deleteMany({
        where: {

          schoolId,
          classId,
          sectionId,
          academicYearId,
        },
      });

      /* ---------------- DUPLICATE GUARD (REQUEST LEVEL) ---------------- */
      const seen = new Set<string>();

      for (const item of schedule) {
        const uniqueKey = `${item.dayId}-${item.periodId}`;

        if (seen.has(uniqueKey)) {
          throw new Error(
            `Duplicate period in request (day ${item.dayId}, period ${item.periodId})`
          );
        }

        seen.add(uniqueKey);

        /* ---------------- TEACHER CONFLICT ---------------- */
        const teacherConflict = await tx.timetable.findFirst({
          where: {
    subjectId: item.subjectId,
            schoolId,
            teacherId: item.teacherId,
            dayId: item.dayId,
            periodId: item.periodId,
            academicYearId,
          },
        });

        if (teacherConflict) {
          throw new Error(
            `Teacher conflict on day ${item.dayId} period ${item.periodId}`
          );
        }

        /* ---------------- SECTION CONFLICT ---------------- */
        const classConflict = await tx.timetable.findFirst({
          where: {
            schoolId,
            sectionId,
            dayId: item.dayId,
            periodId: item.periodId,
            academicYearId,
          },
        });

        if (classConflict) {
          throw new Error(
            `Section conflict on day ${item.dayId} period ${item.periodId}`
          );
        }

        /* ---------------- PERIOD VALIDATION ---------------- */
        const period = await tx.period.findUnique({
          where: { id: item.periodId },
        });

        if (!period) {
          throw new Error(`Invalid period id ${item.periodId}`);
        }

        /* ---------------- FINAL INSERT ---------------- */
        await tx.timetable.create({
          data: {
            schoolId,
            classId,
            sectionId,
            subjectId: item.subjectId,
            teacherId: item.teacherId,
            dayId: item.dayId,
            periodId: item.periodId,
            academicYearId,

           startTime: period.startTime,
    endTime: period.endTime,
          },
        });
      }

      return true;
    });
  }

  /* =====================================================
     ADMIN TIMETABLE
  ===================================================== */
  async getAdminTimetable(
    schoolId: number,
    academicYearId: number
  ) {
    return this.repo.getAllForAdmin(schoolId, academicYearId);
  }

  /* =====================================================
     TEACHER TIMETABLE (MULTI-TENANT SAFE)
  ===================================================== */
  async getTeacherTimetable(
    schoolId: number,
    teacherId: number,
    academicYearId: number
  ) {
    return prisma.timetable.findMany({
      where: {
        schoolId,
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
        period: {
          include: { day: true },
        },
      },
      orderBy: [{ dayId: "asc" }, { periodId: "asc" }],
    });
  }

  /* =====================================================
     GET ALL (SCHOOL SCOPED)
  ===================================================== */
  async getAll(schoolId: number) {
    return this.repo.findAllBySchool(schoolId);
  }

  /* =====================================================
     DELETE SINGLE
  ===================================================== */
  async remove(id: number) {
    return this.repo.delete(id);
  }
}
