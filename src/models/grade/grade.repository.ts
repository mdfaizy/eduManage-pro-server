import prisma from "../../config/prisma";

export class GradeRepository {

  create(data: { name: string; description?: string; schoolId: number }) {
  return prisma.grade.create({ data });
}


  findAll(schoolId: number) {
    return prisma.grade.findMany({
      where: { schoolId },
      // orderBy: { order: "asc" },
    });
  }

  // findById(id: number) {
  //   return prisma.grade.findUnique({ where: { id } });
  // }
  
  async findAllPaginated(
    schoolId: number,
    page: number,
    limit: number,
    search?: string
  ) {
    const skip = (page - 1) * limit;

    const where: any = {
      schoolId,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.grade.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.grade.count({ where }),
    ]);

    return {
      data,
      total,
    };
  }
  findById(id: number, schoolId: number) {
    return prisma.grade.findUnique({
      where: { id, schoolId },
    });
  }

  update(
    id: number,
    schoolId: number,
    data: { name: string; description?: string }
  ) {
    return prisma.grade.update({
      where: { id },
      data,
    });
  }

  toggle(id: number) {
    return prisma.grade.update({
      where: { id },
      data: {
        isActive: { not: undefined },
      },
    });
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
