// import prisma from "../../config/prisma.js";
// import AdmissionRepository from "./admission.repository.js";
// import { StudentService } from "../student/student.service.js";
// export class AdmissionService {
//   private repo = new AdmissionRepository();
// private studentService = new StudentService();
//   // =============================
//   // ✅ APPLY ADMISSION
//   // =============================
//   async applyAdmission(payload: any, schoolId: number) {
//     return this.repo.create({
//       school: { connect: { id: schoolId } },

//       studentName: payload.studentName,
//       dob: payload.dob ? new Date(payload.dob) : null,
//       gender: payload.gender,
//       address: payload.address,

//       class: { connect: { id: payload.classId } },
//       section: payload.sectionId
//         ? { connect: { id: payload.sectionId } }
//         : undefined,

//       academicYear: { connect: { id: payload.academicYearId } },

//       status: "PENDING",
//     });
//   }

//   // =============================
//   // 🔢 student code
//   // =============================
//   private async generateStudentCode(tx: any, schoolId: number) {
//     const count = await tx.student.count({
//       where: { schoolId },
//     });

//     return `STU-${String(count + 1).padStart(5, "0")}`;
//   }

//   // =============================
//   // 🔢 roll generator
//   // =============================
//   private async generateRollNumber(
//     tx: any,
//     schoolId: number,
//     academicYearId: number,
//     classId: number,
//     sectionId?: number | null
//   ) {
//     const count = await tx.admission.count({
//       where: {
//         schoolId,
//         academicYearId,
//         classId,
//         sectionId: sectionId ?? null,
//         status: "ACTIVE",
//       },
//     });

//     return count + 1;
//   }

//   // =============================
//   // 🔢 admission number
//   // =============================
//   private async generateAdmissionNo(tx: any, schoolId: number) {
//     const year = new Date().getFullYear();

//     const count = await tx.admission.count({
//       where: { schoolId },
//     });

//     return `ADM-${year}-${String(count + 1).padStart(4, "0")}`;
//   }

//   // =============================
//   // ✅ APPROVE ADMISSION
//   // =============================
//   // async approveAdmission(admissionId: number, schoolId: number) {
//   //   return prisma.$transaction(async (tx) => {
//   //     const admission = await tx.admission.findFirst({
//   //       where: { id: admissionId, schoolId },
//   //     });

//   //     if (!admission) throw new Error("Admission not found");
//   //     if (admission.status !== "PENDING")
//   //       throw new Error("Already processed");

//   //     // 🔥 generate student code
//   //     const studentCode = await this.generateStudentCode(tx, schoolId);

//   //     // 🔥 CREATE STUDENT
//   //     const student = await tx.student.create({
//   //       data: {
//   //         name: admission.studentName,
//   //         schoolId,
//   //         studentCode,
//   //         dob: admission.dob,
//   //         gender: admission.gender,
//   //         address: admission.address,
//   //       },
//   //     });

//   //     // 🔥 generate numbers
//   //     const rollNumber = await this.generateRollNumber(
//   //       tx,
//   //       schoolId,
//   //       admission.academicYearId,
//   //       admission.classId,
//   //       admission.sectionId
//   //     );

//   //     const admissionNo = await this.generateAdmissionNo(tx, schoolId);

//   //     // 🔥 update admission
//   //     await tx.admission.update({
//   //       where: { id: admissionId },
//   //       data: {
//   //         studentId: student.id,
//   //         rollNumber,
//   //         admissionNo,
//   //         status: "ACTIVE",
//   //       },
//   //     });

//   //     return {
//   //       message: "Admission approved successfully",
//   //       studentId: student.id,
//   //     };
//   //   });
//   // }

//   async approveAdmission(admissionId: number, schoolId: number) {
//     return prisma.$transaction(async (tx) => {
//       /* ============================= */
//       /* 1️⃣ FETCH ADMISSION (SECURE) */
//       /* ============================= */
//       const admission = await tx.admission.findFirst({
//         where: { id: admissionId, schoolId },
//       });

