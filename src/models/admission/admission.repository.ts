import prisma from "../../config/prisma.js";
import { AdmissionStatus } from "@prisma/client";
export class AdmissionRepository {

  async create(data: any) {
    return prisma.admission.create({ data });
  }

  async findById(id: number, schoolId: number) {
  console.log("ID =>", id);
  console.log("School ID =>", schoolId);
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
  async findAll(
  schoolId: number,
  classId?: number,
  sectionId?: number,
  academicYearId?: number,
  status?: string
) {

  return prisma.admission.findMany({

    where: {

      schoolId,

      ...(classId && {
        classId,
      }),

      ...(sectionId && {
        sectionId,
      }),

      ...(academicYearId && {
        academicYearId,
      }),

      ...(status && {
        status,
      }),

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

  async update(
  id: number,
  schoolId: number,
  data: any
) {

  return prisma
    .admission
    .updateMany({

      where: {

        id,

        schoolId,
      },

      data,
    });
}

async reports(
  schoolId: number,
  classId?: number,
  sectionId?: number,
  academicYearId?: number,
  startDate?: string,
  endDate?: string
) {

  return prisma.admission.findMany({

    where: {

      schoolId,

      ...(classId && { classId }),

      ...(sectionId && { sectionId }),

      ...(academicYearId && { academicYearId }),

      ...(startDate &&
        endDate && {
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(`${endDate}T23:59:59.999Z`),
          },
        }),

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
}