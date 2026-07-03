import prisma from "../../config/prisma.js";

class StudentDiscountRepository {

  // =====================================
  // CREATE
  // =====================================

  async create(data: any) {

    return prisma.studentDiscount.create({
      data,
    });

  }

  // =====================================
  // DUPLICATE CHECK
  // =====================================

  async findExisting(
    studentId: number,
    feeHeadId: number,
    applyType: string
  ) {

    return prisma.studentDiscount.findFirst({

      where: {

        studentId,

        feeHeadId,

        applyType,

        isActive: true,

      },

    });

  }

  // =====================================
  // GET ALL
  // =====================================

  async getAll(
    schoolId: number
  ) {

    return prisma.studentDiscount.findMany({

      where: {

        schoolId,

      },

      include: {

        student: true,

        feeHead: true,

      },

      orderBy: {

        createdAt: "desc",

      },

    });

  }

  // =====================================
  // GET ONE
  // =====================================

  async getOne(
    id: number,
    schoolId: number
  ) {

    return prisma.studentDiscount.findFirst({

      where: {

        id,

        schoolId,

      },

      include: {

        student: true,

        feeHead: true,

      },

    });

  }

  // =====================================
  // UPDATE
  // =====================================

  async update(
    id: number,
    schoolId: number,
    data: any
  ) {

    return prisma.studentDiscount.update({

      where: {

        id,

      },

      data,

    });

  }

  // =====================================
  // DELETE
  // =====================================

  async delete(
    id: number,
    schoolId: number
  ) {

    return prisma.studentDiscount.delete({

      where: {

        id,

      },

    });

  }

  // =====================================
  // TOGGLE
  // =====================================

  async toggle(
    id: number,
    schoolId: number,
    isActive: boolean
  ) {

    return prisma.studentDiscount.update({

      where: {

        id,

      },

      data: {

        isActive,

      },

    });

  }

  // =====================================
  // FIND ACTIVE DISCOUNT
  // =====================================

  async getStudentDiscount(

    studentId: number,

    feeHeadId: number,

    month: number

  ) {

    return prisma.studentDiscount.findFirst({

      where: {

        studentId,

        feeHeadId,

        isActive: true,

        OR: [

          {

            applyType: "ONE_TIME",

          },

          {

            applyType: "YEARLY",

          },

          {

            applyType: "MONTHLY",

            startMonth: {

              lte: month,

            },

            endMonth: {

              gte: month,

            },

          },

        ],

      },

    });

  }

}

export default new StudentDiscountRepository();