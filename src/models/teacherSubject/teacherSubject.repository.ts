import prisma from "../../config/prisma";

export class TeacherSubjectRepository {

  create(data: { teacherId: number; subjectId: number; classId: number }) {
    return prisma.teacherSubject.create({ data });
  }

  findByTeacher(teacherId: number) {
    return prisma.teacherSubject.findMany({
      where: { teacherId },
      include: { subject: true },
    });
  }

  exists(teacherId: number, subjectId: number, classId: number) {
    return prisma.teacherSubject.findFirst({
      where: { teacherId, subjectId, classId },
    });
  }

  delete(id: number) {
    return prisma.teacherSubject.delete({ where: { id } });
  }
}
