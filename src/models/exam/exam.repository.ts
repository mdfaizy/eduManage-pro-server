// =====================================================
// exam.repository.ts
// =====================================================

import prisma
from "../../config/prisma.js";

export class ExamRepository {

  // =====================================================
  // CREATE EXAM
  // =====================================================

  async create(data: any) {

    return prisma.exam.create({

      data,

      include: {

        class: true,

        section: true,

        academicYear: true,
      },
    });
  }

  // =====================================================
  // GET ALL
  // =====================================================

  async getAll(
    schoolId: number
  ) {

    return prisma.exam.findMany({

      where: {
        schoolId,
      },

      include: {

        class: true,

        section: true,

        academicYear: true,

        subjects: {

          include: {

            subject: true,
          },
        },
      },

      orderBy: {

        createdAt: "desc",
      },
    });
  }

  // =====================================================
  // GET BY ID
  // =====================================================

  async getById(
    id: number,
    schoolId: number
  ) {

    return prisma.exam.findFirst({

      where: {

        id,

        schoolId,
      },

      include: {

        class: true,

        section: true,

        academicYear: true,

        subjects: {

          include: {

            subject: true,

            marks: {

              include: {

                student: true,
              },
            },
          },
        },
      },
    });
  }

  // =====================================================
  // UPDATE
  // =====================================================

  async update(
    id: number,
    schoolId: number,
    data: any
  ) {

    return prisma.exam.update({

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

  async delete(
    id: number,
    schoolId: number
  ) {

    return prisma.exam.delete({

      where: {

        id,

        schoolId,
      },
    });
  }

  // =====================================================
  // ADD SUBJECT
  // =====================================================

  async addSubject(
    data: any
  ) {

    return prisma.examSubject.create({

      data,

      include: {

        subject: true,
      },
    });
  }

  // =====================================================
  // ENTER MARKS
  // =====================================================

  async enterMarks(
    data: any
  ) {

    return prisma.examMark.upsert({

      where: {

        examSubjectId_studentId: {

          examSubjectId:
            data.examSubjectId,

          studentId:
            data.studentId,
        },
      },

      update: {

        obtainedMarks:
          data.obtainedMarks,

        remarks:
          data.remarks,
      },

      create: data,
    });
  }
}

export default
new ExamRepository();