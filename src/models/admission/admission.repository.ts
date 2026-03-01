// import prisma from "../../config/prisma.js";

// export class AdmissionRepository {
//   async create(data: any) {
//     return prisma.admission.create({ data });
//   }

//   async findActive(studentId: number, academicYearId: number) {
//   return prisma.admission.findFirst({
//     where: {
//       studentId,
//       academicYearId, // ✅ FIXED
//       status: "ACTIVE",
//     },
//   });
// }
// async findAllBySchool(schoolId: number) {
//   return prisma.admission.findMany({
//     where: { schoolId },
//     include: {
//       student: true,
//       class: true,
//       section: true,
//       academicYear: true,
//     },
//     orderBy: { createdAt: "desc" },
//   });
// }

// async getLastRollNumber(classId: number, academicYearId: number) {
//   return prisma.admission.findFirst({
//     where: {
//       classId,
//       academicYearId, // ✅ FIXED
//     },
//     orderBy: { rollNumber: "desc" },
//     select: { rollNumber: true },
//   });
// }
// async getActiveAcademicYear(schoolId: number) {
//   return prisma.academicYear.findFirst({
//     where: { schoolId, isActive: true },
//     select: { id: true },
//   });
// }
//   async findByStudent(studentId: number) {
//     return prisma.admission.findMany({
//       where: { studentId },
//       include: {
//     student: true,
//     class: true,
//     section: true,
//     academicYear: true,
//   },
//       orderBy: { createdAt: "desc" },
//     });
//   }
// }

import prisma from "../../config/prisma.js";

export default class AdmissionRepository {
  // ✅ create
  async create(data: any) {
    return prisma.admission.create({ data });
  }

  // ✅ find by id (SECURE)
  async findById(id: number, schoolId: number) {
    return prisma.admission.findFirst({
      where: { id, schoolId },
    });
  }

  // ✅ update
  async update(id: number, data: any) {
    return prisma.admission.update({
      where: { id },
      data,
    });
  }

  // ✅ list
  async findAll(schoolId: number) {
    return prisma.admission.findMany({
      where: { schoolId },
      orderBy: { createdAt: "desc" },
      include: {
        student: true,
        class: true,
        section: true,
        academicYear: true,
      },
    });
  }
}