// =====================================================
// feeHead.repository.ts
// =====================================================

import prisma from "../../config/prisma.js";
import {CreateFeeHeadDTO,UpdateFeeHeadDTO} from "./feeHead.types.js";
class FeeHeadRepository {

  // =====================================================
  // CREATE
  // =====================================================

  async create({ schoolId, name, description }: CreateFeeHeadDTO) {

    return prisma.feeHead.create({
      data: {
        schoolId,
        name,
        description,
      },
    });
  }

  // =====================================================
  // FIND BY NAME
  // =====================================================

  async findByName(
    schoolId: number,
    name: string
  ) {

    return prisma.feeHead.findFirst({

      where: {

        schoolId,

        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });
  }

  // =====================================================
  // GET ALL
  // =====================================================

  async getAll(
    schoolId: number
  ) {

    return prisma.feeHead.findMany({

      where: {
        schoolId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // =====================================================
  // GET ONE
  // =====================================================

  async getOne(
    id: number,
    schoolId: number
  ) {

    return prisma.feeHead.findFirst({

      where: {
        id,
        schoolId,
      },
    });
  }

  // =====================================================
  // UPDATE
  // =====================================================

async update(
  id: number,
  schoolId: number,
  data: UpdateFeeHeadDTO
) {

  return prisma.feeHead.updateMany({

    where: {
      id,
      schoolId,
    },

    data,
  });
}

  // =====================================================
  // DELETE
  // =====================================================

  async delete(id: number) {

    return prisma.feeHead.delete({

      where: {
        id,
      },
    });
  }

  // =====================================================
  // TOGGLE
  // =====================================================

  // async toggle(
  //   id: number,
  //   isActive: boolean
  // ) {

  //   return prisma.feeHead.update({

  //     where: {
  //       id,
  //     },

  //     data: {
  //       isActive,
  //     },
  //   });
  // }
  async toggle(
  id: number,
  schoolId: number,
  isActive: boolean
) {

  return prisma.feeHead.updateMany({

    where: {
      id,
      schoolId,
    },

    data: {
      isActive,
    },
  });
}
}

export default new FeeHeadRepository();