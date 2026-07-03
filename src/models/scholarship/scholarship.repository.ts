
import prisma from "../../config/prisma.js";

class ScholarshipRepository {

  // =====================================================
  // CREATE
  // =====================================================

  async create(data: any) {
    return prisma.scholarship.create({
      data,
    });
  }

  // =====================================================
  // FIND BY NAME
  // =====================================================

async findByName(
  schoolId: number,
  name: string
) {
  return prisma.scholarship.findFirst({
    where: {
      schoolId,
      name,
    },
  });
}

  // =====================================================
  // GET ALL
  // =====================================================

  async getAll(
    schoolId: number
  ) {
    return prisma.scholarship.findMany({
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
    return prisma.scholarship.findFirst({
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

  // =====================================================
  // DELETE
  // =====================================================

  async delete(
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

  // =====================================================
  // TOGGLE
  // =====================================================

  async toggle(
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

  // =====================================================
  // DROPDOWN
  // =====================================================

  async dropdown(
    schoolId: number
  ) {
    return prisma.scholarship.findMany({
      where: {
        schoolId,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }
}

export default new ScholarshipRepository();