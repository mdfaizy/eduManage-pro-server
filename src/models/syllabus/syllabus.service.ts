import { SyllabusRepository } from "./syllabus.repository";

export class SyllabusService {
  private repo = new SyllabusRepository();

  async createSyllabus(data: {
    subjectId: number;
    gradeId?: number;
    classId?: number;
    schoolId: number;
    type: "CORE" | "EXTRA";
    chapters: any;
    maxMarks?: number;
    passMarks?: number;
  }) {
    if (!data.subjectId) throw new Error("Subject required");

    if (!data.gradeId && !data.classId) {
      throw new Error("Grade or Class required");
    }

    return this.repo.create(data);
  }

  async getClassSyllabus(
    classId: number,
    gradeId: number,
    schoolId: number
  ) {
    return this.repo.findByClass(classId, gradeId, schoolId);
  }

  async getAll(schoolId: number) {
    return this.repo.findAll(schoolId);
  }

  async delete(id: number) {
    return this.repo.delete(id);
  }
}
