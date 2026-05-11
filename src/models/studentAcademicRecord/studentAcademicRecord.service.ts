// import prisma from "../../config/prisma.js";

// import StudentAcademicRecordRepository
// from "./studentAcademicRecord.repository.js";

// export class StudentAcademicRecordService {

//   private repo =
//     StudentAcademicRecordRepository;

//   // =====================================================
//   // GET CURRENT
//   // =====================================================

//   async getCurrentRecord(
//     studentId: number
//   ) {

//     const record =
//       await this.repo.getCurrentRecord(
//         studentId
//       );

//     if (!record) {
//       throw new Error(
//         "Academic record not found"
//       );
//     }

//     return record;
//   }

//   // =====================================================
//   // HISTORY
//   // =====================================================

//   async getHistory(
//     studentId: number
//   ) {

//     return this.repo.getHistory(
//       studentId
//     );
//   }

//   // =====================================================
//   // GENERATE ROLL
//   // =====================================================

//   private async generateRollNumber(
//     schoolId: number,
//     academicYearId: number,
//     classId: number,
//     sectionId?: number
//   ) {

//     const count =
//       await prisma.studentAcademicRecord.count({

//         where: {

//           schoolId,

//           academicYearId,

//           classId,

//           sectionId,

//           isCurrent: true,
//         },
//       });

//     return count + 1;
//   }

//   // =====================================================
//   // PROMOTE STUDENT
//   // =====================================================

//   async promoteStudent(
//     payload: any,
//     schoolId: number
//   ) {

//     return prisma.$transaction(
//       async (tx) => {

//         // 1️⃣ FIND CURRENT

//         const current =
//           await this.repo.getCurrentRecord(
//             payload.studentId
//           );

//         if (!current) {
//           throw new Error(
//             "Current record not found"
//           );
//         }

//         // 2️⃣ DISABLE OLD

//         await this.repo.disableCurrent(
//           tx,
//           current.id
//         );

//         // 3️⃣ GENERATE NEW ROLL

//         const rollNumber =
//           await this.generateRollNumber(

//             schoolId,

//             payload.academicYearId,

//             payload.classId,

//             payload.sectionId
//           );

//         // 4️⃣ CREATE NEW RECORD

//         const record =
//           await this.repo.create(

//             tx,

//             {

//               schoolId,

//               studentId:
//                 payload.studentId,

//               academicYearId:
//                 payload.academicYearId,

//               classId:
//                 payload.classId,

//               sectionId:
//                 payload.sectionId,

//               rollNumber,

//               admissionNo:
//                 current.admissionNo,

//               isCurrent: true,

//               status: "ACTIVE",

//               promotedFromId:
//                 current.id,
//             }
//           );

//         return {

//           message:
//             "Student promoted successfully",

//           data: record,
//         };
//       }
//     );
//   }

// // =====================================================
// // GET STUDENTS FOR PROMOTION
// // =====================================================

// async getPromotionStudents(

//   academicYearId: number,

//   classId: number,

//   sectionId: number | undefined,

//   schoolId: number
// ) {

//   console.log({
//     academicYearId,
//     classId,
//     sectionId,
//     schoolId,
//   });

//   return prisma.studentAcademicRecord.findMany({

//     where: {

//       academicYearId,

//       classId,

//       ...(sectionId
//         ? { sectionId }
//         : {}),

//       isCurrent: true,

//       student: {
//         schoolId,
//       },
//     },

//     include: {

//       student: true,

//       class: true,

//       section: true,

//       academicYear: true,
//     },

//     orderBy: {

//       rollNumber: "asc",
//     },
//   });
// }

// // =====================================================
// // BULK PROMOTION
// // =====================================================

// async bulkPromoteStudents(
//   payload: any,
//   schoolId: number
// ) {

//   const {

//     studentIds,

//     academicYearId,

//     classId,

//     sectionId,

//   } = payload;

//   return prisma.$transaction(
//     async (tx) => {

//       for (const studentId of studentIds) {

//         // ============================================
//         // CURRENT RECORD
//         // ============================================

//         const current =
//           await tx.studentAcademicRecord.findFirst({

//             where: {

//               studentId,

//               isCurrent: true,

//               student: {
//                 schoolId,
//               },
//             },
//           });

//         if (!current) continue;

//         // ============================================
//         // CLOSE OLD RECORD
//         // ============================================

//         await tx.studentAcademicRecord.update({

//           where: {
//             id: current.id,
//           },

//           data: {

//             isCurrent: false,

//             status: "PROMOTED",
//           },
//         });

//         // ============================================
//         // GENERATE ROLL NUMBER
//         // ============================================

//         const rollCount =
//           await tx.studentAcademicRecord.count({

//             where: {

//               schoolId,

//               academicYearId,

//               classId,

//               sectionId,

//               isCurrent: true,
//             },
//           });

//         // ============================================
//         // CREATE NEW RECORD
//         // ============================================

//         await tx.studentAcademicRecord.create({

//           data: {

//             schoolId,

//             studentId,

//             academicYearId,

//             classId,

