
import prisma
from "../../config/prisma.js";

class FeeStructureRepository {

  // =====================================
  // CREATE
  // =====================================

  async create(
    data: any

  ) {

 
const monthlyFee =
  data.items
    .filter(
      (item: any) =>
        item.frequency ===
        "MONTHLY"
    )
    .reduce(
      (
        sum: number,
        item: any
      ) =>
        sum +
        Number(item.amount || 0),
      0
    );

const yearlyFee =
  data.items
    .filter(
      (item: any) =>
        item.frequency ===
        "YEARLY"
    )
    .reduce(
      (
        sum: number,
        item: any
      ) =>
        sum +
        Number(item.amount || 0),
      0
    );

const oneTimeFee =
  data.items
    .filter(
      (item: any) =>
        item.frequency ===
        "ONE_TIME"
    )
    .reduce(
      (
        sum: number,
        item: any
      ) =>
        sum +
        Number(item.amount || 0),
      0
    );
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
            Number(
              data.dueDay
            ),

         monthlyFee,

yearlyFee,

oneTimeFee,

          items: {

           create:
  data.items.map(
    (item: any) => ({

      feeHeadId:
        Number(item.feeHeadId),

      amount:
        Number(item.amount),

      frequency:
        item.frequency,

      // isOptional:
      //   item.isOptional || false,
    })
  )
          },
        },

        include: {

          class: true,

          academicYear: true,

          items: {

            include: {

              feeHead: true,
            },
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
      .feeStructure
      .findMany({

        where: {
          schoolId,
        },

        include: {

          class: true,

          academicYear: true,

          items: {

            include: {

              feeHead: true,
            },
          },
        },

        orderBy: {

          createdAt:
            "desc",
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

  const items =
    data.items || [];

  // =====================================
  // DUPLICATE FEE HEAD CHECK
  // =====================================

  const feeHeadIds =
    items.map(
      (item: any) =>
        item.feeHeadId
    );

  const uniqueIds =
    new Set(feeHeadIds);

  if (
    feeHeadIds.length !==
    uniqueIds.size
  ) {

    throw new Error(
      "Duplicate fee heads are not allowed"
    );
  }

  // =====================================
  // CALCULATE MONTHLY FEE
  // =====================================

  const monthlyFee =
    items
      .filter(
        (item: any) =>
          item.frequency ===
          "MONTHLY"
      )
      .reduce(
        (
          sum: number,
          item: any
        ) =>
          sum +
          Number(item.amount || 0),
        0
      );

  // =====================================
  // CALCULATE YEARLY FEE
  // =====================================

  const yearlyFee =
    items
      .filter(
        (item: any) =>
          item.frequency ===
          "YEARLY"
      )
      .reduce(
        (
          sum: number,
          item: any
        ) =>
          sum +
          Number(item.amount || 0),
        0
      );

  // =====================================
  // CALCULATE ONE TIME FEE
  // =====================================

  const oneTimeFee =
    items
      .filter(
        (item: any) =>
          item.frequency ===
          "ONE_TIME"
      )
      .reduce(
        (
          sum: number,
          item: any
        ) =>
          sum +
          Number(item.amount || 0),
        0
      );

  // =====================================
  // UPDATE
  // =====================================

  return prisma.$transaction(
    async (tx) => {

      return tx
        .feeStructure
        .update({

          where: {
            id,
            schoolId,
          },

          data: {

            academicYearId:
              data.academicYearId,

            classId:
              data.classId,

            name:
              data.name,

            dueDay:
              Number(
                data.dueDay
              ),

            monthlyFee,

            yearlyFee,

            oneTimeFee,

            items: {

              deleteMany: {},

              create:
                items.map(
                  (item: any) => ({

                    feeHeadId:
                      Number(
                        item.feeHeadId
                      ),

                    amount:
                      Number(
                        item.amount
                      ),

                    frequency:
                      item.frequency,

                    isOptional:
                      item.isOptional || false,
                  })
                ),
            },
          },

          include: {

            class: true,

            academicYear: true,

            items: {

              include: {

                feeHead: true,
              },
            },
          },
        });
    }
  );
}

  // =====================================
  // DELETE
  // =====================================

  async delete(
    id: number,
    schoolId: number
  ) {

    return prisma
      .feeStructure
      .delete({

        where: {
          id,
          schoolId,
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

  return prisma
    .feeStructure
    .findFirst({

      where: {

        id,

        schoolId,
      },

      include: {

        class: true,

        academicYear: true,

        items: {

          include: {

            feeHead: true,
          },
        },
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

  return prisma
    .feeStructure
    .update({

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

export default
new FeeStructureRepository();