// // import prisma from "../../config/prisma.js";

// // export class StudentRepository {
// //   async create(tx: any, data: any) {
// //     return tx.student.create({ data });
// //   }

// //   async findAll(schoolId: number) {
// //     return prisma.student.findMany({
// //       where: { schoolId, isDeleted: false },
// //       orderBy: { createdAt: "desc" },
// //     });
// //   }

// //   async findById(id: number, schoolId: number) {
// //     return prisma.student.findFirst({
// //       where: { id, schoolId, isDeleted: false },
// //     });
// //   }
// //    async findByUserId(userId: number) {
// //     return prisma.student.findFirst({
// //       where: { userId, isDeleted: false },
// //     });
// //   }

// //   async update(id: number, data: any) {
// //     return prisma.student.update({
// //       where: { id },
// //       data,
// //     });
// //   }

// //   async updateStatus(id: number, isActive: boolean) {
// //   return prisma.student.update({
// //     where: { id },
// //     data: { isActive },
// //   });
// // }
// //   async softDelete(id: number) {
// //     return prisma.student.update({
// //       where: { id },
// //       data: { isDeleted: true },
// //     });
// //   }
// // }

// import prisma from "../../config/prisma.js";

// export class StudentRepository {

//   async create(tx: any, data: any) {

//     return tx.student.create({
//       data,
//     });
//   }

//   async findById(id: number, schoolId: number) {

//     return prisma.student.findFirst({

//       where: {
//         id,
//         schoolId,
//         isDeleted: false,
//       },
//     });
//   }

//   async findAll(schoolId: number) {

//     return prisma.student.findMany({

//       where: {
//         schoolId,
//         isDeleted: false,
//       },

//       orderBy: {
//         createdAt: "desc",
//       },
//     });
//   }

//   async update(id: number, data: any) {

//     return prisma.student.update({

//       where: { id },

//       data,
//     });
//   }
// }

import prisma from "../../config/prisma.js";

export class StudentRepository {

  async create(tx: any, data: any) {

    return tx.student.create({
      data,
    });
  }

async findById(
  id: number,
  schoolId: number
) {

  return prisma.student.findFirst({

    where: {
      id,
      schoolId,
      isDeleted: false,
    },

    include: {

      school: true,

      academicRecords: {

        where: {
          isCurrent: true,
        },

        include: {

          class: true,

          section: true,

          academicYear: true,

        },
      },

      parents: {

        include: {

          parent: true,

        },
      },
    },
  });
} 

  // async findAll(schoolId: number) {

  //   return prisma.student.findMany({

  //     where: {
  //       schoolId,
  //       isDeleted: false,
  //     },

  //     orderBy: {
  //       createdAt: "desc",
  //     },
  //   });
  // }

  async findAll(schoolId: number) {

  return prisma.student.findMany({

    where: {
      schoolId,
      isDeleted: false,
    },

    include: {

      academicRecords: {

        where: {
          isCurrent: true,
        },

        include: {
          class: true,
          section: true,
          academicYear: true,
        },
      },

      parents: {
        include: {
          parent: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}

  async update(
    id: number,
    data: any
  ) {

    return prisma.student.update({

      where: { id },

      data,
    });
  }

  async updateStatus(
    id: number,
    isActive: boolean
  ) {

    return prisma.student.update({

      where: { id },

      data: {
        isActive,
      },
    });
  }

  async softDelete(id: number) {

    return prisma.student.update({

      where: { id },

      data: {
        isDeleted: true,
      },
    });
  }

  async findByUserId(userId: number) {

    return prisma.student.findFirst({

      where: {
        userId,
        isDeleted: false,
      },
    });
  }
}