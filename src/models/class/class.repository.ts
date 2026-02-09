import prisma from "../../config/prisma";

export class ClassRepository {

  create(data: { name: string; schoolId: number; maxStudents: number; gradeId: number }) {
    return prisma.class.create({ data });
  }

  findAll(schoolId: number, gradeId?: number) {
    return prisma.class.findMany({
      where: {
        schoolId,
        isDeleted: false,
        ...(gradeId && { gradeId })
      },
      include: {
        sections: true,
        grade: true
      },
      orderBy: { id: "desc" }
    });
  }

  findById(id: number) {
    return prisma.class.findFirst({
      where: {
        id,
        isDeleted: false
      },
      include: {
        grade: true,
        sections: true,
        syllabi: {
          include: {
            subject: true
          }
        }
      }
    });
  }

  update(
    id: number,
    data: { name?: string; isActive?: boolean; maxStudents?: number; gradeId?: number }
  ) {
    return prisma.class.update({
      where: { id },
      data,
    });
  }

  // 🔥 SOFT DELETE
  delete(id: number) {
    return prisma.class.update({
      where: { id },
      data: { isDeleted: true, isActive: false }
    });
  }
}
