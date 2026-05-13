import prisma
from "../../config/prisma.js";

class FeeStructureRepository {

  async create(
    data: any
  ) {

    return prisma
      .feeStructure
      .create({

        data: {

          schoolId:
            data.schoolId,

          academicYearId:
            data.academicYearId,

          classId:
            data.classId,

          name:
            data.name,

          dueDay:
            data.dueDay,

          totalFee:
            data.totalFee,

          items: {

            create:
              data.items,
          },
        },

        include: {

          items: true,
        },
      });
  }

  async getAll(
    schoolId: number
  ) {

    return prisma
      .feeStructure
      .findMany({

        where: {
          schoolId,
        },

        include: {

          items: true,
        },
      });
  }
}

export default
new FeeStructureRepository();