//       if (!admission) {
//         throw new Error("Admission not found");
//       }

//       if (admission.status !== "PENDING") {
//         throw new Error("Admission already processed");
//       }

//       /* ============================= */
//       /* 2️⃣ ACADEMIC YEAR CHECK */
//       /* ============================= */
//       const academicYear = await tx.academicYear.findUnique({
//         where: { id: admission.academicYearId },
//       });

//       if (!academicYear?.isActive) {
//         throw new Error("Academic year is not active");
//       }

//       /* ============================= */
//       /* 3️⃣ SECTION CAPACITY CHECK */
//       /* ============================= */
//       if (admission.sectionId) {
//         const section = await tx.section.findUnique({
//           where: { id: admission.sectionId },
//         });

//         if (!section) {
//           throw new Error("Section not found");
//         }

//         const activeStrength = await tx.admission.count({
//           where: {
//             schoolId,
//             classId: admission.classId,
//             sectionId: admission.sectionId,
//             academicYearId: admission.academicYearId,
//             status: "ACTIVE",
//           },
//         });

//         if (activeStrength >= section.capacity) {
//           throw new Error("Section is full");
//         }
//       }

//       /* ============================= */
//       /* 4️⃣ DUPLICATE ADMISSION GUARD */
//       /* ============================= */
//       const duplicate = await tx.admission.findFirst({
//         where: {
//           schoolId,
//           academicYearId: admission.academicYearId,
//           classId: admission.classId,
//           sectionId: admission.sectionId,
//           studentName: admission.studentName,
//           status: "ACTIVE",
//         },
//       });

//       if (duplicate) {
//         throw new Error("Student already admitted in this class");
//       }

//       /* ============================= */
//       /* 5️⃣ CREATE STUDENT (CLEAN) */
//       /* ============================= */
//       const student = await this.studentService.createFromAdmission(
//         tx,
//         admission,
//         schoolId
//       );

//       /* ============================= */
//       /* 6️⃣ GENERATE ROLL */
//       /* ============================= */
//       const rollNumber = await this.generateRollNumber(
//         tx,
//         schoolId,
//         admission.academicYearId,
//         admission.classId,
//         admission.sectionId
//       );

//       /* ============================= */
//       /* 7️⃣ GENERATE ADMISSION NO */
//       /* ============================= */
//       const admissionNo = await this.generateAdmissionNo(tx, schoolId);

//       /* ============================= */
//       /* 8️⃣ UPDATE ADMISSION */
//       /* ============================= */
//       await tx.admission.update({
//         where: { id: admissionId },
//         data: {
//           studentId: student.id,
//           rollNumber,
//           admissionNo,
//           status: "ACTIVE",
//         },
//       });

//       /* ============================= */
//       /* ✅ FINAL RESPONSE */
//       /* ============================= */
//       return {
//         message: "Admission approved successfully",
//         studentId: student.id,
//       };
//     });
//   }

//   // =============================
//   // ❌ REJECT
//   // =============================
//   async rejectAdmission(admissionId: number, schoolId: number) {
//     const admission = await this.repo.findById(admissionId, schoolId);

//     if (!admission) throw new Error("Admission not found");

//     return this.repo.update(admissionId, {
//       status: "CANCELLED",
//     });
//   }

//   // =============================
// // ✏️ UPDATE ADMISSION
// // =============================
// async updateAdmission(
//   admissionId: number,
//   schoolId: number,
//   payload: any
// ) {
//   const admission = await this.repo.findById(admissionId, schoolId);

//   if (!admission) {
//     throw new Error("Admission not found");
//   }

//   // 🔒 real-world rule
//   if (admission.status !== "PENDING") {
//     throw new Error("Only pending admission can be edited");
//   }

//   // ✅ optional validations
//   if (payload.academicYearId) {
//     const year = await prisma.academicYear.findUnique({
//       where: { id: payload.academicYearId },
//     });

//     if (!year?.isActive) {
//       throw new Error("Academic year is not active");
//     }
//   }

