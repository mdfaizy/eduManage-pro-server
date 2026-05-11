// studentAttendance.repository.ts

import prisma
from "../../config/prisma.js";

export class StudentAttendanceRepository {

  // =====================================================
  // GET STUDENTS
  // =====================================================

  async getStudents(

    schoolId: number,

    classId: number,

    sectionId?: number
  ) {

    return prisma
      .studentAcademicRecord
      .findMany({

        where: {

          schoolId,

          classId,

          ...(sectionId
            ? { sectionId }
            : {}),

          isCurrent: true,
        },

        include: {

          student: true,
        },

        orderBy: {

          rollNumber: "asc",
        },
      });
  }

  // =====================================================
  // FIND SESSION
  // =====================================================

  async findSession(

    schoolId: number,

    classId: number,

    sectionId: number | undefined,

    attendanceDate: Date
  ) {

    return prisma
      .studentAttendanceSession
      .findFirst({

        where: {

          schoolId,

          classId,

          sectionId,

          attendanceDate,
        },
      });
  }

  // =====================================================
  // CREATE SESSION
  // =====================================================

  async createSession(
    data: any
  ) {

    return prisma
      .studentAttendanceSession
      .create({
        data,
      });
  }

  // =====================================================
  // CREATE RECORDS
  // =====================================================

  async createRecords(
    data: any[]
  ) {

    return prisma
      .studentAttendanceRecord
      .createMany({
        data,
      });
  }

  // =====================================================
  // DAILY ATTENDANCE
  // =====================================================

async getDailyAttendance(

  schoolId: number,

  attendanceDate: Date,

  classId?: number,

  sectionId?: number

) {

  return prisma
    .studentAttendanceSession
    .findMany({

      where: {

        schoolId,

        attendanceDate,

        ...(classId && {
          classId,
        }),

        ...(sectionId && {
          sectionId,
        }),
      },

      include: {

        class: true,

        section: true,

        markedBy: true,

        records: {

          include: {

            student: true,
          },
        },
      },

      orderBy: {

        createdAt: "desc",
      },
    });
}

  async updateAttendance(

  recordId: number,

  data: any
) {

  return prisma
    .studentAttendanceRecord
    .update({

      where: {
        id: recordId,
      },

      data,
    });
}

async monthlyReport(

  schoolId: number,

  startDate: string,

  endDate: string,

  classId?: number,

  sectionId?: number

) {

  // =====================================
  // DATE CONVERSION
  // =====================================

  const start =
    new Date(startDate);

  const end =
    new Date(endDate);

  // =====================================
  // GET RECORDS
  // =====================================

  const records =
    await prisma
      .studentAttendanceRecord
      .findMany({

        where: {

          session: {

            schoolId,

            attendanceDate: {

              gte: start,

              lte: end,
            },

            ...(classId && {
              classId,
            }),

            ...(sectionId && {
              sectionId,
            }),
          },
        },

        include: {

          student: true,
        },
      });

  // =====================================
  // GROUP BY STUDENT
  // =====================================

  const grouped: any = {};

  records.forEach(
    (record: any) => {

      const id =
        record.student.id;

      if (!grouped[id]) {

        grouped[id] = {

          student:
            record.student,

          present: 0,

          absent: 0,

          total: 0,
        };
      }

      grouped[id].total++;

      if (
        record.status ===
        "PRESENT"
      ) {

        grouped[id].present++;

      } else {

        grouped[id].absent++;
      }
    }
  );

  // =====================================
  // FINAL DATA
  // =====================================

  return Object.values(
    grouped
  ).map((item: any) => ({

    ...item,

    percentage:
      item.total

        ? Math.round(

            (
              item.present /
              item.total
            ) * 100
          )

        : 0,
  }));
}

  // =====================================================
  // STUDENT REPORT
  // =====================================================

  async studentReport(

    schoolId: number,

    studentId: number
  ) {

    return prisma
      .studentAttendanceRecord
      .findMany({

        where: {

          studentId,

          session: {

            schoolId,
          },
        },

        include: {

          session: {

            include: {

              class: true,

              section: true,
            },
          },
        },

        orderBy: {

          createdAt: "desc",
        },
      });
  }

  // =====================================================
  // CLASS REPORT
  // =====================================================

  async classReport(

    schoolId: number,

    classId: number
  ) {

    return prisma
      .studentAttendanceSession
      .findMany({

        where: {

          schoolId,

          classId,
        },

        include: {

          class: true,

          section: true,

          records: {

            include: {

              student: true,
            },
          },
        },

        orderBy: {

          attendanceDate: "desc",
        },
      });
  }

  // =====================================================
  // STATS
  // =====================================================

  async stats(
    schoolId: number
  ) {

    const today =
      new Date();

    const sessions =
      await prisma
        .studentAttendanceSession
        .findMany({

          where: {

            schoolId,

            attendanceDate: {

              gte: new Date(
                today.setHours(
                  0, 0, 0, 0
                )
              ),
            },
          },

          include: {

            records: true,
          },
        });

    let present = 0;
    let absent = 0;
    let late = 0;

    sessions.forEach(
      (session) => {

        session.records
          .forEach((record) => {

            if (
              record.status ===
              "PRESENT"
            ) present++;

            if (
              record.status ===
              "ABSENT"
            ) absent++;

            if (
              record.status ===
              "LATE"
            ) late++;
          });
      }
    );

    return {

      present,

      absent,

      late,
    };
  }

  // =====================================================
  // LOCK ATTENDANCE
  // =====================================================

  async lockAttendance(
    sessionId: number
  ) {

    return prisma
      .studentAttendanceSession
      .update({

        where: {
          id: sessionId,
        },

        data: {

          isLocked: true,
        },
      });
  }

}

export default
new StudentAttendanceRepository();