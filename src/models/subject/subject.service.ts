// subject.service.ts
import { SubjectRepository } from "./subject.repository";
import { generateSubjectCode } from "../../utils/subjectCode";

export class SubjectService {
  private repo = new SubjectRepository();

async createSubject(
  payload: {
    name: string;
    description?: string;
    maxMarks?: number;
    passMarks?: number;
  },
  role: string,
  schoolId: number
) {
  const { name, description, maxMarks, passMarks } = payload;

  if (!schoolId) throw new Error("SchoolId is required");

  const exists = await this.repo.existsByName(name, schoolId);
  if (exists) throw new Error("Subject already exists");

  const code = generateSubjectCode(name, schoolId);

  return this.repo.create({
    name,
    code,
    schoolId,
    description,
    maxMarks,
    passMarks,
  });
}
  async getAllSubjects(role: string, schoolId: number) {
    if (role === "SUPER_ADMIN") {
      return this.repo.findAll();
    }
    return this.repo.findBySchool(schoolId);
  }

async updateSubject(
  id: number,
  payload: {
    name?: string;
    description?: string;
    maxMarks?: number;
    passMarks?: number;
  },
  role: string
) {
  return this.repo.update(id, payload);
}

  async toggleSubject(id: number, role: string) {

    const subject = await this.repo.findById(id);
    if (!subject) throw new Error("Subject not found");

    return this.repo.toggle(id, !subject.isActive);
  }
  async getSubjectById(id: number, role: string, schoolId: number) {
  const subject = await this.repo.findById(id);
  if (!subject) throw new Error("Subject not found");

  return subject;
}

}
