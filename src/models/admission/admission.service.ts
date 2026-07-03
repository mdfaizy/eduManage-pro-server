import prisma from "../../config/prisma.js";
import studentFeeService
from "../studentFee/studentFee.service.js";
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
private studentFeeService =
  studentFeeService;
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

        ///////////////////////////////////////////////////
// 6️⃣ FIND FEE STRUCTURE
///////////////////////////////////////////////////

// const feeStructure =await tx.feeStructure.findFirst({

//     where: {

//       schoolId,

//       classId:
//         admission.classId,

//       academicYearId:
//         admission.academicYearId,

//       isActive: true,
//     },
//   });
//   console.log("========== ADMISSION ==========");
// console.log(admission);

// console.log("========== STUDENT ==========");
// console.log(student);

// console.log("========== FEE STRUCTURE ==========");
// console.log(feeStructure);
// console.log("FEE STRUCTURE", feeStructure);
// ///////////////////////////////////////////////////
// // 7️⃣ GENERATE BASIC FEE
// ///////////////////////////////////////////////////

// // if (feeStructure) {

// //   await tx.studentFee.create({

// //     data: {

// //       schoolId,

// //       studentId:
// //         student.id,

// //       feeStructureId:
// //         feeStructure.id,

// //       month:
// //         new Date().getMonth() + 1,

// //       year:
// //         new Date().getFullYear(),

// //       totalAmount:
// //         Number(
// //           feeStructure.totalFee
// //         ),

// //       paidAmount: 0,

// //       dueAmount:
// //         Number(
// //           feeStructure.totalFee
// //         ),

// //       lateFee: 0,

// //       discount: 0,

// //       isAdmissionFee: false,

// //       status: "PENDING",

// //       dueDate: new Date(),
// //     },
// //   });
// // }
// if (feeStructure) {
// console.log("Calling Fee Generation...");
//   await this.studentFeeService.generateWithTransaction(tx,
//       {schoolId,
//       studentId:student.id,
//         feeStructureId:feeStructure.id,
//         month:new Date().getMonth() + 1,
//         year:new Date().getFullYear(),
//         dueDate:new Date(),
//       }
//     );
// }

const feeStructure = await tx.feeStructure.findFirst({
  where: {
    schoolId,
    classId: admission.classId,
    academicYearId: admission.academicYearId,
    isActive: true,
  },
});

console.log("========== ADMISSION ==========");
console.log(admission);

console.log("========== STUDENT ==========");
console.log(student);

console.log("========== FEE STRUCTURE ==========");
console.log(feeStructure);

// ✅ Validation
if (!feeStructure) {
  throw new Error(
    `Fee Structure not found for Class ${admission.classId} and Academic Year ${admission.academicYearId}. Please create Fee Structure first.`
  );
}

console.log("Calling Fee Generation...");

await this.studentFeeService.generateWithTransaction(tx, {
  schoolId,
  studentId: student.id,
  feeStructureId: feeStructure.id,
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  dueDate: new Date(),
});
        // 6️⃣ UPDATE ADMISSION
        await tx.admission.update({where: {id: admission.id,},
          data: {
            studentId:student.id,
            rollNumber,
            admissionNo,
            status: "ACTIVE",
          },
        });
        return {
          message:"Admission approved successfully",
          studentId:student.id,
        };
      }
    );
  }

  // =====================================================
  // LIST
  // =====================================================

  // async getAdmissions(
  //   schoolId: number
  // ) {

  //   return this.repo.findAll(
  //     schoolId
  //   );
  // }
  async getAdmissions(
  schoolId: number,
  classId?: number,
  sectionId?: number,
  academicYearId?: number,
  status?: string
) {

  return this.repo.findAll(
    schoolId,
    classId,
    sectionId,
    academicYearId,
    status
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

  schoolId,

  // {
  //   status: "CANCELLED",
  // }
    payload
);
}



async getReports(
  schoolId: number,
  classId?: number,
  sectionId?: number,
  academicYearId?: number,
  startDate?: string,
  endDate?: string
) {

  const data = await this.repo.reports(
    schoolId,
    classId,
    sectionId,
    academicYearId,
    startDate,
    endDate
  );

  return data.map((item: any) => ({
    id: item.id,
    admissionNo: item.admissionNo,
    studentName: item.student?.name,
    fatherName: item.fatherName,
    className: item.class?.name,
    sectionName: item.section?.name,
    academicYear: item.academicYear?.name,
    gender: item.student?.gender,
    phone: item.student?.phoneNumber,
    email: item.student?.email,
    status: item.status,
    createdAt: item.createdAt,
  }));
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
    schoolId,
    {
      status: "CANCELLED",
    }
  );
}



}

export default AdmissionService;