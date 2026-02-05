import { TeacherSubjectRepository } from "./teacherSubject.repository";

export class TeacherSubjectService {
  private repo = new TeacherSubjectRepository();

  async assign(teacherId: number, subjectId: number, classId: number) {

    const exists = await this.repo.exists(teacherId, subjectId, classId);
    if (exists) throw new Error("Teacher already assigned to this subject");

    return this.repo.create({ teacherId, subjectId, classId });
  }

  async getTeacherSubjects(teacherId: number) {
    return this.repo.findByTeacher(teacherId);
  }

  async remove(id: number) {
    return this.repo.delete(id);
  }
}
