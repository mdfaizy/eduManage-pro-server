import { ClassTeacherRepository } from "./classTeacher.repository";

export class ClassTeacherService {
  private repo = new ClassTeacherRepository();

  async assignTeacher(teacherId: number, classId: number, isClassTeacher: boolean) {

    const exists = await this.repo.exists(teacherId, classId);
    if (exists) throw new Error("Teacher already assigned to this class");

    return this.repo.create({ teacherId, classId, isClassTeacher });
  }

  async getClassTeachers(classId: number) {
    return this.repo.findByClass(classId);
  }

  async remove(id: number) {
    return this.repo.delete(id);
  }
}
