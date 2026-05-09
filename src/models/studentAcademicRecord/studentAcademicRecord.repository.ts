import prisma from "../../config/prisma.js";

export class StudentAcademicRecordRepository {

  // =====================================================
  // CREATE
  // =====================================================

  async create(tx: any, data: any) {

    return tx.studentAcademicRecord.create({
      data,
    });
  }

  // =====================================================
  // CURRENT RECORD
  // =====================================================

  async getCurrentRecord(
    studentId: number
  ) {

    return prisma.studentAcademicRecord.findFirst({

      where: {

        studentId,

        isCurrent: true,
      },

      include: {

        class: true,

        section: true,

        academicYear: true,
      },
    });
  }

  // =====================================================
  // HISTORY
  // =====================================================

  async getHistory(
    studentId: number
  ) {

    return prisma.studentAcademicRecord.findMany({

      where: {
        studentId,
      },

      include: {

        class: true,

        section: true,

        academicYear: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // =====================================================
  // DISABLE CURRENT
  // =====================================================

  async disableCurrent(
    tx: any,
    id: number
  ) {

    return tx.studentAcademicRecord.update({

      where: { id },

      data: {

        isCurrent: false,

        status: "PROMOTED",
      },
    });
  }
}

export default new StudentAcademicRecordRepository();