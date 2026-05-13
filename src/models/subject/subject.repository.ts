// // subject.repository.ts
// import prisma from "../../config/prisma";

// export class SubjectRepository {

// create(data: {
//   name: string;
//   code: string;
//   schoolId: number;
//   description?: string;
// }) {
//   return prisma.subject.create({
//     data
//   });
// }

//   existsByName(name: string, schoolId: number) {
//     return prisma.subject.findFirst({
//       where: { name, schoolId, isActive: true }
//     });
//   }

//   findAll() {
//     return prisma.subject.findMany({
//       where: { isActive: true },
//       orderBy: { name: "asc" }
//     });
//   }

//   findBySchool(schoolId: number) {
//     return prisma.subject.findMany({
//       where: { schoolId },
//       orderBy: { name: "asc" }
//     });
//   }

//  update(
//   id: number,
//   data: {
//     name?: string;
//     description?: string;
//   }
// ) {
//   return prisma.subject.update({
//     where: { id },
//     data,
//   });
// }
//  findById(id: number) {
//     return prisma.subject.findUnique({ where: { id } });
//   }
//   toggle(id: number, isActive: boolean) {
//     return prisma.subject.update({
//       where: { id },
//       data: { isActive }
//     });
//   }
// }


// import prisma from "../../config/prisma";

// export class SubjectRepository {

//   /* =========================================
//      CREATE
//   ========================================= */
//   create(data: {
//     name: string;
//     code: string;
//     schoolId: number;
//     description?: string;
//   }) {
//     return prisma.subject.create({
//       data,
//     });
//   }

//   /* =========================================
//      CHECK EXISTS
//   ========================================= */
//   existsByName(name: string, schoolId: number) {
//     return prisma.subject.findFirst({
//       where: {
//         schoolId,
//         isActive: true,
//         name: {
//           equals: name,
//           mode: "insensitive",
//         },
//       },
//     });
//   }

//   /* =========================================
//      GET ALL
//   ========================================= */
//   findAll() {
//     return prisma.subject.findMany({
//       where: {
//         isActive: true,
//       },
//       orderBy: {
//         name: "asc",
//       },
//     });
//   }

//   /* =========================================
//      GET BY SCHOOL
//   ========================================= */
//   findBySchool(schoolId: number) {
//     return prisma.subject.findMany({
//       where: {
//         schoolId,
//         isActive: true,
//       },
//       orderBy: {
//         name: "asc",
//       },
//     });
//   }

//   /* =========================================
//      GET BY ID
//   ========================================= */
//   findById(id: number) {
//     return prisma.subject.findUnique({
//       where: { id },
//     });
//   }

//   /* =========================================
//      UPDATE
//   ========================================= */
//   update(
//     id: number,
//     data: {
//       name?: string;
//       description?: string;
//     }
//   ) {
//     return prisma.subject.update({
//       where: { id },
//       data,
//     });
//   }

//   /* =========================================
//      TOGGLE ACTIVE
//   ========================================= */
//   toggle(id: number, isActive: boolean) {
//     return prisma.subject.update({
//       where: { id },
//       data: { isActive },
//     });
//   }
// }


import prisma from "../../config/prisma";

export class SubjectRepository {

  /* =========================================
     CREATE
  ========================================= */
  create(data: {
    name: string;
    code: string;
    schoolId: number;
    description?: string;
  }) {
    return prisma.subject.create({
      data,
    });
  }

  /* =========================================
     CHECK EXISTS
  ========================================= */
  existsByName(name: string, schoolId: number) {
    return prisma.subject.findFirst({
      where: {
        schoolId,
        isActive: true,
        name,
      },
    });
  }

  /* =========================================
     GET ALL
  ========================================= */
  findAll() {
    return prisma.subject.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  /* =========================================
     GET BY SCHOOL
  ========================================= */
  findBySchool(schoolId: number) {
    return prisma.subject.findMany({
      where: {
        schoolId,
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  /* =========================================
     GET BY ID
  ========================================= */
  findById(id: number) {
    return prisma.subject.findUnique({
      where: { id },
    });
  }

  /* =========================================
     UPDATE
  ========================================= */
  update(
    id: number,
    data: {
      name?: string;
      description?: string;
    }
  ) {
    return prisma.subject.update({
      where: { id },
      data,
    });
  }

  /* =========================================
     TOGGLE ACTIVE
  ========================================= */
  toggle(id: number, isActive: boolean) {
    return prisma.subject.update({
      where: { id },
      data: { isActive },
    });
  }
}