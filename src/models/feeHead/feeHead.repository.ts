import prisma
from "../../config/prisma.js";

class FeeHeadRepository {

  // =====================================
  // CREATE
  // =====================================

  async create(data: any) {

    return prisma
      .feeHead
      .create({

        data,
      });
  }

  // =====================================
  // FIND BY NAME
  // =====================================

  async findByName(

    schoolId: number,

    name: string
  ) {

    return prisma
      .feeHead
      .findFirst({

        where: {

          schoolId,

          isActive: true,

          name: {

            equals: name,
          },
        },
      });
  }

  // =====================================
  // GET ALL
  // =====================================

  async getAll(
    schoolId: number
  ) {

    return prisma
      .feeHead
      .findMany({

        where: {

          schoolId,

          isActive: true,
        },

        orderBy: {

          createdAt:
            "desc",
        },
      });
  }
}

export default
new FeeHeadRepository();