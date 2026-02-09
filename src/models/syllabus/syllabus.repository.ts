import prisma from "../../config/prisma";

export class SyllabusRepository {

  create(data: {
    subjectId: number;
    gradeId?: number;
    classId?: number;
    schoolId: number;
    type: "CORE" | "EXTRA";
    chapters: any;
    maxMarks?: number;
    passMarks?: number;
  }) {
    return prisma.syllabus.create({ data });
  }

  findByClass(classId: number, gradeId: number, schoolId: number) {
    return prisma.syllabus.findMany({
      where: {
        schoolId,
        isActive: true,
        OR: [
          { classId },                 // extra subjects
          { gradeId, classId: null }   // common grade subjects
        ]
      },
      include: {
        subject: true
      }
    });
  }

  findAll(schoolId: number) {
    return prisma.syllabus.findMany({
      where: { schoolId, isDeleted: false },
      include: {
        subject: true,
        grade: true,
        class: true
      }
    });
  }

  delete(id: number) {
    return prisma.syllabus.update({
      where: { id },
      data: { isDeleted: true, isActive: false }
    });
  }
}
