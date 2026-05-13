import prisma from "../../config/prisma";
export class SectionRepository {
create(data: any) {
    return prisma.section.create({ data });
  }
findSections(classId?: number, schoolId?: number) {
  return prisma.section.findMany({
    where: {
      ...(schoolId && { schoolId }),
      ...(classId && { classId }),
    },
    include: {
      class: {
        include: {
          // grade: true,   // ⭐ ADD THIS
        },
      },
      school: true,
    },
    orderBy: { id: "asc" },
  });
}

findById(id: number,  schoolId: number) {
  return prisma.section.findFirst({
    where: { id ,schoolId,},
    include: {
      class: {
        include: {
          // grade: true,
        },
      },
      school: true,

      _count: {
        select: {
          // students: true,  // ⭐ COUNT STUDENTS
          admissions: true,
        },
      },
    },
  });
}

delete(
  id: number,
  schoolId: number
) {

  return prisma.section.deleteMany({
    where: {
      id,
      schoolId,
    },
  });
}
  // exists(name: string, classId: number) {
  //   return prisma.section.findFirst({ where: { name, classId } });
  // }
  exists(
  name: string,
  classId: number,
  schoolId: number
) {

  return prisma.section.findFirst({
    where: {
      name,
      classId,
      schoolId,
    },
  });
}
  getClassWithSections(classId: number) {
    return prisma.class.findUnique({
      where: { id: classId },
      include: { sections: true },
    });
  }
//   update(id: number, data: any) {
//   return prisma.section.update({
//     where: { id },
//     data,
//   });
// }

update(
  id: number,
  schoolId: number,
  data: any
) {

  return prisma.section.updateMany({
    where: {
      id,
      schoolId,
    },

    data,
  });
}


}
