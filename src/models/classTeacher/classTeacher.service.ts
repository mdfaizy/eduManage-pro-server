import { ClassTeacherRepository } from "./classTeacher.repository";

export class ClassTeacherService {
  private repo = new ClassTeacherRepository();

  async assign(teacherId: number, classId: number, sectionId: number) {

    const exists = await this.repo.findByClass(classId, sectionId);
    if (exists) {
      throw new Error("Class teacher already assigned for this section");
    }

    return this.repo.create({ teacherId, classId, sectionId });
  }

  async get(classId: number, sectionId: number) {
    return this.repo.findByClass(classId, sectionId);
  }
async getAll() {
  return this.repo.findAll();
}

  async remove(id: number) {
    return this.repo.delete(id);
  }


}
