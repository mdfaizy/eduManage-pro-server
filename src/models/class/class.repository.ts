import prisma from "../../config/prisma";
export class ClassRepository {
  // =========================================
  // CREATE
  // =========================================
  async create(data: {
    name: string;
    schoolId: number;
    maxStudents?: number;
    description?: string;
  }) {
    try {
      return await prisma.class.create({
        data,
      });

    } catch (error: any) {

      // =========================================
      // DUPLICATE CLASS
      // =========================================
      if (
        error?.code === "P2002"
      ) {

        throw new Error(
          "Class already exists"
        );
      }
      throw error;
    }
  }

  // =========================================
  // GET ALL
  // =========================================
  findAll(
    schoolId: number,
    activeOnly?: boolean
  ) {
    return prisma.class.findMany({
      where: {
        schoolId,

        isDeleted: false,

        ...(activeOnly
          ? { isActive: true }
          : {}),
      },

      include: {
        sections: true,
      },

      orderBy: {
        id: "desc",
      },
    });
  }

  // =========================================
  // GET BY ID
  // =========================================

  findById(
    id: number,
    schoolId: number
  ) {

    return prisma.class.findFirst({
      where: {
        id,
        schoolId,
        isDeleted: false,
      },

      include: {
        sections: true,

        syllabi: {
          include: {
            subject: true,
          },
        },
      },
    });
  }

  // =========================================
  // UPDATE
  // =========================================

  update(
    id: number,
    schoolId: number,
    data: {
      name?: string;
      description?: string;
      maxStudents?: number;
      isActive?: boolean;
    }
  ) {

    return prisma.class.updateMany({
      where: {
        id,
        schoolId,
      },

      data,
    });
  }


  findByName(
  name: string,
  schoolId: number
) {

  return prisma.class.findFirst({
    where: {
      name,
      schoolId,
      isDeleted: false,
    },
  });
}
findDeleted(
  schoolId: number
) {

  return prisma.class.findMany({
    where: {
      schoolId,
      isDeleted: true,
    },

    orderBy: {
      id: "desc",
    },
  });
}
  // =========================================
  // SOFT DELETE
  // =========================================

  // delete(
  //   id: number,
  //   schoolId: number
  // ) {

  //   return prisma.class.updateMany({
  //     where: {
  //       id,
  //       schoolId,
  //     },

  //     data: {
  //       isDeleted: true,
  //       isActive: false,
  //     },
  //   });
  // }
  delete(
  id: number,
  schoolId: number
) {

  return prisma.class.deleteMany({
    where: {
      id,
      schoolId,
    },
  });
}
}