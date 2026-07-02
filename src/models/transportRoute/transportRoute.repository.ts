import prisma
from "../../config/prisma.js";

class TransportRouteRepository {

  // =====================================
  // CREATE
  // =====================================

  async create(data: any) {

    return prisma
      .transportRoute
      .create({

        data: {

          schoolId:
            data.schoolId,

          name:
            data.name,

          pickupPoint:
            data.pickupPoint,

          amount:
            Number(
              data.amount
            ),
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
      .transportRoute
      .findMany({

        where: {
          schoolId,
        },

        orderBy: {

          createdAt:
            "desc",
        },
      });
  }

  // =====================================
  // GET ONE
  // =====================================

  async getOne(
    id: number
  ) {

    return prisma
      .transportRoute
      .findUnique({

        where: { id },
      });
  }

  // =====================================
  // UPDATE
  // =====================================

  async update(
    id: number,
    data: any
  ) {

    return prisma
      .transportRoute
      .update({

        where: { id },

        data: {

          name:
            data.name,

          pickupPoint:
            data.pickupPoint,

          amount:
            Number(
              data.amount
            ),
        },
      });
  }

  // =====================================
  // DELETE
  // =====================================

  async delete(
    id: number
  ) {

    return prisma
      .transportRoute
      .delete({

        where: { id },
      });
  }

  // =====================================
  // TOGGLE
  // =====================================

  async toggle(
    id: number,
    isActive: boolean
  ) {

    return prisma
      .transportRoute
      .update({

        where: { id },

        data: {
          isActive,
        },
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
      .transportRoute
      .findFirst({

        where: {

          schoolId,

          name,
        },
      });
  }
}

export default
new TransportRouteRepository();