//             sectionId,

//             admissionNo:
//               current.admissionNo,

//             rollNumber:
//               rollCount + 1,

//             promotedFromId:
//               current.id,

//             isCurrent: true,

//             status: "ACTIVE",
//           },
//         });
//       }

//       return true;
//     }
//   );
// }

// async getAllRecords(
//   schoolId: number
// ) {

//   return prisma.studentAcademicRecord.findMany({

//     where: {
//       schoolId,
//     },

//     include: {

//   student: true,

//   class: true,

//   section: true,

//   academicYear: true,

//   promotedFrom: {

//     include: {

//       class: true,

//       section: true,

//       academicYear: true,
//     },
//   },
// }, 

//     orderBy: {
//       createdAt: "desc",
//     },
//   });
// }
// async revertPromotion(
//   recordId: number,
//   schoolId: number
// ) {

//   return prisma.$transaction(

//     async (tx) => {

//       /* =========================================
//          CURRENT RECORD
//       ========================================= */

//       const current =
//         await tx.studentAcademicRecord
//           .findFirst({

//             where: {

//               id: recordId,

//               schoolId,

//               isCurrent: true,
//             },
//           });

//       if (!current) {

//         throw new Error(
//           "Current record not found"
//         );
//       }

//       /* =========================================
//          OLD RECORD
//       ========================================= */

//       if (!current.promotedFromId) {

//         throw new Error(
//           "Previous academic record not found"
//         );
//       }

//       const oldRecord =
//         await tx.studentAcademicRecord
//           .findFirst({

//             where: {

//               id:
//                 current.promotedFromId,
//             },
//           });

//       if (!oldRecord) {

//         throw new Error(
//           "Old academic record missing"
//         );
//       }

//       /* =========================================
//          REVERT CURRENT
//       ========================================= */

//       await tx.studentAcademicRecord
//         .update({

//           where: {
//             id: current.id,
//           },

//           data: {

//             isCurrent: false,

//             status: "REVERTED",
//           },
//         });

//       /* =========================================
//          RESTORE OLD
//       ========================================= */

//       await tx.studentAcademicRecord
//         .update({

//           where: {
//             id: oldRecord.id,
//           },

//           data: {

//             isCurrent: true,

//             status: "ACTIVE",
//           },
//         });

//       return {

//         revertedRecord:
//           current.id,

//         restoredRecord:
//           oldRecord.id,
//       };
//     }
//   );
// }

// // =====================================================
// // COMPLETE STUDENT
// // =====================================================

// async completeStudent(
//   recordId: number,
//   schoolId: number
// ) {

//   return this.repo
//     .completeStudent(
//       recordId,
//       schoolId
//     );
// }

// // =====================================================
// // DROP STUDENT
// // =====================================================

// async dropStudent(
//   recordId: number,
//   schoolId: number
// ) {

//   return this.repo
//     .dropStudent(
//       recordId,
//       schoolId
//     );
// }

// // =====================================================
// // TRANSFER STUDENT
// // =====================================================

// async transferStudent(
//   recordId: number,
//   schoolId: number
// ) {

//   return this.repo
//     .transferStudent(
//       recordId,
//       schoolId
//     );
// }
// }

// export default new StudentAcademicRecordService();

import prisma
from "../../config/prisma.js";

import StudentAcademicRecordRepository
from "./studentAcademicRecord.repository.js";

export class StudentAcademicRecordService {

  private repo =
    StudentAcademicRecordRepository;

  // =====================================================
  // GET CURRENT
  // =====================================================

  async getCurrentRecord(
    studentId: number
  ) {

    const record =
      await this.repo
        .getCurrentRecord(
          studentId
        );

    if (!record) {

      throw new Error(
        "Academic record not found"
      );
    }

    return record;
  }

  // =====================================================
  // HISTORY
  // =====================================================

  async getHistory(
    studentId: number
  ) {

    return this.repo
      .getHistory(
        studentId
      );
  }

  // =====================================================
  // GENERATE ROLL
  // =====================================================

  private async generateRollNumber(

    schoolId: number,

    academicYearId: number,

    classId: number,

    sectionId?: number
  ) {

    const count =
      await this.repo
        .countCurrentStudents(

          schoolId,

          academicYearId,

          classId,

          sectionId
        );

    return count + 1;
  }

  // =====================================================
  // PROMOTE STUDENT
  // =====================================================

  async promoteStudent(
    payload: any,
    schoolId: number
  ) {

    return prisma.$transaction(

      async (tx) => {

        // =========================================
        // CURRENT RECORD
        // =========================================

        const current =
          await this.repo
            .getCurrentRecord(
              payload.studentId
            );

        if (!current) {

          throw new Error(
            "Current record not found"
          );
        }

        // =========================================
        // DISABLE OLD RECORD
        // =========================================

        await this.repo
          .disableCurrent(
            tx,
            current.id
          );

        // =========================================
        // GENERATE ROLL
        // =========================================

        const rollNumber =
          await this
            .generateRollNumber(

              schoolId,

              payload.academicYearId,

              payload.classId,

              payload.sectionId
            );

        // =========================================
        // CREATE NEW RECORD
        // =========================================

        const record =
          await this.repo
            .create(

              tx,

              {

                schoolId,

                studentId:
                  payload.studentId,

                academicYearId:
                  payload.academicYearId,

                classId:
                  payload.classId,

                sectionId:
                  payload.sectionId,

                rollNumber,

                admissionNo:
                  current.admissionNo,

                isCurrent: true,

                status: "ACTIVE",

                promotedFromId:
                  current.id,
              }
            );

        return {

          message:
            "Student promoted successfully",

          data: record,
        };
      }
    );
  }

