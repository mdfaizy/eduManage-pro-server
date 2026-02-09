// subject.repository.ts
import prisma from "../../config/prisma";

export class SubjectRepository {

  create(name: string, code: string, schoolId: number) {
    return prisma.subject.create({
      data: {
        name,
        code,
        schoolId
      }
    });
  }

  existsByName(name: string, schoolId: number) {
    return prisma.subject.findFirst({
      where: { name, schoolId, isActive: true }
    });
  }

  findAll() {
    return prisma.subject.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" }
    });
  }

  findBySchool(schoolId: number) {
    return prisma.subject.findMany({
      where: { schoolId },
      orderBy: { name: "asc" }
    });
  }

   update(id: number, data: { name?: string; description?: string }) {
    return prisma.subject.update({
      where: { id },
      data
    });
  }
 findById(id: number) {
    return prisma.subject.findUnique({ where: { id } });
  }
  toggle(id: number, isActive: boolean) {
    return prisma.subject.update({
      where: { id },
      data: { isActive }
    });
  }
}
