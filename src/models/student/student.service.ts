import { StudentRepository } from "./student.repository";

export class StudentService {
  private repo = new StudentRepository();

  async admitStudent(payload: any, schoolId: number) {

    // 1️⃣ Create Student
    const student = await this.repo.createStudent({
      schoolId,
      classId: Number(payload.classId),
      sectionId: Number(payload.sectionId),
    });

    // 2️⃣ Create Parent
    const parent = await this.repo.createParent({
      userId: payload.parentUserId, // if using auth user later
      schoolId,
    });

    // 3️⃣ Link Parent ↔ Student
    await this.repo.linkStudentParent(student.id, parent.id);

    // 4️⃣ Admission Entry
    await this.repo.createAdmission({
      studentId: student.id,
      schoolId,
      classId: Number(payload.classId),
      sectionId: Number(payload.sectionId),
      academicYear: payload.academicYear,
      status: "ACTIVE",
    });

    return student;
  }
}
