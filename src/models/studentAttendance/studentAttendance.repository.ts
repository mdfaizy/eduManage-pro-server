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

          // ...(sectionId
          //   ? { sectionId }
          //   : {}),
          ...(sectionId !== undefined &&
  sectionId !== null && {
    sectionId,
  }),

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

  const start = new Date(attendanceDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(attendanceDate);
  end.setHours(23, 59, 59, 999);

  return prisma.studentAttendanceSession.findFirst({

    where: {

      schoolId,

      classId,

      ...(sectionId !== undefined && {
        sectionId,
      }),

      attendanceDate: {
        gte: start,
        lte: end,
      },
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

// async getDailyAttendance(

//   schoolId: number,

//   attendanceDate: Date,

//   classId?: number,

//   sectionId?: number

// ) {

//   return prisma
//     .studentAttendanceSession
//     .findMany({

//       where: {

//         schoolId,

//         attendanceDate,

//         ...(classId && {
//           classId,
//         }),

//         ...(sectionId && {
//           sectionId,
//         }),
//       },

//       include: {

//         class: true,

//         section: true,

//         markedBy: true,

//         records: {

//           include: {

//             student: true,
//           },
//         },
//       },

//       orderBy: {

//         createdAt: "desc",
//       },
//     });
// }

async getDailyAttendance(

  schoolId: number,

  attendanceDate: Date,

  classId?: number,

  sectionId?: number

) {

  // =====================================
  // START & END OF DAY
  // =====================================

  const start = new Date(attendanceDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(attendanceDate);
  end.setHours(23, 59, 59, 999);

  // =====================================
  // GET DAILY ATTENDANCE
  // =====================================

  return prisma.studentAttendanceSession.findMany({

    where: {

      schoolId,

      attendanceDate: {
        gte: start,
        lte: end,
      },

      ...(classId !== undefined && {
        classId,
      }),

      ...(sectionId !== undefined && {
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

      attendanceDate: "desc",
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

// async monthlyReport(

//   schoolId: number,

//   startDate: string,

//   endDate: string,

//   classId?: number,

//   sectionId?: number

// ) {

//   // =====================================
//   // DATE CONVERSION
//   // =====================================

//   const start =
//     new Date(startDate);

//   const end =
//     new Date(endDate);

//   // =====================================
//   // GET RECORDS
//   // =====================================

//   const records =
//     await prisma
//       .studentAttendanceRecord
//       .findMany({

//         where: {

//           session: {

//             schoolId,

//             attendanceDate: {

//               gte: start,

//               lte: end,
//             },

//             ...(classId && {
//               classId,
//             }),

//             ...(sectionId && {
//               sectionId,
//             }),
//           },
//         },

//         include: {

//   student: true,

//   session: {
//     include: {
//       class: true,
//       section: true,
//     },
//   },

//   student: {
//     include: {
//       academicRecords: {
//         where: {
//           isCurrent: true,
//         },
//         select: {
//           rollNumber: true,
//           admissionNo: true,
//           classId: true,
//           sectionId: true,
//         },
//       },
//     },
//   },
// },
//       });

//   // =====================================
//   // GROUP BY STUDENT
//   // =====================================

//   const grouped: any = {};

//   records.forEach(
//     (record: any) => {

//       const id =
//         record.student.id;

//       if (!grouped[id]) {

//         grouped[id] = {

//           student:
//             record.student,

//           present: 0,

//           absent: 0,

//           total: 0,
//         };
//       }

//       grouped[id].total++;

//       if (
//         record.status ===
//         "PRESENT"
//       ) {

//         grouped[id].present++;

//       } else {

//         grouped[id].absent++;
//       }
//     }
//   );

//   // =====================================
//   // FINAL DATA
//   // =====================================

//   return Object.values(
//     grouped
//   ).map((item: any) => ({

//     ...item,

//     percentage:
//       item.total

//         ? Math.round(

//             (
//               item.present /
//               item.total
//             ) * 100
//           )

//         : 0,
//   }));
// }

  // =====================================================
  // STUDENT REPORT
  // =====================================================


async monthlyReport(
  schoolId: number,
  startDate: string,
  endDate: string,
  classId?: number,
  sectionId?: number
) {

  // =====================================
  // DATE RANGE
  // =====================================

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  // =====================================
  // TOTAL WORKING DAYS
  // =====================================

  const workingDays = await prisma.studentAttendanceSession.count({
    where: {
      schoolId,

      attendanceDate: {
        gte: start,
        lte: end,
      },

      ...(classId !== undefined && { classId }),

      ...(sectionId !== undefined && { sectionId }),
    },
  });

  // =====================================
  // GET ATTENDANCE RECORDS
  // =====================================

  const records = await prisma.studentAttendanceRecord.findMany({

    where: {

      session: {

        schoolId,

        attendanceDate: {
          gte: start,
          lte: end,
        },

        ...(classId !== undefined && { classId }),

        ...(sectionId !== undefined && { sectionId }),
      },
    },

    include: {

      // session: {
      //   include: {
      //     class: true,
      //     section: true,
      //   },
      // },
      session: {
  include: {
    class: true,
    section: true,
    markedBy: {
      select: {
        id: true,
        name: true,
      },
    },
  },
},

      student: {
        include: {
          academicRecords: {
            where: {
              isCurrent: true,
            },
            select: {
              rollNumber: true,
              admissionNo: true,
              classId: true,
              sectionId: true,
            },
          },
        },
      },
    },
  });

  // =====================================
  // GROUP STUDENT DATA
  // =====================================

  const grouped: any = {};

  records.forEach((record: any) => {

    const id = record.student.id;

    const academic = record.student.academicRecords?.[0];

    if (!grouped[id]) {

      grouped[id] = {

        student: record.student,

        rollNumber: academic?.rollNumber ?? "-",

        admissionNo: academic?.admissionNo ?? "-",

        className: record.session.class?.name ?? "-",

        sectionName: record.session.section?.name ?? "-",
        markedBy: record.session.markedBy?.name ?? "-",
markedAt: record.session.createdAt,
isLocked: record.session.isLocked,
        workingDays,

        present: 0,

        absent: 0,

        late: 0,

        halfDay: 0,

        leave: 0,

        total: 0,
      };
    }

    grouped[id].total++;

    switch (record.status) {

      case "PRESENT":
        grouped[id].present++;
        break;

      case "ABSENT":
        grouped[id].absent++;
        break;

      case "LATE":
        grouped[id].late++;
        break;

      case "HALF_DAY":
        grouped[id].halfDay++;
        break;

      case "LEAVE":
        grouped[id].leave++;
        break;
    }
  });

  // =====================================
  // FINAL RESPONSE
  // =====================================

  return Object.values(grouped).map((item: any) => ({

    student: item.student,

    rollNumber: item.rollNumber,

    admissionNo: item.admissionNo,

    className: item.className,

    sectionName: item.sectionName,
     markedBy: item.markedBy,

  markedAt: item.markedAt,

  isLocked: item.isLocked,
    workingDays: item.workingDays,

    present: item.present,

    absent: item.absent,

    late: item.late,

    halfDay: item.halfDay,

    leave: item.leave,

    total: item.total,

    percentage:
      item.workingDays > 0
        ? Number(
            (
              (item.present / item.workingDays) *
              100
            ).toFixed(2)
          )
        : 0,
  }));
}

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

  // async stats(
  //   schoolId: number
  // ) {

  //   const today =
  //     new Date();

  //   const sessions =
  //     await prisma
  //       .studentAttendanceSession
  //       .findMany({

  //         where: {

  //           schoolId,

  //           attendanceDate: {

  //             gte: new Date(
  //               today.setHours(
  //                 0, 0, 0, 0
  //               )
  //             ),
  //           },
  //         },

  //         include: {

  //           records: true,
  //         },
  //       });

  //   let present = 0;
  //   let absent = 0;
  //   let late = 0;

  //   sessions.forEach(
  //     (session) => {

  //       session.records
  //         .forEach((record) => {

  //           if (
  //             record.status ===
  //             "PRESENT"
  //           ) present++;

  //           if (
  //             record.status ===
  //             "ABSENT"
  //           ) absent++;

  //           if (
  //             record.status ===
  //             "LATE"
  //           ) late++;
  //         });
  //     }
  //   );

  //   return {

  //     present,

  //     absent,

  //     late,
  //   };
  // }

  async stats(
  schoolId: number,
  startDate?: string,
  endDate?: string,
  classId?: number,
  sectionId?: number
) {

  const start = startDate
    ? new Date(startDate)
    : new Date();

  start.setHours(0, 0, 0, 0);

  const end = endDate
    ? new Date(endDate)
    : new Date();

  end.setHours(23, 59, 59, 999);

  const sessions =
    await prisma.studentAttendanceSession.findMany({

      where: {

        schoolId,

        attendanceDate: {
          gte: start,
          lte: end,
        },

        ...(classId !== undefined && {
          classId,
        }),

        ...(sectionId !== undefined && {
          sectionId,
        }),
      },

      include: {
        records: true,
      },
    });

  let present = 0;
  let absent = 0;
  let late = 0;
  let halfDay = 0;
  let leave = 0;

  sessions.forEach((session) => {

    session.records.forEach((record) => {

      switch (record.status) {

        case "PRESENT":
          present++;
          break;

        case "ABSENT":
          absent++;
          break;

        case "LATE":
          late++;
          break;

        case "HALF_DAY":
          halfDay++;
          break;

        case "LEAVE":
          leave++;
          break;
      }
    });

  });

  return {

    present,

    absent,

    late,

    halfDay,

    leave,
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