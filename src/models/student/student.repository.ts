import prisma from "../../config/prisma";

export class StudentRepository {

  createStudent(data: any) {
    return prisma.student.create({ data });
  }

  createParent(data: any) {
    return prisma.parent.create({ data });
  }

  linkStudentParent(studentId: number, parentId: number) {
    return prisma.studentParent.create({
      data: { studentId, parentId }
    });
  }

  createAdmission(data: any) {
    return prisma.admission.create({ data });
  }
}
