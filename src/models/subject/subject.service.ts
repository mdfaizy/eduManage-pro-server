import { SubjectRepository } from "./subject.repository";

export class SubjectService {
  private repo = new SubjectRepository();
async createSubject(name: string, classId: number, schoolId: number, description?: string) {
  const cleanName = name.trim();

  const exists = await this.repo.exists(cleanName, classId);
  if (exists) throw new Error("Subject already exists in this class");

  const code = `${cleanName.substring(0,3).toUpperCase()}-${classId}-${Date.now().toString().slice(-3)}`;

  return this.repo.create({
    name: cleanName,
    code,
    description,
    classId,
    schoolId,
    type: "EXTRA"  // 🔥 DIFFERENCE
  });
}


async getAllSubjects() {
  return this.repo.findAll();
}
async getSubjects(classId: number, schoolId: number) {
  return this.repo.findByClass(classId, schoolId);
}
async updateSubject(id: number, schoolId: number, name?: string, description?: string) {

  const subject = await this.repo.findById(id);
  if (!subject) throw new Error("Subject not found");

  if (subject.schoolId !== schoolId) throw new Error("Unauthorized");

  let newCode = subject.code;

  if (name && name.trim() !== subject.name) {
    const cleanName = name.trim();

    const exists = await this.repo.exists(cleanName, subject.classId);
    if (exists) throw new Error("Subject name already exists in this class");

    // 🔥 NEW CODE GENERATION
    newCode = `${cleanName.substring(0,3).toUpperCase()}-${subject.classId}-${Date.now().toString().slice(-3)}`;
  }

  return this.repo.update(id, {
    name,
    description,
    code: newCode
  });
}


  // async getSubjects(classId: number) {
  //   return this.repo.findByClass(classId);
  // }

  async deleteSubject(id: number) {
    return this.repo.delete(id);
  }
}