//   return this.repo.update(admissionId, {
//     studentName: payload.studentName,
//     dob: payload.dob ? new Date(payload.dob) : null,
//     gender: payload.gender,
//     address: payload.address,

//     classId: payload.classId,
//     sectionId: payload.sectionId ?? null,
//     academicYearId: payload.academicYearId,
//   });
// }
//   // =============================
//   // 📋 LIST
//   // =============================
//   async getAdmissions(schoolId: number) {
//     return this.repo.findAll(schoolId);
//   }
//   // =============================
// // 🔍 GET BY ID
// // =============================
// async getAdmissionById(admissionId: number, schoolId: number) {
//   const admission = await this.repo.findById(admissionId, schoolId);

//   if (!admission) {
//     throw new Error("Admission not found");
//   }

//   return admission;
// }
// }


// export default new AdmissionService();


import prisma from "../../config/prisma.js";

import StudentAcademicRecordRepository
from "../student/student-academic-record.repository.js";

import {AdmissionRepository}
from "./admission.repository.js";

import { StudentService }
from "../student/student.service.js";

export class AdmissionService {

  private repo =
    new AdmissionRepository();

  private academicRepo =
  StudentAcademicRecordRepository;

  private studentService =
    new StudentService();

  // =====================================================
  // APPLY ADMISSION
  // =====================================================

  // async applyAdmission(
  //   payload: any,
  //   schoolId: number
  // ) {

  //   return this.repo.create({

  //     school: {
  //       connect: {
  //         id: schoolId,
  //       },
  //     },

  //     studentName:
  //       payload.studentName,

  //     dob: payload.dob
  //       ? new Date(payload.dob)
  //       : null,

  //     gender:
  //       payload.gender,

  //     address:
  //       payload.address,

  //     class: {
  //       connect: {
  //         id: payload.classId,
  //       },
  //     },

  //     section:
  //       payload.sectionId
  //         ? {
  //             connect: {
  //               id:
  //                 payload.sectionId,
  //             },
  //           }
  //         : undefined,

  //     academicYear: {
  //       connect: {
  //         id:
  //           payload.academicYearId,
  //       },
  //     },

  //     status: "PENDING",
  //   });
  // }
  async applyAdmission(
  payload: any,
  schoolId: number
) {

  return this.repo.create({

    // =================================
    // School
    // =================================

    school: {
      connect: {
        id: schoolId,
      },
    },

    // =================================
    // Personal
    // =================================

    studentName:
      payload.studentName,

    dob:
      payload.dob
        ? new Date(payload.dob)
        : null,

    gender:
      payload.gender,

    // =================================
    // Contact
    // =================================

    address:
      payload.address,

    phoneNumber:
      payload.phoneNumber,

    email:
      payload.email,

    // =================================
    // Academic
    // =================================

    class: {
      connect: {
        id: payload.classId,
      },
    },

    section:
      payload.sectionId
        ? {
            connect: {
              id:
                payload.sectionId,
            },
          }
        : undefined,

    academicYear: {
      connect: {
        id:
          payload.academicYearId,
      },
    },

    admissionType:
      payload.admissionType,

    previousSchool:
      payload.previousSchool,


    previousClass:
      payload.previousClass,

    previousPercentage:
      payload.previousPercentage
        ? Number(
            payload.previousPercentage
          )
        : null,
    bloodGroup:
  payload.bloodGroup,

nationality:
  payload.nationality,

religion:
  payload.religion,

caste:
  payload.caste,

aadharNumber:
  payload.aadharNumber,

fatherName:
  payload.fatherName,

fatherPhone:
  payload.fatherPhone,

fatherEmail:
  payload.fatherEmail,

fatherOccupation:
  payload.fatherOccupation,

motherName:
  payload.motherName,

motherPhone:
  payload.motherPhone,

motherEmail:
  payload.motherEmail,

motherOccupation:
  payload.motherOccupation,

guardianName:
  payload.guardianName,

guardianRelation:
  payload.guardianRelation,

guardianPhone:
  payload.guardianPhone,

guardianEmail:
  payload.guardianEmail,
    // =================================
    // Status
    // =================================

    status:
      "PENDING",
  });
}

