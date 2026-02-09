// import { MasterSubjectRepository } from "./masterSubject.repository";

// export class MasterSubjectService {
//   private repo = new MasterSubjectRepository();

//   async create(name: string, grade: number, schoolId: number, description?: string) {
//     if (!name) throw new Error("Subject name required");
//     if (!grade) throw new Error("Grade required");

//     return this.repo.create({ name, description, grade, schoolId });
//   }

//   async getAll(schoolId: number) {
//     return this.repo.findAll(schoolId);
//   }

//   async getByGrade(grade: number, schoolId: number) {
//     return this.repo.findByGrade(grade, schoolId);
//   }

//   async delete(id: number) {
//     return this.repo.delete(id);
//   }
// }
