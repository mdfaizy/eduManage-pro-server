import prisma from "../../config/prisma";

export class ClassTeacherRepository {

  create(data: {
    teacherId: number;
    classId: number;
    sectionId: number;
  }) {
    return prisma.classTeacher.create({ data });
  }

  findByClass(classId: number, sectionId: number) {
    return prisma.classTeacher.findFirst({
      where: { classId, sectionId },
      include: {
        teacher: { include: { user: true } },
        class: true,
        section: true,
      },
    });
  }

  findAll() {
  return prisma.classTeacher.findMany({
    include: {
      teacher: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      },
      class: {
        select: {
          id: true,
          name: true
        }
      },
      section: {
        select: {
          id: true,
          name: true
        }
      }
    },
  });
}


  delete(id: number) {
    return prisma.classTeacher.delete({ where: { id } });
  }
}
