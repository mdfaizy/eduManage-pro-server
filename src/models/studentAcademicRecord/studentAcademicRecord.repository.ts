// import prisma from "../../config/prisma.js";

// export class StudentAcademicRecordRepository {

//   // =====================================================
//   // CREATE
//   // =====================================================

//   async create(tx: any, data: any) {

//     return tx.studentAcademicRecord.create({
//       data,
//     });
//   }

//   // =====================================================
//   // CURRENT RECORD
//   // =====================================================

//   async getCurrentRecord(
//     studentId: number
//   ) {

//     return prisma.studentAcademicRecord.findFirst({

//       where: {

//         studentId,

//         isCurrent: true,
//       },

//       include: {

//         class: true,

//         section: true,

//         academicYear: true,
//       },
//     });
//   }

//   // =====================================================
//   // HISTORY
//   // =====================================================

//   async getHistory(
//     studentId: number
//   ) {

//     return prisma.studentAcademicRecord.findMany({

//       where: {
//         studentId,
//       },

//       include: {

//         class: true,

//         section: true,

//         academicYear: true,
//       },

//       orderBy: {
//         createdAt: "desc",
//       },
//     });
//   }

//   // =====================================================
//   // DISABLE CURRENT
//   // =====================================================

//   async disableCurrent(
//     tx: any,
//     id: number
//   ) {

//     return tx.studentAcademicRecord.update({

//       where: { id },

//       data: {

//         isCurrent: false,

//         status: "PROMOTED",
//       },
//     });
//   }

//   // =====================================================
// // COMPLETE
// // =====================================================

// async completeStudent(
//   recordId: number,
//   schoolId: number
// ) {

//   return prisma
//     .studentAcademicRecord
//     .update({

//       where: {
//         id: recordId,
//         schoolId,
//       },

//       data: {

//         status:
//           "COMPLETED",

//         isCurrent:
//           false,
//       },
//     });
// }

// // =====================================================
// // DROP
// // =====================================================

// async dropStudent(
//   recordId: number,
//   schoolId: number
// ) {

//   return prisma
//     .studentAcademicRecord
//     .update({

//       where: {
//         id: recordId,
//         schoolId,
//       },

//       data: {

//         status:
//           "DROPPED",

//         isCurrent:
//           false,
//       },
//     });
// }

// // =====================================================
// // TRANSFER
// // =====================================================

// async transferStudent(
//   recordId: number,
//   schoolId: number
// ) {

//   return prisma
//     .studentAcademicRecord
//     .update({

//       where: {
//         id: recordId,
//         schoolId,
//       },

//       data: {

//         status:
//           "TRANSFERRED",

//         isCurrent:
//           false,
//       },
//     });
// }
// }

// export default new StudentAcademicRecordRepository();


import prisma
from "../../config/prisma.js";

export class StudentAcademicRecordRepository {

  // =====================================================
  // CREATE
  // =====================================================

  async create(
    tx: any,
    data: any
  ) {

    return tx
      .studentAcademicRecord
      .create({
        data,
      });
  }

  // =====================================================
  // CURRENT RECORD
  // =====================================================

  async getCurrentRecord(
    studentId: number
  ) {

    return prisma
      .studentAcademicRecord
      .findFirst({

        where: {

          studentId,

          isCurrent: true,
        },

        include: {

          class: true,

          section: true,

          academicYear: true,
        },
      });
  }

  // =====================================================
  // HISTORY
  // =====================================================

  async getHistory(
    studentId: number
  ) {

    return prisma
      .studentAcademicRecord
      .findMany({

        where: {
          studentId,
        },

        include: {

          class: true,

          section: true,

          academicYear: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });
  }

  // =====================================================
  // DISABLE CURRENT
  // =====================================================

  async disableCurrent(
    tx: any,
    id: number
  ) {

    return tx
      .studentAcademicRecord
      .update({

        where: { id },

        data: {

          isCurrent: false,

          status: "PROMOTED",
        },
      });
  }

  // =====================================================
  // GENERATE ROLL COUNT
  // =====================================================

  async countCurrentStudents(

    schoolId: number,

    academicYearId: number,

    classId: number,

    sectionId?: number
  ) {

    return prisma
      .studentAcademicRecord
      .count({

        where: {

          schoolId,

          academicYearId,

          classId,

          sectionId,

          isCurrent: true,
        },
      });
  }

  // =====================================================
  // GET PROMOTION STUDENTS
  // =====================================================

  async getPromotionStudents(

    academicYearId: number,

    classId: number,

    sectionId: number | undefined,

    schoolId: number
  ) {

    return prisma
      .studentAcademicRecord
      .findMany({

        where: {

          academicYearId,

          classId,

          ...(sectionId
            ? { sectionId }
            : {}),

          isCurrent: true,

          student: {
            schoolId,
          },
        },

        include: {

          student: true,

          class: true,

          section: true,

          academicYear: true,
        },

        orderBy: {

          rollNumber: "asc",
        },
      });
  }

  // =====================================================
  // GET ALL RECORDS
  // =====================================================

  async getAllRecords(
    schoolId: number
  ) {

    return prisma
      .studentAcademicRecord
      .findMany({

        where: {
          schoolId,
        },

        include: {

          student: true,

          class: true,

          section: true,

          academicYear: true,

          promotedFrom: {

            include: {

              class: true,

              section: true,

              academicYear: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });
  }

  // =====================================================
  // COMPLETE
  // =====================================================

  async completeStudent(
    recordId: number,
    schoolId: number
  ) {

    return prisma.studentAcademicRecord.update({
        where: {
          id: recordId,
          schoolId,
        },
        data: {
          status:"COMPLETED",
          isCurrent: false,
        },
      });
  }

  // =====================================================
  // DROP
  // =====================================================

  async dropStudent(
    recordId: number,
    schoolId: number
  ) {

    return prisma
      .studentAcademicRecord
      .update({

        where: {

          id: recordId,

          schoolId,
        },

        data: {

          status:
            "DROPPED",

          isCurrent:
            false,
        },
      });
  }

  // =====================================================
  // TRANSFER
  // =====================================================

  async transferStudent(
    recordId: number,
    schoolId: number
  ) {

    return prisma
      .studentAcademicRecord
      .update({

        where: {

          id: recordId,

          schoolId,
        },

        data: {

          status:
            "TRANSFERRED",

          isCurrent:
            false,
        },
      });
  }
}

export default
new StudentAcademicRecordRepository();