import prisma from "../../config/prisma";

export class SubjectRepository {

  // create(data: { name: string; classId: number; schoolId: number }) {
  //   return prisma.subject.create({ data });
  // }

   create(data: {
    name: string;
    code: string;
    description?: string;
    classId: number;
    schoolId: number;
    type: "CORE" | "EXTRA";
  }) {
    return prisma.subject.create({ data });
  }

  // findByClass(classId: number) {
  //   return prisma.subject.findMany({ where: { classId } });
  // }


  // findByClass(classId: number) {
  //   return prisma.subject.findMany({
  //     where: { classId },
  //     orderBy: { name: "asc" },
  //   });
  // }

  findByClass(classId: number, schoolId: number) {
  return prisma.subject.findMany({
    where: { classId, schoolId },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      code: true,
      description: true
    }
  });
}

  delete(id: number) {
    return prisma.subject.delete({ where: { id } });
  }
// findAll() {
//   return prisma.subject.findMany({
//     include: { class: true },
//     orderBy: { createdAt: "desc" },
//   });
// }

findAll(schoolId?: number) {
  return prisma.subject.findMany({
    where: {
      ...(schoolId && { schoolId })
    },
    include: { class: { select: { name: true } } }
  });
}

findById(id: number) {
  return prisma.subject.findUnique({ where: { id } });
}

update(id: number, data: { name?: string; description?: string; code?: string }) {
  return prisma.subject.update({
    where: { id },
    data
  });
}


deleteByClass(classId: number) {
  return prisma.subject.deleteMany({
    where: { classId }
  });
}

  exists(name: string, classId: number) {
    return prisma.subject.findFirst({ where: { name, classId } });
  }
}
