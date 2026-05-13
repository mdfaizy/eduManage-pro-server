import prisma from "../../config/prisma.js";

export class AdmissionRepository {

  async create(data: any) {
    return prisma.admission.create({ data });
  }

  async findById(id: number, schoolId: number) {

    return prisma.admission.findFirst({

      where: {
        id,
        schoolId,
      },

      include: {
        student: true,
        class: true,
        section: true,
        academicYear: true,
      },
    });
  }

  async findAll(schoolId: number) {

    return prisma.admission.findMany({

      where: {
        schoolId,
      },

      include: {
        student: true,
        class: true,
        section: true,
        academicYear: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async update(id: number, data: any) {

    return prisma.admission.update({
      where: { id },
      data,
    });
  }
}