// import { TeacherSubjectRepository } from "./teacherSubject.repository";

// export class TeacherSubjectService {
//   private repo = new TeacherSubjectRepository();

//   async assign(teacherId: number, subjectId: number, classId: number,sectionId: number) {

//     const exists = await this.repo.exists(teacherId, subjectId, classId,sectionId);
//     if (exists) throw new Error("Teacher already assigned to this subject");

//     return this.repo.create({ teacherId, subjectId, classId ,sectionId});
//   }

//   async getTeacherSubjects(teacherId: number) {
//     return this.repo.findByTeacher(teacherId);
//   }

//   async remove(id: number) {
//     return this.repo.delete(id);
//   }
// }


import prisma from "../../config/prisma";
import { TeacherSubjectRepository } from "./teacherSubject.repository";

export class TeacherSubjectService {
  private repo = new TeacherSubjectRepository();

  async assign(
    teacherId: number,
    subjectId: number,
    classId: number,
    sectionId: number
  ) {

    // 1️⃣ Validate section belongs to class
    const section = await prisma.section.findUnique({
      where: { id: sectionId }
    });

    if (!section || section.classId !== classId) {
      throw new Error("Section does not belong to selected class");
    }

    // 2️⃣ Prevent duplicate same teacher
    const exists = await this.repo.exists(
      teacherId,
      subjectId,
      classId,
      sectionId
    );

    if (exists) {
      throw new Error("Teacher already assigned to this subject");
    }

    // 3️⃣ Optional: Prevent multiple teachers for same subject in same class-section
    const subjectConflict = await this.repo.subjectAlreadyAssigned(
      subjectId,
      classId,
      sectionId
    );

    if (subjectConflict) {
      throw new Error("This subject already has a teacher assigned");
    }

    return this.repo.create({
      teacherId,
      subjectId,
      classId,
      sectionId
    });
  }

  async getTeacherSubjects(teacherId: number) {
    if (!teacherId) {
      throw new Error("Invalid teacherId");
    }

    return this.repo.findByTeacher(teacherId);
  }
async getAll() {
  return prisma.teacherSubject.findMany();
}

  async remove(id: number) {
    if (!id) {
      throw new Error("Invalid ID");
    }

    return this.repo.delete(id);
  }
}
