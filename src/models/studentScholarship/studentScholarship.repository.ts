// studentScholarship.repository.ts

import prisma
from "../../config/prisma.js";

class StudentScholarshipRepository {

  // =====================================
  // CREATE
  // =====================================

  async create(
    data: any
  ) {

    // =========================
    // CHECK EXISTING
    // =========================

    const existing =
      await prisma
        .studentScholarship
        .findFirst({

          where: {

            studentId:
              data.studentId,

            scholarshipId:
              data.scholarshipId,
          },
        });

    if (existing) {

      throw new Error(
        "Scholarship already assigned to this student"
      );
    }

    // =========================
    // CREATE
    // =========================

    return prisma
      .studentScholarship
      .create({

        data,
      });
  }

  // =====================================
// FIND BY STUDENT & SCHOLARSHIP
// =====================================

async findByStudentAndScholarship(
  studentId: number,
  scholarshipId: number
) {
  return prisma.studentScholarship.findFirst({
    where: {
      studentId,
      scholarshipId,
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
      .studentScholarship
      .findMany({

        where: {
          schoolId,
        },

        include: {

          student: true,

          scholarship: true,
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
  id: number,
  schoolId: number
) {
  return prisma.scholarship.findFirst({
    where: {
      id,
      schoolId,
    },
  });
}

  async findByName(
  schoolId: number,
  name: string
) {
  return prisma.scholarship.findFirst({
    where: {
      schoolId,
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
  });
}

  // =====================================
  // UPDATE
  // =====================================

update(
  id: number,
  schoolId: number,
  data: any
) {
  return prisma.scholarship.updateMany({
    where: {
      id,
      schoolId,
    },
    data,
  });
}

  // =====================================
  // DELETE
  // =====================================

 delete(
  id: number,
  schoolId: number
) {
  return prisma.scholarship.deleteMany({
    where: {
      id,
      schoolId,
    },
  });
}
  // =====================================
  // TOGGLE
  // =====================================

toggle(
  id: number,
  schoolId: number,
  isActive: boolean
) {
  return prisma.scholarship.updateMany({
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
new StudentScholarshipRepository();