import prisma from "../../config/prisma";

export class ClassTeacherRepository {

  create(data: { teacherId: number; classId: number; isClassTeacher: boolean }) {
    return prisma.classTeacher.create({ data });
  }

  findByClass(classId: number) {
    return prisma.classTeacher.findMany({
      where: { classId },
      include: { class: true },
    });
  }

  exists(teacherId: number, classId: number) {
    return prisma.classTeacher.findFirst({ where: { teacherId, classId } });
  }

  delete(id: number) {
    return prisma.classTeacher.delete({ where: { id } });
  }
}
