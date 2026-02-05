import prisma from "../../config/prisma";

export class GradeRepository {

  create(data: { name: string; level: string; order: number; schoolId: number }) {
    return prisma.grade.create({ data });
  }

  findAll(schoolId: number) {
    return prisma.grade.findMany({
      where: { schoolId },
      orderBy: { order: "asc" },
    });
  }

  findById(id: number) {
    return prisma.grade.findUnique({ where: { id } });
  }

  delete(id: number) {
    return prisma.grade.delete({ where: { id } });
  }
existsOrder(order: number, schoolId: number) {
  return prisma.grade.findFirst({ where: { order, schoolId } });
}

  exists(name: string, schoolId: number) {
    return prisma.grade.findFirst({ where: { name, schoolId } });
  }
}
