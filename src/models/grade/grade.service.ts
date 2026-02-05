import { GradeRepository } from "./grade.repository";

export class GradeService {
  private repo = new GradeRepository();

  async createGrade(name: string, level: string, order: number, schoolId: number) {
  if (!name) throw new Error("Grade name required");
  if (!level) throw new Error("Level required");

  const nameExists = await this.repo.exists(name, schoolId);
  if (nameExists) throw new Error("Grade name already exists");

  const orderExists = await this.repo.existsOrder(order, schoolId);
  if (orderExists) throw new Error("Display order already used");

  return this.repo.create({ name, level, order, schoolId });
}


  async getGrades(schoolId: number) {
    return this.repo.findAll(schoolId);
  }

  async deleteGrade(id: number) {
    return this.repo.delete(id);
  }
}
