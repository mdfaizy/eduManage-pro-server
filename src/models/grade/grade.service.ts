import { GradeRepository } from "./grade.repository";

export class GradeService {
  private repo = new GradeRepository();

 async createGrade(
  name: string,
  description: string | undefined,
  schoolId: number
) {
  if (!name) throw new Error("Grade name required");

  const nameExists = await this.repo.exists(name, schoolId);
  if (nameExists) throw new Error("Grade already exists");

  return this.repo.create({
    name,
    description,
    schoolId
  });
}

async getGradesPaginated(
    schoolId: number,
    page = 1,
    limit = 10,
    search?: string
  ) {
    const { data, total } = await this.repo.findAllPaginated(
      schoolId,
      page,
      limit,
      search
    );

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }


  async getGrades(schoolId: number) {
    return this.repo.findAll(schoolId);
  }
async getGradeById(id: number, schoolId: number) {
    const grade = await this.repo.findById(id, schoolId);
    if (!grade) throw new Error("Grade not found");
    return grade;
  }

  async updateGrade(
    id: number,
    schoolId: number,
    name: string,
    description?: string
  ) {
    const grade = await this.repo.findById(id, schoolId);
    if (!grade) throw new Error("Grade not found");

    return this.repo.update(id, schoolId, { name, description });
  }

  async toggleGrade(id: number, schoolId: number) {
    const grade = await this.repo.findById(id, schoolId);
    if (!grade) throw new Error("Grade not found");

    return this.repo.update(id, schoolId, {
      isActive: !grade.isActive,
    } as any);
  }
  async deleteGrade(id: number) {
    return this.repo.delete(id);
  }
}
