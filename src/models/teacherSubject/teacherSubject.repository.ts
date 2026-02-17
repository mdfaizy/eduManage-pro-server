import prisma from "../../config/prisma";

export class TeacherSubjectRepository {

  create(data: {
    teacherId: number;
    subjectId: number;
    classId: number;
    sectionId: number;
  }) {
    return prisma.teacherSubject.create({ data });
  }

  findByTeacher(teacherId: number) {
    return prisma.teacherSubject.findMany({
      where: { teacherId },
      include: {
        subject: {
          select: { id: true, name: true }
        },
        class: {
          select: { id: true, name: true }
        },
        section: {
          select: { id: true, name: true }
        }
      }
    });
  }

  exists(teacherId: number, subjectId: number, classId: number, sectionId: number) {
    return prisma.teacherSubject.findFirst({
      where: { teacherId, subjectId, classId, sectionId },
    });
  }

  subjectAlreadyAssigned(subjectId: number, classId: number, sectionId: number) {
    return prisma.teacherSubject.findFirst({
      where: { subjectId, classId, sectionId }
    });
  }

  delete(id: number) {
    return prisma.teacherSubject.delete({ where: { id } });
  }
}