  // =====================================================
  // GET STUDENTS FOR PROMOTION
  // =====================================================

  async getPromotionStudents(

    academicYearId: number,

    classId: number,

    sectionId: number | undefined,

    schoolId: number
  ) {

    return this.repo
      .getPromotionStudents(

        academicYearId,

        classId,

        sectionId,

        schoolId
      );
  }

  // =====================================================
  // BULK PROMOTION
  // =====================================================

  async bulkPromoteStudents(
    payload: any,
    schoolId: number
  ) {

    const {studentIds,
      academicYearId,
      classId,
      sectionId,} = payload;
    return prisma.$transaction(
      async (tx) => {
        for (const studentId of studentIds) {
          // =========================================
          // CURRENT RECORD
          // =========================================
          const current =
            await tx
              .studentAcademicRecord
              .findFirst({
                where: {
                  studentId,
                  isCurrent: true,
                  student: {
                    schoolId,
                  },
                },
              });
          if (!current) {
            continue;
          }
          // =========================================
          // DISABLE OLD
          // =========================================
          await tx
            .studentAcademicRecord
            .update({
              where: {
                id: current.id,
              },
              data: {
                isCurrent: false,
                status: "PROMOTED",
              },
            });
          // =========================================
          // GENERATE ROLL
          // =========================================
          const rollCount =
            await this.repo
              .countCurrentStudents(
                schoolId,
                academicYearId,
                classId,
                sectionId
              );
          // =========================================
          // CREATE NEW RECORD
          // =========================================
          await tx
            .studentAcademicRecord
            .create({
              data: {
                schoolId,
                studentId,
                academicYearId,
                classId,
                sectionId,
                admissionNo:
                  current.admissionNo,
                rollNumber:
                  rollCount + 1,
                promotedFromId:
                  current.id,
                isCurrent: true,
                status: "ACTIVE",
              },
            });
        }

        return true;
      }
    );
  }

  // =====================================================
  // GET ALL RECORDS
  // =====================================================

  async getAllRecords(
    schoolId: number
  ) {

    return this.repo
      .getAllRecords(
        schoolId
      );
  }

  // =====================================================
  // REVERT PROMOTION
  // =====================================================

  async revertPromotion(
    recordId: number,
    schoolId: number
  ) {

    return prisma.$transaction(

      async (tx) => {

        // =========================================
        // CURRENT RECORD
        // =========================================

        const current =
          await tx
            .studentAcademicRecord
            .findFirst({

              where: {

                id: recordId,

                schoolId,

                isCurrent: true,
              },
            });

        if (!current) {

          throw new Error(
            "Current record not found"
          );
        }

        // =========================================
        // PREVIOUS RECORD
        // =========================================

        if (!current.promotedFromId) {

          throw new Error(
            "Previous academic record not found"
          );
        }

        const oldRecord =
          await tx
            .studentAcademicRecord
            .findFirst({

              where: {

                id:
                  current.promotedFromId,
              },
            });

        if (!oldRecord) {

          throw new Error(
            "Old academic record missing"
          );
        }

        // =========================================
        // REVERT CURRENT
        // =========================================

        await tx
          .studentAcademicRecord
          .update({

            where: {
              id: current.id,
            },

            data: {

              isCurrent: false,

              status: "REVERTED",
            },
          });

        // =========================================
        // RESTORE OLD
        // =========================================

        await tx
          .studentAcademicRecord
          .update({

            where: {
              id: oldRecord.id,
            },

            data: {

              isCurrent: true,

              status: "ACTIVE",
            },
          });

        return {

          revertedRecord:
            current.id,

          restoredRecord:
            oldRecord.id,
        };
      }
    );
  }

  // =====================================================
  // COMPLETE STUDENT
  // =====================================================

  async completeStudent(
    recordId: number,
    schoolId: number
  ) {

    return this.repo
      .completeStudent(
        recordId,
        schoolId
      );
  }

  // =====================================================
  // DROP STUDENT
  // =====================================================

  async dropStudent(
    recordId: number,
    schoolId: number
  ) {

    return this.repo
      .dropStudent(
        recordId,
        schoolId
      );
  }

  // =====================================================
  // TRANSFER STUDENT
  // =====================================================

  async transferStudent(
    recordId: number,
    schoolId: number
  ) {

    return this.repo
      .transferStudent(
        recordId,
        schoolId
      );
  }
}

export default
new StudentAcademicRecordService();