  // =====================================================
  // GENERATE ROLL NUMBER
  // =====================================================

  private async generateRollNumber(
    tx: any,
    schoolId: number,
    academicYearId: number,
    classId: number,
    sectionId?: number
  ) {

    const count =
      await tx.studentAcademicRecord.count({

        where: {

          schoolId,

          academicYearId,

          classId,

          sectionId,

          isCurrent: true,
        },
      });

    return count + 1;
  }

  // =====================================================
  // GENERATE ADMISSION NUMBER
  // =====================================================

  private async generateAdmissionNo(
    tx: any,
    schoolId: number
  ) {

    const count =
      await tx.admission.count({

        where: {
          schoolId,
        },
      });

    const year =
      new Date().getFullYear();

    return `ADM-${year}-${String(
      count + 1
    ).padStart(4, "0")}`;
  }

  // =====================================================
  // APPROVE ADMISSION
  // =====================================================

  async approveAdmission(
    admissionId: number,
    schoolId: number
  ) {

    return prisma.$transaction(
      async (tx) => {

        // 1️⃣ FIND ADMISSION

        const admission =
          await tx.admission.findFirst({

            where: {

              id: admissionId,

              schoolId,
            },
          });

        if (!admission) {
          throw new Error(
            "Admission not found"
          );
        }

        if (
          admission.status !==
          "PENDING"
        ) {
          throw new Error(
            "Already processed"
          );
        }

        // 2️⃣ CREATE STUDENT

        const student =
          await this.studentService
            .createFromAdmission(
              tx,
              admission,
              schoolId
            );

        // 3️⃣ GENERATE ROLL NUMBER

        const rollNumber =
          await this.generateRollNumber(

            tx,

            schoolId,

            admission.academicYearId,

            admission.classId,

            admission.sectionId ||
              undefined
          );

        // 4️⃣ GENERATE ADMISSION NUMBER

        const admissionNo =
          await this.generateAdmissionNo(
            tx,
            schoolId
          );

        // 5️⃣ CREATE ACADEMIC RECORD

        await this.academicRepo.create(

          tx,

          {

            schoolId,

            studentId:
              student.id,

            academicYearId:
              admission.academicYearId,

            classId:
              admission.classId,

            sectionId:
              admission.sectionId,

            rollNumber,

            admissionNo,

            isCurrent: true,

            status: "ACTIVE",
          }
        );

        // 6️⃣ UPDATE ADMISSION

        await tx.admission.update({

          where: {
            id: admission.id,
          },

          data: {

            studentId:
              student.id,

            rollNumber,

            admissionNo,

            status: "ACTIVE",
          },
        });

        return {

          message:
            "Admission approved successfully",

          studentId:
            student.id,
        };
      }
    );
  }

  // =====================================================
  // LIST
  // =====================================================

  async getAdmissions(
    schoolId: number
  ) {

    return this.repo.findAll(
      schoolId
    );
  }

  // =====================================================
  // SINGLE
  // =====================================================

  async getAdmissionById(
    id: number,
    schoolId: number
  ) {

    const admission =
      await this.repo.findById(
        id,
        schoolId
      );

    if (!admission) {
      throw new Error(
        "Admission not found"
      );
    }

    return admission;
  }


// =====================================================
// UPDATE
// =====================================================

async updateAdmission(
  id: number,
  schoolId: number,
  payload: any
) {

  const admission =
    await this.repo.findById(
      id,
      schoolId
    );

  if (!admission) {
    throw new Error(
      "Admission not found"
    );
  }

  return this.repo.update(
    id,
    payload
  );
}


// =====================================================
// REJECT
// =====================================================

async rejectAdmission(
  id: number,
  schoolId: number
) {

  const admission =
    await this.repo.findById(
      id,
      schoolId
    );

  if (!admission) {
    throw new Error(
      "Admission not found"
    );
  }

  return this.repo.update(
    id,
    {
      status: "CANCELLED",
    }
  );
}



}

export default AdmissionService;