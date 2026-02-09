import prisma from "../../config/prisma";
import { ClassRepository } from "./class.repository";


export class ClassService {
  private repo = new ClassRepository();
  

  async createClass(
  name: string,
  schoolId: number,
  maxStudents: number,
  gradeId: number
) {
  if (!name) throw new Error("Class name required");
  if (!gradeId) throw new Error("Grade required");

  return this.repo.create({ name, schoolId, maxStudents, gradeId });
}


  async getClasses(schoolId: number, gradeId?: number) {
    return this.repo.findAll(schoolId, gradeId);
  }

  async getClassById(id: number) {
    return this.repo.findById(id);
  }

 async updateClass(id: number, data: {
  name?: string;
  isActive?: boolean;
  maxStudents?: number;
  gradeId?: number;
}) {
  const existing = await this.repo.findById(id);
  if (!existing) throw new Error("Class not found");

  return this.repo.update(id, data);
}


  async deleteClass(id: number) {
    return this.repo.delete(id);
  }
}
