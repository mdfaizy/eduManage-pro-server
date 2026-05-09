// // import prisma from "../../config/prisma.js";
// // export default class AdmissionRepository {
// //   // ✅ create
// //   async create(data: any) {
// //     return prisma.admission.create({ data });
// //   }

// //   // ✅ find by id (SECURE)
// //   async findById(id: number, schoolId: number) {
// //     return prisma.admission.findFirst({
// //       where: { id, schoolId },
// //     });
// //   }

// //   // ✅ update
// //   async update(id: number, data: any) {
// //     return prisma.admission.update({
// //       where: { id },
// //       data,
// //     });
// //   }

// //   // ✅ list
// //   async findAll(schoolId: number) {
// //     return prisma.admission.findMany({
// //       where: { schoolId },
// //       orderBy: { createdAt: "desc" },
// //       include: {
// //         student: true,
// //         class: true,
// //         section: true,
// //         academicYear: true,
// //       },
// //     });
// //   }
// // }

// import prisma from "../../config/prisma.js";

// export default class AdmissionRepository {

//   async create(data: any) {
//     return prisma.admission.create({ data });
//   }

//   async findById(id: number, schoolId: number) {
//     return prisma.admission.findFirst({
//       where: {
//         id,
//         schoolId,
//       },
//       include: {
//         class: true,
//         section: true,
//         academicYear: true,
//         student: true,
//       },
//     });
//   }

//   async update(id: number, data: any) {
//     return prisma.admission.update({
//       where: { id },
//       data,
//     });
//   }

//   async findAll(schoolId: number) {
//     return prisma.admission.findMany({
//       where: { schoolId },
//       include: {
//         class: true,
//         section: true,
//         academicYear: true,
//         student: true,
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });
//   }
// }

import prisma from "../../config/prisma.js";

export class AdmissionRepository {

  async create(data: any) {
    return prisma.admission.create({ data });
  }

  async findById(id: number, schoolId: number) {

    return prisma.admission.findFirst({

      where: {
        id,
        schoolId,
      },

      include: {
        student: true,
        class: true,
        section: true,
        academicYear: true,
      },
    });
  }

  async findAll(schoolId: number) {

    return prisma.admission.findMany({

      where: {
        schoolId,
      },

      include: {
        student: true,
        class: true,
        section: true,
        academicYear: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async update(id: number, data: any) {

    return prisma.admission.update({
      where: { id },
      data,
    });
  